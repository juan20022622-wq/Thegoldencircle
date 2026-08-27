/* The Golden Syndicate · movimiento
   Mismo vocabulario que iagination.co: revelado por IntersectionObserver con
   la curva cubic-bezier(0.16, 1, 0.3, 1) y escalonado por elemento.
   Sin dependencias. Si el visitante pidió menos movimiento, no se observa nada
   y todo queda visible desde el primer pintado. */

(function () {
  'use strict';

  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Entrada de página: el titular y la barra flotante. */
  requestAnimationFrame(function () {
    document.documentElement.classList.add('cargado');
  });

  if (quieto || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.revelar, .paso').forEach(function (el) {
      el.classList.add('dentro');
    });
    return;
  }

  /* ---------- revelado al entrar en pantalla ---------- */

  var vigia = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('dentro');
      vigia.unobserve(e.target);           // se revela una vez y se suelta
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

  document.querySelectorAll('.revelar').forEach(function (el) { vigia.observe(el); });

  /* ---------- el camino se dibuja al bajar ---------- */

  var camino = document.querySelector('[data-camino]');

  if (camino) {
    var pasos = camino.querySelectorAll('.paso');

    /* Cada paso enciende su marca al llegar al centro. Clase aparte de
       .dentro: esa la usa el revelado y no se puede quitar al salir. */
    var vigiaPasos = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        e.target.classList.toggle('activo', e.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    pasos.forEach(function (p) { vigiaPasos.observe(p); });

    /* La línea vertical avanza con el scroll, sin listener por fotograma. */
    var pendiente = false;

    function avance() {
      pendiente = false;
      var caja = camino.getBoundingClientRect();
      var centro = window.innerHeight * 0.55;
      var recorrido = (centro - caja.top) / caja.height;
      camino.style.setProperty('--avance', Math.min(1, Math.max(0, recorrido)).toFixed(3));
    }

    window.addEventListener('scroll', function () {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(avance);
    }, { passive: true });

    avance();
  }

  /* ---------- los anillos se trazan cuando la sección aparece ---------- */

  var anillos = document.querySelector('[data-anillos]');
  if (anillos) vigia.observe(anillos);
})();
