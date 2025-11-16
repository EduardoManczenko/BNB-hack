# Railway Setup Guide

## Configuração no Railway

Se você está tendo o erro `Missing script: "build"`, siga estes passos:

### 1. No Dashboard do Railway

Quando criar o projeto, configure:

**Settings → Build & Deploy:**

- **Build Command**: Deixe vazio ou use `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend-binance` (se estiver na raiz do repo)

**OU** simplesmente deixe o Railway detectar automaticamente (ele deve detectar Node.js).

### 2. Variáveis de Ambiente

Vá em **Variables** e adicione:

```
PORT=3001
BINANCE_API_KEY=sua_chave_aqui
BINANCE_API_SECRET=seu_secret_aqui
```

### 3. Se ainda der erro

No Railway, vá em **Settings → Build & Deploy** e:

1. **Desmarque** "Build Command" ou deixe vazio
2. **Start Command**: `npm start`
3. Salve e faça um novo deploy

### 4. Alternativa: Usar Nixpacks

O arquivo `nixpacks.toml` já está configurado. O Railway deve detectá-lo automaticamente.

## Verificação

Após o deploy, verifique se está funcionando:

1. Acesse a URL do Railway (ex: `https://seu-projeto.railway.app`)
2. Teste o endpoint: `https://seu-projeto.railway.app/health`
3. Deve retornar: `{"status":"ok","message":"Backend is running"}`

