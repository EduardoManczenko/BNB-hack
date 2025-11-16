# Deploy Frontend App no Vercel

## Passo a Passo

### 1. Obter a URL do Backend (Railway)

1. Acesse o [Railway Dashboard](https://railway.app)
2. Vá no seu projeto do backend
3. Clique em **Settings** → **Networking**
4. Copie a URL gerada (ex: `https://seu-projeto.railway.app`)
   - Ou clique em **Generate Domain** se ainda não tiver

### 2. Testar o Backend

Antes de configurar o frontend, teste se o backend está funcionando:

- Acesse: `https://seu-projeto.railway.app/health`
- Deve retornar: `{"status":"ok","message":"Backend is running"}`

### 3. Deploy do Frontend no Vercel

#### Opção A: Via Dashboard (Recomendado)

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub

2. Clique em **Add New Project**

3. Importe o repositório `BNB-hack`

4. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-app` (clique em "Edit" e selecione)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **IMPORTANTE**: Configure as variáveis de ambiente:
   - Clique em **Environment Variables**
   - Adicione:
     ```
     Name: VITE_API_BASE_URL
     Value: https://seu-projeto.railway.app
     ```
   - Marque para **Production**, **Preview** e **Development**
   - Clique em **Save**

6. Clique em **Deploy**

7. Aguarde o build e deploy completarem

8. Você receberá uma URL como: `https://seu-projeto.vercel.app`

#### Opção B: Via CLI

```bash
cd frontend-app
npm i -g vercel
vercel
```

Quando perguntar sobre as variáveis de ambiente, adicione:
```
VITE_API_BASE_URL=https://seu-projeto.railway.app
```

### 4. Verificar se está funcionando

1. Acesse a URL do Vercel
2. Faça login no dashboard
3. Verifique se o saldo está carregando (vem do backend)
4. Teste outras funcionalidades

### 5. Atualizar variáveis de ambiente (se necessário)

Se precisar mudar a URL do backend:

1. No Vercel, vá em **Project Settings** → **Environment Variables**
2. Edite `VITE_API_BASE_URL` com a nova URL
3. Faça um novo deploy (ou aguarde o deploy automático)

## Troubleshooting

### Erro de CORS

Se aparecer erro de CORS, verifique se o backend está permitindo requisições do domínio do Vercel. O backend já tem `cors()` habilitado, então deve funcionar.

### Backend não responde

- Verifique se o backend está rodando no Railway
- Teste o endpoint `/health` diretamente no navegador
- Verifique os logs do Railway para erros

### Variáveis de ambiente não funcionam

- Certifique-se de que adicionou `VITE_API_BASE_URL` no Vercel
- Variáveis que começam com `VITE_` são expostas no build do Vite
- Faça um novo deploy após adicionar variáveis

