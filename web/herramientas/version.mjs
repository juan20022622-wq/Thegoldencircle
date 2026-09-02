/* Sube la versión de los assets en TODAS las páginas.
   Uso:  node web/herramientas/version.mjs

   Por qué existe: los archivos de assets/ no llevan hash, así que sus URLs van
   versionadas a mano. Hacerlo a mano falla — durante varios despliegues
   index.html iba en v=7 mientras gracias, privacidad e ir seguían en v=5, y esas
   tres comparten el mismo CSS y el mismo JS. Quien tuviera una en caché
   ejecutaba código viejo.

   Este script no busca un número concreto: busca cualquier ?v=N, coge el más
   alto que encuentre, le suma uno y lo pone en las cuatro. */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const paginas = fs.readdirSync(web).filter((f) => f.endsWith('.html'));

let alto = 0;
const leidas = paginas.map((p) => {
  const texto = fs.readFileSync(path.join(web, p), 'utf8');
  for (const m of texto.matchAll(/\?v=(\d+)/g)) alto = Math.max(alto, Number(m[1]));
  return { p, texto };
});

const nueva = alto + 1;

for (const { p, texto } of leidas) {
  const salida = texto.replace(/\?v=\d+/g, '?v=' + nueva);
  if (salida !== texto) fs.writeFileSync(path.join(web, p), salida);
  const n = (texto.match(/\?v=\d+/g) || []).length;
  console.log(`  ${p.padEnd(18)} ${n} referencia${n === 1 ? '' : 's'}`);
}

console.log(`\nassets a v=${nueva} en las ${paginas.length} páginas`);
