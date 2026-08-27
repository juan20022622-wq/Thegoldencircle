/* Configuración del sitio · The Golden Syndicate
   Todo lo que cambia sin tocar código vive aquí.
   Lo marcado POR CONFIRMAR bloquea la publicación. */

window.GS = {
  // Enlace de invitación al canal de Telegram.  [POR CONFIRMAR]
  telegram: 'https://t.me/REEMPLAZAR',

  // Enlace de partner de Exness. NO se enlaza desde la landing:
  // se usa desde /ir (bio de Instagram y canal).
  exness: 'https://one.exnessonelink.com/a/4zepksu2az',

  // ID del píxel de Meta. Vacío = no se carga nada.  [POR CONFIRMAR]
  pixelId: '',

  // Endpoint de captura. Hoy Netlify Forms (POST a la propia página).
  // El día que se migre a una función serverless, se cambia solo esta línea.
  endpoint: '/',
  formulario: 'leads'
};
