# Despliegue

## Estado

El sitio está listo para desplegarse en la URL de Netlify **para revisión**.
No está listo para recibir tráfico: ver "Lo que bloquea" abajo.

Mientras tanto, `netlify.toml` manda `X-Robots-Tag: noindex` en producción,
previews y ramas. **Ese bloque se borra el día que el dominio esté puesto y los
marcadores cerrados**, no antes.

## Pasos

### 1 · GitHub

Crear el repo **privado** en github.com. Sin README, sin .gitignore: ya existen.

Después, desde la raíz del proyecto:

```bash
git remote add origin git@github.com:TU-USUARIO/cristian.git
```

```bash
git push -u origin main
```

Si no hay clave SSH configurada, usar la URL HTTPS que da GitHub. La primera vez
pedirá autenticación en el navegador.

### 2 · Netlify

*Add new site → Import an existing project → GitHub → elegir el repo.*

En la configuración de build:

| Campo | Valor |
|---|---|
| Base directory | `web` |
| Build command | *(vacío)* |
| Publish directory | `.` |

No hay build: es HTML plano. Netlify sirve `web/` tal cual y lee `netlify.toml`
desde ahí.

### 3 · Comprobar que las cabeceras llegaron

```bash
curl -sI https://TU-SITIO.netlify.app | grep -i "content-security-policy\|x-robots-tag\|strict-transport"
```

Si la CSP no aparece, Netlify no encontró `netlify.toml` — casi siempre es que
el base directory quedó mal.

### 4 · Probar el formulario de verdad

En local **parece** que funciona porque el servidor estático responde 200 a
cualquier POST. La captura real solo se prueba en Netlify:

1. Enviar el formulario desde el sitio desplegado
2. Comprobar que el envío aparece en *Site configuration → Forms → leads*
3. Si no aparece, revisar que `data-netlify="true"` sobrevivió al deploy

⚠️ Netlify Forms tiene tope de **100 envíos al mes** en el plan gratuito.

## Lo que bloquea recibir tráfico

| Qué | Dónde | Por qué bloquea |
|---|---|---|
| Enlace del canal de Telegram | `assets/js/config.js` → `telegram` | **Crítico.** Hoy manda a `t.me/REEMPLAZAR`. El lead se guarda pero la persona acaba en un enlace muerto |
| ID del píxel de Meta | `assets/js/config.js` → `pixelId` | Sin él no hay medición y la pauta va a ciegas |
| Dominio | `canonical`, `og:*`, `sitemap.xml`, JSON-LD | Hoy dice `REEMPLAZAR-DOMINIO` en 12 sitios |
| Correo de contacto | pie y `privacidad.html` | Obligatorio para la baja de datos |
| Imagen para compartir | `assets/img/og.jpg`, 1200×630 | Sin ella el enlace se comparte sin imagen |
| Revisión legal de `privacidad.html` | — | Es un borrador, no asesoría legal |
| Video de presentación | ver `README.md` | No bloquea técnicamente, pero es el hueco de confianza más grande |

## Después de poner el dominio

1. Reemplazar `REEMPLAZAR-DOMINIO` en `index.html`, `sitemap.xml` y `robots.txt`
2. Borrar el bloque `[[context.production.headers]]` con el noindex de
   `netlify.toml`
3. **Verificar la CSP con el píxel ya instalado.** Una CSP mal puesta lo bloquea
   en silencio y la pauta se queda sin medición sin que nadie se entere
4. Volver a correr `herramientas/auditoria.js` en la consola del sitio en vivo
