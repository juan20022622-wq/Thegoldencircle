/* El plan · The Golden Syndicate
   ---------------------------------------------------------------------------
   Lee calendario.json y muestra qué toca hoy: los mensajes de Telegram ya
   escritos, el post de Instagram, las historias, la semana entera y las reglas.

   Nada se inventa aquí. Lo que el JSON deja entre {{llaves}} es dato de mercado
   y se marca en pantalla para que Cristian lo rellene esa mañana. Lo único que
   se rellena solo es {{frase}}: la regla del día, que sale de las suyas.

   "Copiar y abrir el canal": copia el texto y abre Telegram en el canal. Un
   canal no acepta texto prellenado desde fuera sin un bot, así que pegar es el
   gesto que queda. Cuando haya bot, este botón manda directo.
   --------------------------------------------------------------------------- */

(function () {
  'use strict';

  var ZONA = 'America/Bogota';
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var datos = null;
  var desplazamiento = 0;   /* días respecto a hoy */

  var $ = function (s, raiz) { return (raiz || document).querySelector(s); };
  var $$ = function (s, raiz) { return [].slice.call((raiz || document).querySelectorAll(s)); };

  /* ---------- fechas en Bogotá ---------- */

  function hoyEnBogota() {
    var f = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' })
      .format(new Date());                             /* YYYY-MM-DD */
    var p = f.split('-').map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2]));  /* medianoche UTC de ese día: solo para aritmética */
  }

  function fechaActiva() {
    var d = hoyEnBogota();
    d.setUTCDate(d.getUTCDate() + desplazamiento);
    return d;
  }

  function semanaISO(d) {
    var t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    var dia = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - dia);
    var inicio = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return Math.ceil(((t - inicio) / 86400000 + 1) / 7);
  }

  function diaDelAnio(d) {
    var inicio = Date.UTC(d.getUTCFullYear(), 0, 1);
    return Math.floor((d - inicio) / 86400000) + 1;
  }

  function primerViernesDelMes(d) {
    return d.getUTCDay() === 5 && d.getUTCDate() <= 7;
  }

  function formatoLargo(d) {
    var s = new Intl.DateTimeFormat('es-CO', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' }).format(d);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* ---------- selección rotativa ---------- */

  function elegir(banco, indice) {
    if (!banco || !banco.length) return null;
    return banco[((indice % banco.length) + banco.length) % banco.length];
  }

  function fraseDelDia(d) { return elegir(datos.frases, diaDelAnio(d)); }

  /* ---------- texto ---------- */

  function escapar(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  /* Rellena {{frase}} y deja el resto como hueco marcado. */
  function preparar(texto, d) {
    return texto.replace(/\{\{\s*frase\s*\}\}/g, fraseDelDia(d));
  }

  function aHTML(texto) {
    return escapar(texto).replace(/\{\{([^}]+)\}\}/g, function (_, h) {
      return '<mark class="hueco">[' + h.trim() + ']</mark>';
    });
  }

  function aPortapapeles(texto) {
    return texto.replace(/\{\{([^}]+)\}\}/g, function (_, h) { return '[' + h.trim() + ']'; });
  }

  /* ---------- portapapeles y aviso ---------- */

  var avisoTimer = null;
  function avisar(msg) {
    var a = $('[data-aviso]');
    a.textContent = msg;
    a.hidden = false;
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(function () { a.hidden = true; }, 2200);
  }

  function copiar(texto) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(texto);
    }
    return new Promise(function (ok, no) {
      var ta = document.createElement('textarea');
      ta.value = texto; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) { no(e); }
      document.body.removeChild(ta);
    });
  }

  /* ---------- render: un mensaje ---------- */

  function pintarMensaje(contenedor, opciones) {
    var tpl = $('#tpl-mensaje').content.cloneNode(true);
    var art = $('.mensaje', tpl);
    $('.mensaje__hora', tpl).textContent = opciones.hora || '';
    $('.mensaje__titulo', tpl).textContent = opciones.titulo;
    if (opciones.etiqueta) { var e = $('.mensaje__etiqueta', tpl); e.textContent = opciones.etiqueta; e.hidden = false; }
    if (opciones.fijo) art.classList.add('mensaje--fijo');

    var cuerpo = $('.mensaje__cuerpo', tpl);
    var textoPlano;

    if (opciones.guion) {
      /* audio: se muestra el esquema, se copia como lista */
      cuerpo.innerHTML = '<p><strong>' + escapar(opciones.tema) + '</strong> · 2 a 4 minutos, celular, sin editar.</p><ol>' +
        opciones.guion.map(function (g) { return '<li>' + escapar(g) + '</li>'; }).join('') + '</ol>';
      textoPlano = opciones.tema + '\n\n' + opciones.guion.map(function (g, i) { return (i + 1) + '. ' + g; }).join('\n');
      $('[data-copiar-abrir]', tpl).textContent = 'Abrir el canal para grabar';
    } else {
      cuerpo.innerHTML = aHTML(opciones.texto);
      textoPlano = aPortapapeles(opciones.texto);
    }

    $('[data-copiar]', tpl).addEventListener('click', function () {
      copiar(textoPlano).then(function () { avisar('Copiado.'); }, function () { avisar('No se pudo copiar.'); });
    });
    $('[data-copiar-abrir]', tpl).addEventListener('click', function () {
      copiar(textoPlano).then(function () {
        avisar('Copiado. Pégalo en el canal.');
        window.open(datos.enlaces.canal, '_blank', 'noopener');
      }, function () { window.open(datos.enlaces.canal, '_blank', 'noopener'); });
    });

    contenedor.appendChild(tpl);
  }

  /* ---------- render: el día ---------- */

  function pintarDia() {
    var d = fechaActiva();
    var diaSemana = d.getUTCDay();
    var semana = semanaISO(d);
    var dia = datos.semana[diaSemana];

    $('[data-fecha]').textContent = formatoLargo(d);
    $('[data-hoy]').hidden = desplazamiento === 0;
    $('[data-regla]').textContent = fraseDelDia(d);
    $('[data-tema]').textContent = dia.tema;

    /* Telegram */
    var cont = $('[data-telegram]');
    cont.innerHTML = '';
    dia.telegram.forEach(function (m) {
      if (m.mensual && !primerViernesDelMes(d)) return;
      var banco = datos.bancos[m.banco];
      var pieza = m.mensual ? elegir(banco, d.getUTCMonth()) : elegir(banco, semana);
      if (!pieza) return;

      if (m.tipo === 'audio') {
        pintarMensaje(cont, { hora: m.hora, titulo: m.titulo, etiqueta: 'audio', tema: pieza.tema, guion: pieza.guion });
      } else if (typeof pieza === 'object') {
        pintarMensaje(cont, { hora: m.hora, titulo: m.titulo + (pieza.titulo ? ' · ' + pieza.titulo : ''), etiqueta: m.mensual ? 'una vez al mes' : (pieza.tema || ''), texto: preparar(pieza.texto, d), fijo: m.fijo });
      } else {
        pintarMensaje(cont, { hora: m.hora, titulo: m.titulo, etiqueta: m.fijo ? 'ritual' : '', texto: preparar(pieza, d), fijo: m.fijo });
      }
    });
    if (!cont.children.length) cont.innerHTML = '<p class="bloque__nota">Hoy no se publica nada en Telegram.</p>';

    /* Instagram */
    var ig = datos.semanaIG[diaSemana];
    var igCont = $('[data-instagram]');
    igCont.innerHTML = '';
    if (ig && ig.banco) {
      var pieza = elegir(datos.instagram[ig.banco], semana);
      var html = '<article class="ig"><span class="ig__formato">' + escapar(ig.formato) + '</span>';
      if (pieza.gancho) html += '<p class="ig__gancho">' + escapar(pieza.gancho) + '</p>';
      if (pieza.idea) html += '<p class="ig__gancho">' + escapar(pieza.idea) + '</p>';
      if (pieza.tema) html += '<p class="ig__gancho">' + escapar(pieza.tema) + '</p>';
      html += '<dl>';
      if (pieza.grabar) html += '<div><dt>Qué grabar</dt><dd>' + escapar(pieza.grabar) + '</dd></div>';
      if (pieza.slides) html += '<div><dt>Slides</dt><dd><ol class="ig__slides">' + pieza.slides.map(function (s) { return '<li>' + escapar(s) + '</li>'; }).join('') + '</ol></dd></div>';
      if (pieza.pie) html += '<div><dt>Pie sugerido</dt><dd>' + escapar(pieza.pie) + '</dd></div>';
      if (ig.nota) html += '<div><dt>Nota</dt><dd>' + escapar(ig.nota) + '</dd></div>';
      html += '</dl>';
      html += '</article>';
      igCont.innerHTML = html;
    } else {
      igCont.innerHTML = '<article class="ig"><span class="ig__formato">' + escapar(ig ? ig.formato : 'Descanso') + '</span><p class="bloque__nota" style="margin:0">Hoy no hay publicación en el feed. Historias sí.</p></article>';
    }

    /* Historias */
    var hs = $('[data-historias]');
    hs.innerHTML = '';
    var esMercado = diaSemana >= 1 && diaSemana <= 5;
    if (esMercado) hs.innerHTML += '<li class="historias--fija"><b>7:00</b>' + escapar(datos.historias.apertura) + '</li>';
    var extras = datos.historias.extras;
    var a = elegir(extras, diaDelAnio(d)), b = elegir(extras, diaDelAnio(d) + 3);
    hs.innerHTML += '<li><b>Mediodía</b>' + escapar(a) + '</li>';
    if (b !== a) hs.innerHTML += '<li><b>Tarde</b>' + escapar(b) + '</li>';

    /* Semana */
    var sem = $('[data-semana]');
    sem.innerHTML = '';
    for (var i = 1; i <= 7; i++) {
      var n = i % 7;
      var dd = datos.semana[n], ii = datos.semanaIG[n];
      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'semana__dia';
      if (n === diaSemana) boton.setAttribute('aria-current', 'date');
      boton.innerHTML = '<span class="semana__nombre">' + escapar(DIAS[n]) + '</span>' +
        '<span class="semana__tema">' + escapar(dd.tema) + '</span>' +
        '<span class="semana__meta">' + escapar(ii.formato) + ' · ' + dd.telegram.filter(function (m) { return !m.mensual; }).length + ' en Telegram</span>';
      boton.addEventListener('click', (function (objetivo) {
        return function () { desplazamiento += (objetivo - diaSemana + 7) % 7 || 0; if (objetivo === diaSemana) return; pintarDia(); };
      })(n));
      var li = document.createElement('li'); li.appendChild(boton); sem.appendChild(li);
    }
  }

  /* ---------- render: lo que no cambia ---------- */

  function pintarFijo() {
    $('[data-si]').innerHTML = datos.reglas.si.map(function (r) { return '<li>' + escapar(r) + '</li>'; }).join('');
    $('[data-no]').innerHTML = datos.reglas.no.map(function (r) { return '<li>' + escapar(r) + '</li>'; }).join('');
    $('[data-descargo]').textContent = datos.descargo + ' ' + datos.partner;

    /* la migración: la cuenta personal de Cristian, los primeros diez días */
    var mg = $('[data-migracion]');
    if (mg) {
      var html = '<p class="bloque__nota"><strong>Bio de la personal desde el día 0:</strong> ' + escapar(datos.migracion.bio) + '</p>';
      datos.migracion.dias.forEach(function (d) {
        html += '<article class="ig"><span class="ig__formato">Día ' + d.dia + ' · ' + escapar(d.titulo) + '</span>';
        if (d.publicacion) {
          html += '<p class="ig__gancho">' + escapar(d.publicacion.gancho) + '</p><dl>';
          html += '<div><dt>Formato</dt><dd>' + escapar(d.publicacion.formato) + '</dd></div>';
          if (d.publicacion.grabar) html += '<div><dt>Qué grabar</dt><dd>' + escapar(d.publicacion.grabar) + '</dd></div>';
          if (d.publicacion.slides) html += '<div><dt>Slides</dt><dd><ol class="ig__slides">' + d.publicacion.slides.map(function (x) { return '<li>' + escapar(x) + '</li>'; }).join('') + '</ol></dd></div>';
          if (d.publicacion.pie) html += '<div><dt>Pie</dt><dd>' + escapar(d.publicacion.pie) + '</dd></div>';
          html += '</dl>';
        }
        html += '<dl><div><dt>Historias</dt><dd><ul class="ig__slides">' + d.historias.map(function (x) { return '<li>' + escapar(x) + '</li>'; }).join('') + '</ul></dd></div></dl></article>';
      });
      html += '<p class="bloque__nota">' + escapar(datos.migracion.despues) + '</p>';
      mg.innerHTML = html;
    }

    var bv = $('[data-bienvenida]');
    datos.bienvenida.forEach(function (m) {
      pintarMensaje(bv, { hora: 'Día ' + m.dia, titulo: m.titulo, texto: m.texto });
    });
  }

  /* ---------- arranque ---------- */

  $$('[data-dia]').forEach(function (b) {
    b.addEventListener('click', function () { desplazamiento += Number(b.getAttribute('data-dia')); pintarDia(); });
  });
  $('[data-hoy]').addEventListener('click', function () { desplazamiento = 0; pintarDia(); });

  fetch('/plan/calendario.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (j) { datos = j; pintarFijo(); pintarDia(); })
    .catch(function () {
      $('[data-telegram]').innerHTML = '<p class="bloque__nota">No se pudo cargar el calendario. Recarga la página.</p>';
    });
})();
