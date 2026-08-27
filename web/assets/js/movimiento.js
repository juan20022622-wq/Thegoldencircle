/* The Golden Syndicate · movimiento
   ---------------------------------------------------------------------------
   Una sola línea de tiempo para toda la página.

   Antes había un IntersectionObserver que encendía cada elemento al cruzar un
   umbral. Eso produce exactamente la sensación que hay que evitar: se baja y
   las cosas van apareciendo de a una, con el mismo fade-in en todas. Es uno de
   los tics que delatan a una página generada.

   Ahora un único requestAnimationFrame calcula cada fotograma dos cosas y las
   publica como variables CSS:

     --respiro   una onda lenta y continua, igual para todo el documento. Es lo
                 que hace que el fondo, el oro y los acentos se muevan en la
                 misma respiración en vez de cada uno por su lado.

     --p         el avance de cada pieza por el encuadre, de 0 a 1, recalculado
                 en continuo. Nadie "aparece": todo está siempre interpolando y
                 el scroll mueve un campo entero.

   Coste: solo se recorren las piezas cercanas al encuadre, y solo se escribe
   en el DOM cuando el valor redondeado cambia.
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

  function fotograma(ahora) {
    /* Once segundos por ciclo. Lento a propósito: si se nota, molesta. */
    raiz.style.setProperty('--respiro', (Math.sin(ahora / 11000 * Math.PI * 2) * 0.5 + 0.5).toFixed(4));

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

    requestAnimationFrame(fotograma);
  }

  if (quieto) {
    raiz.style.setProperty('--respiro', '0.5');
    document.querySelectorAll('[data-flujo]').forEach(function (el) { el.style.setProperty('--p', '1'); });
  } else {
    censar();
    window.addEventListener('resize', censar, { passive: true });
    requestAnimationFrame(fotograma);
  }

  /* ================= las cinco llaves ================= */

  (function llaves() {
    var lista = document.querySelector('.llaves');
    var caja  = document.querySelector('[data-textos]');
    if (!lista || !caja) return;

    var botones = [].slice.call(lista.querySelectorAll('button'));
    var textos  = [].slice.call(caja.querySelectorAll('p'));
    if (botones.length !== textos.length) return;

    caja.classList.add('llave__texto--viva');

    function elegir(i, foco) {
      botones.forEach(function (b, k) { b.setAttribute('aria-selected', String(k === i)); });
      textos.forEach(function (p, k) {
        if (k === i) p.setAttribute('data-visible', ''); else p.removeAttribute('data-visible');
      });
      if (foco) botones[i].focus();
    }

    botones.forEach(function (boton, i) {
      boton.addEventListener('click', function () { elegir(i, false); });

      /* Flechas para recorrer las llaves con teclado, como pide el rol tablist. */
      boton.addEventListener('keydown', function (e) {
        var paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!paso) return;
        e.preventDefault();
        elegir((i + paso + botones.length) % botones.length, true);
      });
    });

    elegir(0, false);
  })();

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
