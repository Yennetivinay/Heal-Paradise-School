# Deployment Instructions

Your website is ready to deploy! Follow one of the methods below to make it accessible to anyone on the internet.

## Option A: Deploy to Vercel (Recommended - Easiest)

### Method 1: Using Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to your project directory**:
   ```bash
   cd hs
   ```

3. **Deploy your website**:
   ```bash
   vercel
   ```
   - Follow the prompts to log in or create a Vercel account
   - Answer the questions (defaults are usually fine)
   - Your site will be deployed and you'll get a URL like: `https://your-project.vercel.app`

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Method 2: Using GitHub (Best for Automatic Updates)

1. **Push your code to GitHub**:
   - Create a new repository on GitHub
   - Push your code:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin https://github.com/yourusername/your-repo-name.git
     git push -u origin main
     ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Log in with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect your Vite project
   - Click "Deploy"

3. **Automatic Deployments**:
   - Every time you push to GitHub, Vercel will automatically deploy your changes
   - You'll get a production URL and preview URLs for each deployment

## Option B: Deploy to Netlify

### Method 1: Drag and Drop

1. **Build your project** (already done):
   ```bash
   npm run build
   ```

2. **Go to Netlify**:
   - Visit [netlify.com](https://netlify.com)
   - Sign up/Log in
   - Drag and drop the `dist` folder onto the Netlify dashboard

3. **Your site is live!** You'll get a URL like: `https://random-name.netlify.app`

### Method 2: Using Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   cd hs
   netlify deploy
   ```

3. **Deploy to production**:
   ```bash
   netlify deploy --prod
   ```

### Method 3: GitHub Integration (Netlify)

1. Push your code to GitHub (same as Vercel Method 2, step 1)

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

## Configuration Files

The following files have been created for proper deployment:

- **`vercel.json`**: Configures SPA routing for Vercel (all routes redirect to index.html)
- **`public/_redirects`**: Configures SPA routing for Netlify

## Important Notes

- Both Vercel and Netlify provide **free SSL certificates** (HTTPS)
- Both services offer **free tier** with generous limits
- You can add a **custom domain** later in the project settings
- The build output is in the `dist` folder
- React Router routes will work correctly with the provided configuration

## Troubleshooting

- If routes don't work after deployment, make sure `vercel.json` (for Vercel) or `_redirects` (for Netlify) is in the correct location
- For Vercel: `vercel.json` should be in the root of your project (`hs` folder)
- For Netlify: `_redirects` should be in the `public` folder (it will be copied to `dist` during build)

## Quick Start (Fastest Method)

**For immediate deployment, use Vercel CLI:**

```bash
cd hs
npm install -g vercel
vercel
```

Follow the prompts, and your site will be live in under 2 minutes!

