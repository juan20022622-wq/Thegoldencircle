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
})();
