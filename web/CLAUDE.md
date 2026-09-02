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

**La regla del gráfico:** ningún gráfico de esta página puede subir. Un gráfico
ascendente en una landing de trading es una promesa de rentabilidad dibujada, y
cae en la misma prohibición que el copy. Lo que se dibuja es el método: dónde se
invalida una idea, no cuánto se gana. El del héroe termina perdiendo el nivel.

**Nada de rótulos sobre los titulares.** Un eyebrow por sección es el tic mejor
documentado de las páginas generadas: la página queda perpetuamente
sobre-anunciada y ninguna sección puede simplemente existir. Tampoco la línea
que los acompañaba. Las secciones se separan por espacio y ritmo.

**Los titulares no pueden tener todos la misma forma.** Seis titulares de dos
palabras con punto es tan patrón como seis eyebrows. Se varía el largo: uno es
una frase completa, otro una pregunta.

**La regla de forma:** si todas las secciones tienen antetítulo + titular +
párrafo + lista, la página huele a plantilla por mucho que se recorte. Cada
momento tiene una forma distinta.

1. **Héroe** — la promesa arriba y el botón. Una línea de apoyo, no un párrafo.
   El símbolo, no un menú.
2. **Las cinco llaves** — dinero, propósito, cuerpo, mentalidad, educación,
   las cinco a la vista con su línea. Es el eje conceptual de la marca y lo que
   hace que esto no sea otra página de señales, así que es sección protagonista.
   **Sin iconos ni emojis:** una fila de pictogramas es la rejilla de features
   que delata a una página generada, y el de dinero está prohibido por
   `marca/identidad.md`. Lo que ordena aquí es la tipografía.
3. **La cara** — el video de Cristian y quién es él, en la misma sección. Sin
   el video la página es de cualquiera; sin la bio, el video no se sostiene.
4. **La anatomía** — el cotejo de mensajes: lo que publica un canal de señales
   contra lo que se publica aquí. Es el argumento de la marca mostrado en vez de
   descrito, y la pieza que más trabaja de la página. Los niveles van en blanco
   y el sello «Ejemplo» va **dentro** de cada tarjeta: se van a capturar para
   anuncios y el descargo tiene que viajar con la captura.
5. **La consola** — el camino de la membresía en un solo bloque: entrar al
   canal, abrir cuenta en el broker, replicar lo que se quiera, y con el tiempo
   leer por cuenta propia. Un paso a la vez, con botón «siguiente».
   **La comisión del broker se declara en el paso 02**, no en letra pequeña.
6. **Dudas** — las objeciones de frente, empezando por "¿dónde está el truco?".
7. **Formulario** — nombre, correo, WhatsApp. Máximo tres campos.
8. **Pie** — descargo de riesgo, declaración de partner independiente, contacto.

El botón se repite: barra flotante, héroe, tras la consola y formulario.
Un solo tipo de botón. Nunca dos acciones distintas compitiendo.

**La voz de la página es la del club, no la de Cristian.** La primera persona se
reserva para el video y para su bio. El producto es el Syndicate; si todo lo
dice Cristian, el día que no pueda grabar la página se queda sin voz.

**Todo el contenido va en el DOM.** La consola y la banda esconden con CSS lo
que no toca mostrar; nunca generan texto desde JS. Sin JavaScript se ven los
cuatro pasos y las cinco llaves apilados, y el buscador los indexa igual.

## Requisitos técnicos

**Móvil primero.** El tráfico viene de Instagram. Diseñar a 390 px y crecer
desde ahí, no al revés.

**Formulario:** nombre y WhatsApp obligatorios, correo opcional. El correo sigue
en el formulario porque la base de correos es el activo que sobrevive al broker;
lo que se quitó es el muro. Validación en cliente, y el lead se guarda ANTES
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

## El mazo

Los seis pasos de ejecución y las capturas de los miembros se pasan de lado,
una a la vez. Es lo que hace el pulgar sin que se lo pidan, y deja de exigir
seis lecturas simultáneas para un método que en realidad es secuencial.

**El desplazamiento es del navegador, nunca arrastre simulado.** `scroll-snap`
sobre un contenedor con `overflow-x`. De ahí salen gratis la inercia del
sistema, la rueda del ratón, el teclado y el foco. Una librería de arrastre
aquí es peso y una trampa de accesibilidad.

**La inclinación se mide contra los extremos del desplazamiento, no contra el
centro de la pista.** Midiendo al centro, la primera carta llega inclinada y
apagada: en el arranque no está centrada, porque no se puede desplazar a la
izquierda de cero.

**Esas variables sí pueden escribirse por fotograma**, al revés que la
respiración. Se escriben en el estilo de la carta, que invalida su subárbol; lo
que tumbaba la pestaña era escribir en `<html>`, que invalida el documento
entero.

**Cada paso lleva su propio dibujo, no una plantilla con capas encendidas.**
Seis veces la misma figura es la rejilla de iconos otra vez. Y ninguno sube:
los dos que dibujan precio bajan hacia la zona.

**El mando no puede parecerse al de la consola.** La consola navega con puntos
y un anillo; el mazo, con contador, carril y flechas. Si las tres secciones
navegaran igual, volvería la plantilla.

**Lo que escribe el club sobre una captura no va en `<blockquote>`.** Con un
`<cite>` al lado queda atribuido a la persona, y son palabras que no dijo. Las
citas van verbatim o no van.

**Las capturas van todas a 600x750 (4:5) y en WebP.** Son capturas de texto
plano: comprimen fatal en JPEG y muy bien en WebP — las nueve pasan de 744 KB a
348 KB. La proporción tiene que ser idéntica o la fila se descuadra, y 4:5 en
lugar de 3:4 porque los paneles de historial son más anchos que altos: en 3:4
había que sacrificar la columna de valores o la mitad de las filas.

**El orden del mazo de capturas no es el que llegaron.** Las tres primeras son
las que no salieron bien: el error de gestión, la posición en rojo y el cierre
en negativo. Nueve pantallas seguidas de ganancia son la página de "mira cuánto
ganamos" que el cliente pidió no hacer, y lo que `revision-copy-trading` marca
como bloqueante. En `assets/img/testimonios/LEEME.md` están las que quedaron
fuera y por qué.

## Movimiento

**Una sola línea de tiempo, nunca revelados por umbral.** Un IntersectionObserver
que enciende elementos de a uno produce el "va apareciendo según bajas", que es
un tic de página generada. El revelado cuelga de `--p`, que publica el reloj de
`assets/js/movimiento.js` **solo cuando hay scroll**.

**Nada de variables CSS escritas en cada fotograma.** Escribir una custom
property en `<html>` invalida el estilo del documento entero: medido, 1,33 ms
por escritura. A 60 fps eso son 80 ms de cada 1000 quemados en reposo, y en un
teléfono es la mayor parte del presupuesto de fotograma. El navegador móvil
acaba matando la pestaña y recargándola, que es como se manifestó: "la página
se reinicia de la nada". La respiración compartida vive en keyframes CSS con el
mismo ciclo, que corren en el compositor y no cuestan recálculo.

**Nunca animar el radio de un `blur()` ni de un `drop-shadow()`.** Obliga a
re-rasterizar en cada fotograma. Si algo tiene que latir, que sea la opacidad.

**Ningún gráfico de esta página puede subir**, tampoco los decorativos. Un
gráfico ascendente en una landing de trading es una promesa de rentabilidad
dibujada. El del héroe pierde el nivel; el campo del fondo oscila sin tendencia.

Coste a vigilar: con la página quieta, **cero fotogramas pedidos**. Se comprueba
interceptando `requestAnimationFrame` y contando llamadas durante dos segundos
sin tocar nada; si sale distinto de cero, algo volvió a correr en bucle.

## El símbolo

**León coronado, de trazo continuo**, extraído del PDF de marca convirtiendo sus
operadores vectoriales a SVG con `herramientas/pdf-a-svg.mjs`. Vive en
`assets/img/simbolo.svg`.

Lleva `vector-effect="non-scaling-stroke"`: el grosor se mantiene en píxeles de
pantalla, así el mismo archivo lee a 22 px en la barra y a 640 px de fondo. Sin
eso, a tamaño de barra el trazo mediría 0,2 px y no cumpliría la regla de
`marca/identidad.md` de leer a 16 px.

Aparece pequeño en la barra y **una sola vez grande**, dibujándose con `--p`, en
la sección de registro. Es el único momento donde el símbolo manda.

`marca/identidad.md` sigue listando cinco propuestas sin decidir: **está
desactualizado**, el símbolo ya existe.

## Tipografía

Descartadas por orden: Cinzel y Jost (capitales romanas doradas = uniforme de
página de lujo generada), después Bodoni Moda (astas finas ilegibles a tamaño de
titular). Lo que hay:

- **Manrope** (300–700) todo lo que se lee. Tiene flow y se lee, sin ser Inter
  ni Poppins, que son la tipografía por defecto de las páginas generadas.
- **IBM Plex Mono** (400/500) rótulos, cifras, contadores y etiquetas de campo.
  Es la voz del terminal, y es lo que ancla la página en el mundo del sujeto.

Titulares grandes y ligeros: peso 500, no 700. El peso alto a tamaño grande se
lee como grito.

Nada de la página baja de 11 px, y los rótulos pegados al texto de lectura van
a 12 px.

`marca/identidad.md` todavía propone Cinzel y Jost: **está desactualizado en
este punto** y hay que validarlo con Cristian.

## Caché de los assets

Los archivos de `assets/` **no llevan hash en el nombre**, así que sus URLs van
versionadas a mano: `/assets/js/main.js?v=2`.

**Al tocar cualquier archivo de assets hay que subir ese número** en las cuatro
páginas. Si no, quien ya visitó el sitio sigue ejecutando la versión vieja.

Se hace con `node web/herramientas/version.mjs`, que busca el número más alto
que encuentre y lo sube en todas. **A mano falla**: durante varios despliegues
index iba en v=7 mientras gracias, privacidad e ir seguían en v=5, y esas tres
cargan el mismo CSS y el mismo JS.

Por qué importa tanto: durante un tiempo se sirvieron con
`Cache-Control: immutable` y un año de vida. `immutable` significa "no vuelvas
a preguntar nunca", así que esos navegadores no revalidan **ni recargando**.
Cambiar la cabecera solo arregla a los visitantes nuevos; a los que tienen la
caché envenenada solo se los alcanza cambiando la URL. Pasó, y costó descubrirlo:
el arreglo del formulario estaba desplegado y verificado por curl mientras el
navegador seguía ejecutando el código anterior.

El día que haya un build con nombres hasheados, esto se puede automatizar y
volver a `immutable`.

## Auditoría antes de dar nada por bueno

`herramientas/auditoria.js` se pega en la consola y mide contraste real,
objetivos táctiles, jerarquía, desborde, SEO, seguridad y tics de página
generada. Correrlo después de cualquier cambio de estilo. La meta es cero fallos.

Un aviso sobre el propio arnés: mide contraste componiendo las capas
translúcidas. Cualquier medidor que lea `rgba(255,255,255,0.015)` como blanco
puro reporta fallos que no existen.

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
