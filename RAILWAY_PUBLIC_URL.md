# Como Obter URL Pública do Railway

A URL `bnb-hack.railway.internal` é uma URL **interna** do Railway e não funciona para acessar de fora.

## Passo a Passo para Gerar URL Pública

### 1. No Dashboard do Railway

1. Acesse [railway.app](https://railway.app)
2. Clique no seu projeto `backend-binance`
3. Vá na aba **Settings** (ou clique no serviço)
4. Role até a seção **Networking** ou **Domains**

### 2. Gerar Domínio Público

Você tem duas opções:

#### Opção A: Domínio Railway (Gratuito)
1. Na seção **Networking**, procure por **"Generate Domain"** ou **"Public Domain"**
2. Clique em **"Generate Domain"** ou **"Create Public Domain"**
3. O Railway vai gerar uma URL como: `https://seu-projeto-production.up.railway.app`
4. **Copie essa URL** - essa é a que você vai usar no frontend!

#### Opção B: Domínio Customizado (Opcional)
1. Você pode adicionar seu próprio domínio
2. Mas para começar, use o domínio do Railway (Opção A)

### 3. Verificar se está funcionando

Teste a URL pública no navegador:
- `https://sua-url.railway.app/health`
- Deve retornar: `{"status":"ok","message":"Backend is running"}`

### 4. Usar no Frontend

Quando tiver a URL pública, use ela no Vercel:

```
VITE_API_BASE_URL=https://sua-url.railway.app
```

## Exemplo

Se sua URL pública for: `https://backend-binance-production.up.railway.app`

No Vercel, configure:
```
VITE_API_BASE_URL=https://backend-binance-production.up.railway.app
```

## Importante

- A URL `.railway.internal` é apenas para comunicação interna
- Você precisa de uma URL pública (`.up.railway.app` ou domínio customizado)
- A URL pública é gratuita no Railway

