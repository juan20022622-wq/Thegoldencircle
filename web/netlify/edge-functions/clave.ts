/* Contraseña para /plan/ · The Golden Syndicate
   ---------------------------------------------------------------------------
   El plan diario es una herramienta interna: el banco de mensajes, la semana y
   la estrategia. No es secreto de Estado, pero tampoco es para el público ni
   para los buscadores.

   Cómo funciona:
   · Sin sesión, cualquier GET bajo /plan/ devuelve la pantalla de entrada: una
     página propia, con el símbolo y una sola caja. No el diálogo gris del
     navegador.
   · El formulario hace POST a /plan/entrar. Si la contraseña coincide, se pone
     una cookie HttpOnly con un hash de la contraseña y se redirige al plan. Si
     no coincide, la misma pantalla con el aviso.
   · La cookie es SHA-256(contraseña + sal). Sin la contraseña no se puede
     fabricar, y si la contraseña cambia en Netlify, todas las sesiones caducan
     solas. Dura 30 días.
   · /plan/salir borra la cookie.
   · Se acepta también Basic Auth en la cabecera, para curl y para quien ya la
     tenga guardada.

   No hay contraseña en el código ni en el repo: vive en la variable de entorno
   PLAN_CLAVE de Netlify. Si la variable no existe, la ruta responde 503 y lo
   dice, en lugar de quedar abierta por descuido.
   --------------------------------------------------------------------------- */

import type { Context } from "@netlify/edge-functions";

const COOKIE = "gs_plan";
const SAL = "the-golden-syndicate-plan-v1";
const DIAS = 30;

export default async (request: Request, context: Context) => {
  const clave = Netlify.env.get("PLAN_CLAVE");
  const url = new URL(request.url);

  if (!clave) {
    return texto(
      "El acceso al plan no está configurado.\n\n" +
      "Falta la variable PLAN_CLAVE en Netlify: Site configuration → Environment variables. " +
      "Después de crearla hay que volver a desplegar.",
      503
    );
  }

  const sello = await hash(clave + SAL);

  /* ---- salir ---- */
  if (url.pathname === "/plan/salir") {
    return new Response(null, {
      status: 303,
      headers: { location: "/plan/", "set-cookie": `${COOKIE}=; Path=/plan; Max-Age=0; Secure; HttpOnly; SameSite=Strict`, "cache-control": "no-store" },
    });
  }

  /* ---- entrar ---- */
  if (url.pathname === "/plan/entrar" && request.method === "POST") {
    let dada = "";
    try {
      const form = await request.formData();
      dada = String(form.get("clave") ?? "");
    } catch { dada = ""; }

    if (dada.length === clave.length && iguales(dada, clave)) {
      return new Response(null, {
        status: 303,
        headers: {
          location: "/plan/",
          "set-cookie": `${COOKIE}=${sello}; Path=/plan; Max-Age=${DIAS * 86400}; Secure; HttpOnly; SameSite=Strict`,
          "cache-control": "no-store",
        },
      });
    }
    return pantalla(true);
  }

  /* ---- ¿ya tiene sesión? ---- */
  const cookies = request.headers.get("cookie") ?? "";
  const m = cookies.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([a-f0-9]{64})`));
  if (m && iguales(m[1], sello)) return pasar(context);

  /* ---- Basic Auth, por si acaso ---- */
  const auth = request.headers.get("authorization") ?? "";
  if (auth.startsWith("Basic ")) {
    try {
      const bytes = Uint8Array.from(atob(auth.slice(6)), (c) => c.charCodeAt(0));
      const par = new TextDecoder().decode(bytes);
      const pass = par.slice(par.indexOf(":") + 1);
      if (pass.length === clave.length && iguales(pass, clave)) return pasar(context);
    } catch { /* cabecera rota: se trata como sin credenciales */ }
  }

  /* ---- sin sesión: la pantalla de entrada ---- */
  return pantalla(false);
};

async function pasar(context: Context) {
  const respuesta = await context.next();
  respuesta.headers.set("cache-control", "private, no-store");
  respuesta.headers.set("x-robots-tag", "noindex, nofollow");
  return respuesta;
}

function texto(cuerpo: string, status: number) {
  return new Response(cuerpo, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" },
  });
}

async function hash(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* Comparar carácter a carácter sin cortar antes evita que el tiempo de
   respuesta revele cuántos caracteres iban bien. */
function iguales(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* La pantalla de entrada. Misma paleta que el plan. Sin JavaScript: es un
   formulario. El símbolo va inline para no depender de nada bajo /plan/. */
function pantalla(error: boolean) {
  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><meta name="color-scheme" content="dark">
<title>Entrar · El plan · The Golden Syndicate</title>
<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:#0A0A0B;color:#F2EDE3;font-family:"Manrope",system-ui,sans-serif;-webkit-text-size-adjust:100%}
body{display:grid;place-items:center;padding:1.5rem;background:radial-gradient(90% 60% at 50% 0%,rgba(210,166,75,.09),transparent 65%),#0A0A0B}
main{width:100%;max-width:22rem;display:grid;gap:1.5rem}
.simbolo{width:56px;height:88px;color:#D2A64B;margin:0 auto}
h1{font-size:1.5rem;font-weight:500;letter-spacing:-.015em;margin:0;text-align:center;line-height:1.25}
.rotulo{font-family:"IBM Plex Mono",monospace;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:#D2A64B;text-align:center;margin:0 0 .5rem}
p{margin:0;color:#8A8578;font-size:.9375rem;text-align:center;line-height:1.5}
form{display:grid;gap:.75rem;margin-top:.5rem}
label{font-family:"IBM Plex Mono",monospace;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#8A8578}
input{font:inherit;font-size:1.05rem;letter-spacing:.06em;color:#F2EDE3;background:#121214;border:1px solid rgba(242,237,227,.12);border-radius:8px;padding:.85rem 1rem;width:100%;outline:none;min-height:3rem}
input:focus{border-color:#D2A64B;box-shadow:0 0 0 3px rgba(210,166,75,.18)}
button{font:inherit;font-weight:500;font-size:1rem;background:#D2A64B;color:#0A0A0B;border:0;border-radius:999px;padding:.9rem 1.25rem;min-height:3rem;cursor:pointer}
button:hover{background:#E7C67F}
.error{color:#E08A7C;border:1px solid rgba(224,138,124,.35);background:rgba(224,138,124,.08);border-radius:8px;padding:.7rem 1rem;font-size:.9rem}
.pie{font-size:.78rem;color:#6F6B60;margin-top:.5rem}
</style></head>
<body>
<main>
  <svg class="simbolo" viewBox="391 475 250 393" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><use href="/assets/img/simbolo.svg#leon"/></svg>
  <div>
    <p class="rotulo">The Golden Syndicate</p>
    <h1>El plan de hoy</h1>
  </div>
  <p>Qué se publica hoy en el canal y en Instagram, ya escrito. Solo para el equipo.</p>
  <form method="post" action="/plan/entrar" autocomplete="off">
    ${error ? `<div class="error" role="alert">Esa no es. Revisa mayúsculas y minúsculas.</div>` : ""}
    <label for="clave">Contraseña</label>
    <input id="clave" name="clave" type="password" autofocus required autocapitalize="off" spellcheck="false" inputmode="text">
    <button type="submit">Entrar</button>
  </form>
  <p class="pie">La sesión dura 30 días en este dispositivo.</p>
</main>
</body></html>`;

  return new Response(html, {
    /* 200 y sin WWW-Authenticate a propósito: con esa cabecera el navegador
       abre su diálogo gris antes de pintar esto. La página ES la pantalla. */
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
