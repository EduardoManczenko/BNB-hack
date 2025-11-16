# Passos para Deploy Completo

## ✅ Backend no Railway (Já feito!)

Seu backend já está rodando no Railway. Anote a URL:
- **Backend URL**: `https://seu-projeto.railway.app`

---

## 🎨 Frontend App no Vercel

### Passo 1: Obter URL do Backend

1. Acesse [railway.app](https://railway.app)
2. Vá no seu projeto
3. Em **Settings** → **Networking**, copie a URL (ou gere um domínio se ainda não tiver)

### Passo 2: Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login

2. **Add New Project** → Importe o repositório `BNB-hack`

3. Configure:
   - **Root Directory**: `frontend-app`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables** (IMPORTANTE!):
   ```
   VITE_API_BASE_URL=https://seu-projeto.railway.app
   ```
   (Substitua pela URL real do seu backend no Railway)

5. Clique em **Deploy**

6. Aguarde o build e copie a URL gerada

### Passo 3: Testar

1. Acesse a URL do Vercel
2. Faça login
3. Verifique se o Dashboard carrega os dados do backend

---

## 📝 Production URLs

- **Backend (Railway)**: Configure your Railway backend URL
- **Frontend App (Vercel)**: [https://bnb-hack-cjlu.vercel.app](https://bnb-hack-cjlu.vercel.app) ✅
- **Gateway Front (Vercel)**: [https://bnb-hack-five.vercel.app](https://bnb-hack-five.vercel.app) ✅

---

## 🔄 Deploy Automático

Tanto Railway quanto Vercel fazem deploy automático quando você faz push no GitHub!

**Importante**: Sempre que mudar a URL do backend, atualize a variável `VITE_API_BASE_URL` no Vercel.

