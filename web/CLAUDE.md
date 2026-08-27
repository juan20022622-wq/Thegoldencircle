# Landing de The Golden Syndicate

Pieza 01 de la propuesta: $1.500.000 COP, entrega estimada 2-3 semanas.
El contexto de marca está en `../marca/identidad.md`; la estrategia completa en
`../estrategia/00-marco-estrategico.md`. **Leerlos antes de escribir código.**

## Qué tiene que hacer esta página

Una sola cosa: que un desconocido deje nombre, correo y WhatsApp, y entre al
canal de Telegram. Nada más compite por su atención.

No es una web de la marca. No hay menú, no hay "sobre nosotros", no hay blog.
Es una página, un scroll, una acción repetida.

## Estructura, en orden

1. **Héroe** — la promesa concreta arriba: qué recibe, con qué frecuencia,
   gratis. Botón. El símbolo, no un menú.
2. **Video de Cristian** presentando el Syndicate. El elemento de confianza más
   barato que existe. Sin él la página es de cualquiera.
3. **Las cinco llaves** — dinero, propósito, cuerpo, mentalidad, educación.
   Es lo que hace que esta página no sea otra página de señales.
4. **Qué pasa dentro del canal** — con qué se va a encontrar, en concreto.
   Capturas reales o descripción honesta, nunca resultados.
5. **Quién es Cristian** — años operando `[POR CONFIRMAR]`, qué opera, por qué
   enseña. Sin cifras de rentabilidad.
6. **Formulario** — nombre, correo, WhatsApp. Máximo tres campos.
7. **Pie** — descargo de riesgo, declaración de partner independiente, contacto.

El botón se repite: héroe, después de las cinco llaves, y en el formulario.
Un solo tipo de botón. Nunca dos acciones distintas compitiendo.

## Requisitos técnicos

**Móvil primero.** El tráfico viene de Instagram. Diseñar a 390 px y crecer
desde ahí, no al revés.

**Formulario:** tres campos, validación en cliente, y el lead se guarda ANTES
de redirigir a Telegram — si la redirección falla, el dato no se pierde. La base
de datos es de Cristian, es el activo que sobrevive al broker.

**Medición** (skill `analytics`):
- Píxel de Meta instalado y verificado con tráfico real antes de pautar
- Evento de conversión en el envío del formulario, no en la carga de la página
- Parámetros UTM propagados al formulario, para saber de qué contenido vino

**El enlace de Exness no va crudo.** Va detrás de un redirect propio del
dominio — `/ir` o `/broker` — que registra el origen y luego manda a
`https://one.exnessonelink.com/a/4zepksu2az`. Sin eso no se sabe qué contenido
trae traders y la atribución se pierde entera.

**Rendimiento:** la página debe abrir en menos de 2 s en 4G. Sin librerías
pesadas, imágenes en WebP, el video con póster y carga diferida.

**Accesibilidad básica:** contraste suficiente del oro sobre negro para el
texto (el oro `#D2A64B` sobre `#0A0A0B` no pasa AA en tamaños pequeños — para
texto usar hueso `#F2EDE3`, el oro para acentos y elementos grandes).

## Stack — decisión abierta

`[POR CONFIRMAR]` con Juan y Cristian. El costo de hosting depende de esto y
está declarado como abierto en la propuesta.

Recomendación por defecto: **HTML, CSS y JS planos, sin framework**, servidos en
Vercel o Netlify (plan gratuito suficiente), formulario a una función serverless
que escribe en una hoja o en Airtable. Es una página; un framework solo añade
peso y superficie de mantenimiento. Si más adelante hace falta blog o varias
páginas, Astro.

El dominio se compra a nombre de Cristian. `[POR CONFIRMAR]` cuál.

## Reglas heredadas que aquí no se negocian

**Nada de promesas de rentabilidad** en ningún texto de esta página. Ni en el
héroe, ni en un testimonio, ni en una capa de urgencia. Es la línea que tumba la
cuenta publicitaria de Meta y la cuenta de partner de Exness a la vez.

**Descargo de riesgo visible**, no escondido en un acordeón:

> El trading conlleva riesgo de pérdida. El contenido es educativo y no
> constituye asesoría de inversión. Los resultados pasados no garantizan
> resultados futuros. Opera solo con capital que puedas permitirte perder.

**Declaración de partner:** la página debe decir que Golden Syndicate recibe
comisión cuando alguien opera en el broker a través de su enlace. Exness lo
exige y la transparencia es parte del posicionamiento.

**Antes de dar por final cualquier texto de esta página**, pasarlo por la skill
`revision-copy-trading`.

## Skills para este frente

`cro` para estructura y fricción del formulario · `copywriting` para el texto ·
`copy-editing` para afinarlo · `analytics` para píxel y eventos ·
`ab-testing` cuando toque iterar · `revision-copy-trading` antes de publicar.

## Datos

Los leads capturados NO se versionan y NO viven aquí. Van a `../data/`, que está
en `.gitignore`. Ningún archivo con correos o teléfonos entra a git.
