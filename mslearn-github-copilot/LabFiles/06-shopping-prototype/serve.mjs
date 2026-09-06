import http from 'node:http';
import fs from 'node:fs/promises';

const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/cart.mjs', ['cart.mjs', 'text/javascript; charset=utf-8']]
]);
const server = http.createServer(async (request, response) => {
  if (request.method !== 'GET') {
    response.writeHead(405, { Allow: 'GET' }).end('Method not allowed');
    return;
  }
  const asset = files.get(new URL(request.url, 'http://localhost').pathname);
  if (!asset) {
    response.writeHead(404).end('Not found');
    return;
  }
  try {
    const body = await fs.readFile(new URL(asset[0], import.meta.url));
    response.writeHead(200, { 'Content-Type': asset[1], 'X-Content-Type-Options': 'nosniff' }).end(body);
  } catch (error) {
    if (error.code !== 'ENOENT') console.error(error);
    response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Asset unavailable');
  }
});
server.listen(0, '127.0.0.1', () => console.log(`Prototype: http://127.0.0.1:${server.address().port}`));
