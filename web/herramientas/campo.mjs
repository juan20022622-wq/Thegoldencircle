/* Campo de velas del fondo · v2
   El v1 producía cuerpos de 1 px: dos velas seguidas casi no diferían, así que
   el campo entero era invisible. Aquí la frecuencia del oscilador sube y el
   cuerpo tiene un mínimo real.

   Sigue sin tendencia: oscila, no sube. Un gráfico ascendente en una landing de
   trading es una promesa de rentabilidad dibujada, y esta regla también vale
   para la decoración. */

function capa(semilla, n, alto, ancho) {
  const paso = ancho / n;
  let y = alto / 2;
  let out = '';
  for (let i = 0; i < n; i++) {
    const t = (i + semilla) * 0.95;
    const d = Math.sin(t) * 0.55 + Math.sin(t * 0.37 + semilla) * 0.45;
    const prev = y;
    y = alto / 2 + d * alto * 0.34;
    const arriba = Math.min(prev, y);
    const cuerpo = Math.max(10, Math.abs(y - prev));
    const cx = i * paso + paso / 2;
    const mecha = 8 + ((i * 7 + semilla) % 5) * 5;
    out += `      <line x1="${cx.toFixed(1)}" y1="${(arriba - mecha).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${(arriba + cuerpo + mecha).toFixed(1)}"/>\n`;
    out += `      <rect x="${(cx - paso * 0.2).toFixed(1)}" y="${arriba.toFixed(1)}" width="${(paso * 0.4).toFixed(1)}" height="${cuerpo.toFixed(1)}" rx="1.5"/>\n`;
  }
  return out;
}

const A = 1600, H = 900;

function svg(semilla, n) {
  const marcas = capa(semilla, n, H, A);
  return `<svg class="marea__svg" viewBox="0 0 ${A} ${H}" preserveAspectRatio="none" aria-hidden="true" focusable="false">\n${marcas}    </svg>`;
}

const lejos = svg(0, 76);
const cerca = svg(11, 46);

console.log(`<div class="ambiente" aria-hidden="true">
  <div class="ambiente__aliento"></div>
  <div class="marea marea--lejos">${lejos}${lejos}</div>
  <div class="marea marea--cerca">${cerca}${cerca}</div>
  <div class="ambiente__velo"></div>
</div>`);
