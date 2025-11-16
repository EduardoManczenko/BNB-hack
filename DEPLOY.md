# Deployment Guide

This guide explains how to deploy the NativeFi Payment Gateway projects.

## Overview

- **backend-binance**: Node.js/Express API server (needs continuous running)
- **frontend-app**: Vite/React application (can deploy to Vercel)
- **gateway-front**: Next.js application (already deployed on Vercel at [https://bnb-hack-five.vercel.app](https://bnb-hack-five.vercel.app))

---

## Backend Deployment (backend-binance)

The backend needs to run continuously, so **Vercel is not ideal** (it's serverless). Recommended platforms:

### Option 1: Railway (Recommended) 🚂

Railway is easy to use and perfect for Node.js applications.

#### Steps:

1. **Sign up at [Railway.app](https://railway.app)**

2. **Create a new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo" (connect your GitHub account)
   - Select the `BNB-hack` repository
   - Select the `backend-binance` folder as the root directory

3. **Configure environment variables:**
   - Go to your project → Variables
   - Add the following:
     ```
     PORT=3001
     BINANCE_API_KEY=your_binance_api_key_here
     BINANCE_API_SECRET=your_binance_api_secret_here
     ```

4. **Configure build settings:**
   - Railway will auto-detect Node.js
   - Build command: `npm install`
   - Start command: `npm start`

5. **Deploy:**
   - Railway will automatically deploy on every push to your main branch
   - You'll get a URL like: `https://your-project.railway.app`

6. **Update frontend to use the new URL:**
   - Update `frontend-app/.env` or `frontend-app/.env.production`:
     ```
     VITE_API_BASE_URL=https://your-project.railway.app
     ```

### Option 2: Render

#### Steps:

1. **Sign up at [Render.com](https://render.com)**

2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend-binance` folder

3. **Configure:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. **Add environment variables:**
   - Go to Environment tab
   - Add:
     ```
     PORT=3001
     BINANCE_API_KEY=your_binance_api_key_here
     BINANCE_API_SECRET=your_binance_api_secret_here
     ```

5. **Deploy:**
   - Click "Create Web Service"
   - Render will provide a URL like: `https://your-project.onrender.com`

### Option 3: Vercel (Serverless Functions)

Vercel can work but requires converting to serverless functions. Not recommended for this use case.

---

## Frontend App Deployment (frontend-app)

The `frontend-app` is a Vite/React app that can be easily deployed to **Vercel**.

### Steps:

1. **Install Vercel CLI (optional but recommended):**
   ```bash
   npm i -g vercel
   ```

2. **Navigate to frontend-app:**
   ```bash
   cd frontend-app
   ```

3. **Create vercel.json configuration:**
   - See `frontend-app/vercel.json` (created below)

4. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `frontend-app` folder as root
   - Configure:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

5. **Add environment variables:**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_BASE_URL=https://your-backend-url.railway.app
     ```
   - Make sure to add it for **Production**, **Preview**, and **Development**

6. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a URL like: `https://your-project.vercel.app`

### Deploy via CLI:

```bash
cd frontend-app
vercel
```

Follow the prompts and deploy.

---

## Environment Variables Summary

### Backend (Railway/Render)
```
PORT=3001
BINANCE_API_KEY=your_binance_api_key_here
BINANCE_API_SECRET=your_binance_api_secret_here
```

### Frontend App (Vercel)
```
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

---

## Post-Deployment Checklist

- [ ] Backend is accessible at the deployed URL
- [ ] Backend `/health` endpoint returns `{"status":"ok"}`
- [ ] Frontend app can connect to backend API
- [ ] CORS is properly configured (backend should allow frontend domain)
- [ ] Environment variables are set correctly
- [ ] Test balance fetching works
- [ ] Test transaction history works

---

## Troubleshooting

### Backend Issues

**CORS Errors:**
- Make sure `cors()` middleware is enabled in `server.js`
- Add your frontend domain to CORS whitelist if needed

**API Errors:**
- Verify Binance API credentials are correct
- Check that API key has "Enable Reading" permission
- Check Railway/Render logs for errors

### Frontend Issues

**API Connection Errors:**
- Verify `VITE_API_BASE_URL` is set correctly
- Check that backend URL is accessible
- Verify CORS is configured on backend

**Build Errors:**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

---

## Recommended Setup

1. **Backend**: Deploy to Railway (easiest and most reliable)
2. **Frontend App**: Deploy to Vercel (perfect for static sites)
3. **Gateway Front**: Already deployed on Vercel at [https://bnb-hack-five.vercel.app](https://bnb-hack-five.vercel.app) ✅

This gives you:
- Continuous deployment from GitHub
- Automatic HTTPS
- Easy environment variable management
- Free tier available for all services

