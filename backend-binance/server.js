import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Função para criar assinatura HMAC SHA256
function createSignature(queryString, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(queryString)
    .digest('hex');
}

// Função para buscar saldo da carteira Binance
async function getBinanceBalance(apiKey, apiSecret) {
  try {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = createSignature(queryString, apiSecret);

    const response = await axios.get('https://api.binance.com/api/v3/account', {
      params: {
        timestamp,
        signature,
      },
      headers: {
        'X-MBX-APIKEY': apiKey,
      },
    });

    // Calcular saldo total em USDT
    let totalBalance = 0;
    const balances = response.data.balances || [];

    // Filtrar apenas moedas com saldo
    const activeBalances = balances.filter(
      b => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0
    );

    // Buscar preços de todas as moedas para converter para USDT
    const pricePromises = activeBalances.map(async (balance) => {
      const free = parseFloat(balance.free);
      const locked = parseFloat(balance.locked);
      const total = free + locked;

      if (balance.asset === 'USDT') {
        return { asset: balance.asset, value: total };
      }

      try {
        const symbol = `${balance.asset}USDT`;
        const priceResponse = await axios.get(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
        );
        const price = parseFloat(priceResponse.data.price);
        return { asset: balance.asset, value: total * price };
      } catch (error) {
        // Se não encontrar par USDT, tenta buscar via BUSD ou outro stablecoin
        console.warn(`Price not found for ${balance.asset}USDT, trying alternatives...`);
        return { asset: balance.asset, value: 0 };
      }
    });

    const priceResults = await Promise.all(pricePromises);
    totalBalance = priceResults.reduce((sum, result) => sum + result.value, 0);

    return {
      success: true,
      totalBalance: totalBalance.toFixed(2),
      balances: balances.filter(b => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0),
    };
  } catch (error) {
    console.error('Error fetching Binance balance:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.msg || error.message,
    };
  }
}

// Endpoint para buscar saldo
app.get('/api/balance', async (req, res) => {
  try {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        success: false,
        error: 'Binance API credentials not configured',
      });
    }

    const result = await getBinanceBalance(apiKey, apiSecret);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in /api/balance:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Balance endpoint: http://localhost:${PORT}/api/balance`);
});

