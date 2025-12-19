# Ubuntu 24.04 VPS Deployment Guide (MERN Stack)

This guide shows how to deploy a **MERN stack** on a Hostinger VPS running **Ubuntu 24.04**:

- **Client**: React (Vite build output)
- **Server**: Node.js + Express (API)
- **Database**: MongoDB (recommended: **MongoDB Atlas**; self-host option included)
- **Process manager**: PM2
- **Reverse proxy + SSL**: Nginx + Let’s Encrypt

It’s written to fit the most common repo layout:

```text
your-repo/
  client/   (React app)
  server/   (Express API)
```

If your folders are named differently (e.g. `frontend/`, `backend/`), just substitute paths.

## Prerequisites

- Ubuntu 24.04 VPS (Hostinger)
- SSH access
- A domain pointing to your VPS IP (recommended for HTTPS)

## Step 0: Basic server setup (recommended)

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

### Create a non-root deploy user (recommended)

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
```

Then log in as that user:

```bash
ssh deploy@YOUR_SERVER_IP
```

## Step 1: Install Node.js (Ubuntu 24.04) — use Node 20.19+ (required)

Your dependencies (Vite / React Router / etc.) require **Node 20.19+**.

### Option A: Install via NVM (recommended)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

nvm install 20
nvm use 20
nvm alias default 20

node -v  # v20.x.x
npm -v
```

### Option B: Install via NodeSource (system-wide)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```

## Step 2: MongoDB setup (choose ONE)

### Option A (recommended): MongoDB Atlas (no server DB install)

1. Create a cluster on Atlas and get your connection string.
2. Put it into your server `.env` as `MONGODB_URI=...`.

This is the easiest and most reliable way on VPS.

### Option B: Self-host MongoDB using Docker (recommended for self-host)

Docker avoids “which MongoDB apt repo supports Ubuntu 24.04” issues.

```bash
sudo apt install -y docker.io
sudo systemctl enable --now docker

sudo docker volume create mongo_data
sudo docker run -d \
  --name mongodb \
  --restart unless-stopped \
  -p 127.0.0.1:27017:27017 \
  -v mongo_data:/data/db \
  mongo:7
```

Notes:
- Binding to `127.0.0.1` keeps MongoDB **private** (not exposed publicly).
- Use `mongodb://127.0.0.1:27017/your_db_name` in your app.

## Step 3: Get your code onto the server

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git app
cd app
```

If you upload a zip instead of git, extract into `~/app`.

## Step 4: Configure environment variables

### Server `.env` (example)

Create `server/.env` (do not commit this file):

```bash
nano server/.env
```

Example keys (adjust to your backend):

```env
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/heal_school

# If you use JWT/auth/etc
JWT_SECRET=replace_with_long_random_secret

# If your client calls the API with a base URL
CLIENT_ORIGIN=https://your-domain.com
```

### Client environment (example)

If your React app needs an API base URL at build-time, create `client/.env.production`:

```env
VITE_API_BASE_URL=/api
```

Using `/api` is best with Nginx proxying (next steps).

## Step 5: Build the client (React) for production

```bash
cd ~/app/client
npm ci
npm run build
```

After this you should have:

```bash
ls -la dist
```

## Step 6: Run the server (Express) with PM2

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

## Step 7: Configure Nginx (serve client + proxy /api to server)

Install Nginx:

```bash
sudo apt install -y nginx
```

Create a site config:

```bash
sudo nano /etc/nginx/sites-available/mern-app
```

Paste and edit `server_name` + paths:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # React build output
    root /home/deploy/app/client/dist;
    index index.html;

    # Proxy API to Node/Express
    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
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
sudo ln -s /etc/nginx/sites-available/mern-app /etc/nginx/sites-enabled/mern-app
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: Add HTTPS (Let’s Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Auto-renew:

```bash
sudo systemctl status certbot.timer
```

## Step 9: Deploy updates (pull → install → build → restart)

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

cd ../client
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

### Node engine warnings / build failures

```bash
node -v
```

If it’s not **20.19+**, fix Node first (Step 1), then reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### API not working

- Check PM2 logs:

```bash
pm2 logs api
```

- Confirm server is listening locally:

```bash
curl -i http://127.0.0.1:5000/health || true
```

(Replace `/health` with a real endpoint.)

### Nginx errors

```bash
sudo tail -n 200 /var/log/nginx/error.log
sudo nginx -t
sudo systemctl restart nginx
```

### MongoDB connection issues (Docker)

```bash
sudo docker ps
sudo docker logs mongodb --tail 200
```

## Recommended production setup (summary)

- **MongoDB Atlas** (or Docker Mongo bound to localhost)
- **PM2** for the Express API
- **Nginx** to serve the React build and proxy `/api`
- **Certbot** for HTTPS

