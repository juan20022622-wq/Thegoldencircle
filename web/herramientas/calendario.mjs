/* El banco de contenido · The Golden Syndicate
   ---------------------------------------------------------------------------
   Una sola fuente para dos cosas: el sistema diario (web/plan/) y la página de
   estrategia. Se edita aquí y se genera el JSON con:

       node web/herramientas/calendario.mjs

   Reglas que no se negocian (CLAUDE.md raíz y marca/identidad.md):
   · Nada de promesas de rentabilidad. Se habla de proceso, no de resultado.
   · Cristian no es asesor: nunca "deberías", nunca una recomendación dirigida.
   · Sin emojis de dinero, cohetes ni fuego. Sin mayúsculas para gritar.
   · Las frases atribuidas a Cristian son las suyas, ya publicadas en el canal.
     No se le inventan citas.
   · Lo que va entre {{llaves}} lo escribe él esa mañana: es dato de mercado y
     no se inventa. El sistema lo marca en pantalla.
   --------------------------------------------------------------------------- */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const enlaces = {
  landing:  'https://thegoldensyndicate.com/?utm_source=telegram&utm_medium=canal',
  landingIG:'https://thegoldensyndicate.com/?utm_source=instagram&utm_medium=bio',
  canal:    'https://t.me/TheGoldenSyndicateFree',
  broker:   'https://thegoldensyndicate.com/ir?utm_source=telegram',
  cristian: 'https://t.me/leemintrader',
};

const descargo =
  'El trading conlleva riesgo de pérdida. El contenido es educativo y no constituye ' +
  'asesoría de inversión. Los resultados pasados no garantizan resultados futuros. ' +
  'Opera solo con capital que puedas permitirte perder.';

const partner =
  'The Golden Syndicate es partner independiente de Exness: recibe una comisión del ' +
  'broker cuando alguien opera a través de su enlace. No forma parte del broker ni lo representa.';

/* Las frases de Cristian, tal cual las publicó en el canal (mayo–junio 2026).
   Son la tesis dicha por él y son verificables. No se retocan. */
const frases = [
  'Recuerden que no se trata de operar más… se trata de operar mejor.',
  'Una operación que no tomas por falta de confirmación nunca será una pérdida. La paciencia también forma parte de una estrategia ganadora.',
  'El mercado no premia al que más opera, premia al que sabe esperar y ejecutar con disciplina.',
  'El éxito en trading no se mide por cuánto ganas en un día, sino por la consistencia que construyes con el tiempo.',
  'A veces la mejor operación también es saber esperar.',
  'No arriesguen más de lo que están dispuestos a perder.',
  'Mucho cuidado entrando por emoción. Después de movimientos fuertes el mercado suele hacer rebotes y manipulaciones antes de mostrar la dirección real.',
  'Cada operación es una decisión, pero cada decisión debe estar respaldada por una estrategia.',
];

/* ======================================================================
   TELEGRAM · el ritual diario y la semana
   ====================================================================== */

/* La apertura: todos los días de mercado, 7:00–7:45. Es el hábito que ya existe
   y que hay que proteger. En el grupo Free no van niveles: va el contexto, la
   agenda y una regla. Los niveles viven en el canal de análisis. */
const apertura = [
  `Buenos días. Hoy en el oro.

Agenda: {{qué datos salen hoy y a qué hora}}.
Lo que miro: {{la zona o el contexto que tiene en la pantalla, sin nivel}}.
Lo que no hago: entrar antes de que el precio llegue a donde tiene que llegar.

Regla del día: {{frase}}

Los niveles, con su porqué y con lo que los invalida, van en el canal de análisis.`,

  `Buenos días.

Antes de abrir el gráfico, tres preguntas: ¿qué noticia sale hoy? ¿A qué hora? ¿Qué hago si el precio se mueve antes de tiempo?

Hoy: {{agenda del día}}.

Regla del día: {{frase}}`,

  `Buenos días. Apertura.

Contexto: {{qué hizo el oro ayer, en una línea}}.
Hoy hay que vigilar: {{dato o evento}}.
Si no hay nada claro, no hay operación. Eso también es una decisión.

Regla del día: {{frase}}`,

  `Buenos días.

Hoy es un día de {{agenda fuerte / agenda tranquila}}. Con agenda fuerte el precio se mueve antes de mostrar la dirección; con agenda tranquila se pasa horas sin hacer nada. Las dos cosas piden lo mismo: paciencia.

Regla del día: {{frase}}`,
];

/* Lunes · el audio de Cristian. Voz, no texto: es lo que más acerca. 2 a 4
   minutos, grabado con el celular, sin editar. Estos son guiones de esquema,
   no para leer. */
const audioLunes = [
  {
    tema: 'La semana que empieza',
    guion: [
      'Saludo corto y una frase a los que llegaron esta semana: "arriba, en el mensaje fijado, está cómo funciona esto".',
      'Qué trae la semana en agenda: los dos o tres datos que importan y por qué.',
      'Una idea de mentalidad: cómo se llega al lunes sin la resaca del viernes, gane o pierda.',
      'Cierre: "los niveles, cuando toquen, en el canal de análisis. Aquí, el porqué".',
    ],
  },
  {
    tema: 'Lo que aprendí de una operación que salió mal',
    guion: [
      'Una operación concreta de la semana pasada que no salió. Sin cifra: qué vio, qué hizo, dónde estuvo el error o dónde no lo hubo.',
      'La diferencia entre perder por respetar el plan y perder por saltárselo.',
      'Qué cambia esta semana por eso.',
    ],
  },
  {
    tema: 'Cuerpo y gráfico son la misma disciplina',
    guion: [
      'Cómo fue el fin de semana: entreno, descanso, lectura. Una imagen concreta.',
      'Por qué la persona que no aguanta una serie más tampoco aguanta esperar la confirmación.',
      'Un compromiso pequeño para la semana, suyo, que la gente pueda copiar.',
    ],
  },
  {
    tema: 'Las preguntas que me llegaron',
    guion: [
      'Dos o tres preguntas reales que le escribieron por privado esta semana (sin nombres).',
      'Respuesta corta a cada una. Si una pregunta es "¿cuánto voy a ganar?", la respuesta es la de siempre: nadie lo sabe, y quien te lo diga te está vendiendo algo.',
      'Invitación a escribirle: "las preguntas de esta semana me las mandan por privado".',
    ],
  },
];

/* Martes · la historia de un miembro. Se publica la decisión, no la cifra.
   El modelo es el mensaje del lotaje: alguien que ganó y aun así se corrigió. */
const historiaMiembro = [
  `Historia de un miembro.

{{Nombre de pila o "un miembro", con su permiso}} entró la semana pasada con más lotaje del que tenía planeado. El mercado fue a favor. Aun así, escribió esto al canal:

"{{cita textual del miembro, con permiso, sin cifras}}"

Lo importante no es cómo terminó. Es que se dio cuenta. Esa es la parte del trading que nadie enseña en un video de tres minutos.

Si te pasó algo parecido, cuéntamelo por privado. Las historias de este martes salen de ahí.`,

  `Historia de un miembro.

Esta semana alguien del canal hizo lo más difícil: no entró.

El precio llegó cerca de la zona, no la tocó, y se fue. {{Nombre o "un miembro"}} escribió: "{{cita textual, con permiso}}".

Una operación que no tomas por falta de confirmación nunca será una pérdida. Eso lo llevamos diciendo desde el principio, y verlo en alguien más vale más que decirlo.`,

  `Historia de un miembro.

{{Nombre o "un miembro"}} lleva {{tiempo}} en el canal. Antes de llegar seguía señales de tres canales a la vez y no sabía por qué entraba.

Lo que cambió, en sus palabras: "{{cita textual, con permiso}}".

No hay cifra en esta historia a propósito. Lo que se construye aquí es criterio, y el criterio no se mide en un pantallazo.`,
];

/* Miércoles · educación. Un concepto por semana, explicado como lo explicaría
   Cristian en el canal. Termina con una pregunta que se pueda responder. */
const educacion = [
  {
    tema: 'El stop no se mueve',
    texto: `Educación · El stop no se mueve.

El stop es el precio al que la idea deja de ser cierta. No es el precio al que "ya perdí mucho". Por eso se pone antes de entrar y no se toca después.

Moverlo cuando el precio se acerca es cambiar la idea a mitad de camino para no aceptar que estaba mal. Y una idea que estaba mal, alejada diez puntos, sigue estando mal.

Pregunta de la semana: ¿alguna vez moviste un stop y salió bien? ¿Cuántas veces salió mal después?`,
  },
  {
    tema: 'El lotaje se calcula, no se siente',
    texto: `Educación · El lotaje se calcula, no se siente.

La cifra sale de dos datos: cuánto estás dispuesto a perder si el stop salta, y a qué distancia está el stop. Nada más. Ni la confianza que tienes en la operación ni lo que ganaste ayer entran en la cuenta.

Si la operación "se ve muy buena" y por eso entras con más, no estás operando: estás apostando con un gráfico delante.

Pregunta de la semana: ¿tienes escrito cuánto arriesgas por operación, o lo decides cada vez?`,
  },
  {
    tema: 'Qué es una zona y por qué se espera',
    texto: `Educación · Qué es una zona y por qué se espera.

Una zona es un rango de precio donde el mercado ya reaccionó antes. No es un punto: es un rango. Por eso la instrucción nunca es "entra ahora", es "entra cuando el precio llegue ahí".

Si el mensaje sale y el precio ya está lejos de la zona, no hay operación. Perder esa oportunidad sale más barato que entrar fuera de las condiciones.

Pregunta de la semana: ¿cuántas veces esta semana entraste porque "se iba" el precio?`,
  },
  {
    tema: 'Qué hace una noticia con el precio',
    texto: `Educación · Qué hace una noticia con el precio.

Cuando sale un dato fuerte (inflación, empleo, tasas) el oro se mueve en segundos y muchas veces en las dos direcciones antes de elegir una. Eso no es señal de nada: es ruido de gente entrando y saliendo a la vez.

Por eso la regla es sencilla: antes de una noticia fuerte, no se abre nada nuevo. Se espera a que el precio muestre la dirección real.

Pregunta de la semana: ¿sabes a qué hora sale el dato más importante de esta semana?`,
  },
  {
    tema: 'Qué invalida una idea',
    texto: `Educación · Qué invalida una idea.

Toda idea de operación tiene una condición que la tumba. Si el precio cierra por debajo de tal nivel, la idea deja de servir. Eso se decide antes de entrar, con la cabeza fría.

Un canal que te da el nivel sin decirte qué lo invalida te está dando la mitad de la información, y la mitad que falta es la que protege tu cuenta.

Pregunta de la semana: en tu última operación, ¿sabías antes de entrar qué la invalidaba?`,
  },
  {
    tema: 'Tres seguidas',
    texto: `Educación · Tres seguidas.

Tres operaciones perdidas seguidas le pasan a cualquiera que opere con reglas. No es señal de que las reglas estén mal: es probabilidad.

El problema no son las tres. Es la cuarta, que se abre con el doble de lotaje para "recuperar". Esa sí es una decisión, y es la que rompe cuentas.

Qué se hace: se cierra la plataforma ese día. Mañana el mercado sigue ahí.

Pregunta de la semana: ¿tienes una regla para después de tres seguidas?`,
  },
];

/* Jueves · mercado y noticias. Educativo, sin predicción. Se explica qué pasó
   y por qué importa; nunca "va a subir" ni "va a bajar". */
const mercado = [
  `Mercado · Qué pasó esta semana en el oro.

{{Dato o evento de la semana}}: {{qué salió, en una línea}}.
Cómo reaccionó el precio: {{movimiento, sin nivel exacto}}.
Por qué importa: {{la relación entre el dato y el oro, en dos líneas}}.

Lo que viene: {{dato de la semana que viene}}.

Esto no es una predicción. Es contexto para entender por qué el precio hizo lo que hizo y llegar preparado a lo que sigue.`,

  `Mercado · La agenda de la semana.

Lo que mueve al oro no es el gráfico: son las decisiones sobre tasas, la inflación y el empleo en Estados Unidos. Esta semana salen:

· {{dato 1}} — {{día y hora}}
· {{dato 2}} — {{día y hora}}
· {{dato 3}} — {{día y hora}}

Alrededor de esas horas, nada nuevo se abre. Después, se lee.`,

  `Mercado · Una pregunta que me hacen mucho.

"¿Por qué el oro subió si la noticia era mala?" o al revés.

Porque el mercado no reacciona al dato, reacciona a la diferencia entre el dato y lo que esperaba. Un dato malo que era menos malo de lo previsto es, para el precio, una buena noticia.

Esta semana pasó con {{dato}}: se esperaba {{expectativa}}, salió {{resultado}}.`,

  `Mercado · Cierre de la semana en el oro.

Rango de la semana: {{amplio / estrecho}}, {{con / sin}} noticia fuerte de por medio.
El día más movido fue {{día}}, por {{motivo}}.

La lección de esta semana, si hay una: {{una frase}}.

Sin predicciones para la que viene. Se espera a que el precio hable.`,
];

/* Viernes · cierre de semana. Es donde se comenta lo que salió mal y donde se
   abre la puerta al canal de análisis, una vez, sin insistir. */
const cierre = [
  `Cierre de semana.

Lo que se publicó en el canal de análisis esta semana: {{número}} ideas.
Lo que salió: {{cuántas}}. Lo que no: {{cuántas}}. Las que no salieron se comentaron igual que las otras, con lo que se aprendió de cada una.

La que más vale la pena revisar: {{cuál y por qué, sin cifra}}.

Si quieres ver los niveles con su porqué y con lo que los invalida, así se entra al canal de análisis: está explicado en el mensaje fijado. Al club no le pagas nada.

${partner}`,

  `Cierre de semana.

Esta semana hubo una operación que se cortó antes del stop. No porque el precio se acercara, sino porque la razón para estar dentro dejó de existir. Eso es distinto a mover el stop, y es de las cosas más difíciles de aprender.

Fin de semana: descansar el gráfico. El lunes sigue ahí.

${frases[0]}`,

  `Cierre de semana.

Tres cosas de esta semana:

1. Lo que se hizo bien: {{una}}.
2. Lo que se corrigió: {{una}}.
3. Lo que hay que seguir vigilando: {{una}}.

El canal de análisis publica cada idea con su porqué y con lo que la tumba. Cómo se entra está en el mensaje fijado.

${partner}`,

  `Cierre de semana.

Sin operación hoy. Viernes con {{noticia / rango estrecho}} y no había nada que cumpliera las condiciones. Eso también se publica, porque también es el método.

Descansen. Cuerpo, cabeza y gráfico se cansan igual.

${frases[4]}`,
];

/* Sábado · cuerpo, mentalidad, propósito. Es lo que separa el club de un canal
   de señales, así que no es relleno: es la tesis. */
const cuerpo = [
  `Sábado.

Hoy no hay gráfico. Hay entreno, y hay una idea.

La persona que no aguanta una repetición más tampoco aguanta esperar la confirmación. La disciplina es una sola y se entrena en todas partes.

¿Qué hiciste hoy por tu cuerpo? Contesta abajo si quieres. Nadie te va a juzgar.`,

  `Sábado.

Una pregunta para el fin de semana: ¿para qué operas?

No "para ganar dinero". Eso es el medio. ¿Para qué? Tiempo, familia, libertad de horario, pagar algo concreto. Quien no tiene la respuesta clara opera con miedo, y el miedo es caro.

Piénsalo. El lunes hablamos de otra cosa.`,

  `Sábado.

Lo que leo estos días: {{libro o tema}}. Una idea que me quedó: {{idea, en una frase}}.

Educación no es solo aprender de velas. Es lo que llena la cabeza entre operación y operación.

Si tienes un libro que te cambió algo, mándamelo por privado.`,

  `Sábado.

Rutina de fin de semana, sin adornos: {{hora}} arriba, {{entreno}}, comida en casa, revisar la semana sin abrir la plataforma.

Lo importante no es la rutina. Es que se repite cuando hay ganas y cuando no.`,
];

/* Domingo · la agenda de la semana que viene. Solo eso: es el mensaje más
   corto de la semana y el que más gente guarda. */
const agenda = [
  `La semana que viene en el oro.

· Lunes: {{dato / nada relevante}}
· Martes: {{dato}}
· Miércoles: {{dato}}
· Jueves: {{dato}}
· Viernes: {{dato}}

Alrededor de cada dato fuerte, sin operaciones nuevas. Mañana a las 7, la apertura.`,
];

/* ======================================================================
   TELEGRAM · "Empieza aquí" — la secuencia de bienvenida, fijada
   ------------------------------------------------------------------
   Un canal no puede mandar una secuencia distinta a cada persona; eso pide un
   bot. Mientras no lo haya, la secuencia se publica una vez, se fija, y cada
   lunes el audio empieza señalándola. Son siete mensajes, uno por día de la
   primera semana de quien llega.
   ====================================================================== */
const bienvenida = [
  {
    dia: 0, titulo: 'Bienvenida', texto:
`Bienvenido a The Golden Syndicate.

Esto es la puerta de entrada. Aquí ves cómo trabajamos antes de decidir nada.

Cada día de mercado, entre las 7:00 y las 7:45, sale la apertura: qué hay en agenda, qué se mira y qué no se hace. Los lunes, un audio. Los martes, la historia de un miembro. Los miércoles, un concepto explicado. Los jueves, mercado. Los viernes, el cierre de la semana.

Nadie te va a escribir por privado para venderte nada. Si tú quieres escribir, aquí está Cristian: ${enlaces.cristian}`,
  },
  {
    dia: 1, titulo: 'Quién está detrás', texto:
`Quién está detrás de esto.

Cristian opera oro (XAUUSD) y publica lo que opera él mismo, con el porqué. No revende señales de nadie.

Lo que hace distinto al club no es el gráfico: es lo que hay alrededor. Dinero, propósito, cuerpo, mentalidad, educación. Cinco frentes. Si esto fuera solo señales, sería un canal más.

{{Aquí va el audio o el video de presentación, 60–90 segundos}}`,
  },
  {
    dia: 2, titulo: 'Las cinco llaves', texto:
`Las cinco llaves.

Dinero: gestionar el riesgo antes de pensar en el resultado.
Propósito: saber para qué operas, porque quien no lo sabe opera con miedo.
Cuerpo: la disciplina del entreno y la del gráfico son la misma.
Mentalidad: qué hacer con una pérdida, con tres seguidas, y con la confianza de después de ganar.
Educación: entender por qué, no solo copiar el qué.

Todo lo que se publica aquí entra en una de las cinco. Si no entra, no se publica.`,
  },
  {
    dia: 3, titulo: 'Cómo se lee un mensaje de análisis', texto:
`Cómo se lee un mensaje de análisis.

Cada idea que se publica en el canal de análisis lleva cuatro cosas: dirección, zona de entrada, stop y objetivo. Y tres más que casi nadie da: por qué la veo, qué la invalida y qué hago si falla.

Sin las tres últimas, un nivel es una apuesta. Con ellas, es una decisión que puedes entender y, con el tiempo, tomar tú solo.

{{Captura de un mensaje real con el sello "Ejemplo" y los niveles tapados}}`,
  },
  {
    dia: 4, titulo: 'La única regla que no se negocia', texto:
`La única regla que no se negocia.

No persigas el precio. Si cuando ves el mensaje el precio ya se fue de la zona, no entras. Perder una oportunidad sale más barato que entrar fuera de las condiciones.

Y la segunda, que casi es la misma: el lotaje se calcula con lo que estás dispuesto a perder, no con lo que quieres ganar.

${frases[5]}`,
  },
  {
    dia: 5, titulo: 'Dónde está el truco', texto:
`Dónde está el truco.

Es la pregunta que todos se hacen y casi nadie contesta, así que va de frente.

${partner}

Por eso el canal de análisis pide tener cuenta en Exness con nuestro enlace: es como se sostiene el club sin cobrarte. Tu dinero es tuyo, se queda en tu cuenta y nadie del club lo toca ni tiene acceso a él.

Si prefieres otro broker, puedes quedarte aquí en el grupo abierto todo el tiempo que quieras.`,
  },
  {
    dia: 6, titulo: 'Cómo se entra al canal de análisis', texto:
`Cómo se entra al canal de análisis.

1. Abres tu cuenta en Exness con este enlace: ${enlaces.broker}
2. La fondeas con lo que tú decidas.
3. Mandas el pantallazo del registro a ${enlaces.cristian}

Se valida y se te pasa al canal. Al club no le pagas nada.

Si más adelante quieres acompañamiento más cercano, hay grupos de formación (GOLD, VIP, PREMIUM) y clases privadas con Cristian. No hacen falta para estar aquí, y aquí nadie te los va a estar recordando.

${descargo}`,
  },
];

/* ======================================================================
   TELEGRAM · los mensajes mensuales
   ------------------------------------------------------------------
   Se mandan una vez al mes, el primer viernes, después del cierre. Es la única
   vez que la oferta de pago aparece en el grupo abierto. La promesa del mensaje
   fijado —"aquí nadie te los va a estar recordando"— se cumple así.
   ====================================================================== */
const mensuales = [
  {
    titulo: 'Transparencia', texto:
`Una vez al mes, esto se repite para los que llegaron nuevos.

${partner}

Ese es el modelo. No hay otro truco. Y si en algún momento el club cobrara por algo, se dice aquí con el precio delante, no por privado.

${descargo}`,
  },
  {
    titulo: 'Formación', texto:
`Para quien quiera ir más a fondo.

Hay tres grupos de formación: GOLD, VIP y PREMIUM. {{Qué incluye cada uno, en una línea por grupo. Precio. Cupos.}}

No hacen falta para estar aquí ni para entrar al canal de análisis. Son para quien ya opera con el método y quiere trabajarlo con más acompañamiento.

Información por privado: ${enlaces.cristian}. Este mensaje no se repite hasta el mes que viene.`,
  },
  {
    titulo: 'Clases privadas', texto:
`Clases privadas con Cristian.

Es lo más cercano que hay: tu operativa, tus errores, tu plan, uno a uno. {{Formato, duración, precio, cupos disponibles este mes.}}

No es para todo el mundo y no es para empezar: es para quien ya lleva tiempo operando y sabe qué le está fallando.

Si es tu caso, escríbele: ${enlaces.cristian}`,
  },
];

/* ======================================================================
   INSTAGRAM · la marca personal de Cristian
   ------------------------------------------------------------------
   Cuatro ejes del marco estratégico: método 35 %, mercado en vivo 20 %,
   cuerpo y mentalidad 30 %, comunidad 15 %. "Estilo de vida" aquí significa
   las cinco llaves vividas: gimnasio a las 5, escritorio, lectura, calle.
   Nunca el objeto: ni carro, ni reloj, ni billetes, ni playa como premio.
   ====================================================================== */
const instagram = {
  reelMetodo: [
    { gancho: 'Esta entrada era una trampa. Te muestro por qué.', grabar: 'Pantalla del gráfico con la zona marcada. Cristian explica en 30 s qué la hacía parecer buena y qué la invalidaba. Sin cifra de resultado.', pie: 'El nivel es lo de menos. Lo que importa es saber qué lo tumba. En el canal, cada idea va con eso.' },
    { gancho: 'Por qué no entré aunque el precio llegó a la zona.', grabar: 'Cara a cámara 10 s, luego pantalla. La confirmación que faltaba. Cierre: "una operación que no tomas nunca será una pérdida".', pie: 'La paciencia también es parte de la estrategia. Lo dije en el canal hace meses y lo sigo diciendo.' },
    { gancho: 'Lo primero que miro antes de abrir el gráfico no es el gráfico.', grabar: 'El calendario económico en pantalla. Qué dato sale hoy y a qué hora. Por qué eso decide si se opera o no.', pie: 'El oro se mueve por noticias antes que por velas. Si no sabes qué sale hoy, no sabes qué estás operando.' },
    { gancho: 'El error que más veo en la gente que me escribe.', grabar: 'Cara a cámara. Entrar tarde porque "se va". Explica qué es perseguir el precio y qué cuesta.', pie: 'Perder una oportunidad sale más barato que entrar fuera de las condiciones. Siempre.' },
  ],
  vida: [
    { idea: 'Gimnasio a las 5. Luz dura, sin filtro.', grabar: 'Foto o reel corto en el gym. Texto sobre la imagen: "La disciplina es una sola."', pie: 'La persona que no aguanta una repetición más tampoco aguanta esperar la confirmación. Cuerpo y gráfico se entrenan igual.' },
    { idea: 'El escritorio antes de la apertura.', grabar: 'Plano fijo del escritorio: café, pantalla apagada, cuaderno. Sin gráfico todavía.', pie: 'A las 7 se publica la apertura en el canal. Antes de eso, veinte minutos sin pantalla. La cabeza se prepara igual que el cuerpo.' },
    { idea: 'Lo que estoy leyendo.', grabar: 'El libro en la mano, una página marcada. Cristian lee una frase en voz alta.', pie: 'Educación no es solo velas. Es lo que llena la cabeza entre una operación y otra.' },
    { idea: 'Un día sin operar.', grabar: 'Calle, comida, familia o entreno. Sin gráfico en todo el reel.', pie: 'Hoy no había nada que cumpliera las condiciones. También se publica. También es el método.' },
  ],
  carrusel: [
    { tema: 'El stop no se mueve', slides: ['El stop es el precio al que la idea deja de ser cierta', 'No es el precio al que "ya perdí mucho"', 'Se pone antes de entrar', 'Moverlo es cambiar la idea a mitad de camino', 'Una idea equivocada, alejada diez puntos, sigue equivocada', 'En el canal cada idea va con lo que la invalida'] },
    { tema: 'Cómo se calcula el lotaje', slides: ['Dos datos, nada más', 'Cuánto estás dispuesto a perder si salta el stop', 'A qué distancia está el stop', 'La confianza en la operación no entra en la cuenta', 'Lo que ganaste ayer tampoco', 'Si entras con más porque "se ve buena", estás apostando'] },
    { tema: 'Qué es una zona', slides: ['Una zona es un rango, no un punto', 'Donde el mercado ya reaccionó antes', 'Por eso nunca es "entra ahora"', 'Es "entra cuando el precio llegue"', 'Si ya se fue, no hay operación', 'Perder la oportunidad sale más barato'] },
    { tema: 'Las cinco llaves', slides: ['dinero · propósito · cuerpo · mentalidad · educación', 'Dinero: el riesgo antes que el resultado', 'Propósito: para qué operas', 'Cuerpo: la misma disciplina', 'Mentalidad: qué haces con una pérdida', 'Educación: el porqué, no solo el qué'] },
  ],
  comunidad: [
    { idea: 'Lo que se dijo esta semana en el canal.', grabar: 'Captura de un mensaje de análisis con el sello "Ejemplo" y los niveles tapados. O una frase de disciplina publicada en el canal, con fecha.', pie: 'Así se ve un mensaje del canal. El nivel va tapado a propósito: lo que se enseña es el porqué. Entrada gratis en el enlace de la bio.' },
    { idea: 'Publicación antes de la apertura, todos los días de mercado.', grabar: 'Captura del historial del canal mostrando la hora de los mensajes: 7:00 a 7:45, día tras día. Sin contenido de los mensajes.', pie: 'Sin faltar desde mayo. La constancia no es un adjetivo, se puede comprobar entrando.' },
    { idea: 'Un miembro que se corrigió.', grabar: 'Texto sobre negro con la cita de un miembro (con permiso, sin cifra ni nombre completo): el error de lotaje.', pie: 'Lo que más vale del canal no son las ideas que salen. Es cuando alguien se da cuenta de algo. Esto lo escribió una miembro hace poco.' },
  ],
};

/* Historias: la de las 7:00 es fija y es la que lleva a la landing. Las demás
   se eligen del día. Sin producción: celular y texto. */
const historias = {
  apertura: 'Story fija, 7:00–7:45: "Ya está la apertura en el canal". Foto del escritorio o del gráfico apagado. Sticker de enlace a la landing con texto "Entrar gratis".',
  extras: [
    'Encuesta: "¿Sabes qué dato sale hoy?" Sí / No. Responde con la agenda en la siguiente story.',
    'Caja de preguntas: "Pregúntame algo del método". Las tres mejores se responden en stories al día siguiente; una puede ser el reel del jueves.',
    'Frase de disciplina sobre negro, sin imagen. Una de las suyas, con fecha.',
    'Detrás: el gym, el café, la calle. Sin texto o con una palabra.',
    'Repost del post del día con una línea nueva, no la misma del pie.',
    'Cierre de día: "Mañana a las 7". Nada más.',
  ],
};

/* La semana de Instagram. Lunes a viernes publica la cuenta personal; sábado
   opcional; domingo solo historias. @thegoldensyndicate republica tres a la
   semana del mismo banco: el reel del lunes, el carrusel del miércoles y la
   pieza de comunidad del viernes. */
const semanaIG = {
  1: { formato: 'Reel · método',        banco: 'reelMetodo', ancla: true },
  2: { formato: 'Foto o reel · vida',   banco: 'vida' },
  3: { formato: 'Carrusel · educación', banco: 'carrusel', ancla: true },
  4: { formato: 'Reel · mercado en vivo', banco: 'reelMetodo', nota: 'Reacción a algo de esta semana, con pantalla. El gancho del banco se adapta al dato de la semana.' },
  5: { formato: 'Estático · frase + comunidad', banco: 'comunidad', ancla: true },
  6: { formato: 'Foto · vida (opcional)', banco: 'vida' },
  0: { formato: 'Solo historias', banco: null },
};

/* ======================================================================
   LA SEMANA COMPLETA, por día. 0 = domingo … 6 = sábado.
   Cada mensaje de Telegram dice de qué banco sale; el sistema rota por
   semana ISO para que dos lunes seguidos no repitan texto.
   ====================================================================== */
const semana = {
  1: {
    nombre: 'lunes', tema: 'Arranque · la semana que empieza',
    telegram: [
      { hora: '07:00', titulo: 'La apertura', banco: 'apertura', fijo: true },
      { hora: '12:00', titulo: 'El audio de Cristian', banco: 'audioLunes', tipo: 'audio' },
    ],
  },
  2: {
    nombre: 'martes', tema: 'Historia de un miembro',
    telegram: [
      { hora: '07:00', titulo: 'La apertura', banco: 'apertura', fijo: true },
      { hora: '18:00', titulo: 'Historia de un miembro', banco: 'historiaMiembro' },
    ],
  },
  3: {
    nombre: 'miércoles', tema: 'Educación · un concepto',
    telegram: [
      { hora: '07:00', titulo: 'La apertura', banco: 'apertura', fijo: true },
      { hora: '18:00', titulo: 'Educación', banco: 'educacion' },
    ],
  },
  4: {
    nombre: 'jueves', tema: 'Mercado · qué pasó y por qué',
    telegram: [
      { hora: '07:00', titulo: 'La apertura', banco: 'apertura', fijo: true },
      { hora: '18:00', titulo: 'Mercado', banco: 'mercado' },
    ],
  },
  5: {
    nombre: 'viernes', tema: 'Cierre de semana',
    telegram: [
      { hora: '07:00', titulo: 'La apertura', banco: 'apertura', fijo: true },
      { hora: '17:00', titulo: 'Cierre de semana', banco: 'cierre' },
      { hora: '17:30', titulo: 'Mensaje mensual (solo el primer viernes del mes)', banco: 'mensuales', mensual: true },
    ],
  },
  6: {
    nombre: 'sábado', tema: 'Cuerpo · mentalidad · propósito',
    telegram: [
      { hora: '10:00', titulo: 'Sábado', banco: 'cuerpo' },
    ],
  },
  0: {
    nombre: 'domingo', tema: 'La agenda de la semana que viene',
    telegram: [
      { hora: '19:00', titulo: 'La semana que viene', banco: 'agenda' },
    ],
  },
};

/* Qué sí y qué no. Va en pantalla, en el sistema, todos los días. */
const reglas = {
  si: [
    'Proceso, no resultado: qué se vio, qué se decidió, qué se aprendió.',
    'Las que salen mal se comentan igual que las otras.',
    'Frases de Cristian ya publicadas, con fecha. Verificables.',
    'Cuerpo y mentalidad como prueba de la tesis, no como relleno.',
    'La agenda económica: qué sale, a qué hora, por qué importa.',
    'El descargo de riesgo y la condición de partner, donde corresponda.',
    'Historias de miembros: la decisión, con permiso, sin la cifra.',
  ],
  no: [
    'Cifras de ganancia, porcentajes, pips como gancho, capturas de P&L.',
    '"Vive del trading", "ingreso pasivo", "libertad financiera", "duplica".',
    'Carros, relojes, billetes, jets, playa como premio.',
    'Emojis de dinero, cohetes o fuego. Mayúsculas para gritar.',
    'Urgencia: "últimos cupos", "hoy se cierra", "aprovecha".',
    '"Deberías entrar", "te conviene": eso es asesoría, y Cristian no es asesor.',
    'Predicciones: "va a subir", "va a romper". Se explica lo que pasó, no lo que pasará.',
    'Nombres o caras de terceros sin permiso. Saldos de cuenta ajenos.',
    'Una señal pelada, sin el porqué ni lo que la invalida.',
    'Empujar el broker o la formación fuera del viernes y del mensual.',
  ],
};

const salida = {
  version: 2,
  generado: new Date().toISOString().slice(0, 10),
  zonaHoraria: 'America/Bogota',
  enlaces, descargo, partner, frases,
  bancos: { apertura, audioLunes, historiaMiembro, educacion, mercado, cierre, cuerpo, agenda, mensuales },
  bienvenida,
  instagram, historias, semanaIG,
  semana, reglas,
};

fs.mkdirSync(path.join(web, 'plan'), { recursive: true });
fs.writeFileSync(path.join(web, 'plan/calendario.json'), JSON.stringify(salida, null, 1));

const n = Object.values(salida.bancos).reduce((a, b) => a + b.length, 0);
console.log(`calendario.json · ${n} mensajes de Telegram en banco · ${bienvenida.length} de bienvenida · ${frases.length} frases`);
