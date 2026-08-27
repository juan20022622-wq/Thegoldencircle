# Landing · The Golden Syndicate

HTML, CSS y JS planos. Sin framework, sin build, sin dependencias.
Las reglas del frente están en `CLAUDE.md`; el contexto de marca en
`../marca/identidad.md`.

```
index.html        la landing
gracias.html      confirmación + salto al canal (noindex)
ir.html           redirect propio al broker, con registro de origen (noindex)
privacidad.html   BORRADOR, pendiente de abogado
assets/css/       estilos.css
assets/js/        config.js (lo que se toca) · main.js (lo que no)
netlify.toml      build, redirects y cabeceras
```

## Ver la página en local

```bash
npx -y serve web -l 4321
```

O desde Claude Code, el `launch.json` ya tiene la configuración `landing`.

Ojo: en local el formulario **parece** que envía correctamente porque el
servidor estático responde 200 a cualquier POST. La captura real solo se puede
probar en un deploy de Netlify.

## Despliegue

Netlify conectado al repo, con **base directory `web`**. Cada push a `main`
publica; cada rama genera un *deploy preview* para que Cristian revise antes.

El formulario usa **Netlify Forms**: se detecta en el build por el atributo
`data-netlify="true"` de `index.html`, y `main.js` lo envía por `fetch` para
poder guardar el lead antes de redirigir. Si el POST falla, el registro queda
en `localStorage` y se reintenta en la siguiente visita.

⚠️ **Netlify Forms tiene tope de 100 envíos al mes en el plan gratuito.** En
cuanto arranque la pauta eso se queda corto. Cuando pase, hay dos salidas:
subir al plan de formularios de Netlify, o cambiar `GS.endpoint` en
`assets/js/config.js` por una función serverless que escriba en una hoja de
Cristian. La segunda es una línea de configuración más la función; el
formulario no cambia.

## Qué hay que rellenar antes de publicar

Todo esto está marcado en el código y **bloquea el lanzamiento**:

| Qué | Dónde | Estado |
|---|---|---|
| Enlace del canal de Telegram | `assets/js/config.js` → `telegram` | `[POR CONFIRMAR]` |
| ID del píxel de Meta | `assets/js/config.js` → `pixelId` | `[POR CONFIRMAR]` |
| Video de Cristian (60–90 s) | `index.html`, sección 2 | pendiente de grabar |
| Retrato de Cristian | `index.html`, sección 5 | pendiente |
| Años operando | `index.html`, sección 5 → `[X]` | `[POR CONFIRMAR]` |
| Frecuencia real de publicación | héroe y "dentro del canal" | `[POR CONFIRMAR]` |
| Símbolo primario | cabecera, favicon | sin decidir · `../marca/identidad.md` |
| Dominio | `<link rel=canonical>` y `og:image` | `[POR CONFIRMAR]` |
| Correo de contacto | pie y `privacidad.html` | `[POR CONFIRMAR]` |
| Imagen para compartir (`og.jpg`, 1200×630) | `assets/img/` | pendiente |
| Revisión legal de `privacidad.html` | — | pendiente |

## Medición

- El píxel no carga si `pixelId` está vacío: nada se rompe mientras no exista.
- `Lead` se dispara **al guardar el formulario**, nunca al cargar la página.
- Los UTM de la URL viajan a campos ocultos del formulario, así que cada lead
  llega con su origen.
- `/ir` y `/broker` mandan al enlace de partner de Exness disparando un evento
  `ClicBroker` con el origen. **No se enlaza desde la landing** — la landing
  tiene una sola acción. Va en la bio de Instagram y dentro del canal:
  `/ir?utm_source=ig&utm_content=reel-12`.
- Verificar el píxel con tráfico real **antes** de gastar en pauta.

## Lo que no se toca

Ningún archivo con correos o teléfonos entra a este repo. Los leads se exportan
desde Netlify a `../data/`, que está en `.gitignore`.

Cualquier cambio de texto público vuelve a pasar por la skill
`revision-copy-trading` antes de publicarse.
