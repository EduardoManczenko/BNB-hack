# How to Get Public URL from Railway

The URL `bnb-hack.railway.internal` is an **internal** Railway URL and cannot be accessed from outside.

## Step-by-Step Guide to Generate Public URL

### 1. In Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Click on your `backend-binance` project
3. Go to the **Settings** tab (or click on the service)
4. Scroll to the **Networking** or **Domains** section

### 2. Generate Public Domain

You have two options:

#### Option A: Railway Domain (Free)
1. In the **Networking** section, look for **"Generate Domain"** or **"Public Domain"**
2. Click **"Generate Domain"** or **"Create Public Domain"**
3. Railway will generate a URL like: `https://your-project-production.up.railway.app`
4. **Copy this URL** - this is the one you'll use in the frontend!

#### Option B: Custom Domain (Optional)
1. You can add your own domain
2. But to start, use the Railway domain (Option A)

### 3. Verify it's working

Test the public URL in your browser:
- `https://your-url.railway.app/health`
- Should return: `{"status":"ok","message":"Backend is running"}`

### 4. Use in Frontend

When you have the public URL, use it in Vercel:

```
VITE_API_BASE_URL=https://your-url.railway.app
```

## Example

If your public URL is: `https://backend-binance-production.up.railway.app`

In Vercel, configure:
```
VITE_API_BASE_URL=https://backend-binance-production.up.railway.app
```

## Important

- The `.railway.internal` URL is only for internal communication
- You need a public URL (`.up.railway.app` or custom domain)
- The public URL is free on Railway
