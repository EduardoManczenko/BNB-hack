# Backend API Endpoints

Complete list of available endpoints to test your backend.

## Base URL

Replace `YOUR_RAILWAY_URL` with your Railway public URL:
```
https://your-backend.up.railway.app
```

---

## 1. Health Check (No Authentication Required)

**Endpoint**: `GET /health`

**Description**: Simple health check to verify the server is running.

**Test in Browser**:
```
https://your-backend.up.railway.app/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

**Status Code**: `200 OK`

---

## 2. Get Wallet Balance

**Endpoint**: `GET /api/balance`

**Description**: Returns total wallet balance from Binance converted to USDT.

**Test in Browser**:
```
https://your-backend.up.railway.app/api/balance
```

**Expected Response** (Success):
```json
{
  "success": true,
  "totalBalance": "1245.50",
  "balances": [
    {
      "asset": "USDT",
      "free": "1000.00",
      "locked": "0.00",
      "usdtValue": "1000.00"
    }
  ]
}
```

**Expected Response** (Error):
```json
{
  "success": false,
  "error": "Binance API credentials not configured"
}
```

**Status Codes**:
- `200 OK` - Success
- `500 Internal Server Error` - API error or missing credentials

**Note**: Requires Binance API credentials configured in environment variables.

---

## 3. Get Today's Deposits

**Endpoint**: `GET /api/deposits/today`

**Description**: Returns the sum of all deposits received today, converted to USDT.

**Test in Browser**:
```
https://your-backend.up.railway.app/api/deposits/today
```

**Expected Response** (Success):
```json
{
  "success": true,
  "totalToday": "250.75",
  "count": 5
}
```

**Expected Response** (No deposits today):
```json
{
  "success": true,
  "totalToday": "0.00",
  "count": 0
}
```

**Status Codes**:
- `200 OK` - Success
- `500 Internal Server Error` - API error or missing credentials

---

## 4. Get Transaction History

**Endpoint**: `GET /api/transactions`

**Description**: Returns complete transaction history (deposits and withdrawals) from the last 90 days, with USD conversion.

**Test in Browser**:
```
https://your-backend.up.railway.app/api/transactions
```

**Expected Response** (Success):
```json
{
  "success": true,
  "transactions": [
    {
      "id": "deposit-123456",
      "type": "incoming",
      "amount": 100.5,
      "amountInUSD": 100.5,
      "currency": "USDT",
      "network": "BSC",
      "status": "confirmed",
      "date": "2024-10-20 14:30"
    },
    {
      "id": "withdrawal-789012",
      "type": "outgoing",
      "amount": 50.25,
      "amountInUSD": 50.25,
      "currency": "USDC",
      "network": "Arbitrum",
      "status": "confirmed",
      "date": "2024-10-19 10:15"
    }
  ]
}
```

**Expected Response** (No transactions):
```json
{
  "success": true,
  "transactions": []
}
```

**Status Codes**:
- `200 OK` - Success
- `500 Internal Server Error` - API error or missing credentials

**Note**: Returns transactions from the last 90 days only (Binance API limitation).

---

## 5. Get Simple Earn History

**Endpoint**: `GET /api/earn/history`

**Description**: Returns Simple Earn history (subscriptions, redemptions, and interests) from the last 90 days, with USD conversion.

**Test in Browser**:
```
https://your-backend.up.railway.app/api/earn/history
```

**Expected Response** (Success):
```json
{
  "success": true,
  "subscriptions": [...],
  "redemptions": [...],
  "interests": [...],
  "allHistory": [...]
}
```

**Status Codes**:
- `200 OK` - Success
- `500 Internal Server Error` - API error or missing credentials

**Note**: Returns data from the last 90 days only.

---

## 6. Get Earn Yield (Total)

**Endpoint**: `GET /api/earn/yield`

**Description**: Returns total accumulated yield from Simple Earn interests in USD.

**Test in Browser**:
```
https://your-backend.up.railway.app/api/earn/yield
```

**Expected Response** (Success):
```json
{
  "success": true,
  "totalYieldUSD": "125.50",
  "interestCount": 10
}
```

**Status Codes**:
- `200 OK` - Success
- `400 Bad Request` - Failed to fetch yield
- `500 Internal Server Error` - API error or missing credentials

---

## Testing Methods

### Method 1: Browser (GET requests only)

Simply paste the URL in your browser's address bar:
```
https://your-backend.up.railway.app/health
```

### Method 2: cURL (Command Line)

```bash
# Health check
curl https://your-backend.up.railway.app/health

# Get balance
curl https://your-backend.up.railway.app/api/balance

# Get today's deposits
curl https://your-backend.up.railway.app/api/deposits/today

# Get transactions
curl https://your-backend.up.railway.app/api/transactions

# Get earn history
curl https://your-backend.up.railway.app/api/earn/history

# Get earn yield
curl https://your-backend.up.railway.app/api/earn/yield
```

### Method 3: Postman or Insomnia

1. Create a new GET request
2. Enter the endpoint URL
3. Send the request
4. Check the response

### Method 4: JavaScript (Fetch API)

```javascript
// Health check
fetch('https://your-backend.up.railway.app/health')
  .then(res => res.json())
  .then(data => console.log(data));

// Get balance
fetch('https://your-backend.up.railway.app/api/balance')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Quick Test Checklist

Start with the simplest endpoint and work your way up:

1. ✅ **Test `/health`** - Should work without credentials
2. ✅ **Test `/api/balance`** - Requires Binance API credentials
3. ✅ **Test `/api/deposits/today`** - Requires Binance API credentials
4. ✅ **Test `/api/transactions`** - Requires Binance API credentials
5. ✅ **Test `/api/earn/history`** - Requires Binance API credentials
6. ✅ **Test `/api/earn/yield`** - Requires Binance API credentials

---

## Common Issues

### 401/403 Errors
- Check if Binance API credentials are configured in Railway environment variables
- Verify API key has "Enable Reading" permission

### 500 Internal Server Error
- Check Railway logs for detailed error messages
- Verify Binance API credentials are correct
- Ensure API key is not expired or revoked

### CORS Errors
- Backend has CORS enabled by default (`app.use(cors())`)
- Should work from any origin
- If issues persist, check Railway logs

### Empty Responses
- Normal if you have no transactions/balance
- Check if Binance account has activity
- Verify date ranges (90 days limit)

---

## Environment Variables Required

For endpoints that require Binance API (all except `/health`):

```
BINANCE_API_KEY=your_api_key_here
BINANCE_API_SECRET=your_api_secret_here
```

These should be configured in Railway project settings → Variables.

