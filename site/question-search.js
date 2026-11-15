(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ICSQuestionSearch = api;
}(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const normalize = value => String(value || '').normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
  function index(questions, papers, modules) {
    const paperMap = new Map(papers.map(p => [p.id, p]));
    const moduleMap = new Map(modules.map(m => [m.id, m.title]));
    return questions.map(question => {
      const paper = paperMap.get(question.paperId), label = [paper?.displayName, question.number.display, question.id].filter(Boolean).join(' · ');
      const units = [question, ...(question.parts || [])];
      // Deliberately exclude solutions: searching should never reveal an answer.
      const body = units.flatMap(unit => [unit.stem.text, ...(unit.options || []).map(option => option.content.text)]).join('\n');
      return { question, label, excerpt: question.stem.text.replace(/!\[[^\]]*\]\([^)]*\)/g, '[图片]').replace(/[`#|*]/g, '').replace(/\s+/g, ' ').slice(0, 200),
        text: normalize(label + ' ' + body + ' ' + question.classification.moduleIds.map(id => moduleMap.get(id)).join(' ')) };
    });
  }
  function search(rows, query) {
    const terms = normalize(query).split(' ').filter(Boolean);
    return terms.length ? rows.filter(row => terms.every(term => row.text.includes(term))) : [];
  }
  function mount(options) {
    const host = options.host;
    host.innerHTML = '<details><summary><strong>搜索题目</strong><span>题面、选项、试卷名或题号</span></summary><div class="ics-history-body"><form class="ics-search-form"><label for="ics-search-query">搜索题库</label><div><input id="ics-search-query" type="search" maxlength="200" placeholder="例如：2025 阶段测验、浮点数、题目编号" autocomplete="off"><button class="ics-secondary" type="submit">搜索</button></div></form><p data-search="status" role="status" aria-live="polite"></p><div data-search="results" class="ics-search-results"></div><button data-search="more" class="ics-secondary" type="button" hidden>显示更多</button></div></details>';
    const input = host.querySelector('input'), status = host.querySelector('[data-search="status"]'), results = host.querySelector('[data-search="results"]'), more = host.querySelector('[data-search="more"]');
    let meta = null, rows = null, pending = null, matches = [], limit = 20, generation = 0, timer;
    function render() {
      results.replaceChildren();
      for (const row of matches.slice(0, limit)) {
        const article = document.createElement('article'), heading = document.createElement('strong'), excerpt = document.createElement('p'), button = document.createElement('button');
        heading.textContent = row.label; excerpt.textContent = row.excerpt; button.type = 'button'; button.className = 'ics-secondary'; button.textContent = '打开练习';
        button.addEventListener('click', () => options.practice(row.question)); article.append(heading, excerpt, button); results.append(article);
      }
      more.hidden = matches.length <= limit;
    }
    async function run() {
      const token = ++generation, query = input.value.trim(); limit = 20;
      if (!query) { matches = []; render(); status.textContent = ''; return; }
      if (!meta) { status.textContent = '题库目录正在加载，请稍后重试。'; return; }
      status.textContent = '正在搜索…';
      try {
        if (!rows) {
          if (!pending) pending = options.loadBank().then(bank => index(bank, meta.papers, meta.catalog.modules)).finally(() => { pending = null; });
          rows = await pending;
        }
        if (token !== generation) return;
        matches = search(rows, query); render(); status.textContent = '找到 ' + matches.length + ' 道题（不搜索参考答案）。';
      } catch (_) { if (token === generation) status.textContent = '题库暂时无法读取，请重新搜索。'; }
    }
    host.querySelector('form').addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); run(); });
    input.addEventListener('input', () => { ++generation; clearTimeout(timer); timer = setTimeout(run, 220); });
    more.addEventListener('click', () => { limit += 20; render(); });
    return { init(value) { meta = value; } };
  }
  return { normalize, index, search, mount };
}));
