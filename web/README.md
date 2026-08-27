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
assets/js/        config.js (lo que se toca) · main.js (formulario) ·
                  movimiento.js (revelados, llaves y consola)
herramientas/     velas.mjs · genera el SVG del gráfico del héroe
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
| Video de Cristian (60–90 s) | `index.html`, «La cara» | pendiente de grabar |

| Años operando | `index.html`, «La cara» → `[X]` | `[POR CONFIRMAR]` |
| Frecuencia real de publicación | consola, paso 01 | `[POR CONFIRMAR]` |
| Símbolo primario | cabecera, favicon | sin decidir · `../marca/identidad.md` |
| Dominio | `<link rel=canonical>` y `og:image` | `[POR CONFIRMAR]` |
| Correo de contacto | pie y `privacidad.html` | `[POR CONFIRMAR]` |
| Imagen para compartir (`og.jpg`, 1200×630) | `assets/img/` | pendiente |
| Revisión legal de `privacidad.html` | — | pendiente |

## Estructura de la página

Cada momento tiene una forma distinta. Si todas las secciones llevan antetítulo
+ titular + párrafo + lista, la página huele a plantilla por mucho que se
recorte.

1. **Héroe** — titular grande y ligero, una línea, botón. Detrás, el campo de
   velas en movimiento; debajo, el gráfico de la invalidación.
2. **La banda** — las cinco llaves como cinco palabras que se encienden.
3. **La anatomía** — el cotejo de mensajes. El argumento de la marca mostrado
   en vez de descrito.
4. **La consola** — el camino en un solo bloque, un paso a la vez.
   La comisión del broker se declara en el paso 02.
5. **Dudas** — cuatro objeciones en acordeón.
6. **Entrar** — formulario de tres campos.

Sin líneas divisorias entre secciones: separan el espacio y el fondo, no una
regla horizontal.

**La voz es la del club, sin nombres.** No hay sección de persona. Los
descargos hablan de "quien lleva el canal", no de alguien a quien la página
nunca presentó.

⚠️ **Hueco de confianza abierto.** `estrategia/00-marco-estrategico.md` llama al
video de presentación "el elemento de confianza más barato que existe" y avisa
de que sin él "la página es de cualquiera". Hoy no está. Un club de trading sin
una cara identificable es el perfil que el visitante escéptico lee como estafa.
Decidir dónde vuelve.

## Movimiento

**Una sola línea de tiempo.** Antes había un IntersectionObserver que encendía
cada elemento al cruzar un umbral: se bajaba y las cosas iban apareciendo de a
una, con el mismo fade-in en todas. Ese es uno de los tics que delatan a una
página generada.

Ahora un único `requestAnimationFrame` publica dos variables CSS:

| | |
|---|---|
| `--respiro` | onda continua de 11 s, igual para todo el documento. Hace que el fondo, el oro y el reflejo del vidrio latan juntos |
| `--p` | avance de cada pieza por el encuadre, 0 a 1, recalculado en continuo. Nadie "aparece": todo interpola siempre |

Cuatro modos de entrada, no uno (`rotulo`, `lento`, `lateral`, `hondo`), todos
contra el mismo reloj. Coste medido: **0,027 ms por fotograma, el 0,2 % del
presupuesto de 16,7 ms.**

**El campo de velas** vive dentro del héroe, no a página completa: un fondo
global pelea contra el texto en todas partes y hay que apagarlo tanto que deja
de verse. Dos capas a distinta velocidad, enmascaradas para disolverse antes de
llegar al titular. Se regenera con `node web/herramientas/campo.mjs`.

**Vidrio líquido** en la consola, las tarjetas y la barra: una receta, tres
intensidades, con un reflejo que se desplaza con `--respiro`.

Todo se apaga con `prefers-reduced-motion`, y `<noscript>` deja `--p` en 1.

## Tipografía

**Manrope** para todo lo que se lee, **IBM Plex Mono** para rótulos y cifras.

Bodoni Moda quedó descartada: sus astas finas a tamaño de titular no se leían.
Manrope tiene el flow que se pidió sin ser Inter ni Poppins, que son
literalmente la tipografía por defecto de las páginas generadas — el mismo
artículo que lista los tics de IA recomienda evitarlas.

Titulares grandes y ligeros (peso 500 a 76 px), como los hace Topstep. El peso
alto a tamaño grande se lee como grito, no como autoridad.

## Mostrar, no describir

Los competidores de la industria llevan cientos de elementos visuales en su
portada: capturas de la plataforma, tarjetas de señal, fotos de traders, cifras
grandes. Contados en vivo: [ftmo.com](https://ftmo.com) 350,
[howtotrade.com](https://howtotrade.com) 435. La primera versión de esta página
tenía uno. Hablaba de "cada idea con su razonamiento" sin enseñar nunca un
mensaje.

Dos piezas cargan con eso.

**El gráfico del héroe.** Velas en SVG generadas por `herramientas/velas.mjs` —
serie fija, sin aleatoriedad, para que el dibujo sea idéntico en cada carga.
**No sube.** Un gráfico ascendente en una landing de trading es una promesa de
rentabilidad dibujada: este lateraliza, es rechazado tres veces y termina
perdiendo el nivel. Lo que se destaca es la línea de invalidación — la tesis de
la marca hecha imagen.

Los rótulos son HTML, no `<text>` del SVG: dentro del SVG escalan con el
`viewBox` y a 390 px de ancho un 9 px se convierte en 6,6 px reales. Con ancho
se cuelgan del punto exacto; en móvil bajan como leyenda para no montarse sobre
las velas.

Si se regenera el gráfico:

```bash
node web/herramientas/velas.mjs
```

**El cotejo de mensajes.** Dos tarjetas: lo que publica un canal de señales y lo
que se publica aquí. El argumento entero de la marca de un vistazo, sin
adjetivos. Los niveles van en blanco a propósito, y cada tarjeta lleva su sello
«Ejemplo» **dentro** — estas tarjetas se van a capturar para anuncios y el
descargo tiene que viajar con la captura.

Paleta validada con el script de la skill `dataviz`. Falla los dos checks del
ámbito categórico — hueso y gris son casi neutros y ahí se exige croma — lo cual
no aplica aquí: no hay identidades que distinguir, hay una serie de precio y una
anotación. Lo que sí importa pasa (separación CVD 14,9 · visión normal 16,5 ·
contraste ≥3:1), y la invalidación se distingue por forma además de por color:
va punteada y rotulada.

## Movimiento

El vocabulario viene de iagination.co, leído de su CSS en producción:

- Curva única: `cubic-bezier(0.16, 1, 0.3, 1)`
- Revelado al entrar en pantalla, escalonado con `--retraso`
- Titular que entra desenfocado y se afila, con la última línea en oro
- Barra flotante de vidrio con `backdrop-filter`
- El gráfico se dibuja como se lee: vela por vela, después la línea de
  invalidación, después los rótulos
- Subrayado que barre en los enlaces del pie, y `scale(0.975)` al pulsar
- En móvil baja el desenfoque y se ralentiza el ambiente, como hacen ellos

**Lo que no se trajo:** el campo aurora de degradados de color. En turquesa es
atmósfera; en oro sería el degradado metálico que `marca/identidad.md` prohíbe.

Todo el movimiento se apaga con `prefers-reduced-motion`, y un bloque
`<noscript>` deja la página visible si el JS no carga.

## Auditoría

El arnés vive en `herramientas/auditoria.js`. Se pega en la consola del
navegador y devuelve fallos, avisos y cifras. Mide contraste real componiendo
las capas translúcidas sobre lo que tienen debajo: sin eso, un
`rgba(255,255,255,0.015)` se lee como blanco puro y reporta fallos que no
existen (pasó en la primera corrida, cuatro falsos positivos).

Última corrida, 390 px:

| | |
|---|---|
| Fallos | 0 |
| Avisos | 3 (dos rótulos de 11 px y el `og:image` sin dominio) |
| Peor contraste | 4,92:1 sobre 93 textos medidos (AA pide 4,5) |
| Objetivos táctiles bajo 44 px | 0 de 27 |
| Desborde horizontal | ninguno a 320, 390, 768 y 1280 |
| Encabezados | un solo h1, sin saltos de nivel |
| Manejadores `on*` en línea | 0 |
| Recursos de terceros | 1 dominio (Google Fonts) |
| Datos estructurados | Organization, WebSite y FAQPage, válidos |

## Seguridad

Cabeceras en `netlify.toml`. La CSP prohíbe todo script en línea, y por eso los
scripts de `gracias.html` e `ir.html` viven en `assets/js/`. `style-src` conserva
`unsafe-inline` porque los retrasos del revelado viajan en el atributo
`style="--retraso:120ms"`: son estilos, no código.

⚠️ **Verificar la CSP con el píxel de Meta ya instalado.** Una CSP mal puesta lo
bloquea en silencio y la pauta se queda sin medición sin que nadie se entere.

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
