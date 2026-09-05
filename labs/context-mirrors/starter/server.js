/**
 * Echo Chamber - Enhanced Web Server v2.0
 * Educational server with multi-pattern support
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Import modules
const patterns = require('./lib/patterns');
const HistoricalAnalyzer = require('./lib/history');
const Logger = require('./lib/logger');

const PORT = process.env.PORT || 3000;

// Initialize components
const analyzer = new HistoricalAnalyzer();
Logger.setLevel(1); // INFO level

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper: Parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body exceeds 1 MB'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Helper: Send JSON response
function sendJSON(res, data, status = 200) {
  res.writeHead(status, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data));
}

// Helper: Send error response
function sendError(res, message, status = 400) {
  sendJSON(res, { success: false, error: message }, status);
}

// Helper: Serve static file
function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const mimeType = mimeTypes[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

// API Routes
const apiRoutes = {
  // Analyze sequence pattern
  'POST /api/analyze': async (req, res) => {
    try {
      const { sequence } = await parseBody(req);
      
      if (!sequence) {
        return sendError(res, 'Sequence is required');
      }
      
      const result = patterns.detectPattern(sequence);
      analyzer.record(sequence, result);
      
      Logger.info('Sequence analyzed', { pattern: result.pattern, success: result.success });
      sendJSON(res, result);
    } catch (error) {
      Logger.error('Analysis error', error);
      sendError(res, error.message);
    }
  },
  
  // Predict multiple values
  'POST /api/predict-multiple': async (req, res) => {
    try {
      const { sequence, count = 5 } = await parseBody(req);
      
      if (!sequence) {
        return sendError(res, 'Sequence is required');
      }
      
      const result = patterns.predictMultiple(sequence, count);
      analyzer.record(sequence, result);
      
      sendJSON(res, result);
    } catch (error) {
      Logger.error('Prediction error', error);
      sendError(res, error.message);
    }
  },
  
  // Generate sequence
  'POST /api/generate': async (req, res) => {
    try {
      const { type, params, length = 10 } = await parseBody(req);
      
      if (!type || !params) {
        return sendError(res, 'Type and params are required');
      }
      
      const sequence = patterns.generateSequence(type, params, length);
      sendJSON(res, { success: true, sequence });
    } catch (error) {
      sendError(res, error.message);
    }
  },
  
  // Get statistics
  'GET /api/statistics': async (req, res) => {
    const stats = analyzer.getStatistics();
    sendJSON(res, stats);
  },
  
  // Get history
  'GET /api/history': async (req, res) => {
    const history = analyzer.getHistory();
    sendJSON(res, { history });
  },
  
  // Clear history
  'DELETE /api/history': async (req, res) => {
    analyzer.clear();
    sendJSON(res, { success: true, message: 'History cleared' });
  },
  
  // Export history
  'GET /api/export': async (req, res) => {
    const data = analyzer.export();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="echo-chamber-history.json"'
    });
    res.end(data);
  },
  
  // Get trends
  'GET /api/trends': async (req, res) => {
    const trends = analyzer.getTrends();
    sendJSON(res, { trends });
  },
  
  // Health check
  'GET /api/health': async (req, res) => {
    sendJSON(res, { 
      status: 'healthy', 
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '2.0.0'
    });
  }
};

// Create server
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;
  const pathname = url.pathname;
  
  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }
  
  // Check API routes
  const routeKey = `${method} ${pathname}`;
  if (apiRoutes[routeKey]) {
    try {
      await apiRoutes[routeKey](req, res);
    } catch (error) {
      Logger.error('Route error', error);
      sendError(res, 'Internal server error', 500);
    }
    return;
  }
  
  // Serve static files
  let filePath = path.join(__dirname, 'public', pathname);
  
  if (pathname === '/') {
    filePath = path.join(__dirname, 'public', 'index.html');
  } else if (pathname === '/docs') {
    filePath = path.join(__dirname, 'public', 'docs.html');
  }
  
  // Check if file exists
  const publicRoot = path.join(__dirname, 'public');
  const normalizedPath = path.normalize(filePath);
  if (normalizedPath.startsWith(publicRoot) && fs.existsSync(normalizedPath) && fs.statSync(normalizedPath).isFile()) {
    serveStatic(res, normalizedPath);
    return;
  }
  
  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// Error handling
server.on('error', (error) => {
  Logger.error('Server error', error);
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║      🏰 EL CASTILLO DE ECOS - Servidor Web v2.0 🏰        ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║   🌐 URL: http://localhost:${PORT}                           ║
║   📖 Docs: http://localhost:${PORT}/docs                     ║
║   🔧 API: http://localhost:${PORT}/api/health                ║
║                                                            ║
║   Patrones soportados:                                     ║
║   • Progresiones Aritméticas                               ║
║   • Progresiones Geométricas                               ║
║   • Secuencias Cuadráticas                                 ║
║   • Secuencias Cúbicas                                     ║
║   • Secuencias de Fibonacci                                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('Shutting down server...');
  server.close(() => {
    Logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = server;
