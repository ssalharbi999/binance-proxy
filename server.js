const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors());

const BASE = 'https://api-gcp.binance.com';
// جلب بيانات 24h - كل عملة بشكل منفصل
app.get('/ticker', async (req, res) => {
  try {
    const symbols = JSON.parse(req.query.symbols);
    const results = await Promise.all(
      symbols.map(s =>
        fetch(`${BASE}/api/v3/ticker/24hr?symbol=${s}`)
          .then(r => r.json())
          .catch(() => ({ symbol: s, priceChangePercent: '0', quoteVolume: '0' }))
      )
    );
    res.json(results);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// جلب شموع عملة واحدة
app.get('/klines', async (req, res) => {
  try {
    const { symbol, interval, limit } = req.query;
    const r = await fetch(`${BASE}/api/v3/klines?symbol=${symbol}&interval=${interval||'1h'}&limit=${limit||30}`);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy running on port', PORT));
