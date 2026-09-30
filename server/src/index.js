const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON Body Parsing
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SmartShelf Retail Platform',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve frontend static build if present
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`Serving client production build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // SPA fallback middleware for HTML5 client-side routing
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(clientDistPath, 'index.html'));
    }
    next();
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛒 SmartShelf Production Platform is LIVE!`);
  console.log(`🌐 Website & App: http://localhost:${PORT}`);
  console.log(`🚀 REST API Base: http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
