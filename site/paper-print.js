(function () {
  'use strict';
  const $ = id => document.getElementById(id), channel = location.hash.slice(1);
  let packet, generation = 0;
  function section(q, index, answer) {
    const article = document.createElement('article'); article.className = 'paper-question'; article.dataset.questionId = q.id;
    const heading = document.createElement('h2'); heading.textContent = (index + 1) + '. ' + q.source;
    const id = document.createElement('p'); id.className = 'paper-id'; id.textContent = q.id;
    const content = document.createElement('div'); content.innerHTML = window.ICSSecurity.sanitizeHtml(answer ? q.answer : q.html);
    article.append(heading, id, content); return article;
  }
  const timed = (promise, ms, message) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    Promise.resolve(promise).then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
  async function prepare(root) {
    const current = ++generation; $('print-save').disabled = true; $('print-retry').hidden = true;
    $('print-status').textContent = '正在排版公式并加载图片、字体…';
    try {
      root.querySelectorAll('table').forEach(table => {
        table.classList.toggle('paper-table-wide', Array.from(table.rows).some(row => row.cells.length > 6));
      });
      if (!window.MathJax || !window.MathJax.startup) throw new Error('公式组件未加载，请返回原页面重新打开预览。');
      await timed(window.MathJax.startup.promise, 45000, '公式组件加载超时，请重试。');
      await timed(window.MathJax.typesetPromise([root]), 45000, '公式排版超时，请重试。');
      await timed(Promise.all(Array.from($('paper').querySelectorAll('img')).map(image => image.decode())), 20000, '图片加载超时，请重试。');
      await timed(document.fonts.ready, 20000, '字体加载超时，请重试。');
      if (current !== generation) return;
      $('print-save').disabled = false; $('print-status').textContent = '已就绪 · ' + packet.questions.length + ' 道题。导出、查看答案不会增加作答记录或精选卷参与人数。';
    } catch (error) {
      if (current !== generation) return;
      $('print-status').textContent = '暂不能导出：' + (error.message || '有图片未能加载，请检查网络后重试。'); $('print-retry').hidden = false;
    }
  }
  window.addEventListener('message', event => {
    if (event.source !== window.opener || event.origin !== location.origin || !event.data || event.data.type !== 'ics-print-data' || event.data.channel !== channel || packet) return;
    if (event.data.error) { $('print-status').textContent = event.data.error; return; }
    const value = event.data.packet;
    if (!value || !Array.isArray(value.questions) || !value.questions.length || value.questions.some(q =>
      !/^q-[a-f0-9]{8,64}$/.test(q.id) || ['html', 'answer', 'source'].some(key => typeof q[key] !== 'string'))) return;
    packet = value; document.title = value.title + ' - ICS';
    $('paper-title').textContent = value.title; $('paper-author').textContent = value.author ? '署名：' + value.author : '';
    $('paper-description').textContent = value.description; $('paper-count').textContent = '共 ' + value.questions.length + ' 道题 · 保留整题、选项和稳定编号';
    value.questions.forEach((q, index) => $('paper-questions').append(section(q, index, false)));
    $('paper').hidden = false; $('print-answers').disabled = false; prepare($('paper-questions'));
  });
  $('print-answers').addEventListener('change', () => {
    const answers = $('paper-answers');
    if (window.MathJax.typesetClear) window.MathJax.typesetClear([answers]);
    answers.replaceChildren(); answers.hidden = !$('print-answers').checked;
    if (!answers.hidden) {
      const heading = document.createElement('h1'); heading.textContent = '参考答案与解析'; answers.append(heading);
      packet.questions.forEach((q, index) => answers.append(section(q, index, true)));
    }
    prepare(answers);
  });
  $('print-retry').addEventListener('click', () => {
    $('paper').querySelectorAll('img').forEach(image => { if (!image.naturalWidth) image.src = image.src; }); prepare($('paper'));
  });
  $('print-save').addEventListener('click', () => { if (!$('print-save').disabled) window.print(); });
  // Block Ctrl+P while resources are incomplete instead of printing a blank sheet.
  window.addEventListener('beforeprint', () => document.body.classList.toggle('print-not-ready', $('print-save').disabled));
  if (window.opener && /^[a-f0-9-]{36}$/i.test(channel)) window.opener.postMessage({ type: 'ics-print-ready', channel }, location.origin);
  else $('print-status').textContent = '请从练习网站的“导出 PDF”入口打开此页。';
}());
