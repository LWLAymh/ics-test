(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ICSPaperExport = api;
}(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function stem(content, renderContent, contract) {
    const spans = contract.blankSpans(content), numbers = new Map();
    let text = content.text, prefix = 'ICSPRINTBLANK';
    while (text.includes(prefix)) prefix += 'X';
    spans.forEach(span => { if (!numbers.has(span.blank.id)) numbers.set(span.blank.id, numbers.size + 1); });
    for (const span of spans.slice().reverse()) text = text.slice(0, span.start) + prefix + numbers.get(span.blank.id) + 'END' + text.slice(span.end);
    let html = renderContent({ format: 'markdown', text });
    numbers.forEach(number => {
      html = html.split(prefix + number + 'END').join('<span class="paper-blank"><small>' + number + '</small><span class="paper-blank-line"></span></span>');
    });
    const choices = [];
    numbers.forEach((number, id) => {
      const blank = spans.find(span => span.blank.id === id).blank;
      if (blank.input && blank.input.kind === 'select') choices.push('<li>空 ' + number + (blank.input.multiple ? '（可多选）' : '') + '：' +
        blank.input.options.map(option => escape(option.label)).join(' / ') + '</li>');
    });
    return html + (choices.length ? '<ul class="paper-blank-choices">' + choices.join('') + '</ul>' : '');
  }
  function packet(paper, questions, options) {
    if (!questions.length) throw new Error('这份卷子没有可导出的题目。');
    function unit(q) {
      return stem(q.stem, options.renderContent, options.contract) + (q.options ? '<div class="paper-options">' + q.options.map(option =>
        '<section class="paper-option"><strong>' + escape(option.id) + '.</strong><div>' + options.renderContent(option.content) + '</div></section>').join('') + '</div>' : '');
    }
    return { title: String(paper.title || paper.displayName || 'ICS 练习'), author: String(paper.author_name || paper.author || ''),
      description: String(paper.description || ''), questions: questions.map(q => ({ id: q.id,
        source: options.source(q), html: unit(q) + (q.parts || []).map(part => '<section class="paper-part"><h3>' +
          escape(part.number.display) + '</h3>' + unit(part) + '</section>').join(''), answer: options.renderSolution(q) })) };
  }
  function open(load, options) {
    // Open synchronously during the click, before awaiting bank/network data.
    const channel = crypto.randomUUID(), origin = location.origin;
    const preview = window.open(new URL('./paper-print.html#' + channel, location.href).href, '_blank');
    if (!preview) throw new Error('浏览器阻止了预览窗口，请允许此网站打开新窗口后重试。');
    let value, failure, ready = false;
    const send = () => {
      if (!ready || preview.closed || (!value && !failure)) return;
      preview.postMessage({ type: 'ics-print-data', channel, ...(failure ? { error: failure } : { packet: value }) }, origin);
    };
    const listener = event => {
      if (event.source === preview && event.origin === origin && event.data && event.data.type === 'ics-print-ready' && event.data.channel === channel) { ready = true; send(); }
    };
    window.addEventListener('message', listener);
    const timer = setInterval(() => { if (preview.closed) { clearInterval(timer); window.removeEventListener('message', listener); } }, 2000);
    Promise.resolve().then(load).then(data => { value = packet(data.paper, data.questions, options); send(); })
      .catch(error => { failure = error.message || '读取卷子失败，请返回重试。'; send(); });
  }
  return { packet, stem, open };
}));
