import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env
dotenv.config({ path: join(__dirname, '.env') });

console.log('🔍 Verificando arquivo .env...\n');

// Verificar se o arquivo existe
const envPath = join(__dirname, '.env');
if (!existsSync(envPath)) {
  console.error('❌ Arquivo .env não encontrado!');
  console.log('📝 Crie um arquivo .env na pasta backend-binance com:');
  console.log('   BINANCE_API_KEY=sua_api_key');
  console.log('   BINANCE_API_SECRET=sua_api_secret');
  console.log('   PORT=3001');
  process.exit(1);
}

console.log('✅ Arquivo .env encontrado\n');

// Verificar variáveis
const requiredVars = {
  'BINANCE_API_KEY': process.env.BINANCE_API_KEY,
  'BINANCE_API_SECRET': process.env.BINANCE_API_SECRET,
  'PORT': process.env.PORT || '3001',
};

let hasErrors = false;

console.log('📋 Variáveis de ambiente:\n');

for (const [key, value] of Object.entries(requiredVars)) {
  if (key === 'PORT') {
    console.log(`   ${key}: ${value || '3001 (padrão)'}`);
  } else if (value) {
    // Mostrar apenas os primeiros e últimos caracteres para segurança
    const masked = value.length > 10 
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
      : '***';
    console.log(`   ${key}: ${masked} ✅`);
  } else {
    console.log(`   ${key}: ❌ NÃO CONFIGURADO`);
    hasErrors = true;
  }
}

console.log('\n');

if (hasErrors) {
  console.error('❌ Algumas variáveis estão faltando!');
  console.log('\n📝 Seu arquivo .env deve ter este formato:\n');
  console.log('BINANCE_API_KEY=sua_api_key_aqui');
  console.log('BINANCE_API_SECRET=sua_api_secret_aqui');
  console.log('PORT=3001\n');
  process.exit(1);
}

// Validações adicionais
if (process.env.BINANCE_API_KEY === 'your_api_key_here' || 
    process.env.BINANCE_API_KEY?.includes('your_api')) {
  console.warn('⚠️  BINANCE_API_KEY parece ser um valor de exemplo!');
  console.warn('   Certifique-se de usar sua API key real da Binance.\n');
}

if (process.env.BINANCE_API_SECRET === 'your_api_secret_here' || 
    process.env.BINANCE_API_SECRET?.includes('your_api')) {
  console.warn('⚠️  BINANCE_API_SECRET parece ser um valor de exemplo!');
  console.warn('   Certifique-se de usar sua API secret real da Binance.\n');
}

if (process.env.BINANCE_API_KEY && process.env.BINANCE_API_KEY.length < 20) {
  console.warn('⚠️  BINANCE_API_KEY parece muito curta!');
  console.warn('   Uma API key válida da Binance geralmente tem mais de 20 caracteres.\n');
}

if (process.env.BINANCE_API_SECRET && process.env.BINANCE_API_SECRET.length < 20) {
  console.warn('⚠️  BINANCE_API_SECRET parece muito curta!');
  console.warn('   Uma API secret válida da Binance geralmente tem mais de 20 caracteres.\n');
}

console.log('✅ Arquivo .env está configurado corretamente!');
console.log('\n💡 Dica: Certifique-se de que sua API key da Binance tem permissão de "Reading" habilitada.');
console.log('   Acesse: https://www.binance.com/en/my/settings/api-management\n');

