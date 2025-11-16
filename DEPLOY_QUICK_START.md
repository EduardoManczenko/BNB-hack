# Quick Deployment Guide

## 🚀 Backend (backend-binance) - Railway

**Railway é a melhor opção** porque é simples e funciona perfeitamente para servidores Node.js.

### Passo a passo:

1. Acesse [railway.app](https://railway.app) e faça login com GitHub
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Selecione o repositório `BNB-hack`
4. Configure o root directory como `backend-binance`
5. Vá em "Variables" e adicione:
   ```
   PORT=3001
   BINANCE_API_KEY=sua_chave_aqui
   BINANCE_API_SECRET=seu_secret_aqui
   ```
6. Railway vai fazer deploy automaticamente
7. Copie a URL gerada (ex: `https://seu-projeto.railway.app`)

---

## 🎨 Frontend App (frontend-app) - Vercel

### Passo a passo:

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em "Add New Project"
3. Importe o repositório `BNB-hack`
4. Configure:
   - **Root Directory**: `frontend-app`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Vá em "Environment Variables" e adicione:
   ```
   VITE_API_BASE_URL=https://seu-backend.railway.app
   ```
   (Use a URL do backend que você copiou no passo anterior)
6. Clique em "Deploy"

---

## ✅ Pronto!

Agora você tem:
- **Backend**: Rodando no Railway
- **Frontend App**: Rodando no Vercel
- **Gateway Front**: Já está publicado no Vercel em [https://bnb-hack-five.vercel.app](https://bnb-hack-five.vercel.app)

**Importante**: Sempre que fizer push no código, Railway e Vercel vão fazer deploy automaticamente!

---

## 🔧 Se precisar atualizar a URL do backend:

1. No Vercel, vá em Project Settings → Environment Variables
2. Atualize o `VITE_API_BASE_URL` com a nova URL do backend
3. Faça um novo deploy (ou aguarde o deploy automático)

