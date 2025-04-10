import http from 'http';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith('/routes/health')) {
    const response = {
      status: "ok",
      gemini_available: true,
      brain_store_available: true,
      timestamp: new Date().toISOString()
    };
    res.statusCode = 200;
    res.end(JSON.stringify(response));
  } else if (url.pathname.startsWith('/routes/ted_ai/health')) {
    const response = {
      status: "ok",
      gemini_available: true,
      brain_store_available: true,
      timestamp: new Date().toISOString()
    };
    res.statusCode = 200;
    res.end(JSON.stringify(response));
  } else if (url.pathname.startsWith('/routes/ted_ai/query_brain2')) {
    const response = {
      results: [
        {
          id: "1",
          content: "SPY showed a bullish divergence pattern on the 4-hour chart",
          source: "chart-data",
          metadata: {
            symbol: "SPY",
            timeframe: "4h"
          }
        },
        {
          id: "2",
          content: "AAPL earnings report showed better than expected results",
          source: "article",
          metadata: {
            title: "AAPL Q2 Earnings"
          }
        }
      ]
    };
    res.statusCode = 200;
    res.end(JSON.stringify(response));
  } else if (url.pathname.startsWith('/routes/ted_ai/brain_store_status')) {
    const response = {
      total_items: 15,
      sources: {
        "chart-data": 5,
        "article": 3,
        "user-input": 4,
        "document": 3
      },
      size_kb: 25.5,
      last_added: new Date().toISOString()
    };
    res.statusCode = 200;
    res.end(JSON.stringify(response));
  } else {
    const response = {
      message: `Mock endpoint for ${url.pathname}`
    };
    res.statusCode = 200;
    res.end(JSON.stringify(response));
  }
});

const PORT = 8001;
server.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}/`);
});
