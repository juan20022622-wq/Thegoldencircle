/* The Golden Syndicate · movimiento e interacción
   Vocabulario tomado de iagination.co: curva cubic-bezier(0.16, 1, 0.3, 1),
   revelados escalonados, trazado de SVG. Sin dependencias.

   Regla de construcción: la página funciona sin este archivo. Aquí solo se
   enciende lo que mejora la experiencia; nunca lo que la hace legible. */

(function () {
  'use strict';

  var raiz = document.documentElement;
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  raiz.classList.remove('sin-js');
  requestAnimationFrame(function () { raiz.classList.add('cargado'); });

  var anio = document.querySelector('[data-anio]');
  if (anio) anio.textContent = String(new Date().getFullYear());

  /* ================= revelado al entrar en pantalla ================= */

  if (quieto || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.revelar').forEach(function (el) { el.classList.add('dentro'); });
  } else {
    var vigia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('dentro');
        vigia.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

    document.querySelectorAll('.revelar').forEach(function (el) { vigia.observe(el); });
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
