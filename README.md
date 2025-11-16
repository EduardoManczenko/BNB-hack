# NativeFi Payment Gateway

A comprehensive cryptocurrency payment gateway solution with Binance wallet integration, featuring a modern admin dashboard and a customer-facing payment interface.

## Project Structure

This repository contains three main projects:

- **`frontend-app`** - Admin dashboard for managing payments, transactions, and earnings
- **`backend-binance`** - Backend API service for Binance wallet integration
- **`gateway-front`** - Customer-facing payment gateway interface

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Binance API credentials (API Key and Secret)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BNB-hack
```

2. Install dependencies for each project:
```bash
# Backend
cd backend-binance
npm install

# Frontend App
cd ../frontend-app
npm install

# Gateway Front
cd ../gateway-front
npm install
```

3. Configure environment variables:

**Backend (`backend-binance/.env`):**
```env
PORT=3001
BINANCE_API_KEY=your_binance_api_key_here
BINANCE_API_SECRET=your_binance_api_secret_here
```

**Frontend App (`frontend-app/.env`):**
```env
VITE_API_BASE_URL=http://localhost:3001
```

4. Start the services:

```bash
# Terminal 1: Backend
cd backend-binance
npm start

# Terminal 2: Frontend App
cd frontend-app
npm run dev

# Terminal 3: Gateway Front
cd gateway-front
npm run dev
```

## Port Configuration

- **Backend API**: `http://localhost:3001`
- **Frontend App**: `http://localhost:8080`
- **Gateway Front**: `http://localhost:3000`

## Features

### Admin Dashboard (`frontend-app`)
- Real-time Binance wallet balance tracking
- Transaction history with USD conversion
- Earn/vault management with APY calculations
- Withdrawal management
- QR code generation for payments
- Responsive design with modern UI

### Payment Gateway (`gateway-front`)
- Multi-network support (BNB Chain, Arbitrum, Polygon)
- Multi-token support (USDT, USDC)
- Wallet connection (MetaMask, Trust Wallet)
- Secure transaction processing
- Responsive payment interface

### Backend API (`backend-binance`)
- Binance API integration
- Wallet balance aggregation
- Transaction history (deposits & withdrawals)
- Simple Earn history tracking
- Historical price conversion to USD
- HMAC SHA256 signature authentication

## API Endpoints

### Balance
- `GET /api/balance` - Get total wallet balance in USDT

### Transactions
- `GET /api/transactions` - Get transaction history (last 90 days)
- `GET /api/deposits/today` - Get today's deposits total

### Earn
- `GET /api/earn/history` - Get Simple Earn history (last 90 days)

### Health
- `GET /health` - Health check endpoint

## Technologies

- **Frontend App**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts
- **Gateway Front**: Next.js, React, TypeScript, Ethers.js, Tailwind CSS
- **Backend**: Node.js, Express, Axios, Binance API

## License

ISC

