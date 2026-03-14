const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Default to index.html for directory paths
  if (urlPath.endsWith('/')) {
    urlPath += 'index.html';
  }

  let filePath = path.join(ROOT, urlPath);

  // If no extension and not a file, try adding /index.html
  if (!path.extname(filePath)) {
    const withIndex = path.join(filePath, 'index.html');
    if (fs.existsSync(withIndex)) {
      filePath = withIndex;
    } else if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }
  }

  // Security: prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Handle form submissions locally
  if (req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      is_valid: true,
      confirmation_message: '<div class="gform_confirmation_message">Thank you for your message. This is an offline version — form submissions are not processed.</div>',
      confirmation_type: 'message'
    }));
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Serve the branded 404 page
      const notFoundPage = path.join(ROOT, '404.html');
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      if (fs.existsSync(notFoundPage)) {
        fs.createReadStream(notFoundPage).pipe(res);
      } else {
        res.end('<html><body><h1>404 - Page Not Found</h1><p><a href="/">Go Home</a></p></body></html>');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    const headers = {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    };

    // Add Content-Length
    headers['Content-Length'] = stats.size;

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Cylio website running at http://localhost:${PORT}`);
  console.log(`Serving from: ${ROOT}`);
  console.log('Press Ctrl+C to stop.');
});
