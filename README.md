# NativeFi

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

### User Journey Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    MERCHANT USER JOURNEY                         │
└─────────────────────────────────────────────────────────────────┘

Phase 1: Onboarding
┌──────────────┐
│ Download App │ → Register (Business ID, KYC) → Link Bank Account
└──────────────┘

Phase 2: Generating Charge
┌──────────────┐
│ Enter Amount │ → Generate QR Code (Single, Multi-Network)
│  (Local Fiat)│
└──────────────┘

Phase 3: Transaction
┌──────────────┐      ┌──────────────┐
│ Show QR Code │ → → │ Customer Pays │ → Wait for Confirmation
└──────────────┘      └──────────────┘

Phase 4: Confirmation
┌──────────────┐
│ Payment      │ → Display Balance (Local Fiat) → Hand Product
│ Confirmed    │
└──────────────┘

Phase 5: Settlement
┌──────────────┐
│ View Balance │ → Withdraw to Bank → Fiat Deposited (D+1)
└──────────────┘

Key: Merchant only sees FIAT, never crypto complexity
```

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

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │  Admin Dashboard │         │ Payment Gateway  │              │
│  │  (frontend-app)  │         │  (gateway-front) │              │
│  │                  │         │                  │              │
│  │  - React + Vite  │         │  - Next.js       │              │
│  │  - TypeScript    │         │  - Ethers.js     │              │
│  │  - shadcn/ui     │         │  - Web3 Wallets  │              │
│  └────────┬─────────┘         └────────┬─────────┘              │
│           │                            │                         │
│           └────────────┬───────────────┘                         │
│                        │                                         │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         │ HTTPS/REST API
                         │
┌────────────────────────┼─────────────────────────────────────────┐
│                    API LAYER (Backend)                           │
├────────────────────────┼─────────────────────────────────────────┤
│                        │                                         │
│         ┌──────────────▼──────────────┐                         │
│         │   Backend API Server        │                         │
│         │   (backend-binance)         │                         │
│         │                             │                         │
│         │  - Node.js + Express        │                         │
│         │  - HMAC SHA256 Auth         │                         │
│         │  - CORS Enabled              │                         │
│         └──────────────┬──────────────┘                         │
│                        │                                         │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         │ API Calls
                         │
┌────────────────────────┼─────────────────────────────────────────┐
│                    EXTERNAL SERVICES                              │
├────────────────────────┼─────────────────────────────────────────────────────────┤
│                        │                                         │
│         ┌──────────────▼──────────────┐                         │
│         │   Binance API               │                         │
│         │                             │                         │
│         │  - Wallet Balance           │                         │
│         │  - Transaction History      │                         │
│         │  - Simple Earn Data          │                         │
│         │  - Historical Prices         │                         │
│         └─────────────────────────────┘                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Overview

**Frontend App (Admin Dashboard)**
- **Purpose**: Merchant-facing admin interface
- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Key Features**: Balance tracking, transaction history, vault management
- **Deployment**: Vercel

**Gateway Front (Payment Interface)**
- **Purpose**: Customer-facing payment gateway
- **Tech Stack**: Next.js 15, React 19, Ethers.js
- **Key Features**: Multi-network support, wallet integration
- **Deployment**: Vercel

**Backend API**
- **Purpose**: Binance API integration and data processing
- **Tech Stack**: Node.js, Express, Axios
- **Key Features**: HMAC authentication, historical price conversion
- **Deployment**: Railway

### Data Flow

1. **Admin Dashboard** → Fetches balance/transactions from **Backend API**
2. **Backend API** → Queries **Binance API** for wallet data
3. **Backend API** → Processes and converts data to USD
4. **Backend API** → Returns formatted data to **Admin Dashboard**
5. **Payment Gateway** → Handles customer payments directly on blockchain
6. **Admin Dashboard** → Displays all data in fiat currency (abstracted from crypto)

---

## Open-Source Dependencies

### Frontend App (`frontend-app`)

**Core Framework:**
- `react` ^18.3.1 - UI library
- `react-dom` ^18.3.1 - React DOM renderer
- `react-router-dom` ^6.30.1 - Client-side routing
- `typescript` ^5.8.3 - Type safety

**UI Components:**
- `@radix-ui/*` - Accessible component primitives (accordion, dialog, dropdown, etc.)
- `shadcn/ui` - Component library built on Radix UI
- `lucide-react` ^0.462.0 - Icon library
- `tailwindcss` ^3.4.17 - Utility-first CSS framework

**Data Management:**
- `@tanstack/react-query` ^5.83.0 - Data fetching and caching
- `recharts` ^2.15.4 - Data visualization (charts)

**Utilities:**
- `clsx` ^2.1.1 - Conditional class names
- `tailwind-merge` ^2.6.0 - Merge Tailwind classes
- `zod` ^3.25.76 - Schema validation
- `date-fns` ^3.6.0 - Date manipulation

**Build Tools:**
- `vite` ^5.4.19 - Build tool and dev server
- `@vitejs/plugin-react-swc` ^3.11.0 - React plugin for Vite

### Gateway Front (`gateway-front`)

**Core Framework:**
- `next` ^15.0.3 - React framework
- `react` ^19.0.0-rc - UI library
- `react-dom` ^19.0.0-rc - React DOM renderer
- `typescript` ^5 - Type safety

**Blockchain:**
- `ethers` ^6.13.4 - Ethereum library for wallet interaction

**Styling:**
- `tailwindcss` ^3.4.1 - Utility-first CSS
- `tailwindcss-animate` ^1.0.7 - Animation utilities

### Backend (`backend-binance`)

**Core Framework:**
- `express` ^4.18.2 - Web framework
- `node` - Runtime environment

**HTTP & API:**
- `axios` ^1.6.2 - HTTP client for Binance API
- `cors` ^2.8.5 - Cross-origin resource sharing

**Configuration:**
- `dotenv` ^16.3.1 - Environment variable management

**Crypto:**
- `crypto` (Node.js built-in) - HMAC SHA256 signature generation

### License Information

All dependencies are open-source and licensed under various permissive licenses (MIT, Apache 2.0, ISC, etc.). The project itself is licensed under **ISC**.

---

## Deployment Instructions

### Prerequisites

- GitHub account with repository access
- Railway account (for backend)
- Vercel account (for frontend)
- Binance API credentials

### Backend Deployment (Railway)

1. **Sign up at [Railway.app](https://railway.app)**
   - Log in with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose the `BNB-hack` repository
   - Set root directory to `backend-binance`

3. **Configure Environment Variables**
   - Go to **Variables** tab
   - Add:
     ```
     PORT=3001
     BINANCE_API_KEY=your_binance_api_key_here
     BINANCE_API_SECRET=your_binance_api_secret_here
     ```

4. **Generate Public Domain**
   - Go to **Settings** → **Networking**
   - Click "Generate Domain"
   - Copy the public URL (e.g., `https://your-project.up.railway.app`)

5. **Verify Deployment**
   - Test: `https://your-project.up.railway.app/health`
   - Should return: `{"status":"ok","message":"Backend is running"}`

**For detailed instructions, see:** [`DEPLOY.md`](./DEPLOY.md) or [`DEPLOY_QUICK_START.md`](./DEPLOY_QUICK_START.md)

### Frontend App Deployment (Vercel)

1. **Sign up at [Vercel.com](https://vercel.com)**
   - Log in with your GitHub account

2. **Create New Project**
   - Click "Add New Project"
   - Import the `BNB-hack` repository
   - Configure:
     - **Root Directory**: `frontend-app`
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Configure Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add:
     ```
     VITE_API_BASE_URL=https://your-backend.up.railway.app
     ```
   - Enable for: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy the generated URL

**For detailed instructions, see:** [`frontend-app/DEPLOY_VERCEL.md`](./frontend-app/DEPLOY_VERCEL.md)

### Gateway Front Deployment (Vercel)

The gateway front is already deployed at [https://bnb-hack-five.vercel.app](https://bnb-hack-five.vercel.app).

To redeploy or update:
1. Go to Vercel dashboard
2. Select the `gateway-front` project
3. Push changes to GitHub (auto-deploys) or manually redeploy

### Post-Deployment Checklist

- [ ] Backend health endpoint returns `{"status":"ok"}`
- [ ] Frontend app loads without errors
- [ ] Frontend can connect to backend API
- [ ] Environment variables are correctly set
- [ ] CORS is properly configured
- [ ] All endpoints are accessible
- [ ] Test balance fetching works
- [ ] Test transaction history works

### Continuous Deployment

Both Railway and Vercel support automatic deployment:
- **Railway**: Automatically deploys on push to main branch
- **Vercel**: Automatically deploys on push to main branch

No manual deployment needed after initial setup!

**For troubleshooting, see:**
- [`backend-binance/TROUBLESHOOTING.md`](./backend-binance/TROUBLESHOOTING.md)
- [`frontend-app/VERCEL_TROUBLESHOOTING.md`](./frontend-app/VERCEL_TROUBLESHOOTING.md)

---

## Technologies

- **Frontend App**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts
- **Gateway Front**: Next.js, React, TypeScript, Ethers.js, Tailwind CSS
- **Backend**: Node.js, Express, Axios, Binance API

## License

ISC

