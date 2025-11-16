# Vercel Frontend Troubleshooting

## Problem: Frontend not loading on Vercel

If your frontend at `https://bnb-hack-cjlu.vercel.app` is not loading, follow these steps:

## Step 1: Check Vercel Deployment Status

1. Go to [vercel.com](https://vercel.com)
2. Log in and select your `frontend-app` project
3. Check the **Deployments** tab
4. Look at the latest deployment:
   - ✅ **Ready** - Deployment successful
   - ⏳ **Building** - Still deploying
   - ❌ **Error** - Build failed

### If deployment has errors:

1. Click on the failed deployment
2. Check the **Build Logs** for error messages
3. Common errors:
   - Missing dependencies
   - Build command failed
   - Environment variables missing

## Step 2: Verify Environment Variables

**CRITICAL**: The frontend needs the backend URL configured!

1. In Vercel, go to **Settings** → **Environment Variables**
2. Check if `VITE_API_BASE_URL` is set:
   ```
   VITE_API_BASE_URL=https://backend-binance-production.up.railway.app
   ```
3. Make sure it's enabled for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### If missing or wrong:

1. Click **Add New**
2. Name: `VITE_API_BASE_URL`
3. Value: `https://backend-binance-production.up.railway.app`
4. Select all environments (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** the project (or wait for auto-deploy)

## Step 3: Check Build Configuration

1. Go to **Settings** → **General**
2. Verify:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 4: Check Browser Console

1. Open `https://bnb-hack-cjlu.vercel.app` in your browser
2. Open Developer Tools (F12)
3. Go to **Console** tab
4. Look for errors:
   - Network errors (CORS, 404, etc.)
   - JavaScript errors
   - API connection errors

### Common Console Errors:

**"Failed to fetch"** or **"Network Error"**:
- Backend URL is wrong or not accessible
- CORS issue (but backend has CORS enabled)
- Check `VITE_API_BASE_URL` in Vercel

**"Cannot read property of undefined"**:
- Frontend code error
- Check Vercel build logs

**404 errors for assets**:
- Build output directory might be wrong
- Check `vercel.json` configuration

## Step 5: Test Backend Connection

The frontend needs to connect to:
```
https://backend-binance-production.up.railway.app
```

Test if backend is accessible:
1. Open: `https://backend-binance-production.up.railway.app/health`
2. Should return: `{"status":"ok","message":"Backend is running"}`

If backend is not accessible:
- Check Railway service status
- Verify backend is running
- Check Railway logs

## Step 6: Force Redeploy

After fixing environment variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** (three dots menu)
4. Or make a small change and push to GitHub (triggers auto-deploy)

## Step 7: Check Vercel Logs

1. In Vercel, go to your project
2. Click on a deployment
3. Go to **Functions** or **Logs** tab
4. Check for runtime errors

## Common Issues and Solutions

### Issue 1: Blank Page / White Screen

**Possible causes**:
- Build failed
- JavaScript error
- Missing environment variable

**Solution**:
1. Check browser console for errors
2. Check Vercel build logs
3. Verify environment variables are set
4. Try redeploying

### Issue 2: "Failed to fetch" errors

**Possible causes**:
- `VITE_API_BASE_URL` not set or wrong
- Backend is down
- CORS issue

**Solution**:
1. Verify `VITE_API_BASE_URL` in Vercel settings
2. Test backend URL directly in browser
3. Check backend CORS configuration

### Issue 3: Build fails

**Possible causes**:
- Missing dependencies
- TypeScript errors
- Build command wrong

**Solution**:
1. Check build logs in Vercel
2. Test build locally: `npm run build`
3. Fix any errors locally first
4. Push changes and redeploy

### Issue 4: Assets not loading (404)

**Possible causes**:
- Wrong output directory
- Build configuration issue

**Solution**:
1. Verify `vercel.json` has correct `outputDirectory: "dist"`
2. Check Vercel project settings
3. Ensure build completes successfully

## Quick Fix Checklist

- [ ] Backend is accessible: `https://backend-binance-production.up.railway.app/health`
- [ ] `VITE_API_BASE_URL` is set in Vercel environment variables
- [ ] Environment variable is enabled for Production, Preview, and Development
- [ ] Vercel deployment shows "Ready" status
- [ ] No errors in Vercel build logs
- [ ] No errors in browser console
- [ ] Root directory is set to `frontend-app` in Vercel
- [ ] Build command is `npm run build`
- [ ] Output directory is `dist`

## Test Locally First

Before troubleshooting Vercel, test locally:

1. Create `.env` file in `frontend-app/`:
   ```
   VITE_API_BASE_URL=https://backend-binance-production.up.railway.app
   ```

2. Run locally:
   ```bash
   cd frontend-app
   npm install
   npm run dev
   ```

3. Open `http://localhost:8080`
4. Check if it connects to backend
5. If local works but Vercel doesn't, it's an environment variable issue

## Still Not Working?

Share:
1. What error message you see (browser console, Vercel logs)
2. Vercel deployment status
3. Whether `/health` endpoint works on backend
4. Screenshot of Vercel environment variables (hide sensitive data)

