# Debug: Frontend-Backend Connection

## Steps to Debug

### 1. Open Browser Console

1. Open your frontend app: `https://bnb-hack-cjlu.vercel.app`
2. Press **F12** (or right-click → Inspect)
3. Go to **Console** tab
4. Look for logs starting with `[API Config]` and `[Dashboard]`

### 2. Check API Configuration Logs

You should see logs like:
```
[API Config] Environment: production
[API Config] VITE_API_BASE_URL from env: https://backend-binance-production.up.railway.app
[API Config] Final API Base URL: https://backend-binance-production.up.railway.app
```

**If you see:**
- `VITE_API_BASE_URL from env: undefined` → Variable not set in Vercel
- `Final API Base URL: http://localhost:3001` → Using fallback (wrong for production)

### 3. Check API Request Logs

When the Dashboard loads, you should see:
```
[Dashboard] Fetching balance from: https://backend-binance-production.up.railway.app/api/balance
[Dashboard] Balance response status: 200
[Dashboard] Balance data received: {success: true, totalBalance: "..."}
```

**If you see errors:**
- `Failed to fetch` → CORS issue or backend down
- `404 Not Found` → Wrong URL
- `500 Internal Server Error` → Backend error

### 4. Check Network Tab

1. In DevTools, go to **Network** tab
2. Filter by **Fetch/XHR**
3. Look for requests to `/api/balance`
4. Click on the request to see:
   - **Request URL**: Should be your Railway URL
   - **Status**: Should be 200
   - **Response**: Should show JSON with `success: true`

### 5. Common Issues and Solutions

#### Issue 1: `VITE_API_BASE_URL` is undefined

**Symptoms:**
- Console shows: `VITE_API_BASE_URL from env: undefined`
- Using localhost URL in production

**Solution:**
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add: `VITE_API_BASE_URL = https://backend-binance-production.up.railway.app`
4. Redeploy

#### Issue 2: CORS Error

**Symptoms:**
- Console shows: `Failed to fetch` or `CORS policy`
- Network tab shows CORS error

**Solution:**
- Backend already has `app.use(cors())` which should allow all origins
- Check Railway logs to see if backend is running
- Verify backend URL is correct

#### Issue 3: 404 Not Found

**Symptoms:**
- Network tab shows 404
- Console shows: `Balance response status: 404`

**Solution:**
- Verify backend URL is correct
- Test backend directly: `https://backend-binance-production.up.railway.app/health`
- Should return: `{"status":"ok","message":"Backend is running"}`

#### Issue 4: 500 Internal Server Error

**Symptoms:**
- Network tab shows 500
- Console shows: `Balance response status: 500`

**Solution:**
- Check Railway logs for backend errors
- Verify Binance API credentials are set in Railway
- Test backend endpoint directly

#### Issue 5: Data not updating

**Symptoms:**
- No errors in console
- But balance shows `$150.00` (mock value only)

**Solution:**
- Check if `balanceData?.success` is `true`
- Check if `balanceData.totalBalance` has a value
- Look at console logs: `[Dashboard] Balance data received:`

### 6. Test Backend Directly

Open in browser:
```
https://backend-binance-production.up.railway.app/health
https://backend-binance-production.up.railway.app/api/balance
```

Should return JSON responses.

### 7. Verify Vercel Environment Variable

1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Check:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://backend-binance-production.up.railway.app`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

### 8. Force Redeploy

After fixing environment variables:
1. Vercel Dashboard → Deployments
2. Click three dots (⋯) on latest deployment
3. Click **Redeploy**
4. Wait for build to complete
5. Test again

## Expected Console Output (Success)

```
[API Config] Environment: production
[API Config] VITE_API_BASE_URL from env: https://backend-binance-production.up.railway.app
[API Config] Final API Base URL: https://backend-binance-production.up.railway.app
[Dashboard] Fetching balance from: https://backend-binance-production.up.railway.app/api/balance
[Dashboard] Balance response status: 200
[Dashboard] Balance data received: {success: true, totalBalance: "1245.50", balances: [...]}
[Dashboard] Balance query success: {success: true, totalBalance: "1245.50", balances: [...]}
```

## Share Debug Info

If still not working, share:
1. Console logs (copy all `[API Config]` and `[Dashboard]` logs)
2. Network tab screenshot (showing the `/api/balance` request)
3. Vercel environment variables (hide sensitive data)
4. Backend health check result

