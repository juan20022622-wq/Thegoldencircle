# The Golden Syndicate · sistema de publicaciones

Sistema de diseño para las piezas de Instagram de **@thegoldensyndicate**:
publicaciones 4:5, carruseles, portadas de reel, historias, destacadas y avatar.
Está hecho para subirse a **Claude Design** como sistema de diseño y para que
cualquier pieza nueva salga de aquí sin volver a decidir color, tipografía ni
tono.

## Cómo usarlo en Claude Design

1. En claude.ai/design, crea el sistema de diseño de la marca y sube **esta
   carpeta completa** (o `the-golden-syndicate-sistema.zip`).
2. Lo que Claude Design tiene que leer, por orden de peso: este `README.md`,
   `fuente/sistema.css`, `tokens.json`, las tarjetas de `fundamentos/` y
   `plantillas/`, y `assets/simbolo.svg`. Las imágenes de `previsualizaciones/`
   sirven de referencia visual rápida.
3. Cada HTML es autocontenido (CSS y símbolo dentro) y empieza con una marca
   `@dsCard` con su grupo y su nombre, que es como el panel del sistema las
   ordena en tarjetas.
4. Para pedir una pieza, usa los encargos de la sección «Encargos listos».

Las fuentes son **Manrope** e **IBM Plex Mono**, las dos de Google Fonts y con
licencia abierta. Las plantillas las cargan por enlace.

## Dónde se para la marca en su nicho

Investigación del 2026-09-18. Los feeds de Instagram están detrás de login: lo
verificado son bios, tamaños de audiencia y tipos de publicación; lo que se dice
del aspecto de cada cuenta es conocimiento previo, no una lectura de ese día.

| Cuenta | Qué publica | Qué nos enseña |
|---|---|---|
| @ftmocom · 608K | «Trade of the week» con cifras de pago, certificados, merch | El prop firm vive del resultado exhibido. Es justo lo que aquí no se puede hacer |
| @umarashraf · 433K | Carruseles; destacadas «Trading P/L» y «Member Profits» | La prueba social del nicho es la cifra. La nuestra es la constancia |
| @tradezella · 136K | Pantallazos de panel y carruseles de psicología | El carrusel de proceso funciona sin enseñar dinero |
| @pablogiltrader · ~160K | Reels, macro explicada, entrevistas | El referente hispano menos gurú: marca personal sobria |
| @tradinglatino · ~61K | Clips de análisis con gráfico y cara | El formato «pantalla + cara» es el estándar; hay que vestirlo distinto |
| Señales de oro (GoldSniper y similares) | «93 % accuracy», pips acumulados, «TP HIT» | El cliché exacto del que hay que alejarse |
| @dailystoic · 3,4M | Una cita por lámina, sistema tipográfico fijo | Una idea por pieza y la misma forma siempre |
| @morningbrew · 2,2M | Titulares y carruseles con un solo acento de color | Un color de acento basta si la tipografía manda |
| @chartrdaily | Un gráfico por publicación, fuente al pie | El dato se enseña con rejilla y sobriedad |

**El hueco:** no apareció ninguna comunidad de oro en español con diseño
editorial. Todo el nicho hispano se parece entre sí.

**Lo que hace todo el mundo, y aquí no se hace:**

- Oro metálico degradado, lingotes 3D, toros y leones realistas o de IA.
- Velas verdes y flecha hacia arriba de fondo. Neón verde y rojo.
- Pantallazos de MT4/MT5, certificados de pago, «TP HIT ✅», pips acumulados.
- Lamborghini, Dubái, jets, relojes, fajos de billetes.
- El trader de brazos cruzados frente a seis monitores.
- Escasez falsa, retórica de guerra, citas de motivación sobre foto de archivo.
- La plantilla de Canva oscura que comparten cientos de cuentas.

**Lo que hace esta marca en su lugar:** oro plano sobre negro, tipografía como
única ilustración, una línea discontinua como motivo, fotografía de disciplina
sin objetos, y el mensaje del canal enseñado con los niveles tapados.

## La regla que manda: nada plano

Decisión del cliente (2026-09-19): las piezas **no pueden ser planas ni sentirse
hechas por IA**. Tienen que tener lo que tiene la web: profundidad de campo,
atmósfera y objetos 3D abstractos que representen la idea de forma elegante y
conceptual. Texto sobre un fondo liso queda solo para piezas de apoyo.

Cómo se cumple:

- **Cada pieza parte de una escena 3D real**, no de una ilustración ni de una
  imagen generada. Las escenas viven en `escenas/`, se escriben en three.js y se
  renderizan con Chrome sin cabeza. El desenfoque es óptico: se acumulan 180
  fotogramas moviendo la cámara sobre el disco de la apertura.
- **Un objeto por idea, abstracto y sin literalidad.** Dinero es un equilibrio,
  no una moneda. Propósito son anillos alineados que un hilo atraviesa por el
  centro. Cuerpo es la repetición. Mentalidad es una esfera en calma entre
  esquirlas. Educación son capas.
- **Tres materiales**: grafito con barniz, hueso mate y oro satinado. El oro es
  un objeto por escena y el hilo, nunca la escena entera.
- **Un carrusel es un solo mundo.** Las láminas son teselas contiguas de la misma
  escena: lo que se corta en un borde sigue en la lámina siguiente, y un hilo de
  oro las recorre todas.
- La tipografía va arriba, sobre el negro de la propia escena. El objeto ocupa
  la mitad baja. Abajo, el riel de siempre.
- Siguen valiendo todas las prohibiciones: sin objetos de lujo, sin gráficos que
  suban, sin dinero dibujado.

Primer carrusel hecho así: `carruseles/01-cinco-llaves/`.

    MODULOS=<carpeta temporal con three, puppeteer-core y sharp>
    node escenas/render-escena.mjs escenas/cinco-llaves.html <teselas/> 180
    node carruseles/cinco-llaves.mjs <teselas/>

## Fundamentos

### Color

| Rol | Hex | Uso |
|---|---|---|
| Negro base | `#0A0A0B` | Fondo por defecto |
| Superficie | `#121214` | Tarjetas sobre negro |
| Azul noche | `#04141D` | Solo la serie de mercado y agenda |
| Oro | `#D2A64B` | Acento. **Plano, nunca degradado** |
| Oro claro | `#E7C67F` | Destacado dentro de texto sobre negro |
| Oro profundo | `#8C6A22` | El acento cuando el fondo es hueso |
| Hueso | `#F2EDE3` | Texto sobre oscuro y fondo de la pieza clara |
| Gris cálido | `#8A8578` | Texto secundario y rótulos |

El oro es acento: una frase, una línea, un número. Nunca un fondo entero ni un
párrafo. Sobre negro, el texto de lectura va en hueso. No hay verde ni rojo de
mercado en ninguna pieza.

### El ritmo del feed

Cuatro fondos, para que la cuadrícula respire sin dejar de ser una sola marca.
De cada doce piezas: **siete en negro, dos en hueso, una en azul noche y dos de
fotografía.** Nunca dos piezas de hueso seguidas ni en la misma fila.

### Tipografía

- **Manrope 500** para titulares, grandes y ligeros, con interletrado de −0,025em.
  Nunca 700 ni más: el peso alto a tamaño grande se lee como grito.
- **Manrope 300/400** para lectura.
- **IBM Plex Mono 400** para rótulos, horas, contadores y datos. En versales con
  0,18em de interletrado. Es la voz del terminal y ancla la marca en su mundo.
- Descartadas: Cinzel, Jost, Bodoni, Inter, Poppins, cualquier serif de lujo.

Escala a 1080 de ancho: titular XL 132 · titular 104 · titular M 80 · titular S
60 · cita 76 · cuerpo 36 · rótulo 24 · descargo 24. **Nada por debajo de 19.**
En 9:16 todo sube un 17 %.

Máximo por pieza: un titular, un párrafo de apoyo, un rótulo. Portadas de hasta
diez palabras. Una sola frase en oro por pieza, con `<em>`.

### Lienzo y retícula

| Formato | Medida | Zona segura |
|---|---|---|
| Publicación y carrusel | 1080 × 1350 (4:5) | Margen de 96. La cuadrícula del perfil recorta a 3:4: se pierden unos 34 px por lado |
| Reel e historia | 1080 × 1920 (9:16) | Titular y símbolo dentro del centro de 1080 × 1440. 260 libres arriba y 340 abajo |
| Destacadas y avatar | 1080 × 1080 | Todo dentro del círculo inscrito |

Las medidas del CSS se escriben en «píxeles a 1080» con
`calc(N * var(--u))`, así la misma plantilla sirve de miniatura y exporta nítida.

### El riel

Toda pieza termina abajo con el riel: una línea fina, el león y «THE GOLDEN
SYNDICATE» en mono a la izquierda, y a la derecha el dato de la serie
(«Método», «Mercado», «Cuerpo») o el contador del carrusel («03 / 07»). Es la
firma. No hay logo arriba ni rótulo sobre el titular.

### El motivo: la línea de invalidación

Una discontinua de oro que cruza la pieza de borde a borde, con una etiqueta de
eje a la derecha. Es el nivel donde una idea deja de ser cierta, que es la tesis
de la marca: aquí se enseña qué invalida cada idea. **Una por pieza.** Tiene una
versión corta, continua, para ir bajo una cita.

### El símbolo

León coronado de trazo continuo, `assets/simbolo.svg`. Siempre en oro plano y en
línea, nunca relleno, nunca con sombra ni brillo. Pequeño en el riel; grande solo
en el avatar y en la portada de «Empieza aquí».

### Fotografía

Luz dura, sombras profundas, un punto de desaturación. Gimnasio, escritorio,
lectura, calle. El texto se apoya en un velo negro abajo. Sin filtro dorado, sin
estudio con humo, y **nunca el objeto**: carro, reloj, billetes, jet, playa como
premio. El lujo de esta marca es la disciplina.

### Gráficos

**Ningún gráfico sube.** Un gráfico ascendente en una cuenta de trading es una
promesa de rentabilidad dibujada. Velas en gris y hueso, una sola en oro, la zona
como banda tenue y la línea de invalidación. Sin precios en el eje y sin
resultado. Toda pieza con gráfico dice que es una ilustración del método.

## Plantillas

| Archivo | Para qué | Día del plan |
|---|---|---|
| `01-frase` · `02-frase-hueso` | Frase de Cristian ya publicada en el canal, verbatim | Viernes |
| `03` `04` `05` carrusel | Portada, interior y cierre con entrada y descargo | Miércoles |
| `06-mensaje-del-canal` | Cómo se ve un mensaje, con sello «Ejemplo» y niveles tapados | Viernes |
| `07-agenda` | Qué dato sale hoy y a qué hora | Jueves y domingo |
| `08-cinco-llaves` | Una llave encendida por pieza | Sábado o carrusel |
| `09-vida-foto` | Foto de disciplina con una línea | Martes y sábado |
| `10-metodo-grafico` | Un concepto del método dibujado | Lunes |
| `11-portada-reel` | Portada de reel con guía de recorte | Lunes y jueves |
| `12-historia-apertura` | La historia fija de las 7:00 con hueco para el enlace | Cada día de mercado |
| `13-historia-frase` | Frase en historia | Cualquier día |
| `14-destacadas` · `15-avatar` | Seis portadas y el avatar | Una vez |

Carruseles de 7 a 10 láminas. La segunda lámina funciona como segundo gancho. La
última siempre es `05`: la entrada gratis y el descargo completo.

## Reglas de contenido

Estas reglas pesan más que cualquier decisión estética. Romperlas cuesta la
cuenta publicitaria de Meta y la cuenta de partner del broker.

**Sí**

- Proceso, no resultado: qué se vio, qué se decidió, qué se aprendió.
- Las que salen mal se cuentan igual que las otras.
- Frases de Cristian ya publicadas, **verbatim**. No se le inventan citas.
- Cuerpo y mentalidad como prueba de la tesis, no como relleno.
- La agenda económica: qué sale, a qué hora, por qué importa.
- Historias de miembros: la decisión, con permiso, sin la cifra.
- Descargo de riesgo en la última lámina de todo carrusel y en toda pieza que
  invite a entrar.

**No**

- Cifras de ganancia, porcentajes, pips como gancho, capturas de P&L.
- «Vive del trading», «ingreso pasivo», «libertad financiera», «duplica».
- Urgencia: «últimos cupos», «hoy se cierra».
- «Deberías entrar», «te conviene»: Cristian es educador, no asesor.
- Predicciones. Se explica lo que pasó, no lo que pasará.
- Presumir la situación de quien lee: «¿cansado de perder dinero?».
- Emojis de dinero, cohetes o fuego. Mayúsculas para gritar. Exclamaciones.
- Nombres, caras o saldos de terceros.
- Un dato de mercado inventado. En las plantillas la agenda lleva el sello
  «Ejemplo»; en la pieza real va el dato verdadero de ese día.

Descargo completo:

> El trading conlleva riesgo de pérdida. El contenido es educativo y no
> constituye asesoría de inversión. Los resultados pasados no garantizan
> resultados futuros. Opera solo con capital que puedas permitirte perder.

**Voz:** frases cortas, verbos concretos, se explica el porqué. Habla el club;
la primera persona es solo para las citas de Cristian. Las cinco llaves se
escriben siempre en este orden y en minúscula: dinero · propósito · cuerpo ·
mentalidad · educación. El nombre es «The Golden Syndicate», nunca «TGS».

## Encargos listos

Para pegar en Claude Design con el sistema ya cargado.

**Carrusel educativo**
> Con el sistema de The Golden Syndicate, haz un carrusel de 7 láminas a
> 1080 × 1350 sobre «[tema]». Lámina 1 con la plantilla de portada y la línea de
> invalidación; láminas 2 a 6 con la plantilla interior, una idea por lámina,
> número en mono y carril de progreso; lámina 7 con la plantilla de cierre, la
> pastilla «Entrar gratis · enlace en la bio» y el descargo completo. Textos:
> [pegar las láminas del plan del día].

**Frase**
> Pieza de frase a 1080 × 1350 sobre [negro | hueso] con esta cita verbatim de
> Cristian: «[cita]». Una sola parte en oro. Línea corta y atribución
> «Cristian · en el canal» en mono. Riel con el dato «Mentalidad».

**Agenda**
> Pieza de agenda sobre azul noche con estos datos reales de hoy, hora de
> Bogotá: [hora · dato · impacto]. Titular «Hoy sale esto.» y cierre «Si no
> sabes qué sale hoy, no sabes qué estás operando.» Sin sello «Ejemplo».

**Portada de reel**
> Portada 1080 × 1920 para el reel «[gancho]». Titular XL dentro del centro de
> 1080 × 1440, línea de invalidación con la etiqueta «[dos o tres palabras]»,
> riel con el dato «Reel». Sin guías en la versión final.

**Foto de vida**
> Pieza de foto a 1080 × 1350 con esta imagen [adjuntar]. Un punto de
> desaturación, velo negro abajo, rótulo en oro con la hora y una línea:
> «[texto]». Riel con la llave que corresponde.

## Cómo se mantiene

Fuente única: `fuente/sistema.css` y las plantillas de `construir.mjs`. Las
carpetas `plantillas/` y `fundamentos/` se generan y no se editan a mano.

    node marca/sistema-diseno/construir.mjs

Los textos salen del banco de `web/herramientas/calendario.mjs`, que es también
lo que alimenta el plan diario en thegoldensyndicate.com/plan/.
