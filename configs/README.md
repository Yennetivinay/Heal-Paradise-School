# Configuration & Setup Guides

This folder contains all setup and deployment documentation for the Heal School website.

## 📧 Email & Contact Form

- **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - Set up email sending for the contact form using Nodemailer
  - Configure SMTP settings
  - Set up admin@healschool.org to send emails
  - Configure info@healschool.org to receive submissions
  - Automatic confirmation emails

## 📊 Google Sheets Integration

- **[GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)** - Save all form submissions to Google Sheets
  - Free setup using Google Apps Script
  - No API keys needed
  - Step-by-step instructions
  - Troubleshooting guide included

## 🚀 Deployment Guides

- **[DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)** - Deploy frontend to Vercel
  - Quick setup with Vercel CLI
  - GitHub integration for auto-deployments
  - Configuration details
  - Troubleshooting

- **[DEPLOYMENT_VPS.md](./DEPLOYMENT_VPS.md)** - Full-stack deployment on VPS
  - Ubuntu 24.04 setup
  - React + Node.js deployment
  - Nginx configuration
  - PM2 process management
  - SSL/HTTPS setup

## Quick Start

1. **For Email Setup**: See [EMAIL_SETUP.md](./EMAIL_SETUP.md)
2. **For Google Sheets**: See [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)
3. **For Deployment**: 
   - Frontend only → [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)
   - Full stack → [DEPLOYMENT_VPS.md](./DEPLOYMENT_VPS.md)

## File Structure

```
configs/
├── README.md                    # This file
├── EMAIL_SETUP.md              # Email configuration
├── GOOGLE_SHEETS_SETUP.md      # Google Sheets integration
├── DEPLOYMENT_VERCEL.md        # Vercel deployment
└── DEPLOYMENT_VPS.md           # VPS deployment
```

## Need Help?

- Check the troubleshooting sections in each guide
- Verify your `.env` files are configured correctly
- Check server logs for specific error messages
- Ensure all dependencies are installed

---

**Note**: Keep your `.env` files secure and never commit them to Git!

