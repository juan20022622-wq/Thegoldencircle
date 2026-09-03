/* Genera assets/img/og.jpg — la vista previa del enlace al compartirlo.
   Uso:  npx -y -p sharp node web/herramientas/og.mjs

   Es la primera impresión del sitio en WhatsApp y en Telegram, que es por donde
   va a circular. Sin ella el enlace sale como una tarjeta vacía.

   Se dibuja como SVG y se rasteriza con sharp. La tipografía es del sistema:
   Avenir Next para el texto y Menlo para el rótulo, que es lo más cerca de
   Manrope e IBM Plex Mono que hay sin instalar fuentes en la máquina. A tamaño
   de vista previa la diferencia no se ve.

   La regla del gráfico también manda aquí: no hay ninguna línea que suba. */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const web = process.argv[2] || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* El símbolo se reusa tal cual; solo se le fija el color, que en el archivo va
   como currentColor porque en la página lo hereda. */
const simbolo = fs.readFileSync(path.join(web, 'assets/img/simbolo.svg'), 'utf8')
  .replace(/^[\s\S]*?<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="aliento" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#D2A64B" stop-opacity="0.10"/>
      <stop offset="0.55" stop-color="#D2A64B" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#0A0A0B"/>
  <rect width="1200" height="630" fill="url(#aliento)"/>

  <g transform="translate(1010 315) scale(1.02) translate(-516 -671)"
     fill="none" stroke="#D2A64B" stroke-opacity="0.5" stroke-width="2"
     stroke-linejoin="round" stroke-linecap="round">
    ${simbolo}
  </g>

  <text x="72" y="118" fill="#D2A64B" font-family="Menlo, monospace"
        font-size="19" letter-spacing="4.4">THE GOLDEN SYNDICATE</text>

  <g font-family="Avenir Next, Helvetica Neue, sans-serif" font-weight="500" font-size="62">
    <text x="72" y="268" fill="#F2EDE3">No se trata</text>
    <text x="72" y="344" fill="#F2EDE3">de operar más.</text>
    <text x="72" y="420" fill="#D2A64B">Se trata de operar mejor.</text>
  </g>

  <text x="72" y="536" fill="#8A8578" font-family="Avenir Next, Helvetica Neue, sans-serif"
        font-size="21">Club de trading de oro · Canal de Telegram gratuito</text>

  <text x="72" y="576" fill="#6F6B60" font-family="Avenir Next, Helvetica Neue, sans-serif"
        font-size="16">El trading conlleva riesgo de pérdida. Contenido educativo, no asesoría de inversión.</text>
</svg>`;

const destino = path.join(web, 'assets/img/og.jpg');
await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(destino);

const kb = fs.statSync(destino).size / 1024;
console.log(`  og.jpg  1200x630  ${kb.toFixed(0)} KB`);
