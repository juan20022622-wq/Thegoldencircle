/* Carruseles 02–06 · una llave por carrusel · seis láminas cada uno
   ---------------------------------------------------------------------------
     MODULOS=<carpeta con three, puppeteer-core y sharp>
     node escenas/render-escena.mjs "escenas/pilares.html?pilar=dinero" <teselas/> 180 0,1,2,3,4,5
     node carruseles/pilares.mjs dinero <teselas/>
   --------------------------------------------------------------------------- */
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const aqui = path.dirname(fileURLToPath(import.meta.url)), sis = path.resolve(aqui, '..');
const MODULOS = process.env.MODULOS; const [pilar, teselas] = process.argv.slice(2);
const { default: sharp } = await import(MODULOS + '/node_modules/sharp/dist/index.mjs');
const { default: puppeteer } = await import(MODULOS + '/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js');
const css = fs.readFileSync(path.join(sis, 'fuente/sistema.css'), 'utf8');
const svg = fs.readFileSync(path.resolve(sis, '../../web/assets/img/simbolo.svg'), 'utf8');
const trazos = svg.slice(svg.indexOf('<g id="leon"'), svg.lastIndexOf('</g>') + 4).replace(' id="leon"', '');
const leon = `<svg class="riel__leon leon" viewBox="391 475 250 393" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${trazos}</svg>`;
const DESCARGO = 'El trading conlleva riesgo de pérdida. El contenido es educativo y no constituye asesoría de inversión. Los resultados pasados no garantizan resultados futuros. Opera solo con capital que puedas permitirte perder.';

/* t = titular (con <em> para la frase en oro) · c = cuerpo · cita = atribución */
const P = {
  dinero: { n: '01', nombre: 'dinero', ordinal: 'la primera', carpeta: '02-dinero', laminas: [
    { t: 'Primero <em>se cuida.</em>', c: 'La primera llave no habla de cuánto ganar.' },
    { t: 'Antes de entrar, una sola pregunta: <em>cuánto estoy dispuesto a perder.</em>', c: 'Si esa respuesta no existe, todavía no hay operación.' },
    { t: 'El tamaño sale de dos datos, <em>no de la confianza.</em>', c: 'Cuánto se arriesga y a qué distancia está el stop. Lo bien que se ve la idea no entra en la cuenta.' },
    { t: 'Una pérdida pequeña <em>es parte del plan.</em>', c: 'Se decide antes, se acepta cuando llega y no se lleva por delante lo demás.' },
    { t: 'Lo primero es <em>seguir en el camino.</em>', c: 'Quien cuida su capital tiene mañana para seguir aprendiendo.' } ] },
  proposito: { n: '02', nombre: 'propósito', ordinal: 'la segunda', carpeta: '03-proposito', laminas: [
    { t: 'Saber <em>para qué.</em>', c: 'La segunda llave se decide antes de abrir un gráfico.' },
    { t: 'Sin un para qué, <em>todo parece oportunidad.</em>', c: 'Cada movimiento llama. Cada idea ajena suena bien. Y se termina en todas partes a la vez.' },
    { t: 'Con un para qué, <em>casi todo sobra.</em>', c: 'Una dirección clara ordena lo demás: qué se mira, qué se deja pasar, cuándo se para.' },
    { t: 'No es la meta. <em>Es lo que te hace volver mañana.</em>', c: 'Las metas se cumplen o se caen. El propósito sigue ahí el día que algo sale mal.' },
    { t: 'Es la pieza <em>que sostiene a las otras.</em>', c: 'Sin ella, la disciplina cansa y la paciencia se acaba.' } ] },
  cuerpo: { n: '03', nombre: 'cuerpo', ordinal: 'la tercera', carpeta: '04-cuerpo', laminas: [
    { t: 'La disciplina <em>es una sola.</em>', c: 'La tercera llave se entrena lejos de la pantalla.' },
    { t: 'A las 5:00 nadie mira. <em>Se hace igual.</em>', c: 'Un día no cambia nada. La cuenta de los días, sí.' },
    { t: 'Aguantar <em>una más.</em>', c: 'El cuerpo aprende primero lo que la cabeza va a necesitar después: sostener la tensión sin soltar antes de tiempo.' },
    { t: 'Descansar <em>también es entrenar.</em>', c: 'Dormir, comer bien, parar. Una cabeza cansada decide peor que una que no sabe.' },
    { t: 'Quien sostiene una rutina <em>sostiene una decisión.</em>', c: 'Es el mismo músculo. Por eso aquí se habla de las dos cosas.' } ] },
  mentalidad: { n: '04', nombre: 'mentalidad', ordinal: 'la cuarta', carpeta: '05-mentalidad', laminas: [
    { t: 'Calma, <em>cuando todo se mueve.</em>', c: 'La cuarta llave es la que más se nota cuando falta.', estrecho: true },
    { t: 'Una pérdida no es un veredicto. <em>Es un dato.</em>', c: 'Se revisa, se anota y la fila sigue en pie.' },
    { t: 'La paciencia <em>se entrena antes.</em>', c: 'Cuando el precio se va, llega la prisa. Lo que la contiene se decidió con calma, mucho antes.' },
    { t: '«A veces la mejor operación también es <em>saber esperar.</em>»', c: 'Un día sin operar también es método.', cita: 'Cristian · en el canal' },
    { t: 'La cabeza fría se nota <em>en lo que no haces.</em>', c: 'No perseguir el precio. No desquitarse con el mercado. No doblar para recuperar.' } ] },
  educacion: { n: '05', nombre: 'educación', ordinal: 'la quinta', carpeta: '06-educacion', laminas: [
    { t: 'Entender <em>el porqué.</em>', c: 'La quinta llave es la que vuelve tuyas las otras cuatro.' },
    { t: 'Una señal dice qué hacer. <em>El porqué dice cuándo no.</em>', c: 'Por eso en el canal cada idea va con lo que la invalida.' },
    { t: 'Se aprende <em>por capas.</em>', c: 'Primero el concepto. Después el criterio. Al final, la calma de saber qué estás mirando.' },
    { t: 'Preguntar <em>es parte del método.</em>', c: 'Una duda dicha en voz alta les sirve a todos los que no se atrevieron a decirla.' },
    { t: 'El día que entiendes por qué, <em>dejas de depender de quien te dice qué.</em>', c: 'Para eso enseña una comunidad: para que leas por tu cuenta.' } ] },
};
const d = P[pilar]; if (!d) throw new Error('pilar desconocido: ' + pilar);
const riel = (n) => `<footer class="riel"><span class="riel__marca">${leon}The Golden Syndicate</span><span class="riel__dato"><b>${String(n).padStart(2, '0')}</b> / 06</span></footer>`;
const llave = `<p class="llave"><b>${d.n}</b>${d.nombre}</p>`;
const L = d.laminas.map((l, i) => i === 0
  ? `<div class="cabeza"${l.estrecho ? ' style="max-width:74%"' : ''}>${llave}<h1 class="titular ${l.estrecho ? '' : 'titular--xl'}" style="margin-top:calc(-24 * var(--u))">${l.t}</h1><p class="cuerpo">${l.c}</p></div><span class="desliza" style="margin-top:auto;margin-bottom:calc(40 * var(--u))">Desliza</span>`
  : `<div class="cabeza">${llave}<h2 class="titular ${l.t.length > 78 ? 'titular--s' : 'titular--m'}" style="margin-top:calc(-30 * var(--u))">${l.t}</h2>${l.cita ? `<p class="rotulo" style="margin-top:calc(-8 * var(--u))">${l.cita}</p>` : ''}<p class="cuerpo">${l.c}</p></div>`);
L.push(`<div class="cabeza"><h2 class="titular titular--m">${d.nombre[0].toUpperCase() + d.nombre.slice(1)} es ${d.ordinal} llave. <em>Hay cuatro más.</em></h2><p class="rotulo" style="letter-spacing:.1em;font-size:calc(21 * var(--u));white-space:nowrap">dinero · propósito · cuerpo · mentalidad · educación</p><span class="pastilla">Entrar gratis · enlace en la bio</span><p class="descargo" style="max-width:31em;color:#A8A293;margin-top:calc(6 * var(--u))">${DESCARGO}</p></div>`);

const salida = path.join(aqui, d.carpeta); fs.rmSync(salida, { recursive: true, force: true }); fs.mkdirSync(salida, { recursive: true });
const FUENTES = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">';
for (let i = 0; i < L.length; i++) {
  await sharp(path.join(teselas, `tesela-${i}.png`)).jpeg({ quality: 93, chromaSubsampling: '4:4:4' }).toFile(path.join(salida, `escena-${i + 1}.jpg`));
  fs.writeFileSync(path.join(salida, `lamina-${i + 1}.html`), `<!-- @dsCard group="Carrusel · ${d.nombre}" name="Lámina ${i + 1}" -->
<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${d.nombre} · ${i + 1}/6</title>${FUENTES}<style>${css}</style></head>
<body><main class="lienzo"><div class="hoja hoja--escena" style="--escena:url('escena-${i + 1}.jpg')">${L[i]}${riel(i + 1)}</div></main></body></html>`);
}
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const pngs = [];
for (let i = 1; i <= L.length; i++) { const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 }); await p.goto('file://' + path.join(salida, `lamina-${i}.html`), { waitUntil: 'networkidle0' }); await p.evaluateHandle('document.fonts.ready'); const f = path.join(salida, `${pilar}-${String(i).padStart(2, '0')}.png`); await p.screenshot({ path: f }); pngs.push(f); await p.close(); }
await b.close();
const w = 540, h = 675; const c = await Promise.all(pngs.map(async (f, k) => ({ input: await sharp(f).resize(w, h).toBuffer(), left: (k % 3) * (w + 8), top: Math.floor(k / 3) * (h + 8) })));
await sharp({ create: { width: 3 * (w + 8) - 8, height: 2 * (h + 8) - 8, channels: 3, background: '#222' } }).composite(c).jpeg({ quality: 86 }).toFile(path.join(salida, '00-hoja-de-contacto.jpg'));
console.log('  6 láminas en', path.relative(process.cwd(), salida));
