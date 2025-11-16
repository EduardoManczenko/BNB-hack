# Guia de Configuração do .env

## Formato Correto do Arquivo .env

Seu arquivo `.env` deve estar na pasta `backend-binance` e ter este formato:

```
BINANCE_API_KEY=sua_api_key_aqui
BINANCE_API_SECRET=sua_api_secret_aqui
PORT=3001
```

## ✅ Checklist de Verificação

1. **Arquivo existe?**
   - O arquivo deve se chamar exatamente `.env` (com o ponto no início)
   - Deve estar na pasta `backend-binance`

2. **Formato correto?**
   - Cada variável em uma linha separada
   - Sem espaços antes ou depois do `=`
   - Sem aspas ao redor dos valores (a menos que o valor contenha espaços)
   - Sem comentários na mesma linha das variáveis

3. **Valores preenchidos?**
   - `BINANCE_API_KEY` deve ter sua API key real da Binance
   - `BINANCE_API_SECRET` deve ter sua API secret real da Binance
   - `PORT` pode ser 3001 (ou outro número de porta)

## ❌ Erros Comuns

### ❌ ERRADO:
```
BINANCE_API_KEY = sua_key  (espaços ao redor do =)
BINANCE_API_KEY="sua_key"  (aspas desnecessárias)
BINANCE_API_KEY=your_api_key_here  (valor de exemplo)
```

### ✅ CORRETO:
```
BINANCE_API_KEY=sua_key_real_aqui
BINANCE_API_SECRET=sua_secret_real_aqui
PORT=3001
```

## 🔍 Como Verificar

1. Abra o arquivo `.env` em um editor de texto
2. Verifique se tem exatamente estas 3 linhas:
   - `BINANCE_API_KEY=...`
   - `BINANCE_API_SECRET=...`
   - `PORT=3001`

3. Certifique-se de que:
   - Não há espaços antes ou depois do `=`
   - Os valores não são os exemplos (`your_api_key_here`)
   - As credenciais são válidas da sua conta Binance

## 📝 Onde Obter as Credenciais

1. Acesse: https://www.binance.com/en/my/settings/api-management
2. Crie uma nova API Key ou use uma existente
3. **IMPORTANTE**: Ative a permissão "Enable Reading"
4. Copie a API Key e API Secret
5. Cole no arquivo `.env`

## 🚀 Testar

Depois de configurar, inicie o servidor:
```bash
npm start
```

Se tudo estiver correto, você verá:
```
Server is running on http://localhost:3001
```

Se houver erro, verifique a mensagem no console.

