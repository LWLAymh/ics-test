(function () {
  'use strict';
  const tags = ['p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'ul', 'ol', 'li', 'blockquote',
    'pre', 'code', 'strong', 'em', 'del', 's', 'sup', 'sub', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'span', 'small', 'div', 'section', 'article'];
  const attributes = ['href', 'title', 'src', 'alt', 'class', 'start', 'colspan', 'rowspan', 'align', 'style',
    'loading', 'decoding', 'fetchpriority', 'data-ics-question-image'];
  function safeUrl(value, image) {
    try {
      if (image && /^data:image\/(?:png|jpeg|gif|webp);base64,[a-z0-9+/=\s]+$/i.test(value)) return true;
      const url = new URL(value, location.href);
      return image ? url.origin === location.origin && ['http:', 'https:'].includes(url.protocol)
        : ['http:', 'https:', 'mailto:'].includes(url.protocol);
    } catch (_) { return false; }
  }
  if (window.DOMPurify && window.DOMPurify.isSupported) {
    window.DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
      const name = data.attrName.toLowerCase();
      if (name === 'src' && (node.nodeName !== 'IMG' || !safeUrl(data.attrValue, true))) data.keepAttr = false;
      if (name === 'href' && (node.nodeName !== 'A' || !safeUrl(data.attrValue, false))) data.keepAttr = false;
      // Markdown table alignment is the only authored inline CSS allowed here.
      if (name === 'style' && (!['TH', 'TD'].includes(node.nodeName) || !/^\s*text-align\s*:\s*(left|right|center)\s*;?\s*$/i.test(data.attrValue))) data.keepAttr = false;
    });
    window.DOMPurify.addHook('afterSanitizeAttributes', node => {
      if (node.nodeName === 'A') node.setAttribute('rel', 'noopener noreferrer');
      if (node.nodeName === 'IMG') node.setAttribute('referrerpolicy', 'no-referrer');
    });
  }
  function sanitizeHtml(html) {
    if (!window.DOMPurify || !window.DOMPurify.isSupported) throw new Error('安全渲染组件未加载，请刷新页面后重试。');
    return window.DOMPurify.sanitize(String(html), { ALLOWED_TAGS: tags, ALLOWED_ATTR: attributes,
      ALLOW_DATA_ATTR: false, ALLOW_ARIA_ATTR: false, SANITIZE_DOM: true, SANITIZE_NAMED_PROPS: true });
  }
  window.ICSSecurity = Object.freeze({ sanitizeHtml });
}());
