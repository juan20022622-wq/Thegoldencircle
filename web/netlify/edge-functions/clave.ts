/* Contraseña para /plan/ · The Golden Syndicate
   ---------------------------------------------------------------------------
   El plan diario es una herramienta interna: el banco de mensajes, la semana y
   la estrategia en PDF. No es secreto de Estado, pero tampoco es para el
   público ni para los buscadores.

   Esto es autenticación básica de HTTP en el borde, antes de que el archivo se
   sirva. No hay contraseña en el código ni en el repo: vive en la variable de
   entorno PLAN_CLAVE de Netlify. Si la variable no existe, la ruta responde 503
   y lo dice, en lugar de quedar abierta por descuido.

   El usuario da igual; solo se comprueba la contraseña. Para cambiarla, se
   cambia la variable y se vuelve a desplegar.
   --------------------------------------------------------------------------- */

import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const clave = Netlify.env.get("PLAN_CLAVE");

  if (!clave) {
    return new Response(
      "El acceso al plan no está configurado.\n\n" +
      "Falta la variable PLAN_CLAVE en Netlify: Site configuration → Environment variables. " +
      "Después de crearla hay que volver a desplegar.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } }
    );
  }

  const auth = request.headers.get("authorization") ?? "";

  if (auth.startsWith("Basic ")) {
    let dada = "";
    try {
      /* atob devuelve latin1; se decodifica como UTF-8 por si la clave lleva tildes */
      const bytes = Uint8Array.from(atob(auth.slice(6)), (c) => c.charCodeAt(0));
      const par = new TextDecoder().decode(bytes);
      dada = par.slice(par.indexOf(":") + 1);
    } catch { dada = ""; }

    if (dada.length === clave.length && igualesEnTiempoConstante(dada, clave)) {
      const respuesta = await context.next();
      respuesta.headers.set("cache-control", "private, no-store");
      respuesta.headers.set("x-robots-tag", "noindex, nofollow");
      return respuesta;
    }
  }

  return new Response("Acceso restringido.", {
    status: 401,
    headers: {
      "www-authenticate": 'Basic realm="The Golden Syndicate · el plan", charset="UTF-8"',
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
};

/* Comparar carácter a carácter sin cortar antes evita que el tiempo de
   respuesta revele cuántos caracteres iban bien. */
function igualesEnTiempoConstante(a: string, b: string): boolean {
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
