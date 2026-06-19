const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors());

const BASE = 'https://api.binance.com';

app.get('/ticker', async (req, res) => {
  try {
    const symbols = req.query.symbols;
    const url = `${BASE}/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}`;
    const r = await fetch(url);
    const text = await r.text();
    const data = JSON.parse(text);
    res.json(data);
  } catch(e) {
    res.status(500).json({error: e.message});
  }
});

app.get('/klines', async (req, res) => {
  try {
    const {symbol, interval, limit} = req.query;
    const url = `${BASE}/api/v3/klines?symbol=${symbol}&interval=${interval||'1h'}&limit=${limit||30}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({error: e.message});
  }
});

app.get('/health', (_, res) => res.json({status:'ok'}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy running on port', PORT));
