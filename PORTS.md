# Port Configuration

## Current Ports

- **Frontend (Vite)**: Port `8080`
  - File: `frontend-app/vite.config.ts`
  - URL: http://localhost:8080

- **Backend (Express)**: Port `3001`
  - File: `backend-binance/server.js`
  - URL: http://localhost:3001

## ✅ Status

The ports are configured correctly and **are NOT in conflict**.

## 🔧 How to Change Ports (if needed)

### Change Frontend Port

Edit `frontend-app/vite.config.ts`:
```typescript
server: {
  host: "::",
  port: 8080,  // Change to another port (e.g., 3000, 5173, 8081)
},
```

### Change Backend Port

Option 1: Edit the `.env` file in `backend-binance/`:
```
PORT=3001  # Change to another port (e.g., 3002, 4000, 5000)
```

Option 2: Edit `backend-binance/server.js`:
```javascript
const PORT = process.env.PORT || 3001;  // Change the default 3001
```

## ⚠️ Important

If you change the backend port, also update it in the frontend:

Edit `frontend-app/src/config/api.ts` or create a `.env` file in `frontend-app/`:
```
VITE_API_BASE_URL=http://localhost:3001
```
