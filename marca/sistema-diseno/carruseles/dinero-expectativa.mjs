/* Carrusel corto · dinero · cuatro láminas para quien no sabe nada de trading
     MODULOS=<carpeta con three, puppeteer-core y sharp>
     node escenas/render-escena.mjs escenas/dinero-expectativa.html <teselas/> 180 0,1,2,3
     node carruseles/dinero-expectativa.mjs <teselas/> */
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const aqui = path.dirname(fileURLToPath(import.meta.url)), sis = path.resolve(aqui, '..');
const MODULOS = process.env.MODULOS; const teselas = process.argv[2];
const { default: sharp } = await import(MODULOS + '/node_modules/sharp/dist/index.mjs');
const { default: puppeteer } = await import(MODULOS + '/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js');
const css = fs.readFileSync(path.join(sis, 'fuente/sistema.css'), 'utf8');
const svg = fs.readFileSync(path.resolve(sis, '../../web/assets/img/simbolo.svg'), 'utf8');
const trazos = svg.slice(svg.indexOf('<g id="leon"'), svg.lastIndexOf('</g>') + 4).replace(' id="leon"', '');
const leon = `<svg class="riel__leon leon" viewBox="391 475 250 393" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${trazos}</svg>`;
const riel = (n) => `<footer class="riel"><span class="riel__marca">${leon}The Golden Syndicate</span><span class="riel__dato"><b>${String(n).padStart(2, '0')}</b> / 04</span></footer>`;
const DESCARGO = 'El trading conlleva riesgo de pérdida. El contenido es educativo y no constituye asesoría de inversión. Los resultados pasados no garantizan resultados futuros. Opera solo con capital que puedas permitirte perder.';
const llave = `<p class="llave"><b>01</b>dinero</p>`;
const L = [
  `<div class="cabeza">${llave}<h1 class="titular titular--xl" style="margin-top:calc(-24 * var(--u))">El dinero se parece <em>a quien lo cuida.</em></h1><p class="cuerpo">Antes de tener más, aprender a cuidarlo bien.</p></div><span class="desliza" style="margin-top:auto;margin-bottom:calc(40 * var(--u))">Desliza</span>`,
  `<div class="cabeza">${llave}<h2 class="titular titular--m" style="margin-top:calc(-30 * var(--u))">Cuidarlo no es suerte. <em>Es un hábito.</em></h2><p class="cuerpo">Se construye un día a la vez, cuando nadie está mirando.</p></div>`,
  `<div class="cabeza">${llave}<h2 class="titular titular--m" style="margin-top:calc(-30 * var(--u))">Manejarlo con cabeza <em>es la primera llave.</em></h2><p class="cuerpo">Dinero: la primera de cinco áreas en las que aquí se crece. Las otras cuatro, pronto.</p></div>`,
  `<div class="cabeza"><h2 class="titular titular--m">Cinco llaves. <em>Una puerta que pronto se abre.</em></h2><p class="cuerpo">The Golden Syndicate. Sigue la cuenta para saber cuándo.</p><p class="descargo" style="max-width:31em;color:#A8A293;margin-top:calc(20 * var(--u))">Contenido educativo. No es asesoría financiera.</p></div>`,
];
const salida = path.join(aqui, '08-dinero-expectativa'); fs.rmSync(salida, { recursive: true, force: true }); fs.mkdirSync(salida, { recursive: true });
const FUENTES = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">';
for (let i = 0; i < L.length; i++) {
  await sharp(path.join(teselas, `tesela-${i}.png`)).jpeg({ quality: 93, chromaSubsampling: '4:4:4' }).toFile(path.join(salida, `escena-${i + 1}.jpg`));
  fs.writeFileSync(path.join(salida, `lamina-${i + 1}.html`), `<!-- @dsCard group="Carrusel · dinero (expectativa)" name="Lámina ${i + 1}" -->
<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>dinero · ${i + 1}/4</title>${FUENTES}<style>${css}</style></head>
<body><main class="lienzo"><div class="hoja hoja--escena" style="--escena:url('escena-${i + 1}.jpg')">${L[i]}${riel(i + 1)}</div></main></body></html>`);
}
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true }); const pngs = [];
for (let i = 1; i <= L.length; i++) { const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 }); await p.goto('file://' + path.join(salida, `lamina-${i}.html`), { waitUntil: 'networkidle0' }); await p.evaluateHandle('document.fonts.ready'); const f = path.join(salida, `dinero-${String(i).padStart(2, '0')}.png`); await p.screenshot({ path: f }); pngs.push(f); await p.close(); }
await b.close();
const w = 540, h = 675; const c = await Promise.all(pngs.map(async (f, k) => ({ input: await sharp(f).resize(w, h).toBuffer(), left: k * (w + 8), top: 0 })));
await sharp({ create: { width: 4 * (w + 8) - 8, height: h, channels: 3, background: '#222' } }).composite(c).jpeg({ quality: 86 }).toFile(path.join(salida, '00-hoja-de-contacto.jpg'));
fs.writeFileSync(path.join(salida, 'pie-de-foto.md'), ['# Pie de foto · dinero (expectativa)', '', 'Revisado con `revision-copy-trading`.', '', '---', '', 'El dinero se parece a quien lo cuida.', '', 'Antes de tener más, aprender a cuidarlo bien. Y cuidarlo no es suerte: es un hábito que se construye un día a la vez, cuando nadie está mirando.', '', 'Manejarlo con cabeza es la primera de las cinco llaves. Las otras cuatro, pronto.', '', 'Cinco llaves. Una puerta que pronto se abre. Sigue la cuenta para saber cuándo.', '', '—', 'Contenido educativo. No es asesoría financiera.', ''].join('\n'));
console.log('  4 láminas en', path.relative(process.cwd(), salida));
