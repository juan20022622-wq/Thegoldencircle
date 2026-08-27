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
3. **El círculo** — por qué existe el club, cómo trabaja, qué recibe el miembro.
   Es la tesis, y va antes que la mecánica.
4. **Las cinco llaves** — dinero, propósito, cuerpo, mentalidad, educación.
   Es lo que hace que esta página no sea otra página de señales.
5. **El camino** — los cuatro pasos de la membresía: entrar al canal, abrir
   cuenta en el broker, replicar las operaciones que se quieran, y con el tiempo
   leer por cuenta propia. **Aquí se declara la comisión del broker**, no en
   letra pequeña. Sin esta sección el visitante no sabe en qué se está metiendo.
6. **Qué pasa dentro del canal** — con qué se va a encontrar, en concreto.
   Capturas reales o descripción honesta, nunca resultados.
7. **Quién es Cristian** — años operando `[POR CONFIRMAR]`, qué opera, por qué
   enseña. Sin cifras de rentabilidad.
8. **Dudas** — las objeciones de frente, empezando por "¿dónde está el truco?".
9. **Formulario** — nombre, correo, WhatsApp. Máximo tres campos.
10. **Pie** — descargo de riesgo, declaración de partner independiente, contacto.

El botón se repite: barra flotante, héroe, final de El camino, y formulario.
Un solo tipo de botón. Nunca dos acciones distintas compitiendo.

**La voz de la página es la del club, no la de Cristian.** De El círculo a
Adentro habla el Syndicate. La primera persona se reserva para el video y para
"Quién". El producto es el club; si todo lo dice Cristian, el día que no pueda
grabar la página se queda sin voz. Ver `README.md`.

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

## Stack — decidido 2026-08-26

**HTML, CSS y JS planos, sin framework.** Repo privado en GitHub, desplegado en
Netlify con base directory `web`. Es una página; un framework solo añade peso y
superficie de mantenimiento. Si más adelante hace falta blog o varias páginas,
Astro.

**Captura: Netlify Forms.** Rápido de montar y sin backend. Tiene tope de 100
envíos al mes en el plan gratuito — riesgo vivo en cuanto arranque la pauta. El
envío va por `fetch` contra `GS.endpoint`, así que migrar a una función
serverless que escriba en una hoja de Cristian es cambiar una línea de
`assets/js/config.js`, no rehacer el formulario.

**Cuentas:** GitHub y Netlify a nombre de Juan por ahora, con transferencia a
Cristian al cierre del proyecto. Anotarlo como pendiente: si se olvida, queda
una dependencia incómoda sobre un activo que es de él.

El dominio se compra a nombre de Cristian. `[POR CONFIRMAR]` cuál.

Ver `README.md` para desplegar y para la lista de lo que falta antes de publicar.

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
