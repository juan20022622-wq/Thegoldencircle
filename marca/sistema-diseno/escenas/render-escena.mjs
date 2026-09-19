/* Renderiza una escena por teselas.  node render-escena.mjs <escena.html> <salida/> [muestras] [teselas]
   Necesita three y puppeteer-core instalados en una carpeta temporal (MODULOS). */
import http from 'http'; import fs from 'fs'; import path from 'path';
const MODULOS = process.env.MODULOS; if (!MODULOS) throw new Error('Falta MODULOS: carpeta con node_modules de three y puppeteer-core');
const { default: puppeteer } = await import(MODULOS + '/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js');
const [escena, salida, muestras = '40', cuales = '0,1,2,3,4,5,6,7'] = process.argv.slice(2);
const tipos = { '.html': 'text/html', '.js': 'text/javascript' };
const srv = http.createServer((req, res) => { const u = decodeURIComponent(req.url.split('?')[0]); const f = u.startsWith('/node_modules/') ? MODULOS + u : path.resolve(path.dirname(escena), '.' + u); fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'content-type': tipos[path.extname(f)] || 'application/octet-stream' }); res.end(d); }); }).listen(0);
const puerto = srv.address().port;
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const p = await b.newPage(); p.on('pageerror', e => console.log('  !', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('  !', m.text().slice(0, 200)); });
await p.goto('http://localhost:' + puerto + '/' + path.basename(escena)); await p.waitForFunction('window.lista === true', { timeout: 60000 });
fs.mkdirSync(salida, { recursive: true });
for (const i of cuales.split(',').map(Number)) { const t0 = Date.now(); const url = await p.evaluate((i, n) => window.teselar(i, n), i, Number(muestras)); fs.writeFileSync(path.join(salida, 'tesela-' + i + '.png'), Buffer.from(url.split(',')[1], 'base64')); console.log('  tesela', i, ((Date.now() - t0) / 1000).toFixed(1) + ' s'); }
await b.close(); srv.close();
