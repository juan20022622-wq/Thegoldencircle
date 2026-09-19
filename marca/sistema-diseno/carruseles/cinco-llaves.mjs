/* Carrusel 01 · «Una puerta. Cinco llaves.» · el primer post de la cuenta
   ---------------------------------------------------------------------------
   Expectativa sobre la comunidad, no sobre el trading: qué hay detrás de la
   puerta. Ocho láminas sobre una sola escena continua (escenas/cinco-llaves.html).

     MODULOS=<carpeta con node_modules de three, puppeteer-core y sharp>
     node escenas/render-escena.mjs escenas/cinco-llaves.html <teselas/> 180
     node carruseles/cinco-llaves.mjs <teselas/>
   --------------------------------------------------------------------------- */
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const aqui = path.dirname(fileURLToPath(import.meta.url)), sis = path.resolve(aqui, '..');
const MODULOS = process.env.MODULOS; const teselas = process.argv[2];
const { default: sharp } = await import(MODULOS + '/node_modules/sharp/dist/index.mjs');
const { default: puppeteer } = await import(MODULOS + '/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js');
const css = fs.readFileSync(path.join(sis, 'fuente/sistema.css'), 'utf8');
const svg = fs.readFileSync(path.resolve(sis, '../../web/assets/img/simbolo.svg'), 'utf8');
const trazos = svg.slice(svg.indexOf('<g id="leon"'), svg.lastIndexOf('</g>') + 4).replace(' id="leon"', '');
const leon = `<svg class="riel__leon leon" viewBox="391 475 250 393" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${trazos}</svg>`;
const riel = (n) => `<footer class="riel"><span class="riel__marca">${leon}The Golden Syndicate</span><span class="riel__dato"><b>${String(n).padStart(2, '0')}</b> / 08</span></footer>`;
const DESCARGO = 'El trading conlleva riesgo de pérdida. El contenido es educativo y no constituye asesoría de inversión. Los resultados pasados no garantizan resultados futuros. Opera solo con capital que puedas permitirte perder.';

const L = [
  `<div class="cabeza"><h1 class="titular titular--xl">Una puerta.<br><em>Cinco llaves.</em></h1><p class="cuerpo">Lo que hay detrás no es solo trading.</p></div><span class="desliza" style="margin-top:auto;margin-bottom:calc(40 * var(--u))">Desliza</span>`,
  `<div class="cabeza"><h2 class="titular titular--m">Muchos llegan por el trading. <em>Se quedan por todo lo demás.</em></h2><p class="cuerpo">Esto es una comunidad. Aquí se trabaja en cinco frentes a la vez.</p></div>`,
  `<div class="cabeza"><p class="llave"><b>01</b>dinero</p><h2 class="titular titular--m" style="margin-top:calc(-30 * var(--u))">El riesgo primero. <em>El resultado, después.</em></h2><p class="cuerpo">Aprender a cuidar lo que tienes antes de pensar en lo que quieres.</p></div>`,
  `<div class="cabeza"><p class="llave"><b>02</b>propósito</p><h2 class="titular titular--m" style="margin-top:calc(-30 * var(--u))">Saber para qué. <em>Lo demás se alinea.</em></h2><p class="cuerpo">Una dirección clara ordena cada decisión, dentro y fuera del mercado.</p></div>`,
  `<div class="cabeza"><p class="llave"><b>03</b>cuerpo</p><h2 class="titular titular--m" style="margin-top:calc(-30 * var(--u))">La disciplina <em>es una sola.</em></h2><p class="cuerpo">La que te levanta a entrenar es la misma que te hace esperar el momento correcto.</p></div>`,
  `<div class="cabeza"><p class="llave"><b>04</b>mentalidad</p><h2 class="titular titular--m" style="margin-top:calc(-30 * var(--u))">Calma, <em>cuando todo alrededor se mueve.</em></h2><p class="cuerpo">Paciencia para esperar. Cabeza fría para decidir. Carácter para aceptar lo que no salió.</p></div>`,
  `<div class="cabeza"><p class="llave"><b>05</b>educación</p><h2 class="titular titular--m" style="margin-top:calc(-30 * var(--u))">Entender el porqué, <em>no solo el qué.</em></h2><p class="cuerpo">Capa sobre capa. Lo que de verdad se entiende no hay que volver a preguntarlo.</p></div>`,
  `<div class="cabeza"><h2 class="titular titular--m">La puerta <em>ya está abierta.</em></h2><p class="cuerpo">The Golden Syndicate. Una comunidad para crecer en cinco frentes, con gente que va en serio.</p><span class="pastilla">Entrar gratis · enlace en la bio</span><p class="descargo" style="max-width:19em;color:#A8A293;margin-top:calc(10 * var(--u))">${DESCARGO}</p></div>`,
];

const salida = path.join(aqui, '01-cinco-llaves'); fs.rmSync(salida, { recursive: true, force: true }); fs.mkdirSync(salida, { recursive: true });
const FUENTES = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">';
for (let i = 0; i < L.length; i++) {
  await sharp(path.join(teselas, `tesela-${i}.png`)).jpeg({ quality: 93, chromaSubsampling: '4:4:4' }).toFile(path.join(salida, `escena-${i + 1}.jpg`));
  fs.writeFileSync(path.join(salida, `lamina-${i + 1}.html`), `<!-- @dsCard group="Carrusel · Una puerta, cinco llaves" name="Lámina ${i + 1}" -->
<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Una puerta. Cinco llaves. · ${i + 1}/8</title>${FUENTES}<style>${css}</style></head>
<body><main class="lienzo"><div class="hoja hoja--escena" style="--escena:url('escena-${i + 1}.jpg')">${L[i]}${riel(i + 1)}</div></main></body></html>`);
}
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
for (let i = 1; i <= L.length; i++) { const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 }); await p.goto('file://' + path.join(salida, `lamina-${i}.html`), { waitUntil: 'networkidle0' }); await p.evaluateHandle('document.fonts.ready'); await p.screenshot({ path: path.join(salida, `cinco-llaves-${String(i).padStart(2, '0')}.png`) }); await p.close(); }
await b.close();
console.log('  8 láminas en', path.relative(process.cwd(), salida));
