# VPS Deployment Guide - Full Stack (Ubuntu 24.04)

Complete guide for deploying the full-stack Heal School website (React + Node.js) on a VPS.

## Prerequisites

- Ubuntu 24.04 VPS (Hostinger, DigitalOcean, AWS, etc.)
- SSH access
- A domain pointing to your VPS IP (recommended for HTTPS)

## Step 0: Basic Server Setup

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ca-certificates ufw

# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### Create a Non-Root Deploy User (Recommended)

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
```

Then log in as that user:
```bash
ssh deploy@YOUR_SERVER_IP
```

## Step 1: Install Node.js (Node 20.19+ Required)

Your dependencies require **Node 20.19+**.

### Option A: Install via NVM (Recommended)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

nvm install 20
nvm use 20
nvm alias default 20

node -v  # v20.x.x
npm -v
```

### Option B: Install via NodeSource (System-Wide)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```

## Step 2: Get Your Code onto the Server

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git app
cd app
```

If you upload a zip instead of git, extract into `~/app`.

## Step 3: Configure Environment Variables

### Server `.env`

Create `server/.env` (do not commit this file):

```bash
nano server/.env
```

Example configuration:

```env
NODE_ENV=production
PORT=3001

# Email Configuration (see EMAIL_SETUP.md)
SMTP_HOST=mail.healschool.org
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=admin@healschool.org
EMAIL_PASSWORD=your-admin-password-here
TARGET_EMAIL=info@healschool.org

# Optional: Google Sheets Integration (see GOOGLE_SHEETS_SETUP.md)
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### Client Environment

If your React app needs an API base URL at build-time, create `.env.production`:

```env
VITE_API_URL=https://your-domain.com/api
```

Using `/api` is best with Nginx proxying (next steps).

## Step 4: Build the Client (React) for Production

```bash
cd ~/app
npm ci
npm run build
```

After this you should have:
```bash
ls -la dist
```

## Step 5: Run the Server (Express) with PM2

Install PM2 once:
```bash
sudo npm i -g pm2
```

Then start your API:
```bash
cd ~/app/server
npm ci

# Start using your package.json start script
pm2 start npm --name "api" -- start
pm2 save
```

Enable PM2 on boot:
```bash
pm2 startup systemd -u $USER --hp $HOME
# Copy/paste the command PM2 prints (it uses sudo)
```

Check:
```bash
pm2 status
pm2 logs api
```

## Step 6: Configure Nginx (Serve Client + Proxy /api to Server)

Install Nginx:
```bash
sudo apt install -y nginx
```

Create a site config:
```bash
sudo nano /etc/nginx/sites-available/heal-school
```

Paste and edit `server_name` + paths:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # React build output
    root /home/deploy/app/dist;
    index index.html;

    # Proxy API to Node/Express
    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA routing (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/heal-school /etc/nginx/sites-enabled/heal-school
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: Add HTTPS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Auto-renew:
```bash
sudo systemctl status certbot.timer
```

## Step 8: Deploy Updates (Pull → Install → Build → Restart)

Create `~/deploy.sh`:

```bash
nano ~/deploy.sh
```

```bash
#!/usr/bin/env bash
set -euo pipefail

cd ~/app
git pull

cd server
npm ci
pm2 restart api

cd ..
npm ci
npm run build

sudo systemctl reload nginx
echo "Deploy complete"
```

Make executable:
```bash
chmod +x ~/deploy.sh
```

Run:
```bash
~/deploy.sh
```

## Troubleshooting

### Node Engine Warnings / Build Failures

```bash
node -v
```

If it's not **20.19+**, fix Node first (Step 1), then reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Not Working

- Check PM2 logs:
```bash
pm2 logs api
```

- Confirm server is listening locally:
```bash
curl -i http://127.0.0.1:3001/api/health || true
```

### Nginx Errors

```bash
sudo tail -n 200 /var/log/nginx/error.log
sudo nginx -t
sudo systemctl restart nginx
```

### Routes Don't Work

- Make sure Nginx config has `try_files $uri $uri/ /index.html;`
- Check that `root` points to `/home/deploy/app/dist`

## Recommended Production Setup

- **PM2** for the Express API (auto-restart on crash)
- **Nginx** to serve the React build and proxy `/api`
- **Certbot** for HTTPS (free SSL)
- **UFW** firewall for security
- **Git** for easy deployments

## Next Steps

1. Set up email (see `EMAIL_SETUP.md`)
2. Set up Google Sheets (see `GOOGLE_SHEETS_SETUP.md`)
3. Configure monitoring (optional)
4. Set up backups (optional)

Your full-stack application is now deployed! 🚀

