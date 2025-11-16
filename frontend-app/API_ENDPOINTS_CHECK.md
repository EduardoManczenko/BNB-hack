# Frontend API Endpoints Verification

## ✅ All endpoints are correctly using `VITE_API_BASE_URL`

All pages are using the environment variable correctly:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
```

---

## Endpoints by Page

### 1. Dashboard (`src/pages/Dashboard.tsx`)

**Endpoints used:**
- ✅ `GET ${API_BASE_URL}/api/balance` - Get wallet balance
- ✅ `GET ${API_BASE_URL}/api/deposits/today` - Get today's deposits

**Status**: ✅ Correctly configured

---

### 2. Transactions (`src/pages/Transactions.tsx`)

**Endpoints used:**
- ✅ `GET ${API_BASE_URL}/api/transactions` - Get transaction history

**Status**: ✅ Correctly configured

---

### 3. Earn/Split (`src/pages/Split.tsx`)

**Endpoints used:**
- ✅ `GET ${API_BASE_URL}/api/balance` - Get wallet balance (for vault calculations)

**Status**: ✅ Correctly configured

**Note**: This page also uses mock data for vaults (Child School, Birthday Party), which is expected.

---

### 4. Withdrawals (`src/pages/Withdrawals.tsx`)

**Endpoints used:**
- ✅ `GET ${API_BASE_URL}/api/balance` - Get wallet balance (for withdrawal calculations)

**Status**: ✅ Correctly configured

---

## Environment Variable Configuration

### Local Development

Create `.env` file in `frontend-app/`:
```env
VITE_API_BASE_URL=http://localhost:3001
```

### Production (Vercel)

In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add:
   ```
   Name: VITE_API_BASE_URL
   Value: https://backend-binance-production.up.railway.app
   ```
3. Enable for: Production, Preview, Development

---

## Verification Checklist

- [x] All pages use `import.meta.env.VITE_API_BASE_URL`
- [x] All pages have fallback to `http://localhost:3001`
- [x] All API calls use `${API_BASE_URL}/api/...`
- [x] No hardcoded URLs found
- [x] Environment variable is properly prefixed with `VITE_`

---

## Expected Behavior

### Local Development
- Uses `http://localhost:3001` (fallback)
- Or uses `.env` file if configured

### Production (Vercel)
- Uses `https://backend-binance-production.up.railway.app` (from Vercel environment variables)
- Must be configured in Vercel dashboard

---

## Testing

### Test locally:
```bash
cd frontend-app
npm run dev
```

Open browser console and check network requests:
- Should show requests to `http://localhost:3001/api/...`

### Test in production:
1. Open `https://bnb-hack-cjlu.vercel.app`
2. Open browser DevTools (F12)
3. Go to **Network** tab
4. Check API requests:
   - Should show requests to `https://backend-binance-production.up.railway.app/api/...`

---

## Common Issues

### Issue: Still using localhost in production

**Cause**: `VITE_API_BASE_URL` not set in Vercel

**Solution**: 
1. Add environment variable in Vercel
2. Redeploy

### Issue: CORS errors

**Cause**: Backend not allowing frontend domain

**Solution**: Backend already has `app.use(cors())` which allows all origins

### Issue: 404 errors

**Cause**: Backend URL is wrong or backend is down

**Solution**: 
1. Test backend directly: `https://backend-binance-production.up.railway.app/health`
2. Verify URL in Vercel environment variables

---

## Summary

✅ **All endpoints are correctly configured**
✅ **All pages use `VITE_API_BASE_URL` environment variable**
✅ **Fallback to localhost for local development**
✅ **Ready for production deployment**

**Action Required**: Make sure `VITE_API_BASE_URL` is set in Vercel environment variables with the correct backend URL.

