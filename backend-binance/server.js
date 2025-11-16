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

// Função para buscar depósitos do dia atual
async function getTodayDeposits(apiKey, apiSecret) {
  try {
    const timestamp = Date.now();
    
    // Calcular início e fim do dia atual (UTC)
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    
    const startTime = startOfDay.getTime();
    const endTime = endOfDay.getTime();

    const params = {
      status: 1, // 1 = Success
      startTime,
      endTime,
      timestamp,
    };

    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    const signature = createSignature(queryString, apiSecret);

    const response = await axios.get('https://api.binance.com/sapi/v1/capital/deposit/hisrec', {
      params: {
        ...params,
        signature,
      },
      headers: {
        'X-MBX-APIKEY': apiKey,
      },
    });

    const deposits = response.data || [];
    
    // Converter todos os depósitos para USDT
    let totalInUSDT = 0;
    
    for (const deposit of deposits) {
      const amount = parseFloat(deposit.amount);
      const asset = deposit.coin;

      if (asset === 'USDT' || asset === 'BUSD') {
        totalInUSDT += amount;
      } else {
        try {
          // Tentar buscar preço em USDT
          const symbol = `${asset}USDT`;
          const priceResponse = await axios.get(
            `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
          );
          const price = parseFloat(priceResponse.data.price);
          totalInUSDT += amount * price;
        } catch (error) {
          // Se não encontrar par USDT, tenta BUSD
          try {
            const symbol = `${asset}BUSD`;
            const priceResponse = await axios.get(
              `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
            );
            const price = parseFloat(priceResponse.data.price);
            totalInUSDT += amount * price;
          } catch (error2) {
            console.warn(`Could not convert ${asset} to USDT/BUSD, skipping...`);
          }
        }
      }
    }

    return {
      success: true,
      totalToday: totalInUSDT.toFixed(2),
      count: deposits.length,
      deposits: deposits.map(d => ({
        coin: d.coin,
        amount: parseFloat(d.amount),
        status: d.status,
        insertTime: d.insertTime,
      })),
    };
  } catch (error) {
    console.error('Error fetching Binance deposits:', error.response?.data || error.message);
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

// Função para buscar histórico completo de transações (depósitos e saques)
async function getAllTransactions(apiKey, apiSecret) {
  try {
    // Data de início: últimos 90 dias (limite da API da Binance)
    const endTime = Date.now();
    const startTime = endTime - (90 * 24 * 60 * 60 * 1000); // 90 dias em milissegundos
    
    // Função auxiliar para buscar todos os depósitos com paginação
    const fetchAllDeposits = async () => {
      let allDeposits = [];
      let currentStartTime = startTime;
      let hasMore = true;
      
      while (hasMore) {
        const currentTimestamp = Date.now();
        const depositParams = {
          startTime: currentStartTime,
          endTime: endTime,
          limit: 1000, // Máximo permitido pela API
          timestamp: currentTimestamp,
        };
        
        const depositQueryString = Object.keys(depositParams)
          .map(key => `${key}=${depositParams[key]}`)
          .join('&');
        const depositSignature = createSignature(depositQueryString, apiSecret);
        
        try {
          const depositResponse = await axios.get('https://api.binance.com/sapi/v1/capital/deposit/hisrec', {
            params: {
              ...depositParams,
              signature: depositSignature,
            },
            headers: {
              'X-MBX-APIKEY': apiKey,
            },
          });
          
          const deposits = depositResponse.data || [];
          
          if (deposits.length === 0) {
            hasMore = false;
          } else {
            allDeposits = allDeposits.concat(deposits);
            
            // Se retornou menos que o limite, não há mais dados
            if (deposits.length < 1000) {
              hasMore = false;
            } else {
              // Atualizar startTime para o timestamp da última transação + 1ms
              const lastDeposit = deposits[deposits.length - 1];
              currentStartTime = lastDeposit.insertTime + 1;
            }
          }
        } catch (error) {
          console.error('Error fetching deposits batch:', error.response?.data || error.message);
          hasMore = false;
        }
      }
      
      return allDeposits;
    };
    
    // Função auxiliar para buscar todos os saques com paginação
    const fetchAllWithdrawals = async () => {
      let allWithdrawals = [];
      let currentStartTime = startTime;
      let hasMore = true;
      
      while (hasMore) {
        const currentTimestamp = Date.now();
        const withdrawParams = {
          startTime: currentStartTime,
          endTime: endTime,
          limit: 1000, // Máximo permitido pela API
          timestamp: currentTimestamp,
        };
        
        const withdrawQueryString = Object.keys(withdrawParams)
          .map(key => `${key}=${withdrawParams[key]}`)
          .join('&');
        const withdrawSignature = createSignature(withdrawQueryString, apiSecret);
        
        try {
          const withdrawResponse = await axios.get('https://api.binance.com/sapi/v1/capital/withdraw/history', {
            params: {
              ...withdrawParams,
              signature: withdrawSignature,
            },
            headers: {
              'X-MBX-APIKEY': apiKey,
            },
          });
          
          const withdrawals = withdrawResponse.data || [];
          
          if (withdrawals.length === 0) {
            hasMore = false;
          } else {
            allWithdrawals = allWithdrawals.concat(withdrawals);
            
            // Se retornou menos que o limite, não há mais dados
            if (withdrawals.length < 1000) {
              hasMore = false;
            } else {
              // Atualizar startTime para o timestamp da última transação + 1ms
              const lastWithdrawal = withdrawals[withdrawals.length - 1];
              currentStartTime = lastWithdrawal.applyTime + 1;
            }
          }
        } catch (error) {
          console.error('Error fetching withdrawals batch:', error.response?.data || error.message);
          hasMore = false;
        }
      }
      
      return allWithdrawals;
    };
    
    // Buscar todos os depósitos e saques em paralelo
    const [deposits, withdrawals] = await Promise.all([
      fetchAllDeposits(),
      fetchAllWithdrawals(),
    ]);

    // Função para buscar preço histórico de um token em USDT na data especificada
    const getHistoricalPrice = async (symbol, timestamp) => {
      try {
        // Se for USDT ou BUSD, retornar 1
        if (symbol === 'USDT' || symbol === 'BUSD') {
          return 1;
        }

        // Buscar candle diário que contém o timestamp da transação
        // O timestamp do candle é o início do dia (00:00:00 UTC)
        const transactionDate = new Date(timestamp);
        const dayStart = new Date(Date.UTC(
          transactionDate.getUTCFullYear(),
          transactionDate.getUTCMonth(),
          transactionDate.getUTCDate(),
          0, 0, 0, 0
        )).getTime();

        // Tentar buscar via par USDT
        const usdtSymbol = `${symbol}USDT`;
        try {
          const klinesResponse = await axios.get('https://api.binance.com/api/v3/klines', {
            params: {
              symbol: usdtSymbol,
              interval: '1d', // Intervalo diário
              startTime: dayStart,
              endTime: dayStart + (24 * 60 * 60 * 1000), // Fim do dia
              limit: 1,
            },
          });

          if (klinesResponse.data && klinesResponse.data.length > 0) {
            // Retornar o preço de fechamento (índice 4) do candle
            return parseFloat(klinesResponse.data[0][4]); // [4] = close price
          }
        } catch (usdtError) {
          // Se não encontrar, tentar BUSD
        }

        // Se não encontrar USDT, tentar BUSD
        const busdSymbol = `${symbol}BUSD`;
        try {
          const busdKlinesResponse = await axios.get('https://api.binance.com/api/v3/klines', {
            params: {
              symbol: busdSymbol,
              interval: '1d',
              startTime: dayStart,
              endTime: dayStart + (24 * 60 * 60 * 1000),
              limit: 1,
            },
          });

          if (busdKlinesResponse.data && busdKlinesResponse.data.length > 0) {
            return parseFloat(busdKlinesResponse.data[0][4]);
          }
        } catch (busdError) {
          // Se não encontrar, retornar null
        }

        return null;
      } catch (error) {
        console.warn(`Could not fetch historical price for ${symbol} at ${timestamp}:`, error.message);
        return null;
      }
    };

    // Mapear status da Binance para status do frontend
    const mapDepositStatus = (status) => {
      // 0 = pending, 1 = success
      if (status === 1) return 'confirmed';
      return 'pending';
    };

    const mapWithdrawStatus = (status) => {
      // 0=Email Sent, 1=Cancelled, 2=Awaiting Approval, 3=Rejected, 4=Processing, 5=Failure, 6=Completed
      if (status === 6) return 'confirmed';
      if (status === 4 || status === 2) return 'processing';
      if (status === 0) return 'pending';
      return 'pending';
    };

    // Formatar depósitos como "incoming" e calcular valor em dólar
    const formattedDepositsPromises = deposits.map(async (deposit, index) => {
      const date = new Date(deposit.insertTime);
      const formattedDate = date.toISOString().split('T')[0] + ' ' + 
        date.toTimeString().split(' ')[0].substring(0, 5);
      
      const amount = parseFloat(deposit.amount);
      const currency = deposit.coin;
      
      // Buscar preço histórico do token na data da transação
      const historicalPrice = await getHistoricalPrice(currency, deposit.insertTime);
      const amountInUSD = historicalPrice ? (amount * historicalPrice) : null;
      
      return {
        id: `deposit-${deposit.id || index}`,
        type: 'incoming',
        amount: amount,
        amountInUSD: amountInUSD,
        currency: currency,
        network: deposit.network || 'Unknown',
        status: mapDepositStatus(deposit.status),
        date: formattedDate,
        timestamp: deposit.insertTime,
        hash: deposit.txId || deposit.address || 'N/A',
      };
    });

    // Formatar saques como "outgoing" (Withdrawal) e calcular valor em dólar
    const formattedWithdrawalsPromises = withdrawals.map(async (withdrawal, index) => {
      const date = new Date(withdrawal.applyTime);
      const formattedDate = date.toISOString().split('T')[0] + ' ' + 
        date.toTimeString().split(' ')[0].substring(0, 5);
      
      const amount = parseFloat(withdrawal.amount);
      const currency = withdrawal.coin;
      
      // Buscar preço histórico do token na data da transação
      const historicalPrice = await getHistoricalPrice(currency, withdrawal.applyTime);
      const amountInUSD = historicalPrice ? (amount * historicalPrice) : null;
      
      return {
        id: `withdrawal-${withdrawal.id || index}`,
        type: 'outgoing',
        amount: amount,
        amountInUSD: amountInUSD,
        currency: currency,
        network: withdrawal.network || 'Unknown',
        status: mapWithdrawStatus(withdrawal.status),
        date: formattedDate,
        timestamp: withdrawal.applyTime,
        hash: withdrawal.txId || withdrawal.address || 'N/A',
      };
    });

    // Aguardar todas as promessas de formatação
    const formattedDeposits = await Promise.all(formattedDepositsPromises);
    const formattedWithdrawals = await Promise.all(formattedWithdrawalsPromises);

    // Combinar e ordenar por timestamp em ordem decrescente (mais recente primeiro)
    const allTransactions = [...formattedDeposits, ...formattedWithdrawals]
      .sort((a, b) => b.timestamp - a.timestamp) // Ordem decrescente: b - a
      .map(({ timestamp, ...rest }) => rest); // Remover timestamp do resultado final

    return {
      success: true,
      transactions: allTransactions,
    };
  } catch (error) {
    console.error('Error fetching Binance transactions:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.msg || error.message,
    };
  }
}

// Endpoint para buscar depósitos do dia atual
app.get('/api/deposits/today', async (req, res) => {
  try {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        success: false,
        error: 'Binance API credentials not configured',
      });
    }

    const result = await getTodayDeposits(apiKey, apiSecret);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in /api/deposits/today:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Endpoint para buscar histórico completo de transações
app.get('/api/transactions', async (req, res) => {
  try {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        success: false,
        error: 'Binance API credentials not configured',
      });
    }

    const result = await getAllTransactions(apiKey, apiSecret);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in /api/transactions:', error);
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
  console.log(`Today deposits endpoint: http://localhost:${PORT}/api/deposits/today`);
  console.log(`Transactions endpoint: http://localhost:${PORT}/api/transactions`);
});

