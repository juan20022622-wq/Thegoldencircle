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

/* 1 · fuera las secciones que no pasan la revisión de Meta. Se busca cada una
   por su comentario de apertura y se corta hasta la sección siguiente.
   - TESTIMONIOS: hasta el 2026-09-22 se dejaban cinco capturas "de método",
     pero revisadas de cerca todas enseñan resultado: "+77 ganancia", un
     historial casi todo en verde, "el precio se fue a la luna", un gráfico que
     sube hasta el objetivo. Además llevan el símbolo del broker (XAUUSDm), que
     es un CFD, y Meta prohíbe anunciar CFD en todo el mundo. En la principal
     se quedan; aquí no va ninguna.
   - SCANNER: un producto de pago que vigila "oro y bitcoin". Nombrar bitcoin con
     algo que se vende mete la página en la política de criptomonedas, que pide
     permiso por escrito. No aporta al único objetivo de esta página. */
const fuera = (marca) => {
  const ini = h.indexOf('  <!-- ' + marca);
  if (ini < 0) throw new Error('no encuentro la sección ' + marca);
  /* la sección siguiente, sea cual sea: los comentarios de dentro van más sangrados */
  const fin = h.indexOf('\n  <!-- ', ini + 10) + 1;
  if (fin <= 0) throw new Error('no encuentro el final de ' + marca);
  h = h.slice(0, ini) + h.slice(fin);
};
fuera('TESTIMONIOS ·');
fuera('EL SCANNER ·');

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

/* 3b · las dudas del scanner se van con el scanner (la que nombra el Step Index
   ya viene marcada data-pauta="no"), y nada puede quedar nombrando bitcoin */
h = h.replace(/\n\s*<details class="pregunta"[^>]*>\s*<summary>[^<]*[Ss]canner[\s\S]*?<\/details>/g, '');
if (/data-pauta="no"/.test(h)) throw new Error('quedó algo marcado data-pauta="no"');
if (/bitcoin|scanner/i.test(h.replace(/<!--[\s\S]*?-->/g, ''))) throw new Error('quedó una mención de bitcoin o del scanner');

/* 4 · una marca en el body para que el CSS pueda distinguirla si hace falta */
h = h.replace('<body>', '<body class="pauta">');

/* 5 · aviso al principio del archivo */
h = h.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- GENERADO por herramientas/entrar.mjs a partir de index.html. No editar a mano:\n     los cambios van en index.html y se vuelve a correr el script. -->');

fs.writeFileSync(path.join(web, 'entrar.html'), h);

const cartas = (h.match(/carta--captura/g) || []).length;
if (cartas) throw new Error('quedaron capturas de miembros');
console.log(`  entrar.html · ${(h.length / 1024).toFixed(0)} KB · sin testimonios ni scanner`);
