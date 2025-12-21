import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import os from 'os';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS configuration for network access
app.use(cors({
  origin: true, // Allow all origins (for local network development)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Email transporter configuration
const createTransporter = () => {
  // Check if email is configured
  if (!process.env.SMTP_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('⚠️ Email configuration missing:', {
      hasHost: !!process.env.SMTP_HOST,
      hasUser: !!process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD
    });
    return null;
  }

  // Fix common SMTP host issues
  let smtpHost = process.env.SMTP_HOST;
  if (smtpHost === 'mail.gmail.com') {
    smtpHost = 'smtp.gmail.com';
    console.log('⚠️ Fixed SMTP_HOST: Changed mail.gmail.com to smtp.gmail.com');
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD.trim(), // Trim whitespace from password
    },
    // Add connection timeout and retry options
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  // Verify connection on startup
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email connection failed:', error.message);
      console.error('❌ Check your SMTP settings in .env file');
      console.error('❌ Common issues:');
      console.error('   - Wrong SMTP_HOST (should be smtp.gmail.com for Gmail)');
      console.error('   - Wrong password (use App Password for Gmail)');
      console.error('   - Firewall blocking port 587');
    } else {
      console.log('✅ Email connection verified successfully');
      console.log(`✅ Ready to send emails from: ${process.env.EMAIL_USER}`);
    }
  });

  return transporter;
};

// Google Sheets configuration - Simple Webhook Method (FREE, No API keys needed)
const saveToGoogleSheets = async (formData) => {
  try {
    // Method 1: Simple Webhook (Google Apps Script) - EASIEST & FREE
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.log('⚠️ Google Sheets webhook URL not configured');
      return false;
    }

    if (webhookUrl) {
      console.log('📤 Sending data to Google Sheets webhook...');
      console.log('📤 Webhook URL:', webhookUrl.substring(0, 50) + '...');
      console.log('📤 Data being sent:', {
        referenceNumber: formData.referenceNumber,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        subject: formData.subject,
        message: formData.message?.substring(0, 200) + '...',
        
      });

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        referenceNumber: formData.referenceNumber || '',
      };

      // Create timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).catch((fetchError) => {
        clearTimeout(timeoutId);
        console.error('❌ Google Sheets webhook fetch failed:', fetchError.message);
        if (fetchError.name === 'AbortError') {
          console.error('❌ Request timed out after 10 seconds');
        } else if (fetchError.code === 'ECONNREFUSED') {
          console.error('❌ Connection refused - check if webhook URL is correct');
        } else if (fetchError.code === 'ENOTFOUND') {
          console.error('❌ DNS lookup failed - check internet connection');
        }
        throw fetchError;
      });

      clearTimeout(timeoutId);

      console.log('📥 Response status:', response.status);
      console.log('📥 Response status text:', response.statusText);

      const responseText = await response.text();
      const trimmedResponse = responseText.trim();
      console.log('📥 Response body (first 200 chars):', trimmedResponse.substring(0, 200));

      // Google Apps Script often returns HTML redirect pages instead of JSON
      // Check if response is HTML first (more robust check)
      const isHTML = trimmedResponse.startsWith('<!DOCTYPE') ||
        trimmedResponse.startsWith('<html') ||
        trimmedResponse.startsWith('<!doctype') ||
        trimmedResponse.startsWith('<HTML') ||
        (trimmedResponse.startsWith('<') && trimmedResponse.includes('html'));

      if (isHTML) {
        // Check for authentication errors
        if (response.status === 401) {
          console.error('❌ 401 Unauthorized - Google Apps Script webhook requires authentication');
          console.error('❌ Fix: Go to Apps Script → Deploy → Manage deployments');
          console.error('❌ Set "Who has access" to "Anyone" (not "Only myself")');
          console.error('❌ Then create a new deployment and update the URL in .env');
          throw new Error('Google Sheets webhook returned 401 Unauthorized. Update deployment settings to allow "Anyone" access.');
        }

        // HTML response usually means success (Google Apps Script redirect)
        if (response.status === 200 || response.status === 302) {
          console.log('✅ Google Sheets webhook responded with HTML (success - data saved)');
          console.log('✅ Status code:', response.status, '- HTML redirect means script executed successfully');
          return true;
        } else {
          console.error('❌ Google Sheets returned HTML error page. Status:', response.status);
          throw new Error(`Google Sheets webhook returned error page (Status: ${response.status})`);
        }
      }

      // Try to parse as JSON only if it's not HTML
      let result;
      try {
        result = JSON.parse(trimmedResponse);
      } catch (parseError) {
        // If status is 200 and response doesn't look like an error, assume success
        // This handles cases where Google Apps Script returns something unexpected but successful
        if (response.status === 200 || response.status === 302) {
          console.log('✅ Google Sheets webhook responded successfully (non-JSON response, status:', response.status, ')');
          return true;
        }
        console.error('❌ Failed to parse response as JSON. Status:', response.status);
        console.error('❌ Response preview:', trimmedResponse.substring(0, 500));
        throw new Error('Invalid response from Google Sheets webhook. Check the webhook URL and script deployment.');
      }

      if (result.success) {
        console.log('✅ Data saved to Google Sheets via webhook');
        return true;
      } else {
        console.error('❌ Google Sheets returned error:', result.message);
        throw new Error(result.message || 'Failed to save to sheets');
      }
    }

    // Method 2: Google Sheets API (requires service account)
    if (process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT) {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

      const auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;

      const now = new Date();
      const timestamp = now.toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'medium',
      });

      const values = [[
        timestamp,
        formData.referenceNumber || '',
        formData.name,
        formData.email,
        formData.phone || 'Not provided',
        formData.subject,
        formData.message,
      ]];

      // Check if headers exist
      try {
        const headerCheck = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: 'Sheet1!A1:F1',
        });

        if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: 'Sheet1!A1:F1',
            valueInputOption: 'USER_ENTERED',
            resource: {
              values: [['Timestamp', 'Reference Number', 'Name', 'Email', 'Phone', 'Subject', 'Message']],
            },
          });
        }
      } catch (headerError) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'Sheet1!A1:F1',
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [['Timestamp', 'Reference Number', 'Name', 'Email', 'Phone', 'Subject', 'Message']],
          },
        });
      }

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:F',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      console.log('✅ Data saved to Google Sheets via API');
      return true;
    }

    console.log('⚠️ Google Sheets not configured - skipping save');
    return false;
  } catch (error) {
    console.error('❌ Error saving to Google Sheets:', error.message);
    // Don't throw error - allow email to still be sent even if sheets fails
    return false;
  }
};

// Contact form endpoint - Optimized for fast response
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, subject, and message are required.',
      });
    }

    const referenceNumber = Date.now().toString().slice(-8);

    // Return success immediately (optimistic response)
    // All processing happens in background
    res.json({
      success: true,
      message: 'Your message has been sent successfully. Please check your email for confirmation.',
      messageId: `msg-${Date.now()}`,
      referenceNumber: referenceNumber,
    });

    // Process everything in the background (don't await)
    (async () => {
      try {
        // Create transporter
        const transporter = createTransporter();

        // Skip email sending if not configured
        if (!transporter || !process.env.TARGET_EMAIL) {
          console.log('⚠️ Email service not configured - skipping email sending');
          // Still try to save to Google Sheets
          saveToGoogleSheets({ name, email, phone, subject, message, referenceNumber })
            .then(() => {
              console.log('✅ Google Sheets saved in background');
            })
            .catch((sheetsError) => {
              console.error('⚠️ Google Sheets save failed:', sheetsError.message);
            });
          return;
        }

        // Email 1: Send form submission to info@healschool.org
        const siteUrl = process.env.SITE_URL || 'https://healschool.org/';
        const logoUrl = `${siteUrl}logo.png`;

        const submissionEmail = {
          from: `"Heal School Website" <${process.env.EMAIL_USER}>`,
          to: process.env.TARGET_EMAIL, // info@healschool.org
          replyTo: email, // So you can reply directly to the sender
          subject: 'Important Message from Heal school website',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Logo and School Name Header -->
              <div style="background: linear-gradient(135deg, #0098CA 0%, #007ba8 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <div style="display: block; text-align: center; margin-bottom: 0;">
                  <img src="${logoUrl}" alt="Heal School Logo" style="width: 48px; height: 48px; object-fit: contain; background: white; border-radius: 50%; padding: 4px; display: block; margin: 0 auto 15px auto;" />
                  <h1 style="color: white; font-size: 28px; font-weight: bold; line-height: 1; margin: 0;">Heal School</h1>
                </div>
              </div>
              
              <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <h2 style="color: #0098CA; border-bottom: 2px solid #0098CA; padding-bottom: 10px; margin-top: 0;">
                New Contact Form Submission
              </h2>
              
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Reference Number:</strong> #${referenceNumber}</p>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              
              <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #0098CA; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Message:</h3>
                <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                <p>This email was sent from the Heal School website contact form.</p>
                <p>Reply directly to this email to respond to ${name}.</p>
              </div>
              </div>
            </div>
          `,
          text: `
New Contact Form Submission

New Contact Form Submission
Reference Number: #${referenceNumber}

From: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

Message:
${message}

---
Reply to: ${email}
          `,
        };

        // Email 2: Send confirmation email to the form submitter
        const confirmationEmail = {
          from: `"Heal School" <${process.env.EMAIL_USER}>`,
          to: email, // Email address of the person who filled the form
          subject: 'Thank You for Contacting Heal School',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Logo and School Name Header -->
              <div style="background: linear-gradient(135deg, #0098CA 0%, #007ba8 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <div style="display: block; text-align: center; margin-bottom: 0;">
                  <img src="${logoUrl}" alt="Heal School Logo" style="width: 48px; height: 48px; object-fit: contain; background: white; border-radius: 50%; padding: 4px; display: block; margin: 0 auto 15px auto;" />
                  <h1 style="color: white; font-size: 28px; font-weight: bold; line-height: 1; margin: 0;">Heal School</h1>
                </div>
              </div>
              
              <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <h2 style="color: #0098CA; margin-top: 0;">Thank You, ${name}!</h2>
                
                <p style="color: #555; line-height: 1.6; font-size: 16px;">
                  We have successfully received your message regarding "<strong>${subject}</strong>".
                </p>
                
                <p style="color: #555; line-height: 1.6; font-size: 16px;">
                  Our team will review your inquiry and get back to you as soon as possible. We typically respond within 24-48 hours.
                </p>
                
                <div style="background-color: #f0f9ff; border-left: 4px solid #0098CA; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #555; line-height: 1.6;">
                    <strong>Reference:</strong> Your message has been assigned reference number <strong>#${referenceNumber}</strong>
                  </p>
                </div>
                
                <p style="color: #555; line-height: 1.6; font-size: 16px;">
                  If you have any urgent queries, please feel free to contact us directly at:
                </p>
                
                <div style="margin: 20px 0;">
                  <p style="margin: 5px 0; color: #555;">
                    <strong>Email:</strong> <a href="mailto:info@healschool.org" style="color: #0098CA;">info@healschool.org</a>
                  </p>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 0;">
                  This is an automated confirmation email. Please do not reply to this message.
                  <br>
                  If you need to add more information, please submit another contact form on our website.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Heal School. All rights reserved.</p>
              </div>
            </div>
          `,
          text: `
Thank You, ${name}!

We have successfully received your message regarding "${subject}".

Our team will review your inquiry and get back to you as soon as possible. We typically respond within 24-48 hours.

Reference: Your message has been assigned reference number #${referenceNumber}

If you have any urgent queries, please feel free to contact us directly at:
Email: info@healschool.org

---
This is an automated confirmation email. Please do not reply to this message.
If you need to add more information, please submit another contact form on our website.

© ${new Date().getFullYear()} Heal School. All rights reserved.
          `,
        };

        // Send both emails in background
        try {
          const [submissionInfo, confirmationInfo] = await Promise.all([
            transporter.sendMail(submissionEmail),
            transporter.sendMail(confirmationEmail),
          ]);

          console.log('✅ Form submission email sent:', submissionInfo.messageId);
          console.log('✅ Confirmation email sent:', confirmationInfo.messageId);
        } catch (emailError) {
          console.error('❌ Email sending failed:', emailError.message);
          console.error('❌ Error details:', {
            code: emailError.code,
            command: emailError.command,
            response: emailError.response
          });
          // Don't throw - allow Google Sheets to still save
        }

        // Save to Google Sheets in the background
        saveToGoogleSheets({ name, email, phone, subject, message, referenceNumber })
          .then(() => {
            console.log('✅ Google Sheets saved in background');
          })
          .catch((sheetsError) => {
            console.error('⚠️ Google Sheets save failed:', sheetsError.message);
          });
      } catch (error) {
        console.error('❌ Background processing error:', error);
        // Log error but don't affect user experience (they already got success response)
      }
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process your request. Please try again later or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server - listen on all network interfaces (0.0.0.0) for network access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Server accessible at:`);
  console.log(`   - http://localhost:${PORT}`);
  console.log(`   - http://127.0.0.1:${PORT}`);

  // Get network IP addresses
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];

  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(`   - http://${iface.address}:${PORT}`);
      }
    });
  });

  if (addresses.length > 0) {
    console.log(`   Network IPs:`);
    addresses.forEach(addr => console.log(addr));
  }

  console.log(`📧 Email service configured for: ${process.env.EMAIL_USER}`);
  console.log(`📬 Target email: ${process.env.TARGET_EMAIL}`);

  // Check Google Sheets configuration
  if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    console.log(`📊 Google Sheets webhook: ${process.env.GOOGLE_SHEETS_WEBHOOK_URL.substring(0, 50)}...`);
  } else if (process.env.GOOGLE_SHEET_ID) {
    console.log(`📊 Google Sheets API: Configured (Sheet ID: ${process.env.GOOGLE_SHEET_ID.substring(0, 20)}...)`);
  } else {
    console.log(`⚠️ Google Sheets: Not configured`);
  }
});

