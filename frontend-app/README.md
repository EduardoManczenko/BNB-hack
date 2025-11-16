# NativeFi Admin Dashboard

A modern, responsive admin dashboard for managing cryptocurrency payments, transactions, and earnings with Binance wallet integration.

## Features

- 📊 **Dashboard**: Real-time balance tracking and today's received payments
- 💰 **Transactions**: Complete transaction history with USD conversion (last 90 days)
- 📈 **Earn**: Vault management with automatic earnings calculation (4.96% APY)
- 💸 **Withdrawals**: Manage available and unavailable withdrawal amounts
- 📱 **QR Code**: Generate payment QR codes for customers
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:3001`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```env
VITE_API_BASE_URL=http://localhost:3001
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend-app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── assets/          # Static assets
│   └── App.tsx          # Main application component
├── public/              # Public assets
└── package.json
```

## Key Pages

### Dashboard
- Displays total balance (Binance + mock vaults + earnings)
- Shows today's received payments
- Quick access cards to other sections

### Transactions
- Complete transaction history from Binance
- USD value conversion using historical prices
- Search and filter functionality
- Export capability

### Earn
- Vault management (Child School, Birthday Party)
- Automatic earnings calculation based on 4.96% APY
- Visual breakdown with pie chart
- Monthly earnings distribution chart
- Total Balance, Vault, and Available for Withdrawal displays

### Withdrawals
- Available withdrawal amount (Total Balance - Vault)
- Unavailable withdrawal amount (Vault value)
- Transaction status management

### QR Code
- Payment QR code display
- Share and download functionality

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Utility-first CSS
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `http://localhost:3001`)

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## License

ISC
