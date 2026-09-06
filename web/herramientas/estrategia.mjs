/* La estrategia de redes y canal · The Golden Syndicate
   ---------------------------------------------------------------------------
   Lee el banco de contenido (plan/calendario.json) y escribe plan/estrategia.html:
   la estrategia entera como página web, detrás de la misma contraseña que el
   sistema diario. No hay PDF: el cliente pidió que todo viva en la página.

   Uso:
     node web/herramientas/calendario.mjs     # primero, el banco
     node web/herramientas/estrategia.mjs

   Los ejemplos de mensajes salen del mismo JSON que usa el sistema diario: no
   hay dos versiones de nada. Cambiar un mensaje es cambiar calendario.mjs y
   regenerar los dos.
   --------------------------------------------------------------------------- */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const C = JSON.parse(fs.readFileSync(path.join(web, 'plan/calendario.json'), 'utf8'));
const simbolo = fs.readFileSync(path.join(web, 'assets/img/simbolo.svg'), 'utf8')
  .replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const e = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const huecos = (s) => e(s).replace(/\{\{([^}]+)\}\}/g, (_, h) => `<mark>[${h.trim()}]</mark>`).replace(/\n/g, '<br>');
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const fecha = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(new Date());

/* ---------- el feed: doce casillas, la más nueva primero ---------- */

const feed = [
  { tipo: 'reel',     texto: 'Esta entrada era una trampa.' },
  { tipo: 'frase',    texto: C.frases[0] },
  { tipo: 'vida',     texto: 'Gimnasio, 5:00. Luz dura.' },
  { tipo: 'carrusel', texto: 'El stop no se mueve' },
  { tipo: 'vida',     texto: 'El escritorio antes de la apertura.' },
  { tipo: 'reel',     texto: 'Por qué no entré aunque llegó a la zona.' },
  { tipo: 'comunidad',texto: 'Así se ve un mensaje del canal.' },
  { tipo: 'vida',     texto: 'Lo que estoy leyendo.' },
  { tipo: 'frase',    texto: C.frases[4] },
  { tipo: 'reel',     texto: 'Lo primero que miro no es el gráfico.' },
  { tipo: 'carrusel', texto: 'Las cinco llaves' },
  { tipo: 'vida',     texto: 'Un día sin operar.' },
];

const destacadas = [
  ['Empieza aquí', 'Qué es el Syndicate, cómo se entra, el enlace. Cuatro historias, sin más.'],
  ['Método', 'Los conceptos básicos, uno por historia: zona, stop, lotaje, noticia, invalidación.'],
  ['Las 5 llaves', 'Una historia por llave. Es la promesa de la marca, guardada donde se ve.'],
  ['El canal', 'Cómo se ve un mensaje de análisis, con el sello «Ejemplo». La constancia: la hora de publicación, día tras día.'],
  ['Rutina', 'Cuerpo y mentalidad: el gym, la lectura, el día típico. Sin filtro, sin objeto.'],
  ['Preguntas', 'Las que llegan por privado, respondidas. «¿Dónde está el truco?» va la primera.'],
];

/* ---------- páginas ---------- */

const portada = `
<section class="seccion portada" id="portada">
  <svg class="portada__simbolo" viewBox="391 475 250 393" fill="none" stroke="#D2A64B" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">${simbolo}</svg>
  <p class="rotulo">The Golden Syndicate · marca personal de Cristian</p>
  <h1>Estrategia digital<br>en redes y canal</h1>
  <p class="portada__sub">Instagram, Telegram y la escalera que va del contenido a la clase privada. Con el sistema diario que la publica, en la pestaña de al lado.</p>
  <p class="portada__pie">IAGINATION · ${e(fecha)} · versión 1, para validar con Cristian</p>
</section>`;

const idea = `
<section class="seccion" id="idea">
  <p class="rotulo">01 · La idea en una página</p>
  <h2>No vendemos entradas. Construimos traders, y la gente que hay detrás.</h2>
  <p class="lead">El mercado de señales está saturado de canales que venden un número. Golden Syndicate compite en <strong>la vida alrededor del gráfico</strong>: dinero, propósito, cuerpo, mentalidad, educación. Cristian no es un tipo que manda niveles; es alguien cuya forma de vivir explica por qué opera como opera. Eso es lo que se publica.</p>

  <h3>La escalera</h3>
  <ol class="escalera">
    <li><b>Instagram de Cristian</b><span>La cara y el motor de alcance. Estilo de vida como las cinco llaves vividas, frases suyas, educación.</span></li>
    <li><b>Landing</b><span>thegoldensyndicate.com. Una sola acción: registrarse gratis y entrar al canal.</span></li>
    <li><b>Telegram Free</b><span>La puerta de entrada. Ritual diario, educación, historias. Aquí se construye la confianza.</span></li>
    <li><b>Canal de análisis</b><span>Los niveles con su porqué. Se entra con cuenta en Exness por el enlace del club; al club no se le paga.</span></li>
    <li><b>Formación</b><span>GOLD, VIP, PREMIUM. Acompañamiento con precio. <em>[POR CONFIRMAR: qué incluye cada uno y cuánto vale]</em></span></li>
    <li><b>Clases privadas</b><span>Uno a uno con Cristian, con fee. Para quien ya opera y sabe qué le falla. <em>[POR CONFIRMAR: formato, duración, precio, cupos]</em></span></li>
  </ol>

  <h3>Dos cuentas, dos roles</h3>
  <table>
    <tr><th>Cristian (personal)</th><td>El motor. Sigue siendo la principal. Método, mercado en vivo, disciplina y vida. Cinco piezas a la semana.</td></tr>
    <tr><th>@thegoldensyndicate</th><td>La casa. Crece por arrastre. Republica tres piezas a la semana del mismo banco, con pie en voz del club. Lo que pasa dentro: miembros, cultura, el canal.</td></tr>
  </table>
  <p class="nota">La gente sigue personas, no logos. La cuenta personal no se apaga ni se «migra»: se usa como puerta.</p>
</section>`;

const reglas = `
<section class="seccion" id="reglas">
  <p class="rotulo">02 · Las reglas del juego</p>
  <h2>Lo que se puede decir y lo que no. En las dos plataformas, siempre.</h2>
  <p class="lead">Meta clasifica esto como servicios financieros, categoría restringida. Exness prohíbe prometer ganancias y exige declarar la condición de partner. Romper cualquiera de las dos no cuesta un anuncio: cuesta la cuenta publicitaria o la de partner, que es la monetización entera.</p>
  <div class="dos">
    <div><h3 class="si">Sí</h3><ul>${C.reglas.si.map((r) => `<li>${e(r)}</li>`).join('')}</ul></div>
    <div><h3 class="no">No</h3><ul>${C.reglas.no.map((r) => `<li>${e(r)}</li>`).join('')}</ul></div>
  </div>
  <h3>Dos textos que van siempre</h3>
  <blockquote class="cita">${e(C.descargo)}</blockquote>
  <blockquote class="cita">${e(C.partner)}</blockquote>
  <p class="nota">El descargo va en la landing, en la bio (destacada «Empieza aquí») y fijado en el canal. La declaración de partner, cada vez que se mencione el broker. «Cristian ya es rentable» no se usa como argumento público: se comunica como método y constancia, nunca como resultado.</p>
</section>`;

const instagram1 = `
<section class="seccion" id="instagram">
  <p class="rotulo">03 · Instagram · la marca personal</p>
  <h2>Estilo de vida significa las cinco llaves vividas. Nunca el objeto.</h2>
  <p class="lead">Gimnasio a las cinco, escritorio antes de la apertura, un libro, la calle. Eso es cuerpo, mentalidad y propósito en imágenes. Un carro, un reloj o una playa como premio es el uniforme del gurú de humo y tira la tesis al suelo, además de ser lo que Meta penaliza en categoría financiera.</p>

  <h3>Los cuatro ejes</h3>
  <table class="ejes">
    <tr><th>Método</th><td class="pct">35 %</td><td>Cómo lee el mercado, qué mira antes de entrar, errores comunes con pantalla. Autoridad y guardados.</td></tr>
    <tr><th>Cuerpo y mentalidad</th><td class="pct">30 %</td><td>Entreno, rutina, cómo gestiona una racha mala. <strong>El eje diferenciador.</strong> No es relleno: es la prueba de la tesis.</td></tr>
    <tr><th>Mercado en vivo</th><td class="pct">20 %</td><td>Reacción a lo que pasa esta semana. La razón para volver mañana.</td></tr>
    <tr><th>Comunidad</th><td class="pct">15 %</td><td>Qué pasa dentro del canal: mensajes de análisis con el sello «Ejemplo», la constancia, miembros que se corrigen. Es lo que empuja el registro.</td></tr>
  </table>

  <h3>La semana</h3>
  <table class="semana">
    ${[1, 2, 3, 4, 5, 6, 0].map((d) => `<tr><th>${DIAS[d]}</th><td>${e(C.semanaIG[d].formato)}</td><td class="gris">${C.semanaIG[d].ancla ? '@thegoldensyndicate republica' : ''}</td></tr>`).join('')}
  </table>
  <p class="nota">Cinco publicaciones a la semana en la personal, sábado opcional, domingo solo historias. Tres nacen de las grabaciones con equipo y dos se graban con el celular. Historias todos los días, sin producción. Hora: la publicación del feed a las 12:00; la historia fija a las 7:00, cuando sale la apertura en el canal.</p>

  <h3>La bio</h3>
  <blockquote class="cita bio">Trader. Fundador de The Golden Syndicate.<br>Opero XAUUSD y explico el porqué.<br>dinero · propósito · cuerpo · mentalidad · educación<br>↓ Entra al canal gratis</blockquote>
  <p class="nota">El enlace de la bio va a la landing con <code>?utm_source=instagram&amp;utm_medium=bio</code>, nunca al broker. Tres publicaciones fijadas: el reel de presentación, el carrusel de las cinco llaves y una pieza de comunidad.</p>
</section>`;

const instagram2 = `
<section class="seccion" id="feed">
  <p class="rotulo">04 · Instagram · cómo se ve el feed</p>
  <h2>Tres formatos que alternan. Nunca dos iguales seguidos.</h2>
  <div class="feed-y-leyenda">
    <div class="feed">
      ${feed.map((c, i) => `<div class="casilla casilla--${c.tipo}"><span class="casilla__n">${i + 1}</span><span class="casilla__texto">${e(c.texto)}</span></div>`).join('')}
    </div>
    <div class="leyenda">
      <p><span class="muestra muestra--reel"></span><span><b>Reel</b> · método o mercado. Pantalla o cara a cámara, texto sobre la imagen, 20–40 s.</span></p>
      <p><span class="muestra muestra--frase"></span><span><b>Frase</b> · una de las suyas, ya publicada en el canal, con fecha. Negro, una línea dorada, nada más.</span></p>
      <p><span class="muestra muestra--vida"></span><span><b>Vida</b> · foto o reel corto. Luz dura, sin filtro. Gym, escritorio, calle, lectura.</span></p>
      <p><span class="muestra muestra--carrusel"></span><span><b>Carrusel</b> · un concepto en seis slides. Es lo que más se guarda.</span></p>
      <p><span class="muestra muestra--comunidad"></span><span><b>Comunidad</b> · captura del canal con el sello «Ejemplo» y los niveles tapados, o la hora de publicación día tras día.</span></p>
      <p class="nota">La cuadrícula se lee de arriba abajo con ritmo: oscuro, negro, luz. Sin plantilla repetida: cada frase se compone distinto, cada foto tiene otra luz. Lo que ordena es la paleta —negro, oro plano, hueso— no un marco.</p>
    </div>
  </div>
</section>`;

const instagram3 = `
<section class="seccion" id="historias">
  <p class="rotulo">05 · Instagram · historias</p>
  <h2>Las destacadas son la estantería del perfil. Seis, con nombre corto.</h2>
  <div class="destacadas">
    ${destacadas.map(([n, d]) => `<div class="destacada"><span class="destacada__circulo"></span><b>${e(n)}</b><span>${e(d)}</span></div>`).join('')}
  </div>
  <p class="nota">Portadas iguales: símbolo o inicial en oro sobre negro. Lo que <strong>no</strong> hay: «Resultados», «Ganancias», «Testimonios». Una destacada con capturas de P&amp;L es lo primero que revisa Meta en esta categoría, y es la promesa dibujada. La prueba social vive en «El canal» y «Comunidad», y es la constancia y el criterio, no la cifra.</p>

  <h3>Las historias de cada día</h3>
  <table class="semana">
    <tr><th>7:00</th><td>${e(C.historias.apertura)}</td></tr>
    ${C.historias.extras.map((h, i) => `<tr><th>${['Mediodía', 'Tarde', 'Mediodía', 'Tarde', 'Mediodía', 'Noche'][i]}</th><td>${e(h)}</td></tr>`).join('')}
  </table>
  <p class="nota">Dos o tres al día. La de las 7:00 es fija y es la que lleva a la landing: es el gesto que convierte el ritual del canal en tráfico. Las demás rotan; el sistema propone cuál cada día.</p>
</section>`;

const instagram4 = `
<section class="seccion" id="grabar">
  <p class="rotulo">06 · Instagram · qué grabar</p>
  <h2>Cada pieza sale con gancho, qué grabar y pie. Esto es una muestra; el banco entero está en el sistema.</h2>

  <h3>Reel · método</h3>
  ${C.instagram.reelMetodo.slice(0, 2).map((r) => `<div class="pieza"><b>${e(r.gancho)}</b><p><span class="k">Grabar</span> ${e(r.grabar)}</p><p><span class="k">Pie</span> ${e(r.pie)}</p></div>`).join('')}

  <h3>Vida</h3>
  ${C.instagram.vida.slice(0, 2).map((r) => `<div class="pieza"><b>${e(r.idea)}</b><p><span class="k">Grabar</span> ${e(r.grabar)}</p><p><span class="k">Pie</span> ${e(r.pie)}</p></div>`).join('')}

  <h3>Carrusel</h3>
  <div class="pieza"><b>${e(C.instagram.carrusel[0].tema)}</b><ol class="slides">${C.instagram.carrusel[0].slides.map((s) => `<li>${e(s)}</li>`).join('')}</ol></div>

  <h3>Cómo se escribe un pie</h3>
  <p class="nota">Gancho de una línea → la idea → el porqué → una invitación suave («en el canal, cada idea va con eso») → nada de hashtags de dinero. Tres a cinco hashtags de método si acaso. El enlace siempre es «el de la bio»; nunca el del broker.</p>
</section>`;

const telegram1 = `
<section class="seccion" id="ritual">
  <p class="rotulo">07 · Telegram · el ritual</p>
  <h2>Un mensaje a la misma hora todos los días de mercado. Eso ya existe; hay que protegerlo.</h2>
  <p class="lead">Las capturas del canal prueban publicación entre las 7:00 y las 7:45 desde mayo, sin faltar. Esa constancia es la mejor prueba social que tiene el club y es verificable entrando. Alrededor de ese ritual se construye la semana.</p>

  <table class="semana">
    ${[1, 2, 3, 4, 5, 6, 0].map((d) => `<tr><th>${DIAS[d]}</th><td><b>${e(C.semana[d].tema)}</b><br>${C.semana[d].telegram.map((m) => `<span class="hora">${m.hora}</span> ${e(m.titulo)}`).join('<br>')}</td></tr>`).join('')}
  </table>

  <h3>Qué es cada cosa</h3>
  <ul class="lista">
    <li><b>La apertura (L–V, 7:00).</b> Agenda del día, qué mira, qué no hace, la regla del día. En el grupo Free no van niveles: van al canal de análisis. Es lo que hace que el grupo abierto tenga valor sin regalar el producto.</li>
    <li><b>El audio del lunes.</b> Voz de Cristian, 2 a 4 minutos, celular, sin editar. Es lo que más acerca. Empieza siempre señalando a los nuevos el mensaje fijado.</li>
    <li><b>Historia de un miembro (martes).</b> La decisión, con permiso, sin la cifra. El modelo es el mensaje del lotaje: alguien que ganó y aun así se corrigió.</li>
    <li><b>Educación (miércoles).</b> Un concepto, explicado como lo explicaría él. Termina con una pregunta que se pueda responder: es lo que activa el grupo.</li>
    <li><b>Mercado (jueves).</b> Qué pasó y por qué importa. Nunca «va a subir». Se explica lo que pasó, no lo que pasará.</li>
    <li><b>Cierre (viernes).</b> Lo que salió y lo que no, comentado igual. La única invitación semanal al canal de análisis, con la declaración de partner debajo.</li>
    <li><b>Sábado.</b> Cuerpo, mentalidad, propósito. Es la tesis, no el relleno.</li>
    <li><b>Domingo.</b> La agenda de la semana que viene. El mensaje más corto y el que más se guarda.</li>
  </ul>
</section>`;

const ejemplo = (titulo, hora, texto) => `<div class="burbuja"><span class="burbuja__meta">${e(titulo)} · ${hora}</span><p>${huecos(texto)}</p></div>`;

const telegram2 = `
<section class="seccion" id="suenan">
  <p class="rotulo">08 · Telegram · así suenan</p>
  <h2>Uno de cada. Lo que va <mark>[entre corchetes]</mark> lo escribe Cristian esa mañana: es dato de mercado y no se inventa.</h2>
  <div class="burbujas">
    ${ejemplo('La apertura', '7:00', C.bancos.apertura[0].replace('{{frase}}', C.frases[0]))}
    ${ejemplo('Historia de un miembro', 'martes 18:00', C.bancos.historiaMiembro[0])}
    ${ejemplo('Educación', 'miércoles 18:00', C.bancos.educacion[1].texto)}
  </div>
  <div class="burbujas">
    ${ejemplo('Mercado', 'jueves 18:00', C.bancos.mercado[1])}
    ${ejemplo('Cierre de semana', 'viernes 17:00', C.bancos.cierre[0])}
    ${ejemplo('Sábado', '10:00', C.bancos.cuerpo[0])}
    ${ejemplo('La semana que viene', 'domingo 19:00', C.bancos.agenda[0])}
  </div>
  <p class="nota">Hay ${Object.values(C.bancos).reduce((a, b) => a + b.length, 0)} mensajes en el banco. Rotan por semana, así que dos lunes seguidos no repiten texto. Todos pasaron por la revisión de cumplimiento antes de entrar.</p>
</section>`;

const telegram3 = `
<section class="seccion" id="remarketing">
  <p class="rotulo">09 · Telegram · el remarketing</p>
  <h2>Los primeros siete días deciden si se queda. Y un canal no puede mandar una secuencia distinta a cada persona.</h2>
  <p class="lead">Eso pide un bot. Mientras no lo haya, la secuencia se publica una vez, se fija, y cada lunes el audio empieza señalándola. Son siete mensajes, uno por día de la primera semana de quien llega. Es lo que hay que mandar para que el registro se convierta en hábito y el hábito en confianza.</p>
  <ol class="bienvenida">
    ${C.bienvenida.map((b) => `<li><b>Día ${b.dia} · ${e(b.titulo)}</b><span>${e(b.texto.split('\n').filter(Boolean)[1] || b.texto.split('\n')[0])}</span></li>`).join('')}
  </ol>
  <p class="nota">El broker no aparece hasta el día 5, y aparece como transparencia («dónde está el truco»), no como oferta. Empujarlo el día uno quema la lista: es la lección que ya dejaron las capturas del canal con «440 pips en premium».</p>

  <h3>Fase 2 · el bot</h3>
  <p class="nota">Un bot de Telegram permite tres cosas que el canal no: mandar la bienvenida a cada persona el día que entra, mandarla en privado, y saber quién la abrió. Y convierte el «copiar y abrir el canal» del sistema en «enviar». Se monta cuando el ritmo semanal esté rodando; antes sería automatizar algo que todavía no existe.</p>
</section>`;

const escalera = `
<section class="seccion" id="escalera">
  <p class="rotulo">10 · La escalera de oferta</p>
  <h2>El grupo abierto promete que nadie te va a estar vendiendo. Se cumple con un calendario, no con buena voluntad.</h2>
  <table class="semana">
    <tr><th>Free → análisis</th><td>Una vez a la semana, en el cierre del viernes: «así se entra». Y siempre en el mensaje fijado. Nunca en la apertura, nunca por privado sin que pregunten.</td></tr>
    <tr><th>Análisis → formación</th><td>Una vez al mes, el primer viernes, después del cierre: el mensaje de formación. En el canal de análisis, cuando una idea se comenta a fondo: «esto lo trabajamos en formación», sin enlace. <em>[POR CONFIRMAR: qué incluye GOLD, VIP y PREMIUM, precio, cupos]</em></td></tr>
    <tr><th>Formación → clases privadas</th><td>Solo por privado y solo a quien lo pida. La puerta se abre una vez al mes con el tercer mensaje mensual. <em>[POR CONFIRMAR: formato, duración, precio, cupos]</em></td></tr>
  </table>

  <h3>Los tres mensajes mensuales</h3>
  <div class="burbujas">
    ${C.bancos.mensuales.map((m) => ejemplo(m.titulo, 'primer viernes, 17:30', m.texto)).join('')}
  </div>
  <p class="nota">Rotan: un mes transparencia, otro formación, otro clases privadas. Así la oferta de pago aparece en el grupo abierto <strong>una vez al mes</strong>, y la mitad de las veces lo que aparece es la transparencia sobre cómo gana el club, no una venta.</p>
</section>`;

const sistema = `
<section class="seccion" id="sistema">
  <p class="rotulo">11 · El sistema</p>
  <h2>thegoldensyndicate.com/plan. Con contraseña. Cada mañana dice qué toca.</h2>
  <p class="lead">No hay que recordar nada de esta página. El sistema lo sabe: qué día es, qué mensaje de Telegram toca a qué hora, ya escrito, con los huecos de mercado marcados; qué publicar en Instagram, con gancho, qué grabar y pie; qué historias; y la regla del día, que rellena sola la apertura.</p>
  <ul class="lista">
    <li><b>Copiar y abrir el canal.</b> Un botón copia el mensaje y abre Telegram en el canal. Se pega y se manda. Cuando haya bot, ese botón manda directo.</li>
    <li><b>Rota solo.</b> Cada banco tiene varias versiones; se eligen por semana del año. Dos lunes seguidos no repiten texto.</li>
    <li><b>Sabe qué viernes es.</b> El mensaje mensual solo aparece el primer viernes del mes, y rota entre transparencia, formación y clases privadas.</li>
    <li><b>La semana entera a la vista.</b> Y las reglas de qué sí y qué no, todos los días, antes de publicar.</li>
    <li><b>La bienvenida, lista para fijar.</b> Los siete mensajes, con botón de copiar.</li>
    <li><b>Editable.</b> Todo sale de un solo archivo, <code>calendario.mjs</code>. Cambiar un mensaje ahí cambia el sistema y esta página.</li>
  </ul>
  <h3>Lo que el sistema no hace, a propósito</h3>
  <p class="nota">No inventa datos de mercado. Lo que va entre corchetes lo escribe Cristian esa mañana, porque es lo único que no puede saberse antes. Y no publica solo: en categoría financiera, un mensaje que nadie leyó antes de salir es un riesgo que no compensa el minuto que ahorra.</p>
</section>`;

const medicion = `
<section class="seccion" id="medicion">
  <p class="rotulo">12 · Cómo se sabe si funciona</p>
  <h2>Una métrica por etapa. Los primeros sesenta días existen para llenar esta tabla.</h2>
  <table class="semana">
    <tr><th>Instagram</th><td>Retención a 3 s y a 50 % en reels. Guardados y compartidos en carruseles. Clics en el enlace de la bio.</td></tr>
    <tr><th>Landing</th><td>Conversión a registro. Ya mide con UTM: se sabe de qué contenido vino cada uno.</td></tr>
    <tr><th>Telegram Free</th><td>% de registrados que entran. Retención a 7 y 30 días. Vistas de la apertura sobre miembros.</td></tr>
    <tr><th>Canal de análisis</th><td>% de miembros del Free que abren cuenta y pasan. % que sigue operando al mes.</td></tr>
    <tr><th>Formación y privadas</th><td>% que pregunta por privado tras el mensaje mensual. % que compra. <em>[POR CONFIRMAR: capacidad de Cristian]</em></td></tr>
  </table>
  <h3>Revisión semanal, quince minutos</h3>
  <ul class="lista">
    <li>Las tres piezas que mejor funcionaron y por qué. Las tres peores.</li>
    <li>Vistas de la apertura del canal: si bajan, el ritual se está rompiendo.</li>
    <li>Preguntas que llegaron por privado: son el material del audio del lunes y del reel del jueves.</li>
    <li>Cualquier cosa publicada que roce una regla: se corrige el banco, no se discute.</li>
  </ul>
  <h3>Lo que sigue abierto</h3>
  <ul class="lista">
    <li><b>Formación:</b> qué incluye cada grupo, precio, cupos. Sin eso el mensaje mensual sale con huecos.</li>
    <li><b>Clases privadas:</b> formato, duración, precio, cuántas al mes puede dar Cristian.</li>
    <li><b>El píxel de Meta:</b> sin él no hay medición de la landing desde pauta.</li>
    <li><b>Términos del programa de Exness</b> sobre condicionar el acceso a un depósito: leerlos antes de seguir con ese paso.</li>
    <li><b>El bot de Telegram</b>, fase 2, cuando el ritmo semanal lleve un mes rodando.</li>
  </ul>
  <p class="descargo">${e(C.descargo)} ${e(C.partner)}</p>
</section>`;

/* ---------- el documento ---------- */

const css = `
/* Página larga, misma paleta que el plan. Móvil primero. */
*, *::before, *::after { box-sizing: border-box; }
html { background: #0A0A0B; color-scheme: dark; scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body { margin: 0; color: #F2EDE3; font-family: "Manrope", system-ui, sans-serif; font-size: 1rem; line-height: 1.6; background: #0A0A0B; }
a { color: #E7C67F; text-underline-offset: 3px; }

.cabecera { position: sticky; top: 0; z-index: 5; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.85rem 1.25rem; background: rgba(10,10,11,0.85); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid rgba(242,237,227,0.08); }
.marca { display: inline-flex; align-items: center; gap: 0.6rem; color: #D2A64B; text-decoration: none; font-family: "IBM Plex Mono", monospace; font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; }
.marca svg { width: 20px; height: 32px; }
.volver { font-size: 0.875rem; color: #F2EDE3; }

.indice { max-width: 68rem; margin: 2rem auto 0; padding: 0 1.25rem; }
.indice ol { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.4rem 0.6rem; }
.indice a { display: inline-block; padding: 0.4rem 0.8rem; border: 1px solid rgba(242,237,227,0.08); border-radius: 999px; color: #F2EDE3; text-decoration: none; font-size: 0.8125rem; }
.indice a:hover { border-color: #D2A64B; color: #E7C67F; }
.indice b { color: #8A8578; font-weight: 400; font-family: "IBM Plex Mono", monospace; font-size: 0.7rem; margin-right: 0.4rem; }

.seccion { max-width: 68rem; margin: 0 auto; padding: 4.5rem 1.25rem 1.5rem; scroll-margin-top: 4.5rem; }
.seccion + .seccion { border-top: 1px solid rgba(242,237,227,0.06); margin-top: 2.5rem; }
@media (min-width: 48rem) { .seccion { padding: 5.5rem 1.5rem 2rem; } }

.rotulo { font-family: "IBM Plex Mono", monospace; font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; color: #D2A64B; margin: 0 0 1rem; }
h1 { font-size: clamp(2.2rem, 7vw, 4rem); font-weight: 500; line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 1.25rem; }
h2 { font-size: clamp(1.4rem, 3.6vw, 1.9rem); font-weight: 500; line-height: 1.25; letter-spacing: -0.015em; margin: 0 0 1rem; max-width: 40rem; }
h3 { font-family: "IBM Plex Mono", monospace; font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: #D2A64B; font-weight: 500; margin: 2.25rem 0 0.75rem; }
h3.si { color: #D2A64B; } h3.no { color: #C96A5B; }
p { margin: 0 0 0.85rem; }
.lead { font-size: 1.125rem; margin-bottom: 1.5rem; max-width: 44rem; }
.nota { color: #8A8578; font-size: 0.9375rem; max-width: 44rem; }
.gris { color: #8A8578; }
b, strong { font-weight: 600; }
em { color: #E7C67F; font-style: normal; font-family: "IBM Plex Mono", monospace; font-size: 0.8rem; }
code { font-family: "IBM Plex Mono", monospace; font-size: 0.85em; color: #E7C67F; }
mark { background: rgba(210,166,75,0.18); color: #E7C67F; padding: 0 0.2em; border-radius: 3px; }
ul, ol { margin: 0; padding-left: 1.2rem; }
li { margin: 0 0 0.5rem; }
li::marker { color: #6F6B60; }

table { width: 100%; border-collapse: collapse; margin: 0.25rem 0 0.75rem; }
th, td { text-align: left; vertical-align: top; padding: 0.8rem 0.75rem 0.8rem 0; border-top: 1px solid rgba(242,237,227,0.08); font-size: 0.9375rem; }
th { width: 8.5rem; font-weight: 500; color: #D2A64B; font-family: "IBM Plex Mono", monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; padding-top: 0.95rem; }
tr:first-child th, tr:first-child td { border-top: 0; }
@media (max-width: 40rem) { th, td { display: block; width: auto; padding: 0.35rem 0; } th { padding-top: 0.9rem; } td { border-top: 0; padding-bottom: 0.9rem; } tr + tr th { border-top: 1px solid rgba(242,237,227,0.08); } }
.ejes th { width: 11rem; }
.pct { width: 3.5rem; font-family: "IBM Plex Mono", monospace; color: #E7C67F; }
.hora { font-family: "IBM Plex Mono", monospace; color: #8A8578; font-size: 0.8rem; }
.dos { display: grid; gap: 1.5rem; }
@media (min-width: 46rem) { .dos { grid-template-columns: 1fr 1fr; gap: 2.5rem; } }
.cita { margin: 0 0 0.85rem; padding: 0.9rem 1.1rem; border-left: 2px solid #D2A64B; background: #121214; font-size: 0.9375rem; max-width: 44rem; }
.cita.bio { font-size: 1.05rem; line-height: 1.6; }
.lista li { margin-bottom: 0.7rem; max-width: 44rem; }
.descargo { margin-top: 3rem; font-size: 0.8125rem; color: #6F6B60; max-width: 44rem; }

/* portada */
.portada { position: relative; padding-top: 3.5rem; padding-bottom: 2rem; min-height: 60vh; display: flex; flex-direction: column; justify-content: flex-end; }
.portada__simbolo { position: absolute; top: 2rem; right: 1.25rem; width: clamp(80px, 18vw, 180px); height: auto; opacity: 0.85; }
.portada__sub { font-size: 1.15rem; color: #8A8578; max-width: 34rem; }
.portada__pie { font-family: "IBM Plex Mono", monospace; font-size: 0.72rem; color: #6F6B60; letter-spacing: 0.08em; margin-top: 2rem; }

/* escalera */
.escalera { list-style: none; padding: 0; counter-reset: paso; display: grid; gap: 0; margin-bottom: 0.5rem; }
.escalera li { counter-increment: paso; display: grid; grid-template-columns: 2.5rem 1fr; gap: 0.25rem 0.75rem; align-items: start; padding: 0.9rem 0; border-top: 1px solid rgba(242,237,227,0.08); }
.escalera li::before { content: counter(paso, decimal-leading-zero); font-family: "IBM Plex Mono", monospace; color: #D2A64B; font-size: 0.8rem; padding-top: 0.2rem; grid-row: span 2; }
.escalera b { font-weight: 500; }
.escalera span { color: #8A8578; font-size: 0.9375rem; }
@media (min-width: 46rem) { .escalera li { grid-template-columns: 2.5rem 11rem 1fr; } .escalera li::before { grid-row: auto; } }

/* feed */
.feed-y-leyenda { display: grid; gap: 2rem; align-items: start; }
@media (min-width: 52rem) { .feed-y-leyenda { grid-template-columns: minmax(0, 24rem) 1fr; gap: 3rem; } }
.feed { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; max-width: 24rem; }
.casilla { aspect-ratio: 1; position: relative; padding: 0.55rem; display: flex; align-items: flex-end; font-size: 0.68rem; line-height: 1.3; overflow: hidden; }
.casilla__n { position: absolute; top: 0.45rem; left: 0.55rem; font-family: "IBM Plex Mono", monospace; font-size: 0.6rem; color: rgba(242,237,227,0.55); }
.casilla--reel { background: linear-gradient(180deg, #1a1a1d, #0d0d0f); }
.casilla--reel::after { content: ''; position: absolute; top: 0.5rem; right: 0.5rem; border-left: 0.55rem solid rgba(242,237,227,0.7); border-top: 0.35rem solid transparent; border-bottom: 0.35rem solid transparent; }
.casilla--frase { background: #0A0A0B; border: 1px solid rgba(210,166,75,0.35); font-weight: 500; font-size: 0.64rem; }
.casilla--frase::before { content: ''; position: absolute; top: 0.55rem; left: 0.55rem; width: 1.4rem; height: 1px; background: #D2A64B; }
.casilla--vida { background: linear-gradient(160deg, #6F6B60 0%, #3a3833 55%, #1a1917 100%); }
.casilla--carrusel { background: #121214; border: 1px solid rgba(242,237,227,0.1); }
.casilla--carrusel::after { content: '• • •'; position: absolute; top: 0.4rem; right: 0.55rem; color: #D2A64B; font-size: 0.55rem; }
.casilla--comunidad { background: #F2EDE3; color: #0A0A0B; }
.casilla--comunidad::after { content: 'EJEMPLO'; position: absolute; top: 0.45rem; right: 0.5rem; font-family: "IBM Plex Mono", monospace; font-size: 0.5rem; letter-spacing: 0.1em; border: 1px solid #0A0A0B; padding: 0.05rem 0.25rem; }
.casilla--comunidad .casilla__n { color: rgba(10,10,11,0.5); }
.leyenda p { font-size: 0.9375rem; margin-bottom: 0.85rem; display: grid; grid-template-columns: 1.4rem 1fr; gap: 0.6rem; align-items: start; }
.leyenda p.nota { display: block; margin-top: 1.25rem; }
.muestra { display: inline-block; width: 1.1rem; height: 1.1rem; border-radius: 2px; margin-top: 0.2rem; }
.muestra--reel { background: #1a1a1d; } .muestra--frase { background: #0A0A0B; border: 1px solid rgba(210,166,75,0.5); } .muestra--vida { background: #6F6B60; } .muestra--carrusel { background: #121214; border: 1px solid rgba(242,237,227,0.15); } .muestra--comunidad { background: #F2EDE3; }

/* destacadas */
.destacadas { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem 1.25rem; margin: 1rem 0 1rem; }
@media (min-width: 46rem) { .destacadas { grid-template-columns: repeat(3, 1fr); } }
.destacada { display: grid; gap: 0.35rem; font-size: 0.9rem; color: #8A8578; }
.destacada b { color: #F2EDE3; font-weight: 500; }
.destacada__circulo { width: 4rem; height: 4rem; border-radius: 50%; border: 1.5px solid #D2A64B; background: radial-gradient(circle at 50% 40%, #1a1a1d, #0A0A0B); position: relative; }
.destacada__circulo::after { content: ''; position: absolute; left: 50%; top: 50%; width: 1.2rem; height: 1px; background: #D2A64B; transform: translate(-50%, -50%); }

/* piezas */
.pieza { padding: 0.9rem 0; border-top: 1px solid rgba(242,237,227,0.08); font-size: 0.9375rem; max-width: 44rem; }
.pieza b { display: block; font-weight: 500; margin-bottom: 0.3rem; }
.pieza p { margin: 0 0 0.3rem; }
.k { font-family: "IBM Plex Mono", monospace; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: #8A8578; margin-right: 0.4rem; }
.slides { padding-left: 1.2rem; margin-top: 0.3rem; }
.slides li { margin-bottom: 0.25rem; }

/* telegram */
.burbujas { display: grid; gap: 1rem; margin: 1rem 0; max-width: 40rem; }
.burbuja { background: #121214; border: 1px solid rgba(242,237,227,0.08); border-radius: 14px 14px 14px 4px; padding: 0.85rem 1.1rem; font-size: 0.9375rem; line-height: 1.55; }
.burbuja__meta { display: block; font-family: "IBM Plex Mono", monospace; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: #D2A64B; margin-bottom: 0.4rem; }
.burbuja p { margin: 0; }
.bienvenida { list-style: none; padding: 0; display: grid; gap: 0; max-width: 44rem; }
.bienvenida li { display: grid; gap: 0.15rem; padding: 0.8rem 0; border-top: 1px solid rgba(242,237,227,0.08); font-size: 0.9375rem; }
.bienvenida b { font-weight: 500; }
.bienvenida span { color: #8A8578; }
@media (min-width: 46rem) { .bienvenida li { grid-template-columns: 14rem 1fr; gap: 1rem; } }

.pie { border-top: 1px solid rgba(242,237,227,0.08); padding: 2rem 1.25rem 3rem; max-width: 68rem; margin: 3rem auto 0; color: #6F6B60; font-size: 0.8125rem; }
`;

const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="color-scheme" content="dark">
<title>Estrategia digital · The Golden Syndicate</title>
<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${css}</style></head>
<body>
<header class="cabecera">
  <a class="marca" href="/plan/"><svg viewBox="391 475 250 393" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${simbolo}</svg><span>The Golden Syndicate · la estrategia</span></a>
  <a class="volver" href="/plan/">← El plan de hoy</a>
</header>
<nav class="indice" aria-label="Índice"><ol>${[["idea","La idea"],["reglas","Las reglas"],["instagram","Instagram"],["feed","El feed"],["historias","Historias"],["grabar","Qué grabar"],["ritual","Telegram"],["suenan","Así suenan"],["remarketing","Remarketing"],["escalera","La escalera"],["sistema","El sistema"],["medicion","Medición"]].map(([id, t], i) => `<li><a href="#${id}"><b>${String(i + 1).padStart(2, '0')}</b>${t}</a></li>`).join('')}</ol></nav>
<main>${portada}${idea}${reglas}${instagram1}${instagram2}${instagram3}${instagram4}${telegram1}${telegram2}${telegram3}${escalera}${sistema}${medicion}</main>
<footer class="pie">IAGINATION · ${e(fecha)} · Se genera con <code>herramientas/estrategia.mjs</code> a partir de <code>calendario.mjs</code>. Cambiar un mensaje ahí cambia esta página y el plan diario.</footer>
</body></html>`;

fs.writeFileSync(path.join(web, "plan/estrategia.html"), html);

console.log("  plan/estrategia.html");
