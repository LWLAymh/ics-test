(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ICSFavorites = api;
}(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const PREFIX = 'ics-favorite-v1:', ID = /^q-[a-f0-9]{8,64}$/;
  const TYPES = { 'single-choice': '单选题', 'multiple-choice': '多选题', fill: '填空题', 'short-answer': '简答题', composite: '综合题' };
  function checkIds(ids) {
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string' || !ID.test(id))) throw new Error('Invalid favorite question IDs');
    return Array.from(new Set(ids));
  }
  function create(getStorage) {
    let saved = new Map(), persistent = true, invalidCount = 0;
    const temporary = new Map();
    function list() {
      return Array.from(new Map([...saved, ...temporary]), ([id, savedAt]) => ({ id, savedAt }))
        .sort((a, b) => b.savedAt.localeCompare(a.savedAt) || a.id.localeCompare(b.id));
    }
    function snapshot() { return { count: list().length, persistent, invalidCount }; }
    function refresh() {
      try {
        const storage = getStorage(), found = new Map(); let invalid = 0;
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (!key || !key.startsWith(PREFIX)) continue;
          const id = key.slice(PREFIX.length); if (!ID.test(id)) continue;
          try {
            const value = JSON.parse(storage.getItem(key));
            if (value?.version !== 1 || typeof value.savedAt !== 'string' || !Number.isFinite(Date.parse(value.savedAt))) throw new Error('Invalid favorite');
            found.set(id, new Date(value.savedAt).toISOString());
          } catch (_) { invalid++; }
        }
        saved = found; invalidCount = invalid; persistent = temporary.size === 0;
      } catch (_) { persistent = false; }
      return snapshot();
    }
    function add(ids) {
      ids = checkIds(ids); refresh();
      const addedIds = [];
      ids.forEach(id => {
        if (saved.has(id)) { temporary.delete(id); return; }
        const savedAt = temporary.get(id) || new Date().toISOString();
        if (!temporary.has(id)) addedIds.push(id);
        // Independent keys avoid unrelated additions in parallel tabs overwriting each other.
        try {
          getStorage().setItem(PREFIX + id, JSON.stringify({ version: 1, savedAt }));
          saved.set(id, savedAt); temporary.delete(id);
        } catch (_) { temporary.set(id, savedAt); persistent = false; }
      });
      refresh(); return { ...snapshot(), addedIds };
    }
    function remove(ids) {
      ids = checkIds(ids); refresh();
      const removedIds = [], failedIds = [];
      ids.forEach(id => {
        if (!saved.has(id) && !temporary.has(id)) return;
        try { if (saved.has(id)) getStorage().removeItem(PREFIX + id); }
        catch (_) { failedIds.push(id); return; }
        saved.delete(id); temporary.delete(id); removedIds.push(id);
      });
      return { ...snapshot(), removedIds, failedIds };
    }
    return { refresh, snapshot, list, add, remove, has: id => saved.has(id) || temporary.has(id) };
  }
  function mount(options) {
    const host = options.host, store = options.store;
    const $ = name => host.querySelector('[data-favorites="' + name + '"]');
    let catalog = null, papers = new Map(), bank = null, loading = null, limit = 30, selected = new Set(), filtered = [];
    host.innerHTML = '<summary><strong>我的收藏</strong><span data-favorites="count">0 题</span></summary><div class="ics-history-body">' +
      '<p class="ics-history-note">仅保存在当前浏览器，不上传服务器。收藏与熟知互不影响；清除浏览器数据会丢失收藏。</p>' +
      '<div class="ics-favorites-filters"><label>来源<select data-favorites="source"><option value="">全部来源</option><option value="pku-exam">PKU 真题</option><option value="csapp-textbook">CSAPP 习题</option></select></label>' +
      '<label>知识模块<select data-favorites="module"><option value="">全部模块</option></select></label><label>题型<select data-favorites="type"><option value="">全部题型</option></select></label>' +
      '<label>搜索<input type="search" data-favorites="search" placeholder="题面、卷名或题号"></label></div>' +
      '<div class="ics-history-selection"><label><input type="checkbox" data-favorites="all" disabled> 选择当前显示</label><span data-favorites="selected">已选 0 题</span>' +
      '<div class="ics-history-selection-actions"><button type="button" class="ics-secondary" data-favorites="export-selected" disabled>导出所选 PDF</button>' +
      '<button type="button" class="ics-secondary" data-favorites="export-filtered" disabled>导出筛选结果 PDF</button><button type="button" class="ics-secondary" data-favorites="remove-selected" disabled>取消收藏所选</button></div></div>' +
      '<p data-favorites="notice" class="ics-history-note" role="status"></p><p data-favorites="status" class="ics-history-note" role="status"></p>' +
      '<div data-favorites="list" class="ics-history-list"></div><button type="button" class="ics-secondary" data-favorites="more" hidden>加载更多收藏</button></div>';
    Object.entries(TYPES).forEach(([value, label]) => { const el = document.createElement('option'); el.value = value; el.textContent = label; $('type').appendChild(el); });
    function name(q) { return [papers.get(q.paperId)?.displayName, q.number.display, TYPES[q.type]].filter(Boolean).join(' · '); }
    function selection() {
      const controls = Array.from($('list').querySelectorAll('[data-favorite-select]'));
      const visible = new Set(controls.map(el => el.dataset.favoriteSelect));
      selected.forEach(id => { if (!visible.has(id)) selected.delete(id); });
      controls.forEach(el => { el.checked = selected.has(el.dataset.favoriteSelect); el.closest('article').classList.toggle('is-selected', el.checked); });
      $('selected').textContent = '已选 ' + selected.size + ' 题';
      $('all').disabled = !controls.length; $('all').checked = selected.size > 0 && selected.size === controls.length;
      $('all').indeterminate = selected.size > 0 && selected.size < controls.length;
      $('remove-selected').disabled = !selected.size;
      $('export-selected').disabled = !filtered.some(item => selected.has(item.id) && item.question);
    }
    function refresh() {
      const snapshot = store.snapshot(); $('count').textContent = snapshot.count + ' 题';
      if (!host.open) return;
      if (!catalog || !bank) { $('status').textContent = '正在加载收藏题目…'; return; }
      const source = $('source').value, module = $('module').value, type = $('type').value, search = $('search').value.trim().toLocaleLowerCase();
      const all = store.list().map(item => ({ ...item, question: bank.get(item.id) }));
      filtered = all.filter(item => {
        const q = item.question;
        if (!q) return !source && !module && !type && (!search || item.id.includes(search));
        return (!source || options.collection(papers.get(q.paperId)) === source) && (!module || q.classification.moduleIds.includes(module)) &&
          (!type || q.type === type) && (!search || [item.id, name(q), q.stem.text, ...(q.parts || []).map(part => part.stem.text)].join(' ').toLocaleLowerCase().includes(search));
      });
      const available = filtered.filter(item => item.question), unavailable = all.filter(item => !item.question).length;
      $('status').textContent = '符合筛选 ' + filtered.length + ' 题，显示 ' + Math.min(filtered.length, limit) + ' 题。' +
        (!snapshot.count ? ' 做题时点击“收藏题目”，或从作答记录批量添加。' : '') +
        (unavailable ? ' ' + unavailable + ' 道收藏题已下架或不在当前题库，仍保留标记，但不参与练习和导出。' : '') +
        (!snapshot.persistent ? ' 浏览器存储不可用，部分收藏仅在当前页面临时保留；刷新可能丢失。' : '') +
        (snapshot.invalidCount ? ' 忽略了 ' + snapshot.invalidCount + ' 条损坏的收藏数据。' : '');
      $('list').replaceChildren();
      filtered.slice(0, limit).forEach(item => {
        const q = item.question, row = document.createElement('article'); row.className = 'ics-history-item';
        const heading = document.createElement('label'); heading.className = 'ics-history-select';
        const check = document.createElement('input'); check.type = 'checkbox'; check.dataset.favoriteSelect = item.id;
        check.setAttribute('aria-label', '选择收藏：' + (q ? name(q) : item.id));
        const title = document.createElement('strong'); title.textContent = q ? name(q) : item.id + ' · 已下架或不可用'; heading.append(check, title);
        const text = document.createElement('p'); text.className = 'ics-favorite-excerpt'; text.textContent = q ? q.stem.text.replace(/\s+/g, ' ').slice(0, 200) : '收藏标记仍在，可手动取消。';
        const note = document.createElement('p'); note.className = 'ics-history-note'; note.textContent = '收藏于 ' + new Date(item.savedAt).toLocaleString('zh-CN') + ' · ' + item.id;
        const actions = document.createElement('div'); actions.className = 'ics-favorite-actions';
        function button(action, label) { const el = document.createElement('button'); el.type = 'button'; el.className = 'ics-secondary'; el.textContent = label; el.dataset.favoriteAction = action; el.dataset.id = item.id; return el; }
        const practice = button('practice', '练习本题'); practice.disabled = !q; actions.append(practice, button('remove', '取消收藏'));
        row.append(heading, text, note, actions); $('list').appendChild(row);
      });
      $('more').hidden = filtered.length <= limit; $('export-filtered').disabled = !available.length; selection();
    }
    async function ensureBank() {
      if (!catalog) { $('status').textContent = '题库尚在加载，请稍后重试。'; return; }
      if (!loading) loading = options.loadBank().then(items => { bank = new Map(items.filter(options.isPublished).map(q => [q.id, q])); })
        .catch(() => { $('status').textContent = '收藏题目加载失败；收起后重新展开可重试，收藏数据仍保留。'; }).finally(() => { loading = null; });
      await loading; if (bank) refresh();
    }
    function remove(ids) {
      const result = store.remove(ids); options.changed();
      $('notice').textContent = '已取消收藏 ' + result.removedIds.length + ' 题。' + (result.failedIds.length ? ' ' + result.failedIds.length + ' 题未能删除，仍保留，请检查浏览器存储设置后重试。' : '');
    }
    function exportFavorites(onlySelected) {
      try {
        const questions = filtered.filter(item => item.question && (!onlySelected || selected.has(item.id))).map(item => item.question);
        if (!questions.length) throw new Error('没有可导出的收藏题目。');
        options.exportPaper(async () => ({ paper: { title: '我的收藏' + (onlySelected ? ' · 所选题目' : ' · 筛选结果'), description: '来自本浏览器收藏，共 ' + questions.length + ' 题。' }, questions }));
      } catch (error) { $('notice').textContent = error.message; }
    }
    host.addEventListener('toggle', () => { if (host.open) { store.refresh(); refresh(); ensureBank(); } });
    ['source', 'module', 'type'].forEach(key => $(key).addEventListener('change', () => { limit = 30; selected.clear(); refresh(); }));
    $('search').addEventListener('input', () => { limit = 30; selected.clear(); refresh(); });
    $('more').addEventListener('click', () => { limit += 30; refresh(); });
    $('all').addEventListener('change', () => {
      selected.clear(); if ($('all').checked) $('list').querySelectorAll('[data-favorite-select]').forEach(el => selected.add(el.dataset.favoriteSelect)); selection();
    });
    $('list').addEventListener('change', event => {
      const el = event.target.closest('[data-favorite-select]'); if (!el) return;
      if (el.checked) selected.add(el.dataset.favoriteSelect); else selected.delete(el.dataset.favoriteSelect); selection();
    });
    $('list').addEventListener('click', event => {
      const el = event.target.closest('[data-favorite-action]'); if (!el || el.disabled) return;
      if (el.dataset.favoriteAction === 'remove') remove([el.dataset.id]);
      else if (bank.has(el.dataset.id)) options.practice(bank.get(el.dataset.id));
    });
    $('remove-selected').addEventListener('click', () => {
      if (selected.size && confirm('取消收藏所选的 ' + selected.size + ' 道题？不会删除作答记录或熟知标记。')) remove(Array.from(selected));
    });
    $('export-selected').addEventListener('click', () => exportFavorites(true));
    $('export-filtered').addEventListener('click', () => exportFavorites(false));
    refresh();
    return { refresh, init(config) {
      catalog = config.catalog; papers = new Map(config.papers.map(p => [p.id, p]));
      catalog.modules.forEach(module => { const el = document.createElement('option'); el.value = module.id; el.textContent = module.title; $('module').appendChild(el); });
      if (host.open) ensureBank();
    } };
  }
  return { PREFIX, create, mount };
}));
