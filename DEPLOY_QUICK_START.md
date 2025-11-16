# Quick Deployment Guide

## 🚀 Backend (backend-binance) - Railway

**Railway is the best option** because it's simple and works perfectly for Node.js servers.

### Step by step:

1. Go to [railway.app](https://railway.app) and log in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select the `BNB-hack` repository
4. Set the root directory to `backend-binance`
5. Go to "Variables" and add:
   ```
   PORT=3001
   BINANCE_API_KEY=your_key_here
   BINANCE_API_SECRET=your_secret_here
   ```
6. Railway will automatically deploy
7. Copy the generated URL (e.g., `https://your-project.railway.app`)

---

## 🎨 Frontend App (frontend-app) - Vercel

### Step by step:

1. Go to [vercel.com](https://vercel.com) and log in with GitHub
2. Click "Add New Project"
3. Import the `BNB-hack` repository
4. Configure:
   - **Root Directory**: `frontend-app`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Go to "Environment Variables" and add:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app
   ```
   (Use the backend URL you copied in the previous step)
6. Click "Deploy"

---

## ✅ Production URLs

- **Backend**: Deployed on Railway ✅
- **Frontend App**: [https://bnb-hack-cjlu.vercel.app](https://bnb-hack-cjlu.vercel.app) ✅
- **Gateway Front**: [https://bnb-hack-five.vercel.app](https://bnb-hack-five.vercel.app) ✅

**Important**: Whenever you push code, Railway and Vercel will automatically deploy!

---

## 🔧 If you need to update the backend URL:

1. In Vercel, go to Project Settings → Environment Variables
2. Update `VITE_API_BASE_URL` with the new backend URL
3. Redeploy (or wait for automatic deployment)
