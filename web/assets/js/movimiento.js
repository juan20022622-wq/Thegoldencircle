/* The Golden Syndicate · movimiento
   ---------------------------------------------------------------------------
   Una sola línea de tiempo para toda la página.

   Antes había un IntersectionObserver que encendía cada elemento al cruzar un
   umbral. Eso produce exactamente la sensación que hay que evitar: se baja y
   las cosas van apareciendo de a una, con el mismo fade-in en todas. Es uno de
   los tics que delatan a una página generada.

   Ahora una sola pasada, disparada por el scroll, publica --p en cada pieza:
   su avance por el encuadre de 0 a 1. Nadie "aparece": todo está siempre
   interpolando y el scroll mueve un campo entero.

   La respiración compartida vive en keyframes CSS con el mismo ciclo de 11 s.
   Arrancan todas con la página, así que siguen sincronizadas, pero corren en
   el compositor y no cuestan recálculo de estilo.

   Coste: cero con la página quieta. Al hacer scroll, una pasada por fotograma
   como mucho, solo sobre las piezas cercanas al encuadre, y solo se escribe en
   el DOM cuando el valor redondeado cambia.
   --------------------------------------------------------------------------- */

(function () {
  'use strict';

  var raiz = document.documentElement;
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  raiz.classList.remove('sin-js');
  requestAnimationFrame(function () { raiz.classList.add('cargado'); });

  var anio = document.querySelector('[data-anio]');
  if (anio) anio.textContent = String(new Date().getFullYear());

  /* ================= el reloj ================= */

  var piezas = [];
  var alto = window.innerHeight;

  function censar() {
    piezas = [].slice.call(document.querySelectorAll('[data-flujo]')).map(function (el) {
      return { el: el, ultimo: -1 };
    });
    alto = window.innerHeight;
  }

  /* Entra rápido y se asienta: la misma sensación que la curva
     cubic-bezier(0.16, 1, 0.3, 1) que usa el resto de la página. */
  function curva(t) { return 1 - Math.pow(1 - t, 3); }

  function pasada() {
    pendiente = false;

    for (var i = 0; i < piezas.length; i++) {
      var p = piezas[i];
      var caja = p.el.getBoundingClientRect();

      /* Fuera del encuadre ampliado no se toca: ni se lee ni se escribe. */
      if (caja.bottom < -alto * 0.3 || caja.top > alto * 1.3) continue;

      var bruto = (alto - caja.top) / (alto * 0.42);
      var v = curva(Math.min(1, Math.max(0, bruto)));
      var red = Math.round(v * 100) / 100;

      if (red !== p.ultimo) {
        p.ultimo = red;
        p.el.style.setProperty('--p', red);
      }
    }
  }

  /* El bucle solo corre mientras hay scroll, y como mucho una vez por
     fotograma. Con la página quieta no cuesta nada.

     La versión anterior corría siempre y además escribía --respiro en <html>
     sesenta veces por segundo. Cada escritura invalidaba el estilo del
     documento entero: 1,33 ms medidos, o sea 80 ms de cada 1000 quemados sin
     que nadie estuviera mirando. En un teléfono eso es la mayor parte del
     presupuesto de fotograma, sostenido, y el navegador acaba matando la
     pestaña y recargándola. La respiración vive ahora en keyframes CSS. */
  var pendiente = false;

  function pedirPasada() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(pasada);
  }

  if (quieto) {
    document.querySelectorAll('[data-flujo]').forEach(function (el) { el.style.setProperty('--p', '1'); });
  } else {
    censar();
    pedirPasada();
    window.addEventListener('scroll', pedirPasada, { passive: true });
    window.addEventListener('resize', function () { censar(); pedirPasada(); }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) pedirPasada();
    });
  }

  /* Las cinco llaves ya no son una pestaña: se ven las cinco a la vez, así que
     el bloque que las alternaba se retiró. */

  /* ================= la consola del camino ================= */

  (function consola() {
    var caja = document.querySelector('[data-consola]');
    if (!caja) return;

    var pasos = [].slice.call(caja.querySelectorAll('.paso'));
    if (pasos.length < 2) return;

    var puntos    = caja.querySelector('[data-puntos]');
    var atras     = caja.querySelector('[data-atras]');
    var siguiente = caja.querySelector('[data-siguiente]');
    var numero    = caja.querySelector('[data-numero]');
    var titulo    = caja.querySelector('[data-titulo]');
    var actual    = caja.querySelector('[data-actual]');
    var avance    = caja.querySelector('[data-avance]');

    var VUELTA = 182.2;          /* 2·π·29, igual que en el CSS */
    var indice = 0;

    caja.classList.add('consola--viva');

    pasos.forEach(function (p, i) {
      p.id = 'paso-' + (i + 1);
      p.setAttribute('role', 'tabpanel');

      var punto = document.createElement('button');
      punto.type = 'button';
      punto.setAttribute('role', 'tab');
      punto.setAttribute('aria-controls', p.id);
      punto.setAttribute('aria-label', 'Paso ' + (i + 1) + ': ' + p.getAttribute('data-titulo-paso'));
      punto.addEventListener('click', function () { ir(i); });
      puntos.appendChild(punto);
    });

    function ir(destino, foco) {
      var atrasVa = destino < indice;
      indice = Math.min(pasos.length - 1, Math.max(0, destino));

      pasos.forEach(function (p, i) {
        if (i === indice) {
          p.setAttribute('data-visible', '');
          if (atrasVa) p.setAttribute('data-atras', ''); else p.removeAttribute('data-atras');
        } else {
          p.removeAttribute('data-visible');
        }
      });

      [].slice.call(puntos.children).forEach(function (b, i) {
        b.setAttribute('aria-current', String(i === indice));
      });

      var n = indice + 1;
      numero.textContent = n < 10 ? '0' + n : String(n);
      titulo.textContent = pasos[indice].getAttribute('data-titulo-paso');
      actual.textContent = String(n);
      avance.style.strokeDashoffset = (VUELTA - (VUELTA * n / pasos.length)).toFixed(1);

      atras.disabled = indice === 0;
      siguiente.textContent = indice === pasos.length - 1 ? 'Volver al inicio' : 'Siguiente';

      if (foco) pasos[indice].setAttribute('tabindex', '-1'), pasos[indice].focus();
    }

    atras.addEventListener('click', function () { ir(indice - 1, true); });

    siguiente.addEventListener('click', function () {
      ir(indice === pasos.length - 1 ? 0 : indice + 1, true);
    });

    /* Deslizar en móvil. Solo cuenta si el gesto es claramente horizontal,
       para no robarle el scroll a la página. */
    var x0 = null, y0 = null;

    caja.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });

    caja.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) {
        ir(dx < 0 ? indice + 1 : indice - 1);
      }
      x0 = y0 = null;
    }, { passive: true });

    ir(0);
  })();

  /* ================= los mazos ================= */

  /* Los pasos de ejecución y las capturas de los miembros se pasan de lado.
     El desplazamiento lo hace el navegador —scroll-snap sobre un contenedor
     con overflow-x— así que hay inercia, rueda, teclado y foco sin escribir
     física ni robarle el scroll vertical a la página.

     Lo único que pone el JS es la inclinación: publica en cada carta --d, su
     distancia con signo al centro de la pista, y --e, esa distancia en valor
     absoluto. El CSS las rota y las apaga. De ahí sale el aire de baraja.

     Se escribe en el estilo de la carta, no en <html>: invalida su subárbol y
     nada más. Es lo que distingue esto de la respiración que tumbaba la
     pestaña. Aun así solo corre mientras el dedo mueve una pista, como mucho
     una vez por fotograma, y solo cuando el valor redondeado cambia. */

  [].slice.call(document.querySelectorAll('[data-baraja]')).forEach(function (caja) {
    var pista  = caja.querySelector('[data-pista]');
    var cartas = [].slice.call(pista.children);
    if (cartas.length < 2) return;

    var previos = cartas.map(function () { return null; });
    var frente  = -1;
    var espera  = false;

    /* ---- el mando ---- */

    var mando = document.createElement('div');
    mando.className = 'baraja__mando';
    mando.innerHTML =
      '<p class="baraja__cuenta"><b data-cuenta>01</b> / ' + pad(cartas.length) + '</p>' +
      '<span class="baraja__carril" data-carril aria-hidden="true"></span>' +
      boton('atras', 'Anterior', 'M10 3 5 8l5 5') +
      boton('siguiente', 'Siguiente', 'm6 3 5 5-5 5');
    caja.appendChild(mando);
    caja.classList.add('baraja--viva');

    var cuenta  = mando.querySelector('[data-cuenta]');
    var carril  = mando.querySelector('[data-carril]');
    var atras   = mando.querySelector('[data-atras]');
    var adelante = mando.querySelector('[data-siguiente]');

    atras.addEventListener('click', function () { llevar(frente - 1); });
    adelante.addEventListener('click', function () { llevar(frente + 1); });

    function boton(nombre, etiqueta, trazo) {
      return '<button type="button" class="baraja__flecha" data-' + nombre +
        ' aria-label="' + etiqueta + '" aria-controls="' + pista.id + '">' +
        '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" ' +
        'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="' + trazo + '"/></svg></button>';
    }

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function llevar(i) {
      i = Math.max(0, Math.min(cartas.length - 1, i));
      var carta = cartas[i];
      pista.scrollTo({
        left: carta.offsetLeft - (pista.clientWidth - carta.offsetWidth) / 2,
        behavior: quieto ? 'auto' : 'smooth'
      });
    }

    /* ---- la inclinación ---- */

    /* Todo sale de una cifra: cuánto se ha recorrido de la pista, de 0 a 1,
       repartido entre las cartas. De ahí la distancia de cada una al frente sin
       leer una caja por carta.

       Se mide contra los extremos del desplazamiento y no contra el centro de
       la pista. Midiendo al centro, la carta uno llegaba inclinada y apagada:
       en el arranque no está centrada, porque no se puede desplazar a la
       izquierda de cero. */

    function repartir() {
      espera = false;

      /* Si caben todas —una pantalla ancha con pocas cartas— no hay nada que
         repartir: se quedan rectas y manda la primera. */
      var tope = pista.scrollWidth - pista.clientWidth;
      var pos = tope > 0 ? (pista.scrollLeft / tope) * (cartas.length - 1) : 0;
      var cerca = Math.round(pos);

      for (var i = 0; i < cartas.length; i++) {
        var d = Math.max(-1.5, Math.min(1.5, i - pos));
        var red = Math.round(d * 100) / 100;
        if (red !== previos[i]) {
          previos[i] = red;
          cartas[i].style.setProperty("--d", red);
          cartas[i].style.setProperty("--e", Math.min(1, Math.abs(red)));
        }
      }

      if (cerca === frente) return;

      if (frente >= 0) cartas[frente].removeAttribute("data-frente");
      frente = cerca;
      cartas[frente].setAttribute("data-frente", "");
      cuenta.textContent = pad(frente + 1);
      carril.style.setProperty("--avance", ((frente + 1) / cartas.length).toFixed(3));
      atras.disabled = frente === 0;
      adelante.disabled = frente === cartas.length - 1;
    }

    function pedirReparto() {
      if (espera) return;
      espera = true;
      requestAnimationFrame(repartir);
    }

    pista.addEventListener('scroll', pedirReparto, { passive: true });
    window.addEventListener('resize', pedirReparto, { passive: true });
    pedirReparto();
  });


  /* ================= los planes ================= */

  /* Un interruptor y una tarjeta. La cifra recorre el camino entre los dos
     precios en medio segundo; solo corre al tocar, así que no cuesta nada en
     reposo. Los niveles son tres columnas de las que se elige una. */

  (function planes() {
    var caja = document.querySelector('[data-planes]');
    if (caja) {
      var cifra = caja.querySelector('[data-plan-cifra]');
      var nombre = caja.querySelector('[data-plan-nombre]');
      var moneda = caja.querySelector('[data-plan-moneda]');
      var nota = caja.querySelector('[data-plan-nota]');
      var equivale = caja.querySelector('[data-plan-equivale]');
      var botones = [].slice.call(caja.querySelectorAll('[data-plan-boton]'));
      var actual = 330;
      var animando = null;

      function formato(n) { return 'US$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

      function irA(plan) {
        caja.setAttribute('data-plan', plan);
        botones.forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-plan-boton') === plan)); });
        nombre.textContent = plan === 'anual' ? 'Premium · anual' : 'Premium · mes a mes';
        moneda.textContent = plan === 'anual' ? 'al año · 6.000.000 COP' : 'al mes · 1.000.000 COP';
        nota.textContent = nota.getAttribute(plan === 'anual' ? 'data-nota-anual' : 'data-nota-mes');
        equivale.hidden = plan !== 'anual';

        var destino = Number(cifra.getAttribute(plan === 'anual' ? 'data-anual' : 'data-mes'));
        if (quieto) { actual = destino; cifra.textContent = formato(destino); return; }

        var desde = actual, t0 = null;
        if (animando) cancelAnimationFrame(animando);
        function paso(t) {
          if (t0 === null) t0 = t;
          var k = Math.min(1, (t - t0) / 480);
          var e = 1 - Math.pow(1 - k, 3);
          actual = desde + (destino - desde) * e;
          cifra.textContent = formato(actual);
          if (k < 1) animando = requestAnimationFrame(paso); else { animando = null; actual = destino; }
        }
        animando = requestAnimationFrame(paso);
      }

      botones.forEach(function (b) {
        b.addEventListener('click', function () { irA(b.getAttribute('data-plan-boton')); });
      });
    }

    var niveles = document.querySelector('[data-niveles]');
    if (niveles) {
      var tabs = [].slice.call(niveles.querySelectorAll('[data-nivel-boton]'));
      tabs.forEach(function (b) {
        b.addEventListener('click', function () {
          var n = b.getAttribute('data-nivel-boton');
          niveles.setAttribute('data-nivel', n);
          tabs.forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
        });
      });
    }
  })();


  /* ================= recorrer el gráfico ================= */

  (function recorrer() {
    var caja = document.querySelector('[data-recorrer]');
    if (!caja) return;
    var pista = document.querySelector('[data-pista]');
    var tocado = false;

    function mover(e) {
      var r = caja.getBoundingClientRect();
      var f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      /* la última vela se ve a partir de 0.83: se estira para que el borde
         derecho de la caja sea el final */
      caja.style.setProperty('--p', (f * 0.9 + 0.1).toFixed(3));
      caja.style.setProperty('--sx', f.toFixed(4));
      caja.style.setProperty('--sa', '1');
      if (!tocado && pista) { tocado = true; pista.classList.add('grafico__pista--vista'); }
    }
    function soltar() {
      caja.style.removeProperty('--p');
      caja.style.setProperty('--sa', '0');
    }
    caja.addEventListener('pointermove', mover);
    caja.addEventListener('pointerdown', mover);
    caja.addEventListener('pointerleave', soltar);
    caja.addEventListener('pointercancel', soltar);
    caja.addEventListener('pointerup', function () { if (window.matchMedia('(hover: none)').matches) soltar(); });
  })();

  /* ================= la próxima apertura ================= */

  /* La apertura sale entre las 7:00 y las 7:45 de Bogotá cada día de mercado, y
     eso ya se cumple desde mayo. Bogotá no cambia de hora: 7:00 son las 12:00
     UTC, siempre. Se actualiza cada medio minuto con un temporizador, no con
     fotogramas. */
  (function proxima() {
    var cajas = [].slice.call(document.querySelectorAll('[data-proxima]'));
    if (!cajas.length) return;
    var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    function calcular() {
      var ahora = Date.now();
      var bog = new Date(ahora - 5 * 3600000);              /* reloj de Bogotá, en campos UTC */
      var dia = bog.getUTCDay();
      var hoy7 = Date.UTC(bog.getUTCFullYear(), bog.getUTCMonth(), bog.getUTCDate(), 7, 0, 0) + 5 * 3600000;
      var esMercado = dia >= 1 && dia <= 5;

      var textoCuando, textoCuenta;
      if (esMercado && ahora >= hoy7 && ahora < hoy7 + 45 * 60000) {
        textoCuando = 'está saliendo ahora'; textoCuenta = '';
      } else {
      var objetivo = hoy7, saltos = 0;
      if (!esMercado || ahora >= hoy7) {
        do { objetivo += 86400000; saltos++; } while ((dia + saltos) % 7 === 0 || (dia + saltos) % 7 === 6);
      }
      var etiqueta = saltos === 0 ? 'hoy' : saltos === 1 ? 'mañana' : 'el ' + DIAS[(dia + saltos) % 7];
      var falta = Math.max(0, objetivo - ahora);
      var hrs = Math.floor(falta / 3600000), min = Math.floor((falta % 3600000) / 60000);
      textoCuando = etiqueta + ' a las 7:00';
      textoCuenta = 'faltan ' + (hrs ? hrs + ' h ' : '') + min + ' min';
      }
      cajas.forEach(function (caja) {
        caja.querySelector('[data-proxima-cuando]').textContent = textoCuando;
        caja.querySelector('[data-proxima-cuenta]').textContent = textoCuenta;
      });
    }

    calcular();
    cajas.forEach(function (caja) { caja.hidden = false; });
    setInterval(calcular, 30000);
  })();

  /* ================= la luz en el vidrio y la carta inclinada ================= */

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    [].slice.call(document.querySelectorAll('.vidrio')).forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });

    [].slice.call(document.querySelectorAll('.baraja__pista')).forEach(function (pista) {
      pista.addEventListener('pointermove', function (e) {
        /* Se mira la carta al frente y si el puntero está dentro de su caja,
           no e.target: así vale igual sobre la imagen, el texto o el borde. */
        var carta = pista.querySelector('.carta[data-frente]');
        if (!carta) return;
        var r = carta.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
          carta.style.removeProperty('--tx'); carta.style.removeProperty('--ty'); return;
        }
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        carta.style.setProperty('--tx', (x * 6).toFixed(2) + 'deg');
        carta.style.setProperty('--ty', (-y * 6).toFixed(2) + 'deg');
      });
      pista.addEventListener('pointerleave', function () {
        [].slice.call(pista.querySelectorAll('.carta')).forEach(function (c) { c.style.removeProperty('--tx'); c.style.removeProperty('--ty'); });
      });
    });
  }


  /* ================= el scanner =================
     Las condiciones se tocan y la alerta de ejemplo las refleja. Nada más. */
  (function scanner() {
    var caja = document.querySelector('[data-scanner]');
    if (!caja) return;
    var chips = [].slice.call(caja.querySelectorAll('[data-criterio]'));
    var lista = caja.querySelector('[data-alerta-lista]');
    var vacia = caja.querySelector('[data-alerta-vacia]');
    var n = caja.querySelector('[data-alerta-n]');
    function pinta() {
      var activas = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; });
      lista.innerHTML = activas.map(function (c) { var li = document.createElement('li'); li.textContent = c.getAttribute('data-criterio'); return li.outerHTML; }).join('');
      n.textContent = String(activas.length);
      vacia.hidden = activas.length > 0; lista.hidden = activas.length === 0;
      caja.setAttribute('data-vacio', String(activas.length === 0));
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true')); pinta(); }); });
    pinta();
  })();

  /* ================= el selector del scanner =================
     Tres opciones y un precio. Solo cambia texto al tocar. */
  (function scannerPlanes() {
    var caja = document.querySelector('[data-scanner-oferta]');
    if (!caja) return;
    var botones = [].slice.call(caja.querySelectorAll('[data-scanner-plan]'));
    if (!botones.length) return;
    var cifra = caja.querySelector('[data-scanner-cifra]');
    var periodo = caja.querySelector('[data-scanner-periodo]');
    var detalle = caja.querySelector('[data-scanner-detalle]');
    var planes = {
      oro:  { cifra: 'US$50', periodo: 'al mes · oro y bitcoin', detalle: 'Alertas todos los días, cuando algo cumple tus criterios.' },
      step: { cifra: 'US$50', periodo: 'al mes · Step Index, índices sintéticos', detalle: 'Alertas todos los días, cuando algo cumple tus criterios.' },
      pack: { cifra: 'US$80', periodo: 'al mes · los dos scanners', detalle: 'Oro y bitcoin más Step Index. <b>US$20 menos</b> que por separado.' }
    };
    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        var p = planes[b.getAttribute('data-scanner-plan')];
        botones.forEach(function (o) { o.setAttribute('aria-selected', String(o === b)); });
        cifra.textContent = p.cifra; periodo.textContent = p.periodo; detalle.innerHTML = p.detalle;
      });
    });
  })();

  /* ================= la barra fija =================
     Se muestra cuando el botón del héroe ya no se ve y se retira al llegar al
     formulario. Un observador, cero fotogramas. */
  (function fijo() {
    var barra = document.querySelector('[data-fijo]');
    if (!barra || !('IntersectionObserver' in window)) return;
    var heroe = document.querySelector('.heroe .boton');
    var registro = document.getElementById('registro');
    var ve = { heroe: true, registro: false };
    function pinta() {
      var mostrar = !ve.heroe && !ve.registro;
      barra.classList.toggle('fijo--visible', mostrar);
      barra.setAttribute('aria-hidden', String(!mostrar));
      document.body.classList.toggle('con-fijo', mostrar);
    }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.target === heroe) ve.heroe = e.isIntersecting; else ve.registro = e.isIntersecting; });
      pinta();
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    if (heroe) io.observe(heroe);
    if (registro) io.observe(registro);
  })();

  /* ================= el estado del mercado y el progreso =================
     El oro cotiza de domingo en la noche a viernes en la tarde. Es verdad y se
     calcula; no depende de a qué hora publique nadie. */
  (function mercado() {
    var caja = document.querySelector('[data-mercado]');
    if (!caja) return;
    var texto = caja.querySelector('[data-mercado-texto]');
    function pinta() {
      var d = new Date(), dia = d.getUTCDay(), hora = d.getUTCHours();
      var abierto = (dia === 0 && hora >= 22) || (dia >= 1 && dia <= 4) || (dia === 5 && hora < 22);
      texto.textContent = abierto ? 'El oro se está moviendo ahora' : 'El oro vuelve a abrir el domingo';
      caja.setAttribute('data-abierto', String(abierto));
    }
    pinta(); setInterval(pinta, 60000);
  })();

  (function progreso() {
    var caja = document.querySelector('[data-progreso]');
    var nombre = document.getElementById('nombre'), whatsapp = document.getElementById('whatsapp');
    if (!caja || !nombre || !whatsapp) return;
    var barra = caja.querySelector('i'), texto = caja.querySelector('[data-progreso-texto]');
    var frases = ['Te faltan dos datos', 'Falta uno y entras', 'Listo: pulsa el botón'];
    function pinta() {
      var k = (nombre.value.trim().length > 1 ? 1 : 0) + (whatsapp.value.replace(/\D/g, '').length >= 7 ? 1 : 0);
      barra.style.width = (k * 50) + '%'; texto.textContent = frases[k]; caja.setAttribute('data-listo', String(k === 2));
    }
    [nombre, whatsapp].forEach(function (c) { c.addEventListener('input', pinta); });
    pinta();
  })();
})();
