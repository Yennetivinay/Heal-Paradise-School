# Email Setup Guide - Contact Form

This guide will help you set up email sending for the contact form using Nodemailer.

## Your Configuration

- **Sending Email:** admin@healschool.org (sends emails)
- **Receiving Email:** info@healschool.org (receives form submissions)
- **Confirmation Emails:** Automatically sent to form submitters
- **Google Sheets:** Optional - automatically saves all form submissions (see `GOOGLE_SHEETS_SETUP.md`)

## Quick Setup (3 Steps)

### Step 1: Create `.env` File

1. Go to the `server` folder
2. Create a file named `.env` (create a new file, don't rename anything)
3. Copy and paste this content:

```env
SMTP_HOST=mail.healschool.org
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=admin@healschool.org
EMAIL_PASSWORD=your-admin-password-here
TARGET_EMAIL=info@healschool.org
PORT=3001
NODE_ENV=development

# Optional: Google Sheets Integration
# Uncomment and configure if you want to save submissions to Google Sheets
# See GOOGLE_SHEETS_SETUP.md for detailed instructions
# GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

4. Replace `your-admin-password-here` with your actual admin@healschool.org password

**Optional:** If you want to save all form submissions to Google Sheets, see `GOOGLE_SHEETS_SETUP.md` for instructions.

### Step 2: Find Your SMTP Settings (If mail.healschool.org doesn't work)

The SMTP settings depend on where your email is hosted. Try these in order:

**Most Common (cPanel/Hosting Email):**
```env
SMTP_HOST=mail.healschool.org
SMTP_PORT=587
SMTP_SECURE=false
```

**If that doesn't work, try:**
```env
SMTP_HOST=mail.healschool.org
SMTP_PORT=465
SMTP_SECURE=true
```

**If using Google Workspace:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_PASSWORD=your-app-password  # See note below
```

**If using Microsoft 365:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**How to find your SMTP settings:**
- Contact your hosting provider (they can tell you the exact settings)
- Or check your email provider's documentation
- Or try setting up the email in Outlook/Thunderbird - use the same SMTP settings that work there

**Note for Google Workspace:** You need an "App Password", not your regular password:
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords → Generate password for "Mail"
4. Use the 16-character password here

### Step 3: Start the Server

Open terminal and run:

```bash
cd server
npm install  # Only needed the first time
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📧 Email service configured for: admin@healschool.org
📬 Target email: info@healschool.org
```

### Step 4: Test It

1. Start your frontend: `npm run dev` (in a new terminal)
2. Go to the Contact page
3. Fill out and submit the form
4. Check:
   - **info@healschool.org** should receive the form submission
   - **The person who filled the form** should receive a confirmation email

## What Happens When Someone Submits the Form?

1. ✅ **Email to info@healschool.org** 
   - Subject: "Important Message from Heal school website"
   - Contains: Name, email, phone, subject, and message
   - You can reply directly to the sender

2. ✅ **Confirmation email to form submitter**
   - Subject: "Thank You for Contacting Heal School"
   - Message: "We have received your response, our team will review it"
   - Includes a reference number

3. ✅ **Google Sheets** (if configured)
   - Data automatically saved to your Google Sheet
   - See `GOOGLE_SHEETS_SETUP.md` for setup

## Troubleshooting

### "Authentication failed" error
- Double-check your password is correct
- For Google Workspace, make sure you're using an App Password
- Verify EMAIL_USER is set to admin@healschool.org

### "Connection timeout" error
- Try different SMTP_PORT (587 or 465)
- If using port 465, set SMTP_SECURE=true
- Check if your firewall is blocking the connection

### "Can't connect to SMTP server"
- Try the different SMTP_HOST options listed above
- Contact your hosting provider for exact SMTP settings
- Some hosts require specific ports or configurations

### Emails not sending
- Check the server console for error messages
- Verify your `.env` file is in the `server` folder (not root)
- Make sure all variables in `.env` are filled in correctly

## Production Deployment

When deploying to production:
1. Set environment variables on your hosting platform (Heroku, Railway, Render, etc.)
2. Update frontend `.env` with: `VITE_API_URL=https://your-api-domain.com`
3. Make sure CORS is configured to allow your frontend domain

That's it! If you need help, contact your hosting provider for SMTP settings.

