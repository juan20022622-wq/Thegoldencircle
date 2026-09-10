/* La landing de pauta · /entrar
   ---------------------------------------------------------------------------
   Meta revisa la página de destino de cada anuncio, y en categoría financiera
   un testimonio con cifra de retorno es motivo de rechazo y, repetido, de
   restricción de la cuenta. La página principal lleva esas capturas por
   decisión del cliente; los anuncios no pueden apuntar ahí.

   Este script genera entrar.html a partir de index.html quitando la sección de
   testimonios y marcándola noindex. Misma página en todo lo demás: mismo
   formulario (Netlify lo agrupa por nombre), mismo píxel, mismo evento Lead.
   main.js manda el campo "pagina", así que en Netlify se ve de cuál vino cada
   registro.

   Correr después de cualquier cambio en index.html:
       node web/herramientas/entrar.mjs
   --------------------------------------------------------------------------- */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let h = fs.readFileSync(path.join(web, 'index.html'), 'utf8');

/* 1 · fuera la sección de testimonios, entera */
const ini = h.indexOf('  <!-- TESTIMONIOS ·');
const fin = h.indexOf('  <!-- LA CONSOLA ·');
if (ini < 0 || fin < 0) throw new Error('no encuentro la sección de testimonios');
h = h.slice(0, ini) + h.slice(fin);

/* 2 · cabecera: noindex, canonical a la principal, título propio */
/* la principal ya trae una meta robots: se sustituye, no se añade otra */
h = h.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');
h = h.replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="https://thegoldensyndicate.com/entrar">');
h = h.replace('<title>The Golden Syndicate · El club donde nadie opera a ciegas</title>',
  '<title>Entra al club · The Golden Syndicate</title>');

/* 3 · del JSON-LD se conserva Organization y WebSite; el FAQ sobra en una página
   que no se indexa y cuya sección de dudas es idéntica a la principal */
h = h.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (m, json) => {
  const ld = JSON.parse(json);
  if (ld["@graph"]) ld["@graph"] = ld["@graph"].filter((n) => n["@type"] !== "FAQPage");
  return '<script type="application/ld+json">\n' + JSON.stringify(ld, null, 2) + '\n</script>';
});

/* 4 · una marca en el body para que el CSS pueda distinguirla si hace falta */
h = h.replace('<body>', '<body class="pauta">');

/* 5 · aviso al principio del archivo */
h = h.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- GENERADO por herramientas/entrar.mjs a partir de index.html. No editar a mano:\n     los cambios van en index.html y se vuelve a correr el script. -->');

fs.writeFileSync(path.join(web, 'entrar.html'), h);

const quedan = (h.match(/testimonios\//g) || []).length;
console.log(`  entrar.html · ${(h.length / 1024).toFixed(0)} KB · referencias a testimonios: ${quedan}`);
