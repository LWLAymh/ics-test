(function () {
  'use strict';
  try {
    const saved = localStorage.getItem('lwl-theme');
    const theme = saved === 'light' || saved === 'dark' ? saved : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (_) { /* Theme storage is optional. */ }
  window.MathJax = {
    loader: { paths: { mathjax: new URL('vendor/mathjax', document.currentScript.src).href }, load: ['ui/safe'] },
    tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']], processEscapes: true,
      packages: { '[-]': ['require', 'autoload'] } },
    options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      safeOptions: { allow: { URLs: 'none', classes: 'none', cssIDs: 'none', styles: 'none' },
        safeProtocols: { http: false, https: false, file: false, javascript: false, data: false } } },
    startup: { typeset: false },
  };
}());
