(function (m, e, t, r, i, k, a) {
  m[i] =
    m[i] ||
    function () {
      (m[i].a = m[i].a || []).push(arguments);
    };
  m[i].l = 1 * new Date();
  for (var j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j].src.indexOf("/metrika/tag.js") !== -1) {
      return;
    }
  }
  k = e.createElement(t);
  a = e.getElementsByTagName(t)[0];
  k.async = 1;
  k.src = r;
  k.onerror = function () {
    k.src = "https://mc.yandex.com/metrika/tag.js";
  };
  if (a && a.parentNode) a.parentNode.insertBefore(k, a);
  else e.head.appendChild(k);
})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(112086282, "init", {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
});
