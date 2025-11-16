# Configuração de Portas

## Portas Atuais

- **Frontend (Vite)**: Porta `8080`
  - Arquivo: `frontend-app/vite.config.ts`
  - URL: http://localhost:8080

- **Backend (Express)**: Porta `3001`
  - Arquivo: `backend-binance/server.js`
  - URL: http://localhost:3001

## ✅ Status

As portas estão configuradas corretamente e **NÃO estão em conflito**.

## 🔧 Como Alterar as Portas (se necessário)

### Alterar Porta do Frontend

Edite `frontend-app/vite.config.ts`:
```typescript
server: {
  host: "::",
  port: 8080,  // Altere para outra porta (ex: 3000, 5173, 8081)
},
```

### Alterar Porta do Backend

Opção 1: Edite o arquivo `.env` em `backend-binance/`:
```
PORT=3001  # Altere para outra porta (ex: 3002, 4000, 5000)
```

Opção 2: Edite `backend-binance/server.js`:
```javascript
const PORT = process.env.PORT || 3001;  // Altere o 3001 padrão
```

## ⚠️ Importante

Se alterar a porta do backend, também atualize no frontend:

Edite `frontend-app/src/pages/Dashboard.tsx`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
//                                                                      ^^^^
//                                                          Altere para a nova porta
```

Ou crie um arquivo `.env` em `frontend-app/`:
```
VITE_API_BASE_URL=http://localhost:3001
```

