# NativeFi Backend API

Backend service for Binance wallet integration, providing RESTful API endpoints for balance tracking, transaction history, and Simple Earn data.

## Features

- 🔐 **Secure Authentication**: HMAC SHA256 signature for Binance API requests
- 💰 **Balance Tracking**: Real-time wallet balance aggregation in USDT
- 📊 **Transaction History**: Complete deposit and withdrawal history (last 90 days)
- 📈 **Simple Earn**: Subscription, redemption, and interest history
- 💵 **USD Conversion**: Historical price conversion for accurate USD values
- 🛡️ **Error Handling**: Robust error handling for unsupported tokens and API failures

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Binance API credentials

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your Binance API credentials to `.env`:
```env
PORT=3001
BINANCE_API_KEY=your_binance_api_key_here
BINANCE_API_SECRET=your_binance_api_secret_here
```

**Getting Binance API Credentials:**
1. Go to [Binance API Management](https://www.binance.com/en/my/settings/api-management)
2. Create a new API key
3. Enable "Enable Reading" permission
4. Copy the API key and secret to your `.env` file

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Balance

#### `GET /api/balance`
Returns the total balance of your Binance wallet converted to USDT.

**Response:**
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

### Transactions

#### `GET /api/transactions`
Returns complete transaction history (deposits and withdrawals) from the last 90 days, with USD conversion.

**Response:**
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
    }
  ]
}
```

#### `GET /api/deposits/today`
Returns the sum of all deposits received today, converted to USDT.

**Response:**
```json
{
  "success": true,
  "totalToday": "250.75",
  "count": 5
}
```

### Earn

#### `GET /api/earn/history`
Returns Simple Earn history (subscriptions, redemptions, and interests) from the last 90 days, with USD conversion.

**Response:**
```json
{
  "success": true,
  "subscriptions": [...],
  "redemptions": [...],
  "interests": [...],
  "allHistory": [...]
}
```

### Health

#### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `3001` |
| `BINANCE_API_KEY` | Binance API key | Yes | - |
| `BINANCE_API_SECRET` | Binance API secret | Yes | - |

## Features

### Historical Price Conversion
The API automatically fetches historical token prices from Binance to convert transaction amounts to USD based on the transaction date, ensuring accurate USD values.

### Error Handling
- Silently handles unsupported tokens (fiat currencies like BRL, EUR, etc.)
- Graceful fallback for missing price data
- Comprehensive error messages for debugging

### Security
- HMAC SHA256 signature for all Binance API requests
- Environment variables for sensitive credentials
- CORS enabled for frontend integration

## Development

```bash
# Start server
npm start

# Development with auto-reload
npm run dev

# Check environment variables
npm run check-env
```

## Project Structure

```
backend-binance/
├── server.js          # Main server file
├── check-env.js       # Environment variable checker
├── .env.example       # Example environment variables
└── package.json
```

## Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **axios** - HTTP client for Binance API
- **crypto** - Node.js crypto module for HMAC signatures

## Error Handling

The API handles various error scenarios:
- Invalid API credentials
- Network errors
- Unsupported tokens (fiat currencies)
- Missing historical price data
- Binance API rate limits

## License

ISC
