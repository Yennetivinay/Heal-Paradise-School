# Heal School Website

A modern, responsive website for Heal School built with React, Vite, and Tailwind CSS.

## Features

- 🎨 Modern, responsive design
- 📧 Contact form with email integration
- 📊 Google Sheets integration for form submissions
- 🖼️ Gallery with image collections
- 📱 Mobile-first responsive design
- ⚡ Fast performance with code splitting
- 🎭 Smooth animations with Framer Motion

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Routing**: React Router
- **Animations**: Framer Motion
- **Backend**: Node.js, Express, Nodemailer
- **Deployment**: Vercel (frontend), VPS (full-stack)

## Quick Start

### Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Start backend server** (for contact form):
   ```bash
   cd server
   npm install
   npm run dev
   ```

### Build

```bash
npm run build
```

The build output will be in the `dist` folder.

## Configuration

All setup and deployment guides are in the [`configs/`](./configs/) folder:

- **[Email Setup](./configs/EMAIL_SETUP.md)** - Configure contact form email
- **[Google Sheets Setup](./configs/GOOGLE_SHEETS_SETUP.md)** - Save form submissions to Google Sheets
- **[Vercel Deployment](./configs/DEPLOYMENT_VERCEL.md)** - Deploy frontend to Vercel
- **[VPS Deployment](./configs/DEPLOYMENT_VPS.md)** - Full-stack deployment guide

## Project Structure

```
.
├── src/                    # Source code
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── assets/            # Images, videos, etc.
│   └── utils/             # Utility functions
├── server/                # Backend API
│   ├── server.js         # Express server
│   └── .env              # Environment variables (not in git)
├── configs/               # Setup and deployment guides
├── public/                # Static assets
└── dist/                  # Build output
```

## Environment Variables

### Frontend

Create `.env` in the root:
```env
VITE_API_URL=http://localhost:3001
```

### Backend

Create `server/.env`:
```env
SMTP_HOST=mail.healschool.org
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=admin@healschool.org
EMAIL_PASSWORD=your-password
TARGET_EMAIL=info@healschool.org
PORT=3001
NODE_ENV=development
```

See [configs/EMAIL_SETUP.md](./configs/EMAIL_SETUP.md) for detailed setup.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Frontend Only (Vercel)

See [configs/DEPLOYMENT_VERCEL.md](./configs/DEPLOYMENT_VERCEL.md)

### Full Stack (VPS)

See [configs/DEPLOYMENT_VPS.md](./configs/DEPLOYMENT_VPS.md)

## License

© 2025 Heal School. All rights reserved.
