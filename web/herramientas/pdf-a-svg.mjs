/* Conversor mínimo de un content stream de PDF a SVG.
   Cubre lo que usa este archivo: m l c h re, q/Q, cm, w, rg/RG, f/S/B.
   El PDF tiene el origen abajo a la izquierda y la y hacia arriba; SVG lo
   tiene arriba a la izquierda. Se resuelve con una matriz de volteo global. */

import fs from 'fs';

const ARCHIVO = process.argv[2];
const ANCHO = Number(process.argv[3] || 1080);
const ALTO = Number(process.argv[4] || 1350);

const txt = fs.readFileSync(ARCHIVO, 'latin1');
const fichas = txt.split(/\s+/).filter(Boolean);

const mul = (a, b) => [
  a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3],
  a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3],
  a[4] * b[0] + a[5] * b[2] + b[4], a[4] * b[1] + a[5] * b[3] + b[5]
];

const aplicar = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const n = v => Math.round(v * 100) / 100;

let ctm = [1, 0, 0, 1, 0, 0];
let trazoColor = '#000', rellenoColor = '#000', grosor = 1;
const pila = [];
let d = '';
const piezas = [];
const args = [];

const col = (r, g, b) => '#' + [r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');

for (const f of fichas) {
  const num = Number(f);
  if (!Number.isNaN(num) && /^[-.\d]/.test(f)) { args.push(num); continue; }

  switch (f) {
    case 'q': pila.push([ctm.slice(), trazoColor, rellenoColor, grosor]); break;
    case 'Q': { const e = pila.pop(); if (e) { ctm = e[0]; trazoColor = e[1]; rellenoColor = e[2]; grosor = e[3]; } break; }
    case 'cm': ctm = mul(args.slice(-6), ctm); break;
    case 'w': grosor = args[args.length - 1]; break;
    case 'RG': trazoColor = col(...args.slice(-3)); break;
    case 'rg': rellenoColor = col(...args.slice(-3)); break;
    case 'g': trazoColor = rellenoColor = col(args.at(-1), args.at(-1), args.at(-1)); break;
    case 'm': { const [x, y] = aplicar(ctm, args.at(-2), args.at(-1)); d += `M${n(x)} ${n(y)}`; break; }
    case 'l': { const [x, y] = aplicar(ctm, args.at(-2), args.at(-1)); d += `L${n(x)} ${n(y)}`; break; }
    case 'c': {
      const p = args.slice(-6);
      const a = aplicar(ctm, p[0], p[1]), b = aplicar(ctm, p[2], p[3]), c = aplicar(ctm, p[4], p[5]);
      d += `C${n(a[0])} ${n(a[1])} ${n(b[0])} ${n(b[1])} ${n(c[0])} ${n(c[1])}`;
      break;
    }
    case 'h': d += 'Z'; break;
    case 're': {
      const [x, y, w, h] = args.slice(-4);
      const e1 = aplicar(ctm, x, y), e2 = aplicar(ctm, x + w, y), e3 = aplicar(ctm, x + w, y + h), e4 = aplicar(ctm, x, y + h);
      d += `M${n(e1[0])} ${n(e1[1])}L${n(e2[0])} ${n(e2[1])}L${n(e3[0])} ${n(e3[1])}L${n(e4[0])} ${n(e4[1])}Z`;
      break;
    }
    case 'S': case 's':
      if (d) piezas.push({ d, trazo: trazoColor, relleno: 'none', grosor: grosor * Math.hypot(ctm[0], ctm[1]) });
      d = ''; break;
    case 'f': case 'f*': case 'F':
      if (d) piezas.push({ d, trazo: 'none', relleno: rellenoColor, grosor: 0 });
      d = ''; break;
    case 'B': case 'B*': case 'b':
      if (d) piezas.push({ d, trazo: trazoColor, relleno: rellenoColor, grosor: grosor * Math.hypot(ctm[0], ctm[1]) });
      d = ''; break;
    case 'n': d = ''; break;
  }
  if (!/^[-.\d]/.test(f)) args.length = 0;
}

const cuerpo = piezas.map(p =>
  `  <path d="${p.d}" fill="${p.relleno}" stroke="${p.trazo}"` +
  (p.grosor ? ` stroke-width="${n(p.grosor)}"` : '') +
  ` stroke-linejoin="round" stroke-linecap="round"/>`
).join('\n');

console.log(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${ALTO}">
<g transform="matrix(1 0 0 -1 0 ${ALTO})">
${cuerpo}
</g>
</svg>`);

console.error(`piezas: ${piezas.length} · colores de trazo: ${[...new Set(piezas.map(p => p.trazo))].join(', ')} · rellenos: ${[...new Set(piezas.map(p => p.relleno))].join(', ')}`);
