/* Gráfico de velas del héroe · v2
   Cambio respecto de v1: los rótulos salen del SVG. El texto dentro de un SVG
   escala con el viewBox, y a 390 px de ancho 9px se convierten en 6,6px reales.
   Ahora el SVG solo dibuja marcas y los rótulos son HTML sobre la figura.

   Reglas que manda el proyecto:
   - No sube. Un gráfico ascendente en una landing de trading es una promesa de
     rentabilidad dibujada. Este lateraliza y pierde el nivel.
   - Lo que se destaca no es una ganancia: es dónde se invalida la idea. */

const N = 24;
const W = 480, H = 240;
const PAD = { t: 18, b: 18, l: 6, r: 6 };

const cierres = [
  48, 51, 49, 54, 57, 55, 60, 63, 61, 66, 69, 67,
  71, 68, 72, 69, 73, 70, 72, 68, 64, 61, 58, 55
];

const velas = cierres.map((c, i) => {
  const a = i === 0 ? 47 : cierres[i - 1];
  const alto = Math.max(a, c), bajo = Math.min(a, c);
  return {
    a, c,
    alta: alto + 1.5 + ((i * 7) % 5) * 0.6,
    baja: bajo - 1.5 - ((i * 5) % 4) * 0.7,
    sube: c >= a
  };
});

const min = Math.min(...velas.map(v => v.baja)) - 2;
const max = Math.max(...velas.map(v => v.alta)) + 2;

const anchoUtil = W - PAD.l - PAD.r;
const altoUtil = H - PAD.t - PAD.b;
const paso = anchoUtil / N;
const cuerpo = Math.min(11, paso * 0.6);

const y = v => PAD.t + (max - v) / (max - min) * altoUtil;
const x = i => PAD.l + paso * i + paso / 2;

const NIVEL = 63;
const IDEA = 16;

const yNivel = y(NIVEL);
const yIdea = y(velas[IDEA].alta) - 10;

let marcas = '';
velas.forEach((v, i) => {
  const clase = i === IDEA ? 'vela vela--idea' : i > 19 ? 'vela vela--fuera' : 'vela';
  const cx = x(i);
  const arriba = Math.min(y(v.a), y(v.c));
  const alto = Math.max(1.5, Math.abs(y(v.c) - y(v.a)));
  marcas += `        <g class="${clase}" style="--i:${i}">\n`;
  marcas += `          <line x1="${cx.toFixed(1)}" y1="${y(v.alta).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${y(v.baja).toFixed(1)}"></line>\n`;
  marcas += `          <rect x="${(cx - cuerpo / 2).toFixed(1)}" y="${arriba.toFixed(1)}" width="${cuerpo.toFixed(1)}" height="${alto.toFixed(1)}" rx="1"${v.sube ? '' : ' class="hueca"'}></rect>\n`;
  marcas += `        </g>\n`;
});

/* Posiciones en porcentaje para colgar los rótulos HTML encima. */
const pctNivel = (yNivel / H * 100).toFixed(2);
const pctIdea = (yIdea / H * 100).toFixed(2);
const pctIdeaX = (x(IDEA) / W * 100).toFixed(2);

const html = `<figure class="heroe__grafico revelar" style="--retraso:1040ms">
      <div class="grafico__caja" style="--y-nivel:${pctNivel}%; --y-idea:${pctIdea}%; --x-idea:${pctIdeaX}%">
        <svg class="grafico" viewBox="0 0 ${W} ${H}" role="img"
             aria-label="Gráfico de velas ilustrativo: el precio sube, es rechazado tres veces en la misma zona y termina perdiendo el nivel marcado como invalidación.">
          <g class="grafico__velas">
${marcas}          </g>
          <line class="nivel__linea" x1="${PAD.l}" y1="${yNivel.toFixed(1)}" x2="${(W - PAD.r).toFixed(1)}" y2="${yNivel.toFixed(1)}"></line>
          <circle class="marca__punto" cx="${x(IDEA).toFixed(1)}" cy="${yIdea.toFixed(1)}" r="4"></circle>
        </svg>

        <p class="rotulo rotulo--nivel"><span>Invalidación</span> Si cierra debajo, la idea ya no sirve</p>
        <p class="rotulo rotulo--idea">Tercer rechazo en la misma zona</p>
      </div>
      <figcaption>Ilustración del método. No es una señal: sin precios y sin resultados.</figcaption>
    </figure>`;

console.log(html);
