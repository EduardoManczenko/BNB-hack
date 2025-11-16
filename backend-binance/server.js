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
        // Verificar se é erro de símbolo não encontrado
        const isSymbolNotFound = error.response?.status === 400 || 
                                 error.response?.data?.code === -1121 ||
                                 (error.response?.data?.msg && error.response.data.msg.includes('Invalid symbol'));
        
        if (isSymbolNotFound) {
          // Tentar BUSD silenciosamente
          try {
            const busdSymbol = `${balance.asset}BUSD`;
            const busdPriceResponse = await axios.get(
              `https://api.binance.com/api/v3/ticker/price?symbol=${busdSymbol}`
            );
            const busdPrice = parseFloat(busdPriceResponse.data.price);
            return { asset: balance.asset, value: total * busdPrice };
          } catch (busdError) {
            // Se não encontrar nenhum par, retornar 0 silenciosamente
            return { asset: balance.asset, value: 0 };
          }
        } else {
          // Outro tipo de erro, retornar 0
          return { asset: balance.asset, value: 0 };
        }
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

// Função para buscar preço histórico de um token em USDT na data especificada (reutilizável)
async function getHistoricalPrice(symbol, timestamp) {
  try {
    // Se for USDT ou BUSD, retornar 1
    if (symbol === 'USDT' || symbol === 'BUSD') {
      return 1;
    }

    // Lista de tokens conhecidos que não têm par na Binance (moedas fiat, etc)
    const unsupportedTokens = ['BRL', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'NZD', 'SGD', 'HKD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RUB', 'TRY', 'MXN', 'ZAR', 'INR', 'KRW', 'THB', 'IDR', 'PHP', 'MYR', 'VND'];
    if (unsupportedTokens.includes(symbol)) {
      return null; // Retornar null silenciosamente para tokens não suportados
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
      // Verificar se é erro de símbolo não encontrado (400 ou -1121)
      const isSymbolNotFound = usdtError.response?.status === 400 || 
                               usdtError.response?.data?.code === -1121 ||
                               (usdtError.response?.data?.msg && usdtError.response.data.msg.includes('Invalid symbol'));
      
      // Se não for erro de símbolo não encontrado, pode ser outro problema (tentar BUSD)
      if (!isSymbolNotFound) {
        // Tentar BUSD apenas se não for erro de símbolo
      }
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
      // Se não encontrar, retornar null silenciosamente
    }

    return null;
  } catch (error) {
    // Não logar erros para tokens que não têm par disponível (é esperado)
    return null;
  }
}

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

// Função para buscar histórico completo de Simple Earn (subscrições, resgates e juros)
async function getSimpleEarnHistory(apiKey, apiSecret) {
  try {
    const timestamp = Date.now();
    
    // Últimos 90 dias
    const endTime = Date.now();
    const startTime = endTime - (90 * 24 * 60 * 60 * 1000);
    
    // Buscar histórico de subscrições
    const subscriptionParams = {
      startTime,
      endTime,
      timestamp,
    };
    const subscriptionQueryString = Object.keys(subscriptionParams)
      .map(key => `${key}=${subscriptionParams[key]}`)
      .join('&');
    const subscriptionSignature = createSignature(subscriptionQueryString, apiSecret);
    
    let subscriptions = [];
    try {
      const subscriptionResponse = await axios.get('https://api.binance.com/sapi/v1/simple-earn/flexible/history/subscriptionRecord', {
        params: {
          ...subscriptionParams,
          signature: subscriptionSignature,
        },
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });
      subscriptions = subscriptionResponse.data?.rows || [];
    } catch (error) {
      console.warn('Error fetching subscriptions:', error.response?.data || error.message);
    }
    
    // Buscar histórico de resgates
    const redemptionParams = {
      startTime,
      endTime,
      timestamp,
    };
    const redemptionQueryString = Object.keys(redemptionParams)
      .map(key => `${key}=${redemptionParams[key]}`)
      .join('&');
    const redemptionSignature = createSignature(redemptionQueryString, apiSecret);
    
    let redemptions = [];
    try {
      const redemptionResponse = await axios.get('https://api.binance.com/sapi/v1/simple-earn/flexible/history/redemptionRecord', {
        params: {
          ...redemptionParams,
          signature: redemptionSignature,
        },
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });
      redemptions = redemptionResponse.data?.rows || [];
    } catch (error) {
      console.warn('Error fetching redemptions:', error.response?.data || error.message);
    }
    
    // Buscar histórico de juros
    const interestParams = {
      startTime,
      endTime,
      timestamp,
    };
    const interestQueryString = Object.keys(interestParams)
      .map(key => `${key}=${interestParams[key]}`)
      .join('&');
    const interestSignature = createSignature(interestQueryString, apiSecret);
    
    let interests = [];
    try {
      const interestResponse = await axios.get('https://api.binance.com/sapi/v1/simple-earn/flexible/history/interestHistory', {
        params: {
          ...interestParams,
          signature: interestSignature,
        },
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });
      interests = interestResponse.data?.rows || [];
    } catch (error) {
      console.warn('Error fetching interests:', error.response?.data || error.message);
    }
    
    // Formatar subscrições e calcular valor em dólar
    const formattedSubscriptionsPromises = subscriptions.map(async (sub) => {
      const date = new Date(sub.time);
      const formattedDate = date.toISOString().split('T')[0] + ' ' + 
        date.toTimeString().split(' ')[0].substring(0, 5);
      
      const amount = parseFloat(sub.amount || sub.purchaseAmount || 0);
      const asset = sub.asset;
      
      // Buscar preço histórico do token na data da transação
      const historicalPrice = await getHistoricalPrice(asset, sub.time);
      const amountInUSD = historicalPrice ? (amount * historicalPrice) : null;
      
      return {
        id: `subscription-${sub.orderId || sub.time}`,
        type: 'subscription',
        productId: sub.productId,
        productName: sub.productName || sub.asset,
        amount: amount,
        amountInUSD: amountInUSD,
        asset: asset,
        status: sub.status || 'SUCCESS',
        date: formattedDate,
        timestamp: sub.time,
      };
    });
    
    // Formatar resgates e calcular valor em dólar
    const formattedRedemptionsPromises = redemptions.map(async (red) => {
      const date = new Date(red.time);
      const formattedDate = date.toISOString().split('T')[0] + ' ' + 
        date.toTimeString().split(' ')[0].substring(0, 5);
      
      const amount = parseFloat(red.amount || red.redeemAmount || 0);
      const asset = red.asset;
      
      // Buscar preço histórico do token na data da transação
      const historicalPrice = await getHistoricalPrice(asset, red.time);
      const amountInUSD = historicalPrice ? (amount * historicalPrice) : null;
      
      return {
        id: `redemption-${red.orderId || red.time}`,
        type: 'redemption',
        productId: red.productId,
        productName: red.productName || red.asset,
        amount: amount,
        amountInUSD: amountInUSD,
        asset: asset,
        status: red.status || 'SUCCESS',
        date: formattedDate,
        timestamp: red.time,
      };
    });
    
    // Formatar juros e calcular valor em dólar
    const formattedInterestsPromises = interests.map(async (int) => {
      const date = new Date(int.time);
      const formattedDate = date.toISOString().split('T')[0] + ' ' + 
        date.toTimeString().split(' ')[0].substring(0, 5);
      
      const amount = parseFloat(int.interest || int.amount || 0);
      const asset = int.asset;
      
      // Buscar preço histórico do token na data da transação
      const historicalPrice = await getHistoricalPrice(asset, int.time);
      const amountInUSD = historicalPrice ? (amount * historicalPrice) : null;
      
      return {
        id: `interest-${int.orderId || int.time}`,
        type: 'interest',
        productId: int.productId,
        productName: int.productName || int.asset,
        amount: amount,
        amountInUSD: amountInUSD,
        asset: asset,
        status: int.status || 'SUCCESS',
        date: formattedDate,
        timestamp: int.time,
      };
    });
    
    // Aguardar todas as promessas de formatação
    const formattedSubscriptions = await Promise.all(formattedSubscriptionsPromises);
    const formattedRedemptions = await Promise.all(formattedRedemptionsPromises);
    const formattedInterests = await Promise.all(formattedInterestsPromises);
    
    // Calcular rendimento acumulado para cada redemption
    // Para cada redemption, somar os juros do mesmo produto pagos antes da data do redemption
    const redemptionsWithYield = formattedRedemptions.map((redemption) => {
      // Encontrar todos os juros do mesmo produto pagos antes da data do redemption
      // Comparar por productId e asset, e também considerar se ambos são undefined/null
      const relatedInterests = formattedInterests.filter((interest) => {
        const sameProduct = (interest.productId && redemption.productId) 
          ? interest.productId === redemption.productId 
          : (!interest.productId && !redemption.productId);
        const sameAsset = interest.asset === redemption.asset;
        const beforeRedemption = interest.timestamp <= redemption.timestamp;
        
        return sameProduct && sameAsset && beforeRedemption;
      });
      
      // Somar o valor em USD dos juros relacionados
      const totalYieldUSD = relatedInterests.reduce((sum, interest) => {
        return sum + (interest.amountInUSD || 0);
      }, 0);
      
      // Somar o valor em token dos juros relacionados
      const totalYieldAmount = relatedInterests.reduce((sum, interest) => {
        return sum + (interest.amount || 0);
      }, 0);
      
      return {
        ...redemption,
        yieldAmount: totalYieldAmount > 0 ? totalYieldAmount : 0,
        yieldInUSD: totalYieldUSD > 0 ? totalYieldUSD : null,
      };
    });
    
    // Combinar e ordenar por timestamp (mais recente primeiro)
    const allEarnHistory = [...formattedSubscriptions, ...redemptionsWithYield, ...formattedInterests]
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(({ timestamp, ...rest }) => rest);
    
    return {
      success: true,
      subscriptions: formattedSubscriptions.map(({ timestamp, ...rest }) => rest),
      redemptions: redemptionsWithYield.map(({ timestamp, ...rest }) => rest),
      interests: formattedInterests.map(({ timestamp, ...rest }) => rest),
      allHistory: allEarnHistory,
    };
  } catch (error) {
    console.error('Error fetching Simple Earn history:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.msg || error.message,
    };
  }
}

// Endpoint para buscar histórico de Simple Earn
app.get('/api/earn/history', async (req, res) => {
  try {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        success: false,
        error: 'Binance API credentials not configured',
      });
    }

    const result = await getSimpleEarnHistory(apiKey, apiSecret);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in /api/earn/history:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Endpoint para buscar yield total atual do Simple Earn
app.get('/api/earn/yield', async (req, res) => {
  try {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        success: false,
        error: 'Binance API credentials not configured',
      });
    }

    const result = await getSimpleEarnHistory(apiKey, apiSecret);

    if (result.success && result.interests) {
      // Calcular yield total em USD
      const totalYieldUSD = result.interests.reduce((sum, interest) => {
        return sum + (interest.amountInUSD || 0);
      }, 0);

      res.json({
        success: true,
        totalYieldUSD: totalYieldUSD.toFixed(2),
        interestCount: result.interests.length,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to fetch yield',
      });
    }
  } catch (error) {
    console.error('Error in /api/earn/yield:', error);
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
  console.log(`Earn history endpoint: http://localhost:${PORT}/api/earn/history`);
  console.log(`Earn yield endpoint: http://localhost:${PORT}/api/earn/yield`);
});

