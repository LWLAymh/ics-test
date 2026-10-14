(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ICSCommunityPapers = api;
}(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const MAX_QUESTIONS = 200, PAGE_SIZE = 12, KEY = 'ics-community-draft-v1';
  const TYPES = { 'single-choice': '单选', 'multiple-choice': '多选', fill: '填空', 'short-answer': '简答', composite: '混合 / 综合' };
  const ID = /^q-[a-f0-9]{8,64}$/;
  const PAPER_ID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  function shareUrl(id, base) {
    if (typeof id !== 'string' || !PAPER_ID.test(id)) throw new Error('卷子编号无效。');
    const url = new URL(base);
    if (!/^https?:$/.test(url.protocol)) throw new Error('请通过网站地址分享卷子。');
    url.search = ''; url.hash = ''; url.username = ''; url.password = ''; url.searchParams.set('paper', id.toLowerCase());
    return url.href;
  }
  function sharedPaperId(base) {
    try {
      const url = new URL(base), values = url.searchParams.getAll('paper');
      return /^https?:$/.test(url.protocol) && values.length === 1 && PAPER_ID.test(values[0]) ? values[0].toLowerCase() : null;
    } catch (_) { return null; }
  }
  function moveQuestion(ids, id, destination) {
    const moved = ids.slice(), from = moved.indexOf(id);
    if (from < 0 || !Number.isInteger(destination) || destination < 0 || destination >= moved.length) return moved;
    moved.splice(destination, 0, moved.splice(from, 1)[0]); return moved;
  }
  function validateDraft(draft) {
    if (!draft || typeof draft.title !== 'string' || !draft.title.trim() || draft.title.trim().length > 60) throw new Error('标题须为 1–60 字。');
    if (typeof draft.author !== 'string' || !draft.author.trim() || draft.author.trim().length > 40) throw new Error('署名须为 1–40 字。');
    if (typeof draft.description !== 'string' || draft.description.trim().length > 500) throw new Error('描述最多 500 字。');
    if (!Array.isArray(draft.ids) || !draft.ids.length || draft.ids.length > MAX_QUESTIONS || draft.ids.some(id => typeof id !== 'string' || !ID.test(id)) || new Set(draft.ids).size !== draft.ids.length) throw new Error('请选择 1–200 道不重复的题目。');
    return { title: draft.title.trim(), author: draft.author.trim(), description: draft.description.trim(), ids: draft.ids.slice() };
  }
  function resolveQuestions(ids, bank) {
    const index = new Map(bank.filter(q => q.publication.state === 'published' && TYPES[q.type]).map(q => [q.id, q]));
    const missing = ids.filter(id => !index.has(id));
    if (missing.length) throw new Error('卷子中有 ' + missing.length + ' 道题已停用或不可用，请报告此卷，暂不开始练习。');
    return ids.map(id => Object.assign({}, index.get(id)));
  }
  function sample(pool, chosen, count, random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) {
    const remaining = pool.filter(q => !chosen.includes(q.id));
    if (!Number.isInteger(count) || count < 1 || count > remaining.length) throw new Error('抽题数量须为 1–' + remaining.length + '，已选题不会重复抽取。');
    if (chosen.length + count > MAX_QUESTIONS) throw new Error('每卷最多 200 题。');
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1)); [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    return remaining.slice(0, count).map(q => q.id);
  }
  function historyQuestionIds(records, wrongOnly) {
    return new Set(records.filter(record => typeof record.questionId === 'string' && ID.test(record.questionId) &&
      Number.isFinite(record.points) && (!wrongOnly || record.points < 1)).map(record => record.questionId));
  }
  function create(options) {
    const host = options.host;
    let client, bank = [], papers = new Map(), ids = [], entries = [], offset = 0, request = 0;
    let pool = [], filterLimit = 30, selectedLimit = MAX_QUESTIONS, ready = false, busy = false, publishing = false;
    let draftId = crypto.randomUUID(), dirty = false;
    let dragging = null, dragFrame = 0;
    const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const $ = name => host.querySelector('[data-community="' + name + '"]');
    const button = (action, text, id, extra = '') => '<button type="button" class="ics-secondary" data-cp-action="' + action + '"' + (id ? ' data-id="' + esc(id) + '"' : '') + extra + '>' + text + '</button>';
    host.innerHTML = '<div class="ics-community-head"><div><h3>用户精选卷</h3><p>自由选题，直接发布。署名由发布者自填；发现问题可报告。</p></div>' + button('create', '创建卷子') + '</div>' +
      '<div class="ics-community-toolbar"><label>排序 <select data-community="sort"><option value="newest">最新发布</option><option value="popular">最多点赞</option></select></label>' + button('refresh', '刷新列表') + '</div>' +
      '<p data-community="status" class="ics-community-note" role="status" aria-live="polite"></p><div data-community="list" class="ics-community-list"></div>' +
      '<div class="ics-community-pages">' + button('previous', '上一页') + '<span data-community="page"></span>' + button('next', '下一页') + '</div>' +
      '<details data-community="reports" class="ics-community-reports"><summary>精选卷报错说明（公开）</summary><p data-community="reports-status" role="status"></p><div data-community="reports-list"></div>' + button('reports-refresh', '刷新报告') + button('reports-more', '加载更多报告') + '</details>' +
      '<section data-community="editor" class="ics-community-editor" hidden aria-label="创建精选卷"><div class="ics-community-head"><h3>创建精选卷</h3>' + button('close', '收起草稿') + '</div>' +
      '<p class="ics-community-note">草稿保存在本浏览器。综合题保持整体；每卷最多 200 题。随机抽取的题目会固定下来，发布后不能编辑。</p>' +
      '<div class="ics-community-fields"><label>标题<input data-community="title" maxlength="60" placeholder="例如：数据表示易错题精选"></label><label>署名<input data-community="author" maxlength="40" placeholder="你的名字或昵称"></label></div>' +
      '<label class="ics-community-description">简短描述<textarea data-community="description" maxlength="500" rows="2" placeholder="适合谁练习、选题思路等（选填）"></textarea></label>' +
      '<div data-community="agent"></div>' +
      '<fieldset class="ics-community-sources"><legend>题目来源</legend><label><input type="checkbox" data-cp-source="pku-exam" checked> PKU 真题</label><label><input type="checkbox" data-cp-source="csapp-textbook" checked> CSAPP 习题</label></fieldset>' +
      '<div class="ics-community-toolbar"><label>选题范围 <select data-community="history-range"><option value="all">全部题库</option><option value="attempted">我的作答记录</option><option value="wrong">我的错题（曾经答错）</option></select></label>' + button('history-refresh', '刷新本地记录') + button('add-filtered', '添加筛选结果', '', ' hidden') + '</div>' +
      '<p class="ics-community-note">记录仅在本浏览器读取，重复作答按题目去重；错题包含任意一次得分不足满分的题。个人回答和成绩不会随卷子或 MCP 草稿上传。</p>' +
      '<div class="ics-community-fields"><label>知识模块<select data-community="module"><option value="">全部模块</option></select></label><label>题型<select data-community="type"><option value="">全部题型</option>' + Object.entries(TYPES).map(([key, name]) => '<option value="' + key + '">' + name + '</option>').join('') + '</select></label>' +
      '<label>原卷 / 章节<select data-community="paper"><option value="">全部卷 / 章节</option></select></label><label>搜索题面 / 编号<input data-community="search" type="search" placeholder="关键词或 q-…"></label></div>' +
      '<div class="ics-community-toolbar"><label>随机添加 <input data-community="random-count" type="number" min="1" max="200" value="5"> 题</label>' + button('random', '从当前范围抽题') + '<span data-community="pool-count"></span></div>' +
      '<div class="ics-community-builder"><section><h4>可选题目</h4><div data-community="pool" class="ics-community-candidates"></div>' + button('pool-more', '显示更多候选题') + '</section>' +
      '<section><h4 data-community="selected-heading">已选 0 / 200 题</h4><p class="ics-community-note">拖动左侧手柄排序；也可聚焦手柄后用 ↑ / ↓、Home / End 键，或使用上移 / 下移。</p><div data-community="selected" class="ics-community-selected" aria-label="已选题目排序"></div>' + button('selected-more', '显示更多已选题') + '</section></div>' +
      '<p data-community="editor-status" class="ics-community-note" role="status" aria-live="polite"></p><div class="ics-community-toolbar"><button type="button" class="ics-primary" data-cp-action="publish">直接发布</button>' + button('export-draft', '导出草稿 PDF') + button('clear', '清空草稿') + '</div></section>' +
      '<section data-community="preview" class="ics-community-preview" hidden aria-label="题目预览"><div class="ics-community-head"><h4 data-community="preview-title"></h4>' + button('close-preview', '关闭预览') + '</div><div data-community="preview-content" class="post-content ics-question-content"></div></section>' +
      '<form data-community="report" class="ics-community-report" hidden><h4>报告精选卷问题</h4><p data-community="report-title"></p><p class="ics-community-note">说明会公开，请勿填写个人联系方式等隐私信息。</p><label>问题说明（选填）<textarea data-community="report-message" rows="3" maxlength="1000"></textarea></label><p data-community="report-status" role="status"></p><div class="ics-community-toolbar"><button type="submit" class="ics-primary">提交报告</button>' + button('close-report', '取消') + '</div></form>';
    function notice(text, editor = false) { $(editor ? 'editor-status' : 'status').textContent = text; }
    function api() { if (!client) throw new Error('精选卷服务暂未连接。'); return client; }
    function errorText(error) {
      const message = String(error && error.message || '服务请求失败');
      if (/schema cache|does not exist|PGRST20[25]|42P01/i.test(message)) return '精选卷数据库尚未初始化，请站点维护者执行新增的数据库脚本。';
      if (/publish limit/i.test(message)) return '本浏览器每天最多发布 5 份卷子，请稍后再试。';
      if (/invalid question/i.test(message)) return '存在未登记或已停用的题目，请刷新题库后重新选题。';
      if (/not available/i.test(message)) return '这份卷子已下架或不存在。';
      if (/rate limit/i.test(message)) return '操作过于频繁，请稍后再试。';
      return '操作未完成：' + message.slice(0, 160);
    }
    async function rpc(name, args) { const result = await api().rpc(name, args); if (result.error) throw result.error; return result.data; }
    async function loadBank() { if (!bank.length) bank = (await options.loadBank()).filter(options.isPublished); }
    function name(q) { return [papers.get(q.paperId) && papers.get(q.paperId).displayName, q.number.display, TYPES[q.type]].filter(Boolean).join(' · '); }
    function excerpt(q) { return q.stem.text.replace(/\{\{blank:[^}]+\}\}/g, '____').replace(/[`#*]/g, '').replace(/\s+/g, ' ').slice(0, 140); }
    function filters() {
      const sources = Array.from(host.querySelectorAll('[data-cp-source]:checked')).map(el => el.dataset.cpSource), search = $('search').value.trim().toLowerCase();
      const range = $('history-range').value, historyIds = range === 'all' ? null : historyQuestionIds(options.history(), range === 'wrong');
      pool = bank.filter(q => sources.includes(options.collection(papers.get(q.paperId))) &&
        (!historyIds || historyIds.has(q.id)) &&
        (!$('module').value || q.classification.moduleIds.includes($('module').value)) &&
        (!$('type').value || q.type === $('type').value) && (!$('paper').value || q.paperId === $('paper').value) &&
        (!search || (q.id + ' ' + q.stem.text + ' ' + name(q)).toLowerCase().includes(search)));
      $('pool-count').textContent = pool.length + ' 题符合条件 · ' + pool.filter(q => !ids.includes(q.id)).length + ' 题尚未选入';
      host.querySelector('[data-cp-action="add-filtered"]').hidden = range === 'all';
      $('pool').innerHTML = pool.slice(0, filterLimit).map(q => '<article><small>' + esc(name(q)) + '</small><p>' + esc(excerpt(q)) + '</p><div>' + button('preview', '预览', q.id) + button('add', ids.includes(q.id) ? '已添加' : '添加', q.id, ids.includes(q.id) || publishing ? ' disabled' : '') + '</div></article>').join('') || '<p>没有匹配的题目。</p>';
      host.querySelector('[data-cp-action="pool-more"]').hidden = pool.length <= filterLimit;
    }
    function renderSelected() {
      cancelDrag();
      const index = new Map(bank.map(q => [q.id, q])); $('selected-heading').textContent = '已选 ' + ids.length + ' / 200 题';
      $('selected').innerHTML = ids.slice(0, selectedLimit).map((id, position) => {
        const q = index.get(id);
        return '<article data-selected-id="' + esc(id) + '"><button type="button" class="ics-sort-handle" data-sort-handle="' + esc(id) + '" aria-label="第 ' + (position + 1) + ' 题，拖动排序或使用方向键" title="拖动排序；↑↓ 移动，Home/End 移到首尾"' + (publishing ? ' disabled' : '') + '>⠿</button><small>' + (position + 1) + '. ' + esc(q ? name(q) : id) + '</small><p>' + esc(q ? excerpt(q) : '题目已不可用，请移除。') + '</p><div>' + button('preview', '预览', id) + button('up', '上移', id, !position || publishing ? ' disabled' : '') + button('down', '下移', id, position === ids.length - 1 || publishing ? ' disabled' : '') + button('remove', '移除', id, publishing ? ' disabled' : '') + '</div></article>';
      }).join('') || '<p>从左侧添加题目，或者按模块随机抽取。</p>';
      host.querySelector('[data-cp-action="selected-more"]').hidden = ids.length <= selectedLimit;
    }
    function draft() { return { title: $('title').value, author: $('author').value, description: $('description').value, ids: ids.slice() }; }
    function saveDraft() {
      try { localStorage.setItem(KEY, JSON.stringify({ id: draftId, ...draft() })); }
      catch (_) { notice('浏览器无法保存草稿，刷新后会丢失。', true); }
    }
    function restoreDraft() {
      try {
        const saved = JSON.parse(localStorage.getItem(KEY)); if (!saved) return;
        if (typeof saved.id === 'string' && PAPER_ID.test(saved.id)) draftId = saved.id;
        ['title', 'author', 'description'].forEach(key => { if (typeof saved[key] === 'string') $(key).value = saved[key].slice(0, key === 'title' ? 60 : key === 'author' ? 40 : 500); });
        if (Array.isArray(saved.ids)) ids = Array.from(new Set(saved.ids.filter(id => typeof id === 'string' && ID.test(id)))).slice(0, MAX_QUESTIONS);
      } catch (_) { /* Corrupt browser drafts must not prevent using the site. */ }
    }
    function changed() {
      // A possibly successful, timed-out publish remains immutable on retry.
      if (!dirty) { draftId = crypto.randomUUID(); dirty = true; }
      saveDraft(); filters(); renderSelected();
    }
    function moveSelected(id, destination) {
      const from = ids.indexOf(id);
      if (publishing || from < 0 || destination < 0 || destination >= ids.length || destination === from) return;
      ids = moveQuestion(ids, id, destination); changed();
      $('selected').querySelector('[data-sort-handle="' + id + '"]')?.focus({ preventScroll: true });
      notice('已将第 ' + (from + 1) + ' 题移到第 ' + (destination + 1) + ' 位，草稿已保存。', true);
    }
    function cancelDrag() {
      if (dragFrame) cancelAnimationFrame(dragFrame); dragFrame = 0;
      if (!dragging) return;
      const current = dragging; dragging = null;
      current.ghost?.remove();
      $('selected').querySelectorAll('.is-dragging, .is-drop-before, .is-drop-after').forEach(el => el.classList.remove('is-dragging', 'is-drop-before', 'is-drop-after'));
      if (current.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
    }
    function updateDragTarget() {
      if (!dragging?.active) return;
      const list = $('selected'), box = list.getBoundingClientRect(), d = dragging;
      list.querySelectorAll('.is-drop-before, .is-drop-after').forEach(el => el.classList.remove('is-drop-before', 'is-drop-after'));
      d.destination = null;
      if (d.x < box.left || d.x > box.right || d.y < box.top - 48 || d.y > box.bottom + 48) return;
      const y = Math.max(box.top + 2, Math.min(box.bottom - 2, d.y));
      const target = document.elementFromPoint(d.x, y)?.closest('[data-selected-id]');
      if (!target || !list.contains(target) || target === d.row) return;
      const after = y >= (target.getBoundingClientRect().top + target.getBoundingClientRect().bottom) / 2;
      let destination = ids.indexOf(target.dataset.selectedId) + (after ? 1 : 0);
      if (destination > ids.indexOf(d.id)) destination--;
      d.destination = destination; target.classList.add(after ? 'is-drop-after' : 'is-drop-before');
    }
    function scrollDrag() {
      if (!dragging?.active) return;
      const list = $('selected'), box = list.getBoundingClientRect(), d = dragging;
      if (d.x >= box.left && d.x <= box.right && d.y >= box.top - 48 && d.y <= box.bottom + 48) {
        if (d.y < box.top + 40) list.scrollTop -= Math.min(16, (box.top + 40 - d.y) / 3);
        else if (d.y > box.bottom - 40) list.scrollTop += Math.min(16, (d.y - box.bottom + 40) / 3);
        updateDragTarget();
      }
      dragFrame = requestAnimationFrame(scrollDrag);
    }
    $('selected').addEventListener('pointerdown', event => {
      const handle = event.target.closest('[data-sort-handle]');
      if (!handle || handle.disabled || publishing || !event.isPrimary || event.button !== 0) return;
      cancelDrag(); event.preventDefault(); handle.focus({ preventScroll: true });
      dragging = { id: handle.dataset.sortHandle, pointerId: event.pointerId, handle, row: handle.closest('article'), x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, active: false, destination: null };
      handle.setPointerCapture(event.pointerId);
    });
    $('selected').addEventListener('pointermove', event => {
      if (!dragging || event.pointerId !== dragging.pointerId) return;
      const d = dragging; d.x = event.clientX; d.y = event.clientY;
      if (!d.active && Math.hypot(d.x - d.startX, d.y - d.startY) < 6) return;
      event.preventDefault();
      if (!d.active) {
        d.active = true; d.row.classList.add('is-dragging');
        d.ghost = document.createElement('div'); d.ghost.className = 'ics-sort-ghost'; d.ghost.setAttribute('aria-hidden', 'true');
        d.ghost.textContent = d.row.querySelector('small').textContent; document.body.appendChild(d.ghost);
        dragFrame = requestAnimationFrame(scrollDrag);
      }
      d.ghost.style.left = Math.min(d.x + 12, Math.max(0, innerWidth - d.ghost.offsetWidth - 8)) + 'px';
      d.ghost.style.top = Math.min(d.y + 12, Math.max(0, innerHeight - d.ghost.offsetHeight - 8)) + 'px'; updateDragTarget();
    });
    $('selected').addEventListener('pointerup', event => {
      if (!dragging || event.pointerId !== dragging.pointerId) return;
      const { id, destination, active } = dragging; cancelDrag();
      if (active && destination !== null) moveSelected(id, destination);
    });
    ['pointercancel', 'lostpointercapture'].forEach(type => $('selected').addEventListener(type, cancelDrag));
    window.addEventListener('blur', cancelDrag);
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancelDrag(); });
    host.addEventListener('keydown', event => {
      if (event.key === 'Escape' && dragging) { event.preventDefault(); cancelDrag(); return; }
      const handle = event.target.closest('[data-sort-handle]'); if (!handle || handle.disabled || publishing) return;
      const position = ids.indexOf(handle.dataset.sortHandle), destinations = { ArrowUp: position - 1, ArrowDown: position + 1, Home: 0, End: ids.length - 1 };
      if (event.key in destinations) { event.preventDefault(); moveSelected(handle.dataset.sortHandle, destinations[event.key]); }
    });
    async function copyLink(id, control) {
      const url = shareUrl(id, location.href);
      let feedback = control.parentElement.querySelector(':scope > .ics-paper-share-feedback');
      if (!feedback) { feedback = document.createElement('div'); feedback.className = 'ics-paper-share-feedback'; control.insertAdjacentElement('afterend', feedback); }
      feedback.dataset.paperId = id;
      feedback.replaceChildren();
      const status = document.createElement('p'); status.setAttribute('role', 'status'); feedback.appendChild(status);
      try { await navigator.clipboard.writeText(url); status.textContent = '链接已复制，其他人打开即可练习此卷。'; }
      catch (_) {
        status.textContent = '未能自动复制，请复制下方网址。';
        const label = document.createElement('label'); label.textContent = '公开分享链接';
        const input = document.createElement('input'); input.type = 'url'; input.readOnly = true; input.value = url; label.appendChild(input); feedback.appendChild(label);
        input.focus(); input.select();
      }
    }
    async function openEditor() {
      if (!ready) { notice('题库仍在加载，请稍后再试。'); return; } notice('正在读取选题列表…');
      try { await loadBank(); $('editor').hidden = false; filters(); renderSelected(); notice(''); $('title').focus(); }
      catch (error) { notice(errorText(error)); }
    }
    function renderList() {
      $('list').innerHTML = entries.map(paper => '<article class="ics-community-card"><h4>' + esc(paper.title) + '</h4><small>' + esc(paper.author_name) + ' · ' + new Date(paper.created_at).toLocaleDateString('zh-CN') + ' · ' + paper.question_ids.length + ' 题</small>' +
        '<p>' + esc(paper.description || '发布者未填写描述。') + '</p><div class="ics-community-card-footer"><span>' + Number(paper.participant_count) + ' 次参与 · ' + Number(paper.like_count) + ' 赞</span><div>' + button('start', '开始练习', paper.id) + button('share', '复制链接', paper.id) + button('export', '导出 PDF', paper.id) + button('like', paper.liked ? '取消赞' : '点赞', paper.id, ' aria-pressed="' + Boolean(paper.liked) + '"') + button('report', '报告问题', paper.id) + '</div></div></article>').join('');
      $('page').textContent = '第 ' + (Math.floor(offset / PAGE_SIZE) + 1) + ' 页';
      host.querySelector('[data-cp-action="previous"]').disabled = offset === 0; host.querySelector('[data-cp-action="next"]').disabled = entries.length < PAGE_SIZE;
    }
    async function refresh(reset = false) {
      if (!ready || host.hidden) return; if (reset) offset = 0;
      const generation = ++request; notice('正在读取精选卷…');
      try {
        const data = await rpc('list_ics_community_papers', { p_sort: $('sort').value, p_offset: offset, p_visitor_id: options.visitorId() });
        if (generation !== request) return;
        entries = data || []; renderList(); notice(entries.length ? '每个浏览器每卷只计一次参与；实际提交答案或自评后计入。' : '还没有精选卷，来发布第一份吧。');
      } catch (error) { if (generation === request) { entries = []; renderList(); notice(errorText(error)); } }
    }
    async function preview(id) {
      await loadBank(); const q = bank.find(item => item.id === id); if (!q) throw new Error('该题已停用或不存在。');
      $('preview-title').textContent = name(q) + ' · ' + q.id; $('preview-content').innerHTML = options.renderPreview(q); $('preview').hidden = false;
      options.typeset($('preview-content')); $('preview').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    async function start(id) {
      if (busy) return; busy = true; ++request; notice('正在准备精选卷…');
      // A slower list refresh must not replace a shared-link error or current-paper status.
      try {
        // Re-read: an already visible card may have been taken down.
        const result = await api().from('ics_community_papers').select('*').eq('id', id).eq('status', 'published').maybeSingle();
        if (result.error) throw result.error; if (!result.data) throw new Error('paper not available');
        await loadBank(); options.start(result.data, resolveQuestions(result.data.question_ids, bank)); notice('');
      } catch (error) { notice(errorText(error)); } finally { busy = false; }
    }
    async function publish() {
      if (publishing) return;
      let validated;
      try { validated = validateDraft(draft()); resolveQuestions(validated.ids, bank); }
      catch (error) { notice(error.message, true); return; }
      if (!confirm('发布后将立即公开，题单和署名不能再编辑。确认发布这 ' + ids.length + ' 道题吗？')) return;
      publishing = true; dirty = false; saveDraft();
      $('editor').querySelectorAll('input, textarea, select, button').forEach(el => { el.disabled = true; }); notice('正在发布…', true);
      try {
        // Publishing is a browser-only Worker endpoint, never an MCP tool or anonymous DB RPC.
        const response = await fetch('https://ics-test-community.ics-test-mcp.workers.dev/papers', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20000),
          body: JSON.stringify({ paperId: draftId, visitorId: options.visitorId(), draft: validated }),
        });
        const result = await response.json(); if (!response.ok) throw new Error(result.error || '发布失败。');
        ids = []; draftId = crypto.randomUUID(); ['title', 'description'].forEach(key => { $(key).value = ''; }); saveDraft();
        $('editor').hidden = true; $('sort').value = 'newest'; await refresh(true); notice('已直接发布。可在列表中开始练习、点赞或报告问题。');
      } catch (error) { notice(errorText(error) + '。草稿仍保留；直接重试不会重复发布。', true); }
      finally { publishing = false; $('editor').querySelectorAll('input, textarea, select, button').forEach(el => { el.disabled = false; }); filters(); renderSelected(); }
    }
    let reportId = '', reporting = false;
    $('report').addEventListener('submit', async event => {
      event.preventDefault(); if (reporting || !reportId) return; reporting = true;
      const id = reportId, submit = $('report').querySelector('[type="submit"]'); submit.disabled = true; $('report-status').textContent = '正在提交…';
      try { await rpc('report_ics_community_paper', { p_id: id, p_visitor_id: options.visitorId(), p_message: $('report-message').value.trim() }); $('report-status').textContent = '已报告，感谢反馈。'; loadReports(true); }
      catch (error) { $('report-status').textContent = errorText(error); } finally { reporting = false; submit.disabled = false; }
    });
    host.addEventListener('input', event => {
      if (['title', 'author', 'description'].includes(event.target.dataset.community)) changed();
      if (event.target === $('search')) { filterLimit = 30; filters(); }
    });
    host.addEventListener('change', event => {
      if (event.target === $('sort')) refresh(true);
      if (event.target.matches('[data-cp-source]') || ['module', 'type', 'paper', 'history-range'].includes(event.target.dataset.community)) { filterLimit = 30; filters(); }
    });
    let reportRows = [], reportLoading = false;
    async function loadReports(reset) {
      if (!$('reports').open || reportLoading) return;
      reportLoading = true;
      if (reset) reportRows = [];
      $('reports-status').textContent = '正在读取报告…';
      try {
        const result = await api().from('ics_community_paper_reports').select('id,paper_id,paper_title,message,created_at').order('created_at', { ascending: false }).order('id', { ascending: false }).range(reportRows.length, reportRows.length + 24);
        if (result.error) throw result.error;
        reportRows.push(...result.data);
        $('reports-list').innerHTML = reportRows.map(row => '<article><strong>' + esc(row.paper_title) + '</strong><small> · ' + esc(row.paper_id) + '</small><p>' + esc(row.message || '未填写说明') + '</p><small>' + esc(new Date(row.created_at).toLocaleString('zh-CN')) + '</small></article>').join('');
        $('reports-status').textContent = reportRows.length ? '已显示 ' + reportRows.length + ' 条报告；下架卷子的报告不公开显示。' : '暂无报告。';
        host.querySelector('[data-cp-action="reports-more"]').hidden = result.data.length < 25;
      } catch (error) { $('reports-status').textContent = errorText(error); }
      finally { reportLoading = false; }
    }
    $('reports').addEventListener('toggle', () => { if ($('reports').open) loadReports(true); });
    host.addEventListener('click', async event => {
      const control = event.target.closest('[data-cp-action]'); if (!control || control.disabled) return;
      const action = control.dataset.cpAction, id = control.dataset.id, position = ids.indexOf(id);
      try {
        if (action === 'create') await openEditor();
        if (action === 'close') $('editor').hidden = true;
        if (action === 'close-preview') $('preview').hidden = true;
        if (action === 'close-report' && !reporting) $('report').hidden = true;
        if (action === 'refresh') await refresh();
        if (action === 'reports-refresh') await loadReports(true);
        if (action === 'reports-more') await loadReports(false);
        if (action === 'previous' && offset) { offset -= PAGE_SIZE; await refresh(); }
        if (action === 'next' && entries.length === PAGE_SIZE) { offset += PAGE_SIZE; await refresh(); }
        if (action === 'pool-more') { filterLimit += 30; filters(); }
        if (action === 'selected-more') { selectedLimit += 30; renderSelected(); }
        if (action === 'preview') await preview(id);
        if (action === 'start') await start(id);
        if (action === 'share') await copyLink(id, control);
        if (action === 'export') options.exportPaper(async () => {
          const result = await api().from('ics_community_papers').select('*').eq('id', id).eq('status', 'published').maybeSingle();
          if (result.error) throw result.error; if (!result.data) throw new Error('这份卷子已下架或不存在。');
          await loadBank(); return { paper: result.data, questions: resolveQuestions(result.data.question_ids, bank) };
        });
        if (action === 'export-draft') {
          const current = draft();
          options.exportPaper(async () => { await loadBank(); return { paper: { ...current, title: current.title.trim() || '未发布精选卷草稿' }, questions: resolveQuestions(current.ids, bank) }; });
        }
        if (action === 'history-refresh') { filters(); notice('已重新读取本浏览器记录；已停用的题不会出现在候选题中。', true); }
        // Never exposed to MCP: only a trusted browser click can invoke this UI action.
        if (action === 'publish' && event.isTrusted) await publish();
        if (action === 'like') {
          control.disabled = true; const paper = entries.find(p => p.id === id);
          await rpc('like_ics_community_paper', { p_id: id, p_visitor_id: options.visitorId(), p_liked: !paper.liked }); await refresh();
        }
        if (action === 'report' && !reporting) { reportId = id; $('report-title').textContent = entries.find(p => p.id === id).title; $('report-message').value = ''; $('report-status').textContent = ''; $('report').hidden = false; $('report-message').focus(); }
        if (publishing) return;
        if (action === 'clear' && confirm('清空当前草稿？此操作不能撤销。')) { ids = []; ['title', 'author', 'description'].forEach(key => { $(key).value = ''; }); changed(); }
        if (action === 'add' && !ids.includes(id)) { if (ids.length >= MAX_QUESTIONS) throw new Error('每卷最多 200 题。'); ids.push(id); changed(); }
        if (action === 'remove' && position >= 0) { ids.splice(position, 1); changed(); }
        if (action === 'up') moveSelected(id, position - 1);
        if (action === 'down') moveSelected(id, position + 1);
        if (action === 'random') { ids.push(...sample(pool, ids, Number($('random-count').value))); changed(); }
        if (action === 'add-filtered') {
          const additional = pool.filter(q => !ids.includes(q.id)).map(q => q.id);
          if (ids.length + additional.length > MAX_QUESTIONS) throw new Error('添加后超过 200 题，请缩小筛选范围或逐题添加。');
          ids.push(...additional); changed(); notice('已添加 ' + additional.length + ' 道题；个人回答和成绩不会上传。', true);
        }
      } catch (error) { notice(errorText(error), ['add', 'add-filtered', 'random', 'preview', 'publish', 'export-draft'].includes(action)); }
      finally { if (action === 'like') control.disabled = false; }
    });
    restoreDraft();
    const participation = new Set(), pendingParticipation = new Set();
    return {
      agentHost: $('agent'), getDraft: draft,
      share: copyLink, openShared: start,
      async importAgentDraft(value) {
        if (publishing) throw new Error('发布中，不能替换草稿。');
        const checked = validateDraft(value); await loadBank(); resolveQuestions(checked.ids, bank);
        ids = checked.ids; ['title', 'author', 'description'].forEach(key => { $(key).value = checked[key]; }); changed();
        $('editor').hidden = false; notice('已载入 Agent 草稿。请检查题单，发布仍需你亲自点击。', true);
      },
      init(config) {
        client = config.client; papers = new Map(config.papers.map(p => [p.id, p])); ready = true;
        config.catalog.modules.forEach(m => { const option = document.createElement('option'); option.value = m.id; option.textContent = m.title; $('module').appendChild(option); });
        papers.forEach(p => { const option = document.createElement('option'); option.value = p.id; option.textContent = p.displayName; $('paper').appendChild(option); });
      },
      show(show) { host.hidden = !show; if (show) refresh(); else cancelDrag(); },
      async recordParticipation(id) {
        if (!id || participation.has(id) || pendingParticipation.has(id)) return; pendingParticipation.add(id);
        try { await rpc('participate_ics_community_paper', { p_id: id, p_visitor_id: options.visitorId() }); participation.add(id); }
        catch (_) { /* Failed counter must not lose a graded answer; next grade retries. */ }
        finally { pendingParticipation.delete(id); }
      },
    };
  }
  return { MAX_QUESTIONS, validateDraft, resolveQuestions, sample, historyQuestionIds, moveQuestion, shareUrl, sharedPaperId, create };
}));
