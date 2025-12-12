# Vercel Deployment Fix Guide

## Issue: Deployment Failed on Vercel

If your deployment is failing, follow these steps:

## Step 1: Verify Project Structure

**IMPORTANT**: Make sure Vercel is pointing to the correct root directory:

- If your repository root contains the `hs` folder, you need to set the **Root Directory** in Vercel settings to `hs`
- OR push only the contents of the `hs` folder to the repository root

### Option A: Set Root Directory in Vercel (Recommended)

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Go to **General** → **Root Directory**
4. Set it to: `hs`
5. Click **Save**
6. Redeploy

### Option B: Restructure Repository

If you want the repository root to be the project root:

1. Move all files from `hs/` to the repository root
2. Update `.gitignore` if needed
3. Push changes
4. Vercel will auto-detect

## Step 2: Verify Build Settings in Vercel

In Vercel Dashboard → Settings → General:

- **Framework Preset**: Vite (or leave blank for auto-detect)
- **Build Command**: `npm run build` (or leave blank)
- **Output Directory**: `dist` (or leave blank)
- **Install Command**: `npm install` (or leave blank)
- **Node.js Version**: 18.x or higher

## Step 3: Check for Common Issues

### Issue 1: Node Version
- The `.nvmrc` file specifies Node 18
- Vercel should auto-detect this
- If not, set it manually in Vercel settings

### Issue 2: Build Command Fails
- Check the build logs in Vercel
- Common errors:
  - Missing dependencies → Add to `package.json`
  - TypeScript errors → Fix type issues
  - ESLint errors → Fix linting issues or disable in build

### Issue 3: Output Directory
- Make sure `dist` folder is generated after build
- Check that `vercel.json` specifies `"outputDirectory": "dist"`

## Step 4: Manual Deployment Test

Test the build locally first:

```bash
cd hs
npm install
npm run build
```

If this works locally, the issue is likely with Vercel configuration.

## Step 5: Check Vercel Build Logs

1. Go to Vercel Dashboard
2. Click on the failed deployment
3. Check the **Build Logs** tab
4. Look for specific error messages
5. Common errors:
   - "Command not found" → Check build command
   - "Module not found" → Missing dependencies
   - "Permission denied" → File permission issues
   - "Out of memory" → Increase memory limit (Pro plan)

## Step 6: Environment Variables

If your app uses environment variables:

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add any required variables
3. Redeploy

## Step 7: Force Redeploy

After making changes:

1. Push changes to GitHub
2. Vercel should auto-deploy
3. OR manually trigger: Vercel Dashboard → Deployments → Redeploy

## Current Configuration

Your `vercel.json` now includes:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Framework: `vite`
- ✅ Install command: `npm install`
- ✅ SPA routing configuration

Your `package.json` now includes:
- ✅ Node.js version requirement: `>=18.0.0`
- ✅ Build script: `vite build`

## Still Not Working?

1. **Check Vercel Status**: https://www.vercel-status.com/
2. **Review Build Logs**: Look for specific error messages
3. **Try Different Framework Preset**: Set to "Other" and specify commands manually
4. **Contact Support**: If all else fails, contact Vercel support with build logs

## Quick Fix Checklist

- [ ] Root directory is set correctly in Vercel
- [ ] Build command is correct (`npm run build`)
- [ ] Output directory is correct (`dist`)
- [ ] Node.js version is 18+ (check `.nvmrc`)
- [ ] All dependencies are in `package.json`
- [ ] Build works locally
- [ ] `vercel.json` is in the correct location
- [ ] No syntax errors in configuration files



