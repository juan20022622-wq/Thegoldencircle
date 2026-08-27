/* ir.html · extraído del HTML para que la CSP pueda prohibir
   todo script en línea. Ver netlify.toml. */

(function () {
  var CFG = window.GS || {};
  var params = new URLSearchParams(window.location.search);
  var origen = params.get('utm_source') || params.get('o') || 'directo';
  var pieza  = params.get('utm_content') || '';

  if (CFG.pixelId) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', CFG.pixelId);
    window.fbq('trackCustom', 'ClicBroker', { origen: origen, pieza: pieza });
  }

  /* [POR CONFIRMAR] si el enlace de partner de Exness admite un parámetro de
     sub-afiliado para cerrar la atribución del lado del broker. Verificar en el
     panel de partner antes de activar esta línea. */
  var destino = CFG.exness;

  var enlace = document.getElementById('destino');
  enlace.setAttribute('href', destino);
  enlace.setAttribute('rel', 'nofollow sponsored noopener');
  setTimeout(function () { window.location.replace(destino); }, 900);
})();
