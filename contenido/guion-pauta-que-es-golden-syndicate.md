# Guion de pauta · Qué es The Golden Syndicate

Objetivo: visitas a la landing (thegoldensyndicate.com).
Duración: 35–40 s. Vertical 9:16, grabado con el celular.
Estado: v2, ajustado a las políticas de Meta vigentes (revisadas el 2026-09-22).
Apunta a `thegoldensyndicate.com/entrar`, nunca a la principal. Falta que Cristian
lo lea en voz alta y ajuste las palabras a como él habla.

## El guion

**GANCHO · 0–4 s**
Primer plano, mirando a cámara. Sin saludo, sin presentarse: arranca directo.

> Te soy sincero: cuando yo empecé en el trading, lo más duro no era perder.
> Era no entender por qué.

**EL PROBLEMA · 4–12 s**
Puede seguir caminando o sentado en el escritorio. Tono de conversación.

> Me metía a grupos donde le decían a uno "compre aquí, venda allá", y ya.
> Nadie explicaba nada. Y si salía mal, uno quedaba ahí solo, mirando el
> celular sin saber qué había pasado.

**EL GIRO · 12–26 s**
Aquí puede mostrar un momento el celular con Telegram abierto (sin cifras de
ganancia en pantalla).

> Por eso armé The Golden Syndicate: un club para aprender trading viéndome
> hacerlo. Cuando opero, lo muestro en Telegram y explico el porqué: dónde
> entro y dónde me salgo si sale mal. No es para que me copies. Es para que
> entiendas.
>
> Y no es solo trading. Es disciplina, cabeza fría, cuerpo y propósito. Porque
> el que opera es una persona, no una máquina.

**CIERRE · 26–38 s**
De vuelta a cámara, más cerca.

> Si nunca has hecho trading, no pasa nada: ahí arrancas desde cero. Entrar es
> gratis y no te piden tarjeta. Dale al botón y mira cómo funciona.
>
> Nos vemos adentro.

## Ganchos alternativos para testear

Mismo cuerpo, solo cambia la primera frase. Tres anuncios, uno por gancho.

1. "Esto es lo que me hubiera gustado que alguien me mostrara cuando empecé en
   el trading."
2. "Si alguna vez te pasaron una señal de trading y no entendiste nada, mira
   esto."
3. "Nadie me explicó esto cuando empecé. Así que ahora lo hago yo."

## Texto en pantalla

- 0–4 s: la frase del gancho en subtítulo grande.
- Todo el video: subtítulos (la mayoría lo ve sin sonido).
- Últimos 3 s: "thegoldensyndicate.com · Entrar es gratis".
- Franja inferior fija, pequeña: "El trading conlleva riesgo de pérdida.
  Contenido educativo, no asesoría de inversión."

## Texto del anuncio (primary text)

> Cuando empecé, nadie me explicaba por qué se entraba en una operación.
> Por eso armé The Golden Syndicate: un club para aprender trading viendo cómo
> lo hago y por qué. Entrar es gratis y puedes empezar desde cero.
>
> El trading conlleva riesgo de pérdida. El contenido es educativo y no
> constituye asesoría de inversión. Los resultados pasados no garantizan
> resultados futuros. Opera solo con capital que puedas permitirte perder.

Titular: Aprende trading viendo a alguien hacerlo de verdad
Botón: Más información

## Cómo grabarlo

- Luz de ventana de frente. Nada de luz de techo a la espalda.
- Celular a la altura de los ojos, cámara trasera si alguien le ayuda.
- Lugares que sirven: el escritorio donde opera, caminando por la calle, el
  gimnasio para la línea de "cuerpo". Nada de carros, relojes ni billetes.
- No leerlo de memoria palabra por palabra. Que se aprenda la idea de cada
  bloque y la diga como le salga; si una palabra no es suya, se cambia.
- Grabar cada bloque por separado, dos o tres tomas. Se une en edición.
- Si Cristian habla de "usted" en su día a día, pasar todo a usted. Lo que
  importa es que suene a él.

## Por qué Meta debería aprobarlo

Revisado contra el texto oficial de Meta el 2026-09-22:

- Meta **prohíbe anunciar operaciones con CFD** en todo el mundo
  (Productos y servicios financieros prohibidos). El oro en Exness es un CFD.
  Por eso el anuncio no nombra a Exness, ni al broker, ni el oro como producto,
  ni habla de abrir una cuenta. Vende aprender, no operar.
- Meta deja pasar sin verificación los "anuncios educativos sobre un producto o
  servicio financiero que no permitan al usuario obtenerlo o conectarse
  directamente con él". Ahí encaja este anuncio: aprender, entrar gratis a un
  club. /entrar no tiene ningún enlace directo a Exness, y así debe quedarse.
- Colombia no está en la lista de países que exigen verificación de anunciante
  financiero (hoy son Australia, Hong Kong, India, Irlanda, Israel, España,
  Taiwán, Tailandia, Reino Unido y EE. UU.). **Segmentar solo Colombia.** Si
  algún día se abre a España o EE. UU., cambia todo.
- La declaración de partner de Exness va en la landing y no en el anuncio:
  poner el nombre del broker en el anuncio lo convierte en un anuncio de
  broker.
- El anuncio no pide datos ("deja tus datos"): el formulario vive en la
  landing. Meta es más estricto cuando el anuncio mismo pide información.
- Sin promesas, sin cifras, sin presión con plata, sin suponer la situación
  económica de quien lo ve. El descargo va en el texto y en el video.

## La landing de pauta (/entrar), ya limpia

Resuelto el 2026-09-22 en `web/herramientas/entrar.mjs`:

- Fuera las capturas de miembros: todas enseñaban resultado ("+77 ganancia",
  historial en verde, "se fue a la luna") y el símbolo del broker.
- Fuera el scanner: nombraba bitcoin en un producto de pago (política de cripto).
- Exness se nombra, porque hay que declararlo, pero no hay ningún enlace a
  Exness en /entrar. Meta permite nombrar un producto financiero siempre que la
  página no dé forma de obtenerlo o conectarse con él.
- Si aun así rechazan el anuncio, lo siguiente es sacar de /entrar el paso de
  abrir cuenta en Exness y contarlo en la página de gracias o en el canal.

## Cómo subirlo sin quemar la cuenta

- Objetivo: tráfico o clientes potenciales hacia /entrar. Edad 18+.
- Si Meta lo rechaza, pedir revisión una vez. No editar y resubir muchas
  veces: varios rechazos seguidos restringen la cuenta publicitaria.
- Arrancar con presupuesto bajo los primeros días y revisar la calidad del
  anuncio en Ads Manager antes de subir.
- Nadie puede garantizar la aprobación: la revisión de Meta es automática y a
  veces inconsistente. Lo que sí se puede hacer es no darle ningún motivo, y
  eso es lo que busca esta versión.
