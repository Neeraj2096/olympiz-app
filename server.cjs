const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3002;
const distDir = path.join(__dirname, 'dist');

const server = http.createServer((req, res) => {
  // Resolve requested file path
  let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);
  // Strip query string
  filePath = filePath.split('?')[0];

  // If file doesn't exist or is a directory, fallback to SPA entry point
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.json': 'application/json',
    '.ico': 'image/x-icon'
  };
  const contentType = mime[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Server error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
