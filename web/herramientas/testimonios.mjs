/* Recorta y convierte las capturas de testimonios.

   Con sharp el recorte es esquina + tamaño, sin ambigüedad. sips recorta
   centrado y su --cropOffset se mide desde el centro; calcularlo a mano es de
   donde salían los encuadres torcidos.

   Las coordenadas se miden sobre una vista previa cuyo lado mayor son 500 px:
   `sips -Z 500 origen.jpeg --out vista.jpg`. */

import sharp from 'sharp';   // npx -y -p sharp node web/herramientas/testimonios.mjs <destino>
import fs from 'fs';
import os from 'os';

const D = os.homedir() + '/Downloads/WhatsApp Image 2026-09-01 at ';
const salida = process.argv[2] || new URL('../assets/img/testimonios', import.meta.url).pathname;
const RATIO = 3 / 4;

/* nombre · archivo · [x0, y0, x1, y1] sobre la vista previa de 500 */
export const piezas = [
  ['lotaje',       '02.53.48 (4)', [ 20, 105, 296, 468]],
  ['flotante',     '02.53.49 (1)', [ 30,   0, 306, 368]],
  ['tp-4-minutos', '02.53.48 (3)', [ 52,  72, 338, 454]],
  ['perdedora',    '02.53.48 (2)', [ 38, 158, 263, 458]],
  ['zonas',        '02.53.49',     [ 12,   0, 222, 280]],
  ['historial-01', '02.53.50',     [ 58,  10, 283, 304]],
  ['historial-02', '02.53.49 (4)', [ 30,   5, 259, 310]],
  ['ventas',       '02.53.47',     [ 38, 152, 263, 448]],
  ['salidas',      '02.53.49 (2)', [ 33,   5, 258, 305]],
  ['posiciones',   '02.53.49 (3)', [ 33,   5, 258, 305]],
];

for (const [nombre, sufijo, [px0, py0, px1, py1]] of piezas) {
  const origen = D + sufijo + '.jpeg';
  const img = sharp(origen);
  const { width: W, height: H } = await img.metadata();
  const escala = Math.max(W, H) / 500;

  let top    = Math.round(py0 * escala);
  let height = Math.round((py1 - py0) * escala);
  let width  = Math.round(height * RATIO);
  let left   = Math.round(px0 * escala);

  /* Si la ventana se sale, se recorta el alto antes que descuadrar el encuadre. */
  if (left + width > W)  { left = W - width; }
  if (left < 0)          { width += left; left = 0; height = Math.round(width / RATIO); }
  if (top + height > H)  { top = Math.max(0, H - height); height = Math.min(height, H - top); width = Math.round(height * RATIO); }

  await sharp(origen)
    .extract({ left, top, width, height })
    .resize(600, 800, { fit: 'fill' })
    .webp({ quality: 78 })
    .toFile(`${salida}/${nombre}.webp`);

  const kb = fs.statSync(`${salida}/${nombre}.webp`).size / 1024;
  console.log(`  ${nombre.padEnd(14)} ${width}x${height} en (${left},${top}) de ${W}x${H}   ${kb.toFixed(0)} KB`);
}
