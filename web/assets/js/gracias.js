/* gracias.html · extraído del HTML para que la CSP pueda prohibir
   todo script en línea. Ver netlify.toml. */

(function () {
  var url = (window.GS && window.GS.telegram) || '#';
  var boton = document.getElementById('canal');
  boton.setAttribute('href', url);

  if (window.GS && window.GS.pixelId) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', window.GS.pixelId);
    window.fbq('track', 'PageView');
    window.fbq('trackCustom', 'AbreCanal');
  }

  /* Apertura automática, con el botón siempre visible como respaldo. */
  if (url.indexOf('http') === 0) {
    setTimeout(function () { window.location.assign(url); }, 1200);
  }
})();
