import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('docs');
const base = '/executive-intelligence-index';
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.xml':'application/xml', '.svg':'image/svg+xml', '.cff':'text/yaml' };
http.createServer((request, response) => {
  let pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
  if (!pathname.startsWith(base)) { response.writeHead(302, { Location: `${base}/` }); response.end(); return; }
  pathname = pathname.slice(base.length) || '/';
  let target = path.join(root, pathname);
  if (pathname.endsWith('/')) target = path.join(target, 'index.html');
  if (!path.extname(target) && fs.existsSync(`${target}.html`)) target = `${target}.html`;
  if (!target.startsWith(root) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, { 'Content-Type': types[path.extname(target)] ?? 'application/octet-stream' });
  fs.createReadStream(target).pipe(response);
}).listen(4173, '127.0.0.1', () => process.stdout.write('Serving docs at http://127.0.0.1:4173/executive-intelligence-index/\n'));
