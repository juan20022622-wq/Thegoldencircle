/* The Golden Syndicate · landing
   Sin dependencias. El lead se guarda ANTES de redirigir al canal:
   si la redirección falla, el dato no se pierde. */

(function () {
  'use strict';

  var CFG = window.GS || {};
  var CLAVE_PENDIENTE = 'gs_lead_pendiente';

  /* ---------- píxel de Meta ---------- */

  function cargarPixel(id) {
    if (!id) return;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', id);
    window.fbq('track', 'PageView');
  }

  function evento(nombre, datos) {
    if (window.fbq) window.fbq('track', nombre, datos || {});
  }

  cargarPixel(CFG.pixelId);

  /* ---------- origen del tráfico ---------- */

  var formulario = document.querySelector('form[name="' + (CFG.formulario || 'leads') + '"]');
  if (!formulario) return;

  (function marcarOrigen() {
    var params = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
      .forEach(function (clave) {
        var campo = formulario.querySelector('[name="' + clave + '"]');
        if (campo) campo.value = params.get(clave) || '';
      });
    var ref = formulario.querySelector('[name="referente"]');
    if (ref) ref.value = document.referrer || '';
  })();

  /* ---------- validación ---------- */

  var REGLAS = {
    nombre: {
      valida: function (v) { return v.trim().length >= 2; },
      error: 'Escribe tu nombre.'
    },
    /* Opcional: vacío pasa, pero si escriben algo tiene que ser un correo. */
    correo: {
      valida: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      error: 'Revisa el correo: falta algo.'
    },
    whatsapp: {
      valida: function (v) { return (v.replace(/[^\d]/g, '').length) >= 7; },
      error: 'Escribe tu número con indicativo, por ejemplo +57 300 000 0000.'
    }
  };

  function pintarError(campo, mensaje) {
    var caja = document.getElementById('e-' + campo.name);
    if (caja) caja.textContent = mensaje || '';
    campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
  }

  Object.keys(REGLAS).forEach(function (nombre) {
    var campo = formulario.elements[nombre];
    if (!campo) return;
    campo.addEventListener('blur', function () {
      if (campo.value) pintarError(campo, REGLAS[nombre].valida(campo.value) ? '' : REGLAS[nombre].error);
    });
    campo.addEventListener('input', function () {
      if (campo.getAttribute('aria-invalid') === 'true' && REGLAS[nombre].valida(campo.value)) {
        pintarError(campo, '');
      }
    });
  });

  function validar() {
    var primerFallo = null;
    Object.keys(REGLAS).forEach(function (nombre) {
      var campo = formulario.elements[nombre];
      if (!campo) return;
      var ok = REGLAS[nombre].valida(campo.value);
      pintarError(campo, ok ? '' : REGLAS[nombre].error);
      if (!ok && !primerFallo) primerFallo = campo;
    });
    if (primerFallo) primerFallo.focus();
    return !primerFallo;
  }

  /* ---------- envío ---------- */

  var boton = formulario.querySelector('[data-envio]');
  var fallo = formulario.querySelector('[data-fallo]');

  function cuerpo() {
    var datos = new FormData(formulario);
    datos.set('enviado_en', new Date().toISOString());
    datos.set('pagina', window.location.pathname + window.location.search);
    return new URLSearchParams(datos).toString();
  }

  function guardar(payload) {
    return fetch(CFG.endpoint || '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload
    }).then(function (r) {
      if (!r.ok) throw new Error('respuesta ' + r.status);
      return r;
    });
  }

  function irAlCanal() {
    var destino = '/gracias.html';
    var params = new URLSearchParams(window.location.search);
    var utm = params.get('utm_source');
    window.location.assign(utm ? destino + '?utm_source=' + encodeURIComponent(utm) : destino);
  }

  formulario.addEventListener('submit', function (e) {
    e.preventDefault();
    if (fallo) fallo.hidden = true;
    if (!validar()) return;

    var payload = cuerpo();
    boton.disabled = true;
    boton.textContent = 'Guardando…';

    /* Red de seguridad: si el navegador se cierra o la petición muere,
       el lead queda en el dispositivo y se reintenta en la próxima visita. */
    try { localStorage.setItem(CLAVE_PENDIENTE, payload); } catch (_) {}

    /* Si el guardado falla, se reintenta una vez y, si vuelve a fallar, la
       persona entra igual al canal. Perder a alguien que ya rellenó tres campos
       es peor que retrasar su registro — y el registro no se pierde: queda en
       el dispositivo y se reintenta en la próxima visita.

       La versión anterior le mostraba un error y lo dejaba ahí parado. Con
       Netlify Forms sin detectar el formulario, eso significaba cero entradas
       al canal aunque la gente sí estuviera rellenando. */
    guardar(payload)
      .catch(function () {
        return new Promise(function (r) { setTimeout(r, 900); }).then(function () {
          return guardar(payload);
        });
      })
      .then(function () {
        try { localStorage.removeItem(CLAVE_PENDIENTE); } catch (_) {}
      })
      .catch(function () {
        /* Queda en cola. No se le dice nada: no es su problema. */
      })
      .then(function () {
        evento('Lead', { content_name: 'canal-telegram' });
        irAlCanal();
      });
  });

  /* Reintento de un lead que quedó a medias en una visita anterior. */
  (function reintentar() {
    var pendiente = null;
    try { pendiente = localStorage.getItem(CLAVE_PENDIENTE); } catch (_) {}
    if (!pendiente) return;
    guardar(pendiente).then(function () {
      try { localStorage.removeItem(CLAVE_PENDIENTE); } catch (_) {}
    }).catch(function () {});
  })();
})();
