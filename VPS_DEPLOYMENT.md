# VPS Deployment Guide for Hostinger Ubuntu Server

This guide will help you deploy your Vite React app to a Hostinger VPS running Ubuntu.

## Prerequisites

- Ubuntu VPS server (Hostinger)
- SSH access to your server
- Domain name (optional, but recommended)

## Step 1: Update Node.js Version

Your current Node.js version (v18.19.1) is too old. You need v20.19.0 or higher.

### Option A: Using NVM (Recommended)

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell configuration
source ~/.bashrc

# Install Node.js v20
nvm install 20

# Use Node.js v20
nvm use 20

# Set as default
nvm alias default 20

# Verify installation
node -v  # Should show v20.x.x
npm -v
```

### Option B: Using NodeSource Repository

```bash
# Remove old Node.js
sudo apt remove nodejs npm -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node -v  # Should show v20.x.x
npm -v
```

## Step 2: Install Dependencies and Build

```bash
# Navigate to your project directory
cd ~/Heal-Paradise-School

# Install dependencies
npm install

# Build the production version
npm run build

# This creates a `dist` folder with all production files
```

## Step 3: Serve the Application

You have two options:

### Option A: Using Vite Preview (Quick Test)

```bash
# Serve the built files
npm start

# Or directly:
npm run serve

# Your app will be available at http://your-server-ip:3000
```

### Option B: Using Nginx (Production - Recommended)

1. **Install Nginx:**
```bash
sudo apt update
sudo apt install nginx -y
```

2. **Create Nginx Configuration:**
```bash
sudo nano /etc/nginx/sites-available/heal-paradise-school
```

3. **Add this configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /root/Heal-Paradise-School/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # SPA routing - all routes go to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

4. **Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/heal-paradise-school /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

5. **Set up SSL with Let's Encrypt (Optional but Recommended):**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Option C: Using PM2 with serve (Alternative)

```bash
# Install serve globally
npm install -g serve

# Install PM2
npm install -g pm2

# Start the app with PM2
pm2 serve dist 3000 --spa --name heal-paradise-school

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the instructions it provides
```

## Step 4: Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# If using Vite preview, allow port 3000
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable
```

## Step 5: Update and Rebuild

Whenever you make changes:

```bash
# Pull latest changes (if using git)
git pull

# Install any new dependencies
npm install

# Rebuild
npm run build

# If using Nginx, no restart needed (it serves static files)
# If using PM2, restart:
pm2 restart heal-paradise-school
```

## Troubleshooting

### Node.js Version Still Wrong
```bash
# Check current version
node -v

# If still old, make sure you're using the right Node.js
which node
# Should point to NVM's Node.js if using NVM

# Or restart your SSH session
exit
# SSH back in
```

### Port Already in Use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill the process or use a different port
# In package.json, change the port in the serve script
```

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Nginx 502 Bad Gateway
- Check that the `dist` folder exists: `ls -la ~/Heal-Paradise-School/dist`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify file permissions: `sudo chown -R www-data:www-data /root/Heal-Paradise-School/dist`

## Quick Deployment Script

Save this as `deploy.sh`:

```bash
#!/bin/bash
cd ~/Heal-Paradise-School
git pull
npm install
npm run build
# If using PM2:
pm2 restart heal-paradise-school
# If using Nginx, no restart needed
echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
```

## Recommended Setup

For production, use **Nginx** (Option B) as it's:
- More efficient for serving static files
- Better for SSL/HTTPS
- More reliable and performant
- Industry standard

