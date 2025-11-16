# Troubleshooting Backend Issues

## Problem: "Not Found" Error

If you're getting "Not Found" when accessing endpoints, check the following:

### 1. Check if you're using the correct URL format

❌ **Wrong**:
```
http://sua-url.railway.app/api/balance
```

✅ **Correct**:
```
https://your-actual-railway-url.up.railway.app/api/balance
```

**Important**:
- Use `https://` (not `http://`)
- Replace `sua-url` or `your-actual-railway-url` with your **real Railway URL**
- Railway URLs usually end with `.up.railway.app` or `.railway.app`

### 2. Verify your Railway Public URL

1. Go to [railway.app](https://railway.app)
2. Click on your project
3. Click on your service (backend-binance)
4. Go to **Settings** → **Networking**
5. Look for **"Public Domain"** or **"Generate Domain"**
6. Copy the **actual URL** (should look like `https://something.up.railway.app`)

### 3. Test the Health Endpoint First

Always start with the simplest endpoint:

```
https://your-real-railway-url.up.railway.app/health
```

This should return:
```json
{"status":"ok","message":"Backend is running"}
```

If `/health` doesn't work, the backend might not be running or the URL is wrong.

### 4. Check Railway Service Status

1. Go to Railway dashboard
2. Check if your service shows:
   - ✅ **"Active"** or **"Running"**
   - ❌ **"Stopped"** or **"Error"**

If it's stopped or has errors:
- Check the **Logs** tab for error messages
- Verify environment variables are set correctly
- Check if the service needs to be restarted

### 5. Check Railway Logs

1. In Railway, click on your service
2. Go to **Logs** tab
3. Look for:
   - Error messages
   - "Server is running on..." message
   - Any connection errors

### 6. Verify Environment Variables

Make sure these are set in Railway:
- `PORT=3001` (optional, defaults to 3001)
- `BINANCE_API_KEY=your_key`
- `BINANCE_API_SECRET=your_secret`

### 7. Common URL Mistakes

❌ **Wrong Examples**:
```
http://bnb-hack.railway.internal/api/balance  (internal URL)
http://sua-url.railway.app/api/balance        (placeholder)
http://localhost:3001/api/balance            (local, won't work)
```

✅ **Correct Example**:
```
https://backend-binance-production-abc123.up.railway.app/api/balance
```

## Step-by-Step Diagnosis

### Step 1: Get Your Real Railway URL

1. Railway Dashboard → Your Project → Your Service
2. Settings → Networking
3. Copy the **public URL** (starts with `https://`)

### Step 2: Test Health Endpoint

Open in browser:
```
https://YOUR_REAL_URL/health
```

**Expected**: `{"status":"ok","message":"Backend is running"}`

**If this fails**: 
- URL is wrong, or
- Backend is not running, or
- Service is not deployed

### Step 3: Test API Endpoint

If `/health` works, try:
```
https://YOUR_REAL_URL/api/balance
```

**Expected**: JSON with balance data or error message

**If this fails but `/health` works**:
- Backend is running but API credentials might be missing
- Check Railway environment variables

## Quick Test Commands

### Using cURL (Terminal)

Replace `YOUR_REAL_URL` with your actual Railway URL:

```bash
# Test health
curl https://YOUR_REAL_URL/health

# Test balance
curl https://YOUR_REAL_URL/api/balance
```

### Using Browser

Just paste the URL in your browser:
```
https://YOUR_REAL_URL/health
```

## Still Not Working?

1. **Share your actual Railway URL** (the one that starts with `https://`)
2. **Check Railway logs** and share any error messages
3. **Verify the service is running** in Railway dashboard
4. **Test `/health` first** - if this doesn't work, nothing else will

## Example of Correct Usage

If your Railway URL is: `https://backend-binance-production.up.railway.app`

Then test:
```
https://backend-binance-production.up.railway.app/health
https://backend-binance-production.up.railway.app/api/balance
https://backend-binance-production.up.railway.app/api/deposits/today
```

