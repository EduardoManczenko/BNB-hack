# Railway Setup Guide

## Configuration on Railway

If you're getting the error `Missing script: "build"`, follow these steps:

### 1. In Railway Dashboard

When creating the project, configure:

**Settings → Build & Deploy:**

- **Build Command**: Leave empty or use `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend-binance` (if at the root of the repo)

**OR** simply let Railway auto-detect (it should detect Node.js).

### 2. Environment Variables

Go to **Variables** and add:

```
PORT=3001
BINANCE_API_KEY=your_key_here
BINANCE_API_SECRET=your_secret_here
```

### 3. If you still get an error

In Railway, go to **Settings → Build & Deploy** and:

1. **Uncheck** "Build Command" or leave it empty
2. **Start Command**: `npm start`
3. Save and redeploy

### 4. Alternative: Use Nixpacks

The `nixpacks.toml` file is already configured. Railway should detect it automatically.

## Verification

After deployment, verify it's working:

1. Access the Railway URL (e.g., `https://your-project.railway.app`)
2. Test the endpoint: `https://your-project.railway.app/health`
3. Should return: `{"status":"ok","message":"Backend is running"}`
