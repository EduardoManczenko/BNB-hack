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

## Live Applications

- **Admin Dashboard (Frontend App)**: [https://bnb-hack-cjlu.vercel.app](https://bnb-hack-cjlu.vercel.app)
- **Payment Gateway (Gateway Front)**: [https://bnb-hack-five.vercel.app](https://bnb-hack-five.vercel.app)
- **Backend API**: Deployed on Railway (configure your backend URL)

## Local Development Ports

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
- **Live**: [https://bnb-hack-cjlu.vercel.app](https://bnb-hack-cjlu.vercel.app)

### Payment Gateway (`gateway-front`)
- Multi-network support (BNB Chain, Arbitrum, Polygon)
- Multi-token support (USDT, USDC)
- Wallet connection (MetaMask, Trust Wallet)
- Secure transaction processing
- Responsive payment interface
- **Live**: [https://bnb-hack-five.vercel.app](https://bnb-hack-five.vercel.app)

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

## User Journey

The NativeFi payment gateway is designed with a **fiat-first approach**, completely abstracting cryptocurrency complexity from merchants. Here's how the user experience flows:

### Phase 1: Onboarding

**Merchant's Actions:**
1. Downloads the "NativeFi" app from the app store
2. Registers (Business/Tax ID, store data)
3. Completes the KYC (identity verification) process
4. Registers their local bank account (for the off-ramp)

**Thoughts & Feelings:**
- "Looks like a normal registration for a digital bank or payment app. Simple."
- "Great, they already asked for my account. This is where I'll get the money."

**Value Points:**
- **Simplicity**: The registration flow is familiar, with no crypto jargon
- **Compliance**: KYC is done once, ensuring security from the start

---

### Phase 2: Generating the Charge

**Merchant's Actions:**
1. A customer wants to pay in crypto (USDC/USDT)
2. The merchant opens the NativeFi app
3. Enters the sale amount in local currency (e.g., R$ 30.00)
4. The app generates a single QR Code for this amount

**Thoughts & Feelings:**
- "I don't need to ask which network they'll use. I just need to type the amount in Reais. Easy."
- "It's just one QR code, like PIX."

**Value Points:**
- **Total Abstraction (Fiat-First)**: The merchant only thinks in local currency
- **Operational Simplicity**: One unified QR code for all networks

---

### Phase 3: Transaction

**Merchant's Actions:**
1. The merchant shows the QR Code to the customer
2. (Customer scans and chooses their preferred network in their own wallet - Polygon, BSC, ETH, etc)
3. The merchant waits for confirmation in the app

**Thoughts & Feelings:**
- "The customer is choosing something on their phone... I hope this works..."
- (App beeps) "Ah, great!"

**Value Points:**
- **Zero Friction (Merchant)**: The merchant doesn't participate in the complexity of network choice
- **(Backend: NativeFi executes the invisible bridge)**

---

### Phase 4: Confirmation

**Merchant's Actions:**
1. The NativeFi app displays: **"Payment Confirmed: R$ 30.00"**
2. The merchant sees their balance in the app (e.g., "Balance for Withdrawal: R$ 30.00")
3. The merchant hands the product to the customer

**Thoughts & Feelings:**
- "Perfect! It already showed up in Reais for me. I didn't have to see 'USDC' or 'Solana'."
- "That was fast. I can help the next customer."

**Value Points:**
- **Zero Crypto Exposure**: The merchant is "shielded" from volatility and tokens
- **Instant Confirmation**: The confirmation is instant and in local currency

---

### Phase 5: Settlement (Off-Ramp)

**Merchant's Actions:**
1. At the end of the day (or week), the merchant opens the app
2. Sees the total accumulated balance (e.g., "Balance: R$ 540.00")
3. Taps the "Withdraw to Bank Account" button
4. The (Fiat) value is deposited into the registered bank account (e.g., in D+1)

**Thoughts & Feelings:**
- "All my crypto movement is here, in Reais. Now I just transfer it."
- "The money landed in my account, just like the card terminal does. I trust this."

**Value Points:**
- **Easy Liquidity**: The off-ramp is integrated and direct to the local account
- **Trust**: The cycle closes with fiat money in the merchant's bank, which is their ultimate goal

---

## Technologies

- **Frontend App**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts
- **Gateway Front**: Next.js, React, TypeScript, Ethers.js, Tailwind CSS
- **Backend**: Node.js, Express, Axios, Binance API

## License

ISC

