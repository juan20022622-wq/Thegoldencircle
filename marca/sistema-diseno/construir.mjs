/* Construye el sistema de publicaciones de The Golden Syndicate.
   ---------------------------------------------------------------------------
   Fuente única: fuente/sistema.css + las plantillas de este archivo.
   Salida: plantillas/*.html y fundamentos/*.html, cada una autocontenida (CSS
   y símbolo dentro), con la marca @dsCard en la primera línea para que Claude
   Design las indexe como tarjetas del sistema.

       node marca/sistema-diseno/construir.mjs
   --------------------------------------------------------------------------- */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '../..');
const css = fs.readFileSync(path.join(aqui, 'fuente/sistema.css'), 'utf8');
const svgFuente = fs.readFileSync(path.join(raiz, 'web/assets/img/simbolo.svg'), 'utf8');
const trazos = svgFuente.slice(svgFuente.indexOf('<g id="leon"'), svgFuente.lastIndexOf('</g>') + 4).replace(' id="leon"', '');

const leon = (clase = 'leon', grosor = 2) =>
  `<svg class="${clase}" viewBox="391 475 250 393" fill="none" stroke="currentColor" stroke-width="${grosor}" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${trazos}</svg>`;

const riel = (dato = '') => `<footer class="riel"><span class="riel__marca">${leon('riel__leon leon', 1.6)}The Golden Syndicate</span><span class="riel__dato">${dato}</span></footer>`;

const DESCARGO = 'El trading conlleva riesgo de pérdida. Contenido educativo; no constituye asesoría de inversión. Los resultados pasados no garantizan resultados futuros. Opera solo con capital que puedas permitirte perder.';

/* ---- el gráfico: baja a la zona, amaga y pierde el nivel. Nunca sube. ---- */
function grafico() {
  const W = 1080, H = 520, n = 26, paso = W / (n + 1);
  /* cierres a mano: descenso, tres toques a la zona, ruptura */
  const c = [120,138,128,160,178,170,204,232,222,260,300,322,300,272,290,326,304,282,300,330,312,300,338,372,404,436];
  let velas = '', prev = 104;
  c.forEach((y, i) => {
    const x = paso * (i + 1), arriba = Math.min(prev, y), alto = Math.max(8, Math.abs(y - prev));
    const mecha = 14 + ((i * 7) % 11);
    const oro = i === 21; const baja = y > prev;
    velas += `<g class="vela ${oro ? 'vela--oro' : baja ? 'vela--llena' : 'vela--hueca'}"><line x1="${x}" x2="${x}" y1="${arriba - mecha}" y2="${arriba + alto + mecha * 0.8}"/><rect x="${x - 9}" y="${arriba}" width="18" height="${alto}"/></g>`;
    prev = y;
  });
  return `<svg class="grafico" viewBox="0 0 ${W} ${H}" aria-hidden="true">
    <rect class="zona" x="0" y="292" width="${W}" height="52"/>
    <line class="linea" x1="0" x2="${W}" y1="352" y2="352"/>
    ${velas}
    <text x="96" y="280">Zona</text><text x="96" y="388">Lo que invalida la idea</text>
  </svg>`;
}

/* ---------------------------------------------------------------------------
   PLANTILLAS · [archivo, grupo, nombre, formato, html]
   formato: '' = 4:5 (1080×1350) · 'vertical' = 9:16 (1080×1920) · 'cuadro' = 1:1
   --------------------------------------------------------------------------- */
const P = [];
const pieza = (archivo, grupo, nombre, formato, html) => P.push({ archivo, grupo, nombre, formato, html });

pieza('01-frase', 'Publicaciones', 'Frase · negro', '', `
<div class="hoja">
  <div class="centro">
    <p class="cita">Recuerden que no se trata de operar más… <em>se trata de operar mejor.</em></p>
    <div class="nivel nivel--corta"></div>
    <p class="rotulo">Cristian · en el canal</p>
  </div>
  ${riel('Mentalidad')}
</div>`);

pieza('02-frase-hueso', 'Publicaciones', 'Frase · hueso', '', `
<div class="hoja hoja--hueso">
  <div class="centro">
    <p class="cita">Una operación que no tomas por falta de confirmación <em>nunca será una pérdida.</em></p>
    <div class="nivel nivel--corta"></div>
    <p class="rotulo">Cristian · en el canal</p>
  </div>
  ${riel('Mentalidad')}
</div>`);

pieza('03-carrusel-portada', 'Carrusel', 'Portada', '', `
<div class="hoja">
  <div class="centro">
    <h1 class="titular titular--xl">El stop<br>no se<br>mueve.</h1>
  </div>
  <div class="nivel"><span class="nivel__eje">Invalidación</span></div>
  <div class="abajo">
    <p class="cuerpo">Es el precio al que la idea deja de ser cierta. No el precio al que ya duele.</p>
    <span class="desliza">Desliza</span>
  </div>
  ${riel('<b>01</b> / 07')}
</div>`);

pieza('04-carrusel-interior', 'Carrusel', 'Interior', '', `
<div class="hoja">
  <div class="arriba"><span class="numero">03</span><span class="rotulo">El stop no se mueve</span></div>
  <div class="centro">
    <h2 class="titular titular--m">Se pone <em>antes</em> de entrar.</h2>
    <p class="cuerpo">Con la cabeza fría y el gráfico delante. Una vez dentro ya no decides igual: decides con la operación abierta encima.</p>
  </div>
  <div class="carril"><i style="width:42.8%"></i></div>
  ${riel('<b>03</b> / 07')}
</div>`);

pieza('05-carrusel-cierre', 'Carrusel', 'Cierre con entrada', '', `
<div class="hoja">
  <div class="centro">
    <h2 class="titular titular--m">En el canal, cada idea va con lo que la invalida.</h2>
    <p class="cuerpo">La apertura sale a las 7:00, cada día de mercado. Se entra gratis, sin tarjeta y sin cuenta de broker.</p>
    <span class="pastilla">Entrar gratis · enlace en la bio</span>
  </div>
  <p class="descargo">${DESCARGO}</p>
  <div class="carril"><i style="width:100%"></i></div>
  ${riel('<b>07</b> / 07')}
</div>`);

pieza('06-mensaje-del-canal', 'Publicaciones', 'Mensaje del canal · ejemplo', '', `
<div class="hoja">
  <div class="abajo" style="margin-bottom:calc(56 * var(--u))">
    <h2 class="titular titular--s">Así se lee un mensaje del canal.</h2>
    <p class="cuerpo">El nivel va tapado a propósito. Lo que se enseña es el porqué.</p>
  </div>
  <dl class="mensaje">
    <span class="sello">Ejemplo</span>
    <div class="mensaje__fila"><dt>Par</dt><dd>XAUUSD</dd></div>
    <div class="mensaje__fila"><dt>Dirección</dt><dd>Venta</dd></div>
    <div class="mensaje__fila"><dt>Zona</dt><dd><i class="tapado"></i></dd></div>
    <div class="mensaje__fila"><dt>Stop</dt><dd><i class="tapado" style="width:calc(150 * var(--u))"></i></dd></div>
    <div class="mensaje__fila"><dt>Objetivo</dt><dd><i class="tapado" style="width:calc(180 * var(--u))"></i></dd></div>
    <p class="mensaje__porque"><b>Por qué:</b> tercer rechazo en la misma zona, con volumen bajando. <b>Qué la invalida:</b> un cierre de vela por encima de la zona.</p>
  </dl>
  ${riel('El canal')}
</div>`);

pieza('07-agenda', 'Publicaciones', 'Agenda del día · azul noche', '', `
<div class="hoja hoja--noche">
  <div class="arriba"><span class="rotulo rotulo--oro">Hora de Bogotá</span><span class="rotulo">Ejemplo</span></div>
  <div class="centro">
    <h2 class="titular titular--m">Hoy sale esto.<br>Antes del gráfico, la agenda.</h2>
    <ul class="agenda">
      <li><time>07:30</time><span>IPC de Estados Unidos</span><small>Alto</small></li>
      <li><time>09:00</time><span>Confianza del consumidor</span><small>Medio</small></li>
      <li><time>13:00</time><span>Habla un miembro de la Fed</span><small>Medio</small></li>
    </ul>
    <p class="cuerpo">Si no sabes qué sale hoy, no sabes qué estás operando.</p>
  </div>
  ${riel('Mercado')}
</div>`);

pieza('08-cinco-llaves', 'Publicaciones', 'Las cinco llaves', '', `
<div class="hoja">
  <div class="centro">
    <ul class="llaves">
      <li><span>01</span>dinero</li>
      <li><span>02</span>propósito</li>
      <li data-activa><span>03</span>cuerpo</li>
      <li><span>04</span>mentalidad</li>
      <li><span>05</span>educación</li>
    </ul>
    <p class="cuerpo cuerpo--claro">Quien no aguanta una repetición más tampoco aguanta esperar la confirmación.</p>
  </div>
  ${riel('Las cinco llaves')}
</div>`);

pieza('09-vida-foto', 'Publicaciones', 'Vida · foto con texto', '', `
<div class="hoja hoja--foto">
  <div class="foto"></div>
  <div class="foto__hueco">Foto · luz dura, sombras profundas<br>gimnasio · escritorio · calle<br>sin filtro dorado, sin objetos de lujo</div>
  <div class="velo">
    <div class="abajo">
      <p class="rotulo rotulo--oro">05:00</p>
      <h2 class="titular titular--m">La disciplina es una sola.</h2>
    </div>
    ${riel('Cuerpo')}
  </div>
</div>`);

pieza('10-metodo-grafico', 'Publicaciones', 'Método · gráfico que no sube', '', `
<div class="hoja">
  <h2 class="titular titular--m">Esta entrada era <em>una trampa.</em></h2>
  <div style="margin-block:auto">${grafico()}</div>
  <div class="abajo">
    <p class="cuerpo">Parecía compra en la zona. El tercer toque llegó sin fuerza y el cierre por debajo la tumbó. Ilustración del método: sin precios y sin resultados.</p>
  </div>
  ${riel('Método')}
</div>`);

pieza('11-portada-reel', 'Vertical 9:16', 'Portada de reel', 'vertical', `
<div class="hoja hoja--vertical guias">
  <div class="centro">
    <p class="rotulo rotulo--oro">Método</p>
    <h1 class="titular titular--xl">Por qué<br>no entré.</h1>
    <div class="nivel"><span class="nivel__eje">Faltó confirmación</span></div>
    <p class="cuerpo cuerpo--claro">Y el precio sí llegó a la zona.</p>
  </div>
  ${riel('Reel')}
</div>`);

pieza('12-historia-apertura', 'Vertical 9:16', 'Historia fija de las 7:00', 'vertical', `
<div class="hoja hoja--vertical">
  <p class="rotulo">Cada día de mercado</p>
  <div class="centro">
    <p class="hora">7<i>:</i>00</p>
    <h2 class="titular titular--m">Ya está la apertura en el canal.</h2>
    <p class="cuerpo">Agenda, contexto y la regla del día. Antes de que abra el mercado.</p>
    <div class="enlace-aqui">Aquí va el sticker de enlace · «Entrar gratis»</div>
  </div>
  ${riel('Apertura')}
</div>`);

pieza('13-historia-frase', 'Vertical 9:16', 'Historia · frase', 'vertical', `
<div class="hoja hoja--vertical hoja--hueso">
  <div class="centro">
    <p class="cita">A veces la mejor operación también es <em>saber esperar.</em></p>
    <div class="nivel nivel--corta"></div>
    <p class="rotulo">Cristian · en el canal</p>
  </div>
  ${riel('Mentalidad')}
</div>`);

const DESTACADAS = ['Empieza aquí', 'Método', 'Las 5 llaves', 'El canal', 'Rutina', 'Preguntas'];
pieza('14-destacadas', 'Marca', 'Portadas de destacadas', 'cuadro', `
<div class="hoja" style="padding:calc(72 * var(--u))">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:calc(56 * var(--u)) calc(44 * var(--u));margin-block:auto">
    ${DESTACADAS.map((n, i) => `<div style="display:grid;gap:calc(20 * var(--u));justify-items:center;text-align:center"><div class="disco">${i === 0 ? leon('leon', 1.8).replace('<svg ', '<svg style="height:58%" ') : `<span class="cifra" style="font-size:calc(84 * var(--u));color:var(--oro)">${String(i).padStart(2, '0')}</span>`}</div><span class="rotulo" style="font-size:calc(19 * var(--u));letter-spacing:.12em">${n}</span></div>`).join('')}
  </div>
</div>`);

pieza('15-avatar', 'Marca', 'Avatar', 'cuadro', `
<div class="hoja" style="padding:0;display:grid;place-items:center">
  ${leon('leon', 3).replace('<svg ', '<svg style="height:58%" ')}
  <div style="position:absolute;inset:0;border-radius:50%;border:1px dashed rgba(210,166,75,.35)"></div>
</div>`);

/* ---------------------------------------------------------------------------
   FUNDAMENTOS · tarjetas de color, tipografía, retícula y motivo
   --------------------------------------------------------------------------- */
const COLORES = [['Negro base', '#0A0A0B', 'Fondo por defecto. Dos de cada tres piezas.'], ['Superficie', '#121214', 'Tarjetas sobre negro.'], ['Azul noche', '#04141D', 'Solo la serie de mercado y agenda.'], ['Oro', '#D2A64B', 'Acento. Plano, nunca degradado.'], ['Oro claro', '#E7C67F', 'Destacado dentro de texto sobre negro.'], ['Oro profundo', '#8C6A22', 'El acento cuando el fondo es hueso.'], ['Hueso', '#F2EDE3', 'Texto sobre oscuro y fondo de la pieza clara.'], ['Gris cálido', '#8A8578', 'Texto secundario y rótulos.']];

pieza('f1-color', 'Colores', 'Paleta', 'cuadro', `
<div class="hoja" style="padding:calc(64 * var(--u))">
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:calc(20 * var(--u));margin-block:auto">
  ${COLORES.map(([n, h, u]) => `<div style="display:grid;grid-template-columns:calc(120 * var(--u)) 1fr;gap:calc(22 * var(--u));align-items:center"><i style="display:block;aspect-ratio:1;background:${h};border:1px solid var(--borde-tenue);border-radius:calc(10 * var(--u))"></i><div><b style="font-weight:500;font-size:calc(28 * var(--u))">${n}</b><br><span class="cifra" style="font-size:calc(22 * var(--u));color:var(--oro)">${h}</span><br><span style="font-size:calc(19 * var(--u));color:var(--gris);line-height:1.35;display:block">${u}</span></div></div>`).join('')}
  </div>
</div>`);

pieza('f2-tipografia', 'Tipografía', 'Manrope + IBM Plex Mono', 'cuadro', `
<div class="hoja" style="padding:calc(72 * var(--u))">
  <p class="rotulo rotulo--oro">Manrope 500 · titulares</p>
  <p class="titular" style="margin:calc(12 * var(--u)) 0 calc(36 * var(--u))">Operar mejor,<br>no operar más.</p>
  <p class="rotulo rotulo--oro">Manrope 300 · lectura</p>
  <p class="cuerpo" style="margin:calc(12 * var(--u)) 0 calc(36 * var(--u))">Frases cortas. Verbos concretos. Se explica el porqué, no solo el qué.</p>
  <p class="rotulo rotulo--oro">IBM Plex Mono 400 · rótulos, horas, contadores</p>
  <p class="cifra" style="font-size:calc(64 * var(--u));margin:calc(12 * var(--u)) 0 0">07:00 · XAUUSD · 03 / 07</p>
  ${riel('Tipografía')}
</div>`);

pieza('f3-reticula', 'Retícula', 'Márgenes y zonas seguras', '', `
<div class="hoja" style="padding:0">
  <div style="position:absolute;inset:calc(96 * var(--u));border:1px dashed rgba(210,166,75,.55)"></div>
  <div style="position:absolute;inset:0 calc(33.75 * var(--u));border-inline:1px solid rgba(242,237,227,.25)"></div>
  <div style="position:absolute;left:0;right:0;top:calc(135 * var(--u));height:calc(1080 * var(--u));border-block:1px dotted rgba(242,237,227,.3)"></div>
  <div style="position:absolute;inset:calc(96 * var(--u));padding:calc(40 * var(--u));display:flex;flex-direction:column;gap:calc(20 * var(--u));font-family:var(--mono);font-size:calc(21 * var(--u));letter-spacing:.08em;color:var(--gris);line-height:1.7">
    <span style="color:var(--oro)">1080 × 1350 · 4:5</span>
    <span>— discontinua oro: margen de 96. Todo el texto vive dentro.</span>
    <span>— líneas verticales: recorte 3:4 de la cuadrícula del perfil.</span>
    <span>— punteadas: cuadrado central 1080 × 1080. El titular de una portada cabe aquí.</span>
    <span style="margin-top:auto">— abajo, siempre, el riel: símbolo, nombre y dato de la serie.</span>
  </div>
</div>`);

pieza('f4-motivo', 'Marca', 'La línea de invalidación', '', `
<div class="hoja">
  <div class="centro">
    <h2 class="titular titular--m">El motivo de la marca es una línea.</h2>
    <p class="cuerpo">Una discontinua de oro con su etiqueta de eje: el nivel donde la idea deja de ser cierta. Una por pieza, nunca dos. Cruza de borde a borde o se queda corta bajo una cita.</p>
  </div>
  <div class="nivel"><span class="nivel__eje">Invalidación</span></div>
  <div class="abajo"><div class="nivel nivel--corta" style="margin-block:0 calc(24 * var(--u))"></div><p class="rotulo">Versión corta · bajo una cita</p></div>
  ${riel('Motivo')}
</div>`);

/* ---------------------------------------------------------------------------
   ESCRITURA
   --------------------------------------------------------------------------- */
const FUENTES = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">';
const medidas = { '': [1080, 1350], vertical: [1080, 1920], cuadro: [1080, 1080] };

for (const d of ['plantillas', 'fundamentos']) { fs.rmSync(path.join(aqui, d), { recursive: true, force: true }); fs.mkdirSync(path.join(aqui, d)); }

const indice = [];
for (const p of P) {
  const carpeta = p.archivo.startsWith('f') ? 'fundamentos' : 'plantillas';
  const [w, h] = medidas[p.formato];
  const html = `<!-- @dsCard group="${p.grupo}" name="${p.nombre}" -->
<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.nombre} · The Golden Syndicate</title>
<meta name="gs:formato" content="${w}x${h}">
${FUENTES}
<style>
${css}</style></head>
<body>
<main class="lienzo${p.formato ? ' lienzo--' + p.formato : ''}">${p.html}
</main>
</body></html>
`;
  fs.writeFileSync(path.join(aqui, carpeta, p.archivo + '.html'), html);
  indice.push({ ruta: `${carpeta}/${p.archivo}.html`, grupo: p.grupo, nombre: p.nombre, ancho: w, alto: h });
}

fs.writeFileSync(path.join(aqui, 'tokens.json'), JSON.stringify({
  marca: 'The Golden Syndicate',
  color: Object.fromEntries(COLORES.map(([n, h, u]) => [n, { hex: h, uso: u }])),
  tipografia: { leer: { familia: 'Manrope', pesos: [300, 400, 500, 600], origen: 'Google Fonts' }, mono: { familia: 'IBM Plex Mono', pesos: [400, 500], origen: 'Google Fonts' } },
  lienzo: { publicacion: '1080x1350', vertical: '1080x1920', cuadro: '1080x1080', margen: 96 },
  escala: { 'titular-xl': 132, titular: 104, 'titular-m': 80, 'titular-s': 60, cita: 76, 'cita-larga': 58, cuerpo: 36, rotulo: 24, descargo: 24, minimo: 19, 'escala-vertical': 1.17 },
  piezas: indice,
}, null, 2));

console.log(`  ${indice.length} tarjetas · ${indice.filter(i => i.ruta.startsWith('plantillas')).length} plantillas y ${indice.filter(i => i.ruta.startsWith('fundamentos')).length} fundamentos`);
