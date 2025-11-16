# Backend Binance

Backend service for fetching Binance wallet balance.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your Binance API credentials to `.env`:
   - Get your API key and secret from: https://www.binance.com/en/my/settings/api-management
   - Make sure to enable "Enable Reading" permission for your API key

4. Run the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### GET /api/balance
Returns the total balance of your Binance wallet in USDT.

**Response:**
```json
{
  "success": true,
  "totalBalance": "1245.50",
  "balances": [...]
}
```

### GET /health
Health check endpoint.

## Environment Variables

- `BINANCE_API_KEY`: Your Binance API key
- `BINANCE_API_SECRET`: Your Binance API secret
- `PORT`: Server port (default: 3001)

