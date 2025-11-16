# Complete Deployment Steps

## ✅ Backend on Railway (Already done!)

Your backend is already running on Railway. Note the URL:
- **Backend URL**: `https://your-project.railway.app`

---

## 🎨 Frontend App on Vercel

### Step 1: Get Backend URL

1. Go to [railway.app](https://railway.app)
2. Go to your project
3. In **Settings** → **Networking**, copy the URL (or generate a domain if you don't have one yet)

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and log in

2. **Add New Project** → Import the `BNB-hack` repository

3. Configure:
   - **Root Directory**: `frontend-app`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables** (IMPORTANT!):
   ```
   VITE_API_BASE_URL=https://your-project.railway.app
   ```
   (Replace with the actual URL of your backend on Railway)

5. Click **Deploy**

6. Wait for the build and copy the generated URL

### Step 3: Test

1. Access the Vercel URL
2. Log in
3. Verify that the Dashboard loads data from the backend

---

## 📝 Production URLs

- **Backend (Railway)**: Configure your Railway backend URL
- **Frontend App (Vercel)**: [https://bnb-hack-cjlu.vercel.app](https://bnb-hack-cjlu.vercel.app) ✅
- **Gateway Front (Vercel)**: [https://bnb-hack-five.vercel.app](https://bnb-hack-five.vercel.app) ✅

---

## 🔄 Automatic Deployment

Both Railway and Vercel automatically deploy when you push to GitHub!

**Important**: Whenever you change the backend URL, update the `VITE_API_BASE_URL` variable in Vercel.
