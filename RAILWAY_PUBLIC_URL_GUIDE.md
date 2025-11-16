# How to Get Public URL from Railway

The URL `bnb-hack.railway.internal` is an **internal URL** and cannot be accessed from your browser. You need to generate a **public URL**.

## Step-by-Step Guide

### Method 1: Generate Public Domain (Recommended)

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Log in to your account
   - Click on your project (the one with `backend-binance`)

2. **Find the Service**
   - Click on the service that contains your backend (usually named `backend-binance` or similar)

3. **Go to Settings**
   - Click on the **Settings** tab (or the gear icon)
   - Scroll down to find **Networking** or **Domains** section

4. **Generate Public Domain**
   - Look for a button that says:
     - **"Generate Domain"**
     - **"Create Public Domain"**
     - **"Generate Public URL"**
     - Or a toggle to enable public domain
   - Click on it

5. **Copy the Public URL**
   - Railway will generate a URL like:
     - `https://backend-binance-production.up.railway.app`
     - `https://your-project.up.railway.app`
     - Or similar format
   - **Copy this URL** - this is your public URL!

### Method 2: Check Service Settings

If you don't see the "Generate Domain" button:

1. Click on your service in Railway
2. Go to **Settings** tab
3. Look for **"Public Networking"** or **"Public URL"**
4. There should be an option to enable it or generate a domain
5. Enable it and Railway will provide a public URL

### Method 3: Check the Service Overview

1. Click on your service
2. In the main view, look for a section showing:
   - **"Public URL"**
   - **"Domain"**
   - Or a link that says "Open" or "Visit"
3. If it shows the internal URL, click on it or look for options to make it public

## Test Your Public URL

Once you have the public URL, test it in your browser:

```
https://your-backend.up.railway.app/health
```

It should return:
```json
{"status":"ok","message":"Backend is running"}
```

## Use in Frontend

After getting the public URL, update your Vercel environment variable:

1. Go to [vercel.com](https://vercel.com)
2. Select your `frontend-app` project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_BASE_URL` with your Railway public URL:
   ```
   VITE_API_BASE_URL=https://your-backend.up.railway.app
   ```
5. Redeploy the frontend (or wait for automatic deployment)

## Troubleshooting

### Can't find "Generate Domain" button

- Make sure you're looking at the **service** settings, not the project settings
- Try clicking directly on the service name in the project view
- Check if there's a **"Networking"** tab in the service settings

### Still seeing internal URL only

- Some Railway plans might require enabling public networking
- Check if there's a toggle or switch to enable public access
- Look for any warnings or messages about public access

### URL works but getting CORS errors

- The backend already has CORS enabled (`app.use(cors())`)
- Make sure the frontend URL is allowed (CORS should allow all origins by default)
- Check Railway logs for any errors

## Important Notes

- The `.railway.internal` URL is **only for internal Railway communication**
- You **must** have a public URL (`.up.railway.app` or custom domain) to access from outside
- Public URLs are **free** on Railway
- The public URL is automatically HTTPS enabled

