import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testando API do Backend Binance...\n');

  // Teste 1: Health Check
  console.log('1️⃣ Testando Health Check...');
  try {
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check OK:', healthResponse.data);
  } catch (error) {
    console.error('❌ Health Check FALHOU:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   ⚠️  Servidor não está rodando!');
      console.error('   💡 Execute: npm start');
      process.exit(1);
    }
    return;
  }

  console.log('\n');

  // Teste 2: Balance Endpoint
  console.log('2️⃣ Testando Balance Endpoint...');
  try {
    const balanceResponse = await axios.get(`${API_BASE_URL}/api/balance`);
    console.log('✅ Balance Response:', JSON.stringify(balanceResponse.data, null, 2));
    
    if (balanceResponse.data.success) {
      console.log(`\n💰 Saldo Total: $${balanceResponse.data.totalBalance}`);
      console.log(`📊 Moedas com saldo: ${balanceResponse.data.balances?.length || 0}`);
    } else {
      console.error('❌ Erro ao buscar saldo:', balanceResponse.data.error);
    }
  } catch (error) {
    console.error('❌ Balance Endpoint FALHOU:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
  }

  console.log('\n✅ Testes concluídos!');
}

// Aguardar um pouco para o servidor iniciar
setTimeout(() => {
  testAPI().catch(console.error);
}, 2000);

