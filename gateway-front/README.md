# NativeFi Payment Gateway

A modern, responsive cryptocurrency payment gateway interface for customers to send USDT or USDC payments across multiple blockchain networks.

**🌐 Live Application**: [https://bnb-hack-five.vercel.app](https://bnb-hack-five.vercel.app)

## Features

- 🌐 **Multi-Network Support**: BNB Chain, Arbitrum, and Polygon
- 💰 **Multi-Token Support**: USDT and USDC
- 🔗 **Wallet Integration**: MetaMask and Trust Wallet support
- 🔒 **Secure Transactions**: Direct blockchain transactions via wallet
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Styled with Tailwind CSS and shadcn/ui components

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- A Web3 wallet (MetaMask, Trust Wallet, etc.)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Usage

1. **Select Network**: Choose from BNB Chain, Arbitrum, or Polygon
2. **Select Token**: Choose USDT or USDC
3. **Enter Amount**: Input the payment amount
4. **Connect Wallet**: Click "Connect Wallet" and approve the connection
5. **Confirm Transaction**: Review and confirm the transaction in your wallet

## Supported Networks

### BNB Chain
- **Chain ID**: `0x38` (56)
- **RPC**: `https://bsc-dataseed.binance.org/`
- **Tokens**: USDT, USDC

### Arbitrum
- **Chain ID**: `0xa4b1` (42161)
- **RPC**: `https://arb1.arbitrum.io/rpc`
- **Tokens**: USDT, USDC

### Polygon
- **Chain ID**: `0x89` (137)
- **RPC**: `https://polygon-rpc.com`
- **Tokens**: USDT, USDC

## Project Structure

```
gateway-front/
├── app/
│   ├── page.tsx        # Main payment gateway page
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/
│   └── ui/             # Reusable UI components
├── public/             # Static assets
└── package.json
```

## Technologies

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Ethers.js** - Ethereum blockchain interaction
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - UI component library

## Wallet Integration

The gateway supports:
- **MetaMask** - Primary wallet provider
- **Trust Wallet** - Alternative wallet provider
- **WalletConnect** - Multi-wallet support

### Network Switching
The gateway automatically prompts users to switch networks when needed, or provides instructions for manual switching.

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Configuration

### Fixed Receiver Address
The receiver address is currently hardcoded in the application. To change it, edit `app/page.tsx`:

```typescript
const FIXED_RECEIVER = "0xed14922507cee9938faaf2958d577a2aeea9c4e7";
```

## Security Considerations

- All transactions are processed directly through the user's wallet
- No private keys are stored or transmitted
- Users must approve each transaction manually
- Network validation ensures transactions are sent to the correct chain

## License

ISC
