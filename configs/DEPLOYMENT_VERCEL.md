# Vercel Deployment Guide

Complete guide for deploying your Heal School website to Vercel.

## Quick Start

**Fastest Method - Vercel CLI:**
```bash
npm install -g vercel
vercel
```

Follow the prompts, and your site will be live in under 2 minutes!

## Configuration Files

Your project is already configured with:

### ✅ vercel.json
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: `vite`
- **Install Command**: `npm install`
- **SPA Routing**: Configured with rewrites for React Router
- **Security Headers**: Configured for production
- **Cache Headers**: Optimized for static assets

### ✅ package.json
- **Node Version**: >=20.19.0 (specified in engines)
- **Build Script**: `vite build`
- **All Dependencies**: Listed and versioned

### ✅ vite.config.js
- **Base Path**: `/` (root)
- **Output Directory**: `dist`
- **Build Optimization**: Enabled
- **Code Splitting**: Configured
- **Minification**: Terser with console removal

## Deployment Methods

### Method 1: Automatic via GitHub (Recommended)

1. **Push to GitHub**:
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

4. **Important**: If your repo root contains a subfolder:
   - Go to Project Settings → General
   - Set **Root Directory** to your project folder
   - Click Save
   - Redeploy

### Method 2: Manual via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy.

For production:
```bash
vercel --prod
```

## Build Settings (Auto-detected by Vercel)

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 20.x (from package.json engines)

## Environment Variables

If your app needs environment variables:

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add variables for:
   - Production
   - Preview
   - Development (optional)

**For the contact form backend**, you'll need to deploy the server separately (see `DEPLOYMENT_VPS.md` for full-stack deployment).

## Troubleshooting

### Build Fails

1. **Check Build Logs** in Vercel Dashboard
2. **Common Issues**:
   - Missing dependencies → Check `package.json`
   - TypeScript errors → Fix type issues
   - ESLint errors → Fix or disable in build
   - Memory issues → Upgrade plan or optimize build

### Routes Don't Work

- ✅ Already fixed with `vercel.json` rewrites
- All routes redirect to `/index.html` for SPA routing

### Assets Not Loading

- ✅ Already configured with proper base path (`/`)
- ✅ Cache headers configured for optimal performance

### Deployment Slow

- ✅ Code splitting configured
- ✅ Asset optimization enabled
- ✅ Compression enabled

### Root Directory Issues

**If your repository structure is:**
```
repo-root/
  your-project-folder/
    src/
    package.json
    ...
```

**Solution:**
1. Go to Vercel Dashboard → Settings → General
2. Set **Root Directory** to: `your-project-folder`
3. Click Save
4. Redeploy

## Verification Checklist

Before deploying, ensure:

- [x] `vercel.json` exists in project root
- [x] `package.json` has build script
- [x] `vite.config.js` has correct base path
- [x] Node.js version is 20.19+ (check package.json engines)
- [x] All dependencies are in `package.json`
- [x] Build works locally (`npm run build`)
- [x] `dist` folder is generated after build
- [x] Root directory is set correctly in Vercel (if needed)

## Post-Deployment

After successful deployment:

1. **Test all routes** - Navigate through your app
2. **Check console** - No errors in browser console
3. **Test on mobile** - Responsive design works
4. **Check performance** - Use Lighthouse
5. **Set up custom domain** (optional) - In Vercel project settings

## Current Configuration Summary

```
✅ Framework: Vite
✅ Build: npm run build
✅ Output: dist/
✅ Node: 20.19+
✅ Routing: SPA (React Router)
✅ Security: Headers configured
✅ Performance: Optimized
✅ Caching: Configured
```

## Support

If deployment still fails:

1. Check Vercel build logs for specific errors
2. Verify all files are committed to Git
3. Ensure Root Directory is set correctly
4. Check Node.js version compatibility
5. Review Vercel status: https://www.vercel-status.com/

Your project is ready for Vercel deployment! 🚀

