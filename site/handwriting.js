(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ICSHandwriting = api;
}(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const MODE_KEY = 'ics-answer-input-mode-v1', MAX_POINTS = 100000;
  function validDocument(value) {
    if (!value || value.version !== 1 || !Number.isFinite(value.width) || value.width < 240 || value.width > 2400 || !Array.isArray(value.strokes) || value.strokes.length > 3000) return null;
    let count = 0;
    for (const stroke of value.strokes) {
      if (!stroke || !['pen', 'erase'].includes(stroke.tool) || !/^#[0-9a-f]{6}$/i.test(stroke.color) || !Number.isFinite(stroke.size) || stroke.size < 1 || stroke.size > 40 ||
        typeof stroke.anchor !== 'string' || !/^(surface|a\d+)$/.test(stroke.anchor) || !Array.isArray(stroke.points) || !stroke.points.length) return null;
      count += stroke.points.length;
      if (count > MAX_POINTS || stroke.points.some(p => !Array.isArray(p) || p.length !== 3 || p.some(n => !Number.isFinite(n)) || Math.abs(p[0]) > 50000 || Math.abs(p[1]) > 50000 || p[2] < 0 || p[2] > 1)) return null;
    }
    return value;
  }
  function storage() {
    let pending;
    function db() {
      if (!pending) pending = new Promise((resolve, reject) => {
        const request = indexedDB.open('ics-handwriting-v1', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('questions');
        request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
        request.onerror = () => reject(new Error('本地手写存储无法打开。'));
        request.onblocked = () => reject(new Error('请关闭其它旧版页面后重试。'));
      });
      return pending;
    }
    return {
      async get(key) { const database = await db(); return new Promise((resolve, reject) => { const request = database.transaction('questions').objectStore('questions').get(key); request.onsuccess = () => resolve(validDocument(request.result)); request.onerror = () => reject(request.error); }); },
      async set(key, value) { const database = await db(); return new Promise((resolve, reject) => { const tx = database.transaction('questions', 'readwrite'); tx.objectStore('questions').put(value, key); tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error); }); },
    };
  }
  let captureLibrary;
  function loadCapture() {
    if (!captureLibrary) captureLibrary = new Promise((resolve, reject) => {
      const script = document.createElement('script'); script.src = './vendor/html2canvas/html2canvas.min.js';
      script.onload = () => resolve(window.html2canvas); script.onerror = () => { captureLibrary = null; script.remove(); reject(new Error('截图组件加载失败，请重试。')); }; document.head.append(script);
    });
    return captureLibrary;
  }
  function mount(options) {
    const host = options.host, surface = options.surface, viewport = options.viewport, canvas = document.createElement('canvas');
    canvas.className = 'ics-ink-overlay'; canvas.setAttribute('aria-hidden', 'true'); surface.append(canvas);
    host.innerHTML = '<div class="ics-input-mode" role="group" aria-label="作答方式"><span>作答方式</span><button class="ics-secondary" data-ink-mode="typing" type="button">打字</button><button class="ics-secondary" data-ink-mode="handwriting" type="button">手写 / 批注</button><small>记住本浏览器的选择</small></div>' +
      '<div class="ics-ink-tools" hidden><div role="group" aria-label="手写工具"><button class="ics-secondary" data-ink="pen" type="button" aria-pressed="true">笔</button><button class="ics-secondary" data-ink="erase" type="button" aria-pressed="false">橡皮</button><label>颜色<select data-ink="color"><option value="#125dcc">蓝</option><option value="#cf3535">红</option><option value="#18212f">黑</option></select></label><label>粗细<select data-ink="size"><option value="2">细</option><option value="3" selected>中</option><option value="5">粗</option></select></label><button class="ics-secondary" data-ink="undo" type="button">撤销</button><button class="ics-secondary" data-ink="redo" type="button">重做</button><button class="ics-text-button" data-ink="clear" type="button">清空本题笔迹</button></div><label class="ics-ink-touch"><input data-ink="finger" type="checkbox"> 允许手指书写（取消后手指可滚动、点选和填写）</label><p>触控笔可在题面、选项和空位上书写；手指仍可操作题目。鼠标可在控件外书写。笔迹仅保存在本浏览器，不自动同步或评测。</p><div class="ics-api-actions"><button class="ics-secondary" data-ink="grade" type="button">预览整题并交给 AI 评测</button><button class="ics-secondary" data-ink="self" type="button">核对手写答案并自评</button><button class="ics-text-button" data-ink="cancel" type="button" hidden>取消评测</button></div><p data-ink="status" role="status" aria-live="polite"></p><section data-ink="result" class="ics-ai-result" hidden></section></div>';
    const $ = name => host.querySelector('[data-ink="' + name + '"]'), tools = host.querySelector('.ics-ink-tools');
    const store = storage(), memory = new Map(); let mode = 'typing', key = '', doc = null, redo = [], active = null, tool = 'pen', generation = 0, loading = false, frame = 0, timer, dirty = false;
    try { if (localStorage.getItem(MODE_KEY) === 'handwriting') mode = 'handwriting'; } catch (_) { /* Default remains usable. */ }
    let anchors = new Map();
    function currentKey() { const q = options.question(); return q ? q.id + ':' + q.revision : ''; }
    function setAnchors() {
      anchors = new Map([['surface', surface]]);
      surface.querySelectorAll('[data-ink-anchor]').forEach(el => el.removeAttribute('data-ink-anchor'));
      surface.querySelectorAll('#ics-question-content > *, .ics-choice, [data-ink-paper]').forEach((el, index) => { const id = 'a' + index; el.dataset.inkAnchor = id; anchors.set(id, el); });
    }
    function offset(anchor) { const rect = (anchors.get(anchor) || surface).getBoundingClientRect(), base = surface.getBoundingClientRect(); return { x: rect.left - base.left, y: rect.top - base.top }; }
    function drawStroke(ctx, stroke) {
      const origin = offset(stroke.anchor); ctx.globalCompositeOperation = stroke.tool === 'erase' ? 'destination-out' : 'source-over'; ctx.strokeStyle = stroke.color; ctx.fillStyle = stroke.color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      stroke.points.forEach((point, index) => {
        const previous = stroke.points[index - 1] || point; ctx.lineWidth = stroke.size * (stroke.tool === 'erase' ? 5 : 0.5 + point[2]);
        ctx.beginPath(); ctx.moveTo(previous[0] + origin.x, previous[1] + origin.y); ctx.lineTo(point[0] + origin.x + (index ? 0 : 0.01), point[1] + origin.y); ctx.stroke();
      });
    }
    function redraw() {
      frame = 0; if (mode !== 'handwriting' || !doc) return;
      const w = surface.clientWidth, h = surface.offsetHeight;
      const ratio = Math.min(devicePixelRatio || 1, 2, 16000 / Math.max(w, h), Math.sqrt(16000000 / (w * h)));
      const width = Math.ceil(w * ratio), height = Math.ceil(h * ratio);
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      const ctx = canvas.getContext('2d'); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, w, h);
      doc.strokes.forEach(stroke => drawStroke(ctx, stroke)); if (active) drawStroke(ctx, active.stroke);
      $('undo').disabled = !doc.strokes.length && !undoClear; $('redo').disabled = !redo.length;
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(redraw); }
    function save() {
      clearTimeout(timer); if (!key || !doc || !dirty) return;
      const saveKey = key, value = JSON.parse(JSON.stringify(doc)); memory.set(saveKey, value); dirty = false;
      // IndexedDB transactions are ordered; returning to a question uses the memory copy immediately.
      store.set(saveKey, value).then(() => { if (key === saveKey && !dirty) $('status').textContent = '本题笔迹已保存在本浏览器。'; }).catch(() => { if (key === saveKey) $('status').textContent = '存储失败，笔迹暂时只保留在当前页面；请勿刷新。'; });
    }
    function changed() { dirty = true; memory.set(key, doc); if (key === currentKey()) options.changed?.(); $('result').hidden = true; options.cancelReview(); clearTimeout(timer); timer = setTimeout(save, 350); schedule(); }
    function finish(event) {
      if (!active || event && event.pointerId !== active.id) return;
      doc.strokes.push(active.stroke); try { surface.releasePointerCapture(active.id); } catch (_) { /* Pointer may already be cancelled. */ } active = null; redo = []; changed();
    }
    function applyMode() {
      tools.hidden = mode !== 'handwriting'; canvas.hidden = mode !== 'handwriting'; surface.classList.toggle('ics-ink-active', mode === 'handwriting');
      surface.style.width = mode === 'handwriting' && doc ? doc.width + 'px' : '';
      host.querySelectorAll('[data-ink-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.inkMode === mode)));
      schedule();
    }
    async function open() {
      const token = ++generation; finish(); save(); key = currentKey(); doc = null; active = null; redo = []; loading = false; dirty = false; $('result').hidden = true; canvas.width = 1; canvas.height = 1;
      surface.style.width = ''; setAnchors(); applyMode();
      if (mode !== 'handwriting' || !key) return;
      loading = true; $('status').textContent = '正在读取本题笔迹…'; const loadKey = key;
      let value = memory.get(key), warning = '';
      if (!value) { try { value = await store.get(key); } catch (_) { warning = '本地存储不可用，笔迹仅保留在当前页面。'; } }
      if (token !== generation || key !== loadKey || mode !== 'handwriting') return;
      doc = value || { version: 1, width: Math.max(240, Math.min(2400, viewport.clientWidth)), strokes: [] }; memory.set(key, doc); loading = false;
      $('status').textContent = warning || (value ? '已恢复本题笔迹。版面保持书写宽度，窄屏可左右移动。' : '可以开始书写。手写内容需 AI 建议或人工自评，点击和输入仍按原规则自动核对。'); applyMode();
      if (doc.strokes.length) options.changed?.();
    }
    host.addEventListener('click', event => {
      const button = event.target.closest('button'); if (!button) return;
      if (button.dataset.inkMode) {
        finish(); save(); options.cancelReview(); mode = button.dataset.inkMode;
        try { localStorage.setItem(MODE_KEY, mode); } catch (_) { /* Preference can remain in memory. */ } open(); return;
      }
      const action = button.dataset.ink;
      if (action === 'cancel') { options.cancelReview(); return; }
      if (action === 'grade') { if (event.isTrusted && doc && !loading) options.review({ capture, status: $('status'), panel: $('result'), cancel: $('cancel'), isCurrent: () => mode === 'handwriting' && key === currentKey() }); return; }
      if (action === 'self') { options.selfGrade(); return; }
      if (!doc || loading) return;
      if (action === 'pen' || action === 'erase') { tool = action; $('pen').setAttribute('aria-pressed', String(tool === 'pen')); $('erase').setAttribute('aria-pressed', String(tool === 'erase')); }
      if (action === 'undo' && doc.strokes.length) { redo.push(doc.strokes.pop()); changed(); }
      if (action === 'redo' && redo.length) { doc.strokes.push(redo.pop()); changed(); }
      if (action === 'clear' && doc.strokes.length) {
        // Erasing the complete canvas is also undoable.
        undoClear = doc.strokes; doc.strokes = []; redo = []; changed(); $('status').textContent = '本题笔迹已清空；点击撤销可恢复。';
      }
    });
    let undoClear = null;
    $('undo').addEventListener('click', event => { if (undoClear && doc && !doc.strokes.length) { event.stopPropagation(); doc.strokes = undoClear; undoClear = null; changed(); } });
    function point(event, anchor) { const rect = (anchors.get(anchor) || surface).getBoundingClientRect(); return [Math.round((event.clientX - rect.left) * 10) / 10, Math.round((event.clientY - rect.top) * 10) / 10, event.pressure > 0 ? event.pressure : 0.5]; }
    const interactive = 'input,textarea,select,button,a,summary,[role="button"]';
    surface.addEventListener('pointerdown', event => {
      if (mode !== 'handwriting' || loading || !doc || active || event.button !== 0 && event.button !== 5 || event.target.closest('.ics-answer-actions,.ics-ai-controls,[data-ink-ignore]')) return;
      if (event.pointerType !== 'pen' && (event.target.closest(interactive) || event.pointerType === 'touch' && !$('finger').checked)) return;
      if (doc.strokes.reduce((sum, stroke) => sum + stroke.points.length, 0) >= MAX_POINTS || doc.strokes.length >= 3000) { $('status').textContent = '本题笔迹已达容量上限，请擦除或清空部分笔迹。'; return; }
      event.preventDefault(); event.stopImmediatePropagation(); undoClear = null;
      const anchor = event.target.closest('[data-ink-anchor]')?.dataset.inkAnchor || 'surface';
      active = { id: event.pointerId, limit: Math.min(10000, MAX_POINTS - doc.strokes.reduce((sum, stroke) => sum + stroke.points.length, 0)), stroke: { tool: event.button === 5 ? 'erase' : tool, color: $('color').value, size: Number($('size').value), anchor, points: [point(event, anchor)] } };
      surface.setPointerCapture(event.pointerId); options.cancelReview(); schedule();
    }, { capture: true, passive: false });
    surface.addEventListener('pointermove', event => {
      if (!active || active.id !== event.pointerId) return; event.preventDefault();
      const samples = event.getCoalescedEvents?.();
      for (const sample of samples?.length ? samples : [event]) { if (active.stroke.points.length < active.limit) active.stroke.points.push(point(sample, active.stroke.anchor)); } schedule();
    }, { passive: false });
    surface.addEventListener('pointerup', finish); surface.addEventListener('pointercancel', finish); surface.addEventListener('lostpointercapture', finish);
    surface.addEventListener('click', event => { if (mode === 'handwriting' && event.pointerType === 'pen') { event.preventDefault(); event.stopImmediatePropagation(); } }, true);
    // Safari exposes stylus touches; cancel their native pan without disabling finger scrolling or pinch zoom.
    surface.addEventListener('touchstart', event => { if (mode === 'handwriting' && (active || Array.from(event.touches).some(touch => touch.touchType === 'stylus') || $('finger').checked)) event.preventDefault(); }, { passive: false });
    $('finger').addEventListener('change', () => surface.classList.toggle('ics-ink-finger', $('finger').checked));
    const observer = new ResizeObserver(() => { if (mode === 'handwriting') schedule(); }); observer.observe(surface);
    surface.addEventListener('load', schedule, true); surface.addEventListener('toggle', schedule, true);
    window.addEventListener('pagehide', () => { finish(); save(); }); document.addEventListener('visibilitychange', () => { if (document.hidden) { finish(); save(); } });
    async function capture() {
      finish(); save(); const captureKey = key;
      if (!options.canReview()) throw new Error('请在显示参考答案或提交答案之前评测手写内容。');
      const render = await loadCapture(); await document.fonts.ready;
      if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise;
      if (window.MathJax?.typesetPromise) await window.MathJax.typesetPromise([surface]);
      const images = Array.from(surface.querySelectorAll('img')).filter(img => !img.closest('[hidden]'));
      await Promise.all(images.map(img => img.decode().catch(() => { throw new Error('题目图片尚未加载完成，请加载后再试。'); })));
      if (captureKey !== key || mode !== 'handwriting') throw new Error('题目已切换，请重新评测。');
      redraw(); const width = surface.clientWidth, height = surface.offsetHeight;
      if (height > 18000 || width * height > 12000000) throw new Error('本题截图过长，请收起草稿纸或减少展开内容后重试；不会截断发送。');
      const originals = Array.from(surface.querySelectorAll('input,textarea,select'));
      const shot = await render(surface, { backgroundColor: getComputedStyle(surface).backgroundColor, scale: Math.min(1.5, Math.sqrt(20000000 / (width * height))), logging: false, allowTaint: false, useCORS: false,
        ignoreElements: element => element.matches?.('.ics-answer-actions,.ics-ai-controls,[data-ink-ignore],script'),
        onclone: clone => {
          clone.querySelectorAll('input[type="password"],#ics-api-config').forEach(el => el.remove());
          // Rasterize controls as ordinary text in the isolated clone. html2canvas's
          // native input painter otherwise loses text inside inline code backgrounds.
          clone.querySelectorAll('#ics-ink-surface input,#ics-ink-surface textarea,#ics-ink-surface select').forEach((input, index) => {
            const original = originals[index]; if (!original || !original.getClientRects().length || original.type === 'hidden') return;
            const style = getComputedStyle(original), rect = original.getBoundingClientRect(), text = clone.createElement('span');
            text.textContent = original.tagName === 'SELECT' ? original.selectedOptions[0]?.textContent || '' : original.value;
            text.style.cssText = 'display:inline-block;box-sizing:border-box;vertical-align:middle;position:relative;white-space:pre-wrap;overflow:hidden;';
            for (const property of ['font', 'color', 'backgroundColor', 'border', 'borderRadius', 'padding', 'margin', 'textAlign']) text.style[property] = style[property];
            text.style.width = rect.width + 'px'; text.style.height = rect.height + 'px'; input.replaceWith(text);
          });
        } });
      if (captureKey !== key || mode !== 'handwriting') throw new Error('题目已切换，请重新评测。');
      const pages = [];
      for (let y = 0; y < shot.height; y += 1800) { const page = document.createElement('canvas'); page.width = shot.width; page.height = Math.min(1800, shot.height - y); page.getContext('2d').drawImage(shot, 0, y, page.width, page.height, 0, 0, page.width, page.height); pages.push(page.toDataURL('image/png')); }
      if (pages.join('').length > 24000000) throw new Error('本题图片超过发送上限，请改用人工自评；不会截断发送。');
      return pages;
    }
    applyMode();
    return { render() { undoClear = null; open(); }, hasInk() { return !!doc?.strokes.length; } };
  }
  return { MODE_KEY, MAX_POINTS, validDocument, mount };
}));
