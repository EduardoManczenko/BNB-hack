# .env Configuration Guide

## Correct .env File Format

Your `.env` file should be in the `backend-binance` folder and have this format:

```
BINANCE_API_KEY=your_api_key_here
BINANCE_API_SECRET=your_api_secret_here
PORT=3001
```

## ✅ Verification Checklist

1. **File exists?**
   - The file must be named exactly `.env` (with the dot at the beginning)
   - Must be in the `backend-binance` folder

2. **Correct format?**
   - Each variable on a separate line
   - No spaces before or after the `=`
   - No quotes around values (unless the value contains spaces)
   - No comments on the same line as variables

3. **Values filled in?**
   - `BINANCE_API_KEY` must have your real Binance API key
   - `BINANCE_API_SECRET` must have your real Binance API secret
   - `PORT` can be 3001 (or another port number)

## ❌ Common Errors

### ❌ WRONG:
```
BINANCE_API_KEY = your_key  (spaces around =)
BINANCE_API_KEY="your_key"  (unnecessary quotes)
BINANCE_API_KEY=your_api_key_here  (example value)
```

### ✅ CORRECT:
```
BINANCE_API_KEY=your_real_key_here
BINANCE_API_SECRET=your_real_secret_here
PORT=3001
```

## 🔍 How to Verify

1. Open the `.env` file in a text editor
2. Check if it has exactly these 3 lines:
   - `BINANCE_API_KEY=...`
   - `BINANCE_API_SECRET=...`
   - `PORT=3001`

3. Make sure:
   - There are no spaces before or after the `=`
   - The values are not examples (`your_api_key_here`)
   - The credentials are valid from your Binance account

## 📝 Where to Get Credentials

1. Go to: https://www.binance.com/en/my/settings/api-management
2. Create a new API Key or use an existing one
3. **IMPORTANT**: Enable the "Enable Reading" permission
4. Copy the API Key and API Secret
5. Paste into the `.env` file

## 🚀 Test

After configuring, start the server:
```bash
npm start
```

If everything is correct, you'll see:
```
Server is running on http://localhost:3001
```

If there's an error, check the console message.
