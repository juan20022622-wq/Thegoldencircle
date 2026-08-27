/* Arnés de auditoría de la landing.
   Pegar en la consola del navegador, o cargar como script y llamar a la función.
   Mide contraste real componiendo capas translúcidas, objetivos táctiles,
   jerarquía de encabezados, desborde, SEO, seguridad y tics de página generada. */

(() => {
  const R = { fallos: [], avisos: [], datos: {} };
  const fallo = (c, m) => R.fallos.push(c + ': ' + m);
  const aviso = (c, m) => R.avisos.push(c + ': ' + m);

  /* ---------- contraste real, leído del DOM ---------- */
  const lum = rgb => {
    const c = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const parse = s => (s.match(/[\d.]+/g) || []).map(Number);
  /* Compone las capas translúcidas sobre lo que tienen debajo. Sin esto, un
     rgba(255,255,255,0.015) se lee como blanco puro y el contraste sale mal:
     la primera corrida reportó cuatro fallos de contraste que no existían. */
  const fondoDe = el => {
    const capas = [];
    let e = el;
    while (e) {
      const v = parse(getComputedStyle(e).backgroundColor);
      const a = v.length === 4 ? v[3] : 1;
      if (a > 0) { capas.push({ c: v.slice(0, 3), a }); if (a === 1) break; }
      e = e.parentElement;
    }
    if (!capas.length) return [10, 10, 11];
    let base = capas[capas.length - 1].a === 1 ? capas.pop().c : [10, 10, 11];
    for (let i = capas.length - 1; i >= 0; i--) {
      const { c, a } = capas[i];
      base = base.map((v, k) => c[k] * a + v * (1 - a));
    }
    return base;
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

  const textos = [...document.querySelectorAll('p,h1,h2,h3,li,a,button,label,dt,dd,span,summary,figcaption')]
    .filter(e => e.offsetParent !== null && e.textContent.trim() && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));

  let peorC = { r: 99, sel: '' };
  textos.forEach(e => {
    const st = getComputedStyle(e);
    const px = parseFloat(st.fontSize);
    const grande = px >= 24 || (px >= 18.66 && +st.fontWeight >= 700);
    const r = ratio(parse(st.color), fondoDe(e));
    const min = grande ? 3 : 4.5;
    if (r < min) fallo('contraste', `${e.tagName}.${(e.className || '').toString().split(' ')[0]} ${r.toFixed(2)}:1 (mín ${min}) "${e.textContent.trim().slice(0, 32)}"`);
    if (r < peorC.r) peorC = { r, sel: e.tagName + '.' + (e.className || '').toString().split(' ')[0] };
    if (px < 12) aviso('tamaño', `${e.tagName}.${(e.className || '').toString().split(' ')[0]} ${px}px`);
  });
  R.datos.peorContraste = peorC.r.toFixed(2) + ':1 en ' + peorC.sel;
  R.datos.textosMedidos = textos.length;

  /* ---------- objetivos táctiles ---------- */
  const tocables = [...document.querySelectorAll('a,button,input,summary,[role="tab"]')].filter(e => e.offsetParent !== null);
  const chicos = tocables.filter(e => { const b = e.getBoundingClientRect(); return b.height < 44 && b.width < 44; });
  R.datos.objetivosTactiles = tocables.length;
  chicos.forEach(e => aviso('objetivo táctil', `${e.tagName}.${(e.className || '').toString().split(' ')[0]} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`));

  /* ---------- jerarquía de encabezados ---------- */
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  R.datos.h1 = document.querySelectorAll('h1').length;
  if (R.datos.h1 !== 1) fallo('encabezados', `hay ${R.datos.h1} h1, debe haber 1`);
  let prev = 0;
  hs.forEach(h => { const n = +h.tagName[1]; if (prev && n > prev + 1) fallo('encabezados', `salto h${prev} a h${n}: "${h.textContent.trim().slice(0, 30)}"`); prev = n; });
  R.datos.encabezados = hs.map(h => h.tagName).join(' ');

  /* ---------- accesibilidad ---------- */
  [...document.querySelectorAll('img')].forEach(i => { if (!i.hasAttribute('alt')) fallo('a11y', 'img sin alt: ' + i.src.slice(-40)); });
  [...document.querySelectorAll('svg')].forEach(s => {
    if (s.getAttribute('aria-hidden') === 'true') return;
    if (!s.getAttribute('role') && !s.getAttribute('aria-label')) aviso('a11y', 'svg sin role ni aria-label');
  });
  [...document.querySelectorAll('a[target="_blank"]')].forEach(a => { if (!/noopener/.test(a.rel)) fallo('seguridad', 'target=_blank sin noopener: ' + a.href); });
  [...document.querySelectorAll('button')].forEach(b => { if (!b.textContent.trim() && !b.getAttribute('aria-label')) fallo('a11y', 'botón sin nombre accesible'); });

  /* ---------- estados atascados ---------- */
  const invisibles = [...document.querySelectorAll('[data-flujo]')].filter(e => {
    const b = e.getBoundingClientRect();
    return b.top < window.innerHeight && b.bottom > 0 && getComputedStyle(e).opacity === '0';
  });
  R.datos.piezasSinPintar = invisibles.length;

  /* ---------- desborde ---------- */
  R.datos.desbordeX = document.documentElement.scrollWidth > window.innerWidth + 1;
  if (R.datos.desbordeX) {
    [...document.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 3).forEach(e => fallo('desborde', e.tagName + '.' + (e.className || '').toString().split(' ')[0]));
  }

  /* ---------- SEO ---------- */
  const t = document.title, d = document.querySelector('meta[name="description"]');
  R.datos.tituloLargo = t.length;
  if (t.length > 60) aviso('seo', `title de ${t.length} caracteres, se corta sobre 60`);
  if (!d) fallo('seo', 'sin meta description');
  else { R.datos.descripcionLargo = d.content.length; if (d.content.length > 160) aviso('seo', `description de ${d.content.length}, se corta sobre 160`); }
  if (!document.documentElement.lang) fallo('seo', 'sin lang en <html>');
  if (!document.querySelector('link[rel="canonical"]')) fallo('seo', 'sin canonical');
  R.datos.jsonLd = document.querySelectorAll('script[type="application/ld+json"]').length;
  if (!R.datos.jsonLd) fallo('seo', 'sin datos estructurados JSON-LD');
  const og = document.querySelector('meta[property="og:image"]');
  if (og && /REEMPLAZAR/.test(og.content)) aviso('seo', 'og:image apunta a un dominio sin definir');

  /* ---------- seguridad ---------- */
  const inline = [...document.querySelectorAll('*')].filter(e => [...e.attributes].some(a => /^on/i.test(a.name)));
  R.datos.manejadoresEnLinea = inline.length;
  if (inline.length) fallo('seguridad', `${inline.length} manejadores on* en línea (rompen una CSP estricta)`);
  const externos = [...document.querySelectorAll('script[src],link[rel="stylesheet"]')]
    .map(e => e.src || e.href).filter(u => u && !u.startsWith(location.origin));
  R.datos.recursosExternos = [...new Set(externos.map(u => new URL(u).host))];

  /* ---------- tics de página generada ---------- */
  const txt = document.body.innerText;
  const tics = [];
  if (/—/.test(txt)) tics.push('guiones largos');
  if (/\bdesbloquea\b|\bpotencia\b|\bempodera\b|\brevoluciona\b/i.test(txt)) tics.push('verbos de folleto');
  if (/\ben el mundo actual\b|\bhoy en día\b/i.test(txt)) tics.push('apertura de relleno');
  const grads = [...document.querySelectorAll('*')].filter(e => /gradient/.test(getComputedStyle(e).backgroundImage) && getComputedStyle(e).webkitBackgroundClip === 'text');
  if (grads.length) tics.push('texto con degradado');
  const centrado = [...document.querySelectorAll('section')].filter(s => getComputedStyle(s).textAlign === 'center');
  if (centrado.length > 1) tics.push('secciones centradas en cadena');
  R.datos.ticsIA = tics.length ? tics : 'ninguno';

  /* ---------- volumen ---------- */
  R.datos.altoPagina = document.body.scrollHeight;
  R.datos.secciones = document.querySelectorAll('section').length;
  R.datos.elementosVisuales = document.querySelectorAll('img,svg,canvas,video,rect,line,circle,path,polyline').length;
  R.datos.animaciones = (() => {
    let n = 0;
    for (const h of document.styleSheets) { let rs; try { rs = h.cssRules } catch (e) { continue } for (const r of rs) if (r.type === 7) n++; }
    return n;
  })();

  R.resumen = `${R.fallos.length} fallos · ${R.avisos.length} avisos`;
  return R;
})()
