(function () {
  'use strict';
  const api = window.ICSAIGrader, CONFIRM_KEY = 'ics-ai-grader-confirm-v1';
  window.ICSAIGraderUI = { create(options) {
    const host = options.host, vault = api.vault(() => localStorage), cache = new Map();
    let config = vault.load(), request = null, generation = 0, prompting = false, pendingConfirm = null, skip = {};
    try { const value = JSON.parse(localStorage.getItem(CONFIRM_KEY)); if (value && value.version === 1) skip = value; } catch (_) { /* Ask by default. */ }
    host.innerHTML = '<details id="ics-api-settings"><summary><strong>API 简答评测</strong><span>无需 MCP，手机也可使用</span></summary>' +
      '<p>仅当你主动评测时，浏览器才会直接调用所选官方 API。本站不收集、不代用你的 API Key，不用于其它用途；API 密钥和评测请求不经过本站服务器、Supabase、MCP 或 Cloudflare。如另行开启 MCP 填写共享，仍按该独立设置同步。</p>' +
      '<p class="ics-api-warning">浏览器不是密钥保险箱：同一域名下其它页面的脚本、恶意扩展或共用设备可能读取密钥。建议使用单独、受限且设置费用额度的 Key。供应商会收到评测内容，并按其政策处理；API 费用由你承担。</p>' +
      '<form data-api="form"><div class="ics-api-fields"><label>供应商<select data-api="provider"><option value="openai">OpenAI</option><option value="deepseek">DeepSeek</option></select></label>' +
      '<label>模型 ID<input data-api="model" maxlength="128" autocomplete="off" spellcheck="false"></label>' +
      '<label class="ics-api-key">API Key<input data-api="key" type="password" maxlength="1024" autocomplete="off" spellcheck="false" autocapitalize="none" placeholder="仅输入你自己的模型 API Key"></label></div>' +
      '<label class="ics-api-check"><input data-api="remember" type="checkbox"> 在此浏览器记住密钥（明文保存；不要用于共享设备）</label>' +
      '<label class="ics-api-check"><input data-api="ask" type="checkbox" checked> 每次评测前显示发送确认（按供应商记忆，可随时恢复）</label>' +
      '<label class="ics-api-check"><input data-api="consent" type="checkbox" required> 我了解上述风险，同意仅在主动评测时发送当前题资料和回答，并承担 API 费用。</label>' +
      '<div class="ics-api-actions"><button class="ics-primary" type="submit">保存并启用</button><button class="ics-secondary" data-api="clear" type="button">停用并清除密钥</button></div></form>' +
      '<p data-api="status" role="status" aria-live="polite"></p><details class="ics-api-prompt"><summary>查看评测规则与发送范围</summary>' +
      '<p>仅发送当前简答题（或当前简答小问与公共题面）、参考答案和本次填写。不发送作答历史、熟知进度或其它题的回答。不上传图片像素；依赖图片且文字资料不足时需人工复核。0–10 分仅作建议，仍需你确认自评。</p><pre data-api="prompt"></pre></details>' +
      '<p class="ics-api-links"><a href="https://developers.openai.com/api/reference/typescript#requirements" target="_blank" rel="noopener noreferrer">OpenAI 浏览器密钥风险说明 ↗</a></p></details>';
    const $ = key => host.querySelector('[data-api="' + key + '"]');
    const dialog = document.createElement('dialog'); dialog.className = 'ics-api-confirm'; dialog.id = 'ics-api-confirm';
    dialog.innerHTML = '<h3>确认发送简答评测</h3><p data-confirm="scope"></p><p>会发送当前题面、参考答案和本次填写，可能产生 API 费用。不发送其它回答、作答历史或图片像素，不通过本站转发。</p><label class="ics-api-check"><input data-confirm="skip" type="checkbox"> 以后不再显示（仅此供应商；可在 API 设置恢复）</label><div class="ics-api-actions"><button class="ics-secondary" data-confirm="cancel" type="button">取消</button><button class="ics-primary" data-confirm="send" type="button">发送并评测</button></div>';
    document.body.append(dialog); $('prompt').textContent = api.PROMPT;
    const confirmField = key => dialog.querySelector('[data-confirm="' + key + '"]');
    function remember(provider, value) {
      skip[provider] = value;
      try { localStorage.setItem(CONFIRM_KEY, JSON.stringify({ version: 1, openai: skip.openai === true, deepseek: skip.deepseek === true })); }
      catch (_) { $('status').textContent = '发送确认偏好仅在当前页面生效，刷新后可能再次询问。'; }
      $('ask').checked = !value;
    }
    function confirmation(used) {
      if (skip[used.provider] === true) return Promise.resolve(true);
      confirmField('scope').textContent = '接收方：' + api.PROVIDERS[used.provider].name + ' · 模型：' + used.model;
      confirmField('skip').checked = false;
      return new Promise(resolve => { pendingConfirm = { resolve, provider: used.provider }; dialog.showModal(); });
    }
    dialog.addEventListener('close', () => {
      if (!pendingConfirm) return;
      const current = pendingConfirm; pendingConfirm = null;
      const accepted = dialog.returnValue === 'send';
      if (accepted && confirmField('skip').checked) remember(current.provider, true);
      current.resolve(accepted);
    });
    dialog.addEventListener('cancel', event => { event.preventDefault(); dialog.close('cancel'); });
    confirmField('cancel').addEventListener('click', () => dialog.close('cancel'));
    confirmField('send').addEventListener('click', event => { if (event.isTrusted) dialog.close('send'); });
    function label() { options.summary.textContent = config ? '已启用 ' + api.PROVIDERS[config.provider].name : '未启用'; }
    function stop(message) {
      generation++;
      if (dialog.open) dialog.close('cancel');
      if (request) { request.controller.abort(); if (request.status.isConnected && message) request.status.textContent = message; request = null; }
      options.questionHost.querySelectorAll('[data-ai-cancel]').forEach(button => { button.hidden = true; });
    }
    function setFields(value) {
      $('provider').value = value ? value.provider : 'openai'; $('model').value = value ? value.model : api.PROVIDERS.openai.model;
      $('key').value = value ? value.key : ''; $('remember').checked = !!value; $('consent').checked = !!value;
      $('ask').checked = skip[$('provider').value] !== true;
    }
    setFields(config); label();
    $('status').textContent = config ? '已从本浏览器读取配置，尚未验证接口；只在主动评测时发送请求。' : '未启用。默认密钥仅保留在当前页面，刷新后清除。';
    function refreshButtons() {
      options.questionHost.querySelectorAll('[data-ai-grade]').forEach(button => {
        const input = button.closest('.ics-short-answer').querySelector('textarea');
        let valid = true; try { api.payload(options.question(), input.dataset.shortAnswer, input.value); button.title = ''; } catch (error) { valid = false; button.title = error.message; }
        button.disabled = !config || !valid || !!request || prompting;
      });
    }
    $('ask').addEventListener('change', () => remember($('provider').value, !$('ask').checked));
    $('form').addEventListener('input', event => {
      if (event.target === $('provider') || event.target === $('ask')) return;
      if (config) { config = null; stop('设置已修改，本次评测已取消。'); label(); refreshButtons(); }
      $('status').textContent = '设置尚未保存，评测暂未启用。';
    });
    $('provider').addEventListener('change', () => {
      config = null; stop('供应商已切换，本次评测已取消。'); $('key').value = ''; $('model').value = api.PROVIDERS[$('provider').value].model;
      $('consent').checked = false; $('ask').checked = skip[$('provider').value] !== true;
      try { vault.clear(); $('status').textContent = '供应商已切换，原密钥已清除，请填写该供应商的密钥并保存。'; }
      catch (_) { $('status').textContent = '供应商已切换，但旧的浏览器存储未能清除，请在浏览器设置中清除此站点数据。'; }
      label(); refreshButtons();
    });
    $('form').addEventListener('submit', event => {
      event.preventDefault(); stop('配置已更改，本次评测已取消。'); config = null;
      try {
        if (!$('consent').checked) throw new Error('请先阅读并同意密钥风险和发送范围。');
        const value = api.validConfig({ provider: $('provider').value, model: $('model').value.trim(), key: $('key').value.trim() });
        let storageWarning = '';
        try { vault.save(value, $('remember').checked); }
        catch (_) { storageWarning = '浏览器存储更新失败，本次只在内存启用；旧保存配置可能仍存在，请手工清除此站点数据。'; }
        config = value; $('key').value = value.key;
        $('status').textContent = '配置已启用（尚未验证接口）。' + (storageWarning || ($('remember').checked ? '密钥已明文保存在本浏览器。' : '密钥只在当前页面内存中保留，刷新后清除。')) + '在简答框下点击“自动评测简答题答案”即可使用。';
      } catch (error) { $('status').textContent = error.message; }
      label(); refreshButtons();
    });
    $('clear').addEventListener('click', () => {
      config = null; stop('API 已停用，评测已取消。'); cache.clear(); skip = {}; setFields(null);
      options.questionHost.querySelectorAll('[data-ai-result]').forEach(panel => { panel.hidden = true; panel.replaceChildren(); });
      try { vault.clear(); localStorage.removeItem(CONFIRM_KEY); $('status').textContent = '已停用并清除密钥，恢复发送确认。供应商已经收到的内容无法在这里撤回。'; }
      catch (_) { $('status').textContent = '当前页面已停用并清除密钥，但浏览器存储清除失败；请在浏览器设置中清除此站点数据。'; }
      label(); refreshButtons();
    });
    function output(panel, result, used) {
      panel.replaceChildren(); panel.hidden = false;
      const heading = document.createElement('h4'); heading.textContent = result.score === null ? 'AI 无法可靠评分 · 请人工复核'
        : 'AI 建议评分：' + (Math.round(result.score * 10) / 10) + ' / 10' + (result.needs_review ? ' · 需人工复核' : ''); panel.append(heading);
      const meta = document.createElement('p'); meta.className = 'ics-api-result-note'; meta.textContent = used + ' · 针对此次回答 · 不自动确认自评或写入作答记录。'; panel.append(meta);
      for (const [key, title] of [['reason', '评分依据'], ['strengths', '已答对的点'], ['gaps', '遗漏或错误'], ['suggestions', '改进建议'], ['uncertainty', '不确定性']]) {
        if (typeof result[key] === 'string' ? !result[key].trim() : !result[key].length) continue;
        const heading = document.createElement('strong'); heading.textContent = title; panel.append(heading);
        if (Array.isArray(result[key])) {
          const list = document.createElement('ul'); result[key].forEach(text => { const li = document.createElement('li'); li.textContent = text; list.append(li); }); panel.append(list);
        } else { const p = document.createElement('p'); p.textContent = result[key]; panel.append(p); }
      }
    }
    options.questionHost.addEventListener('input', event => {
      if (!event.target.matches('[data-short-answer]')) return;
      const root = event.target.closest('.ics-short-answer'); root.querySelector('[data-ai-result]').hidden = true;
      if (request && request.input === event.target || prompting) stop('回答已修改，本次评测已取消，请重新评测。');
      root.querySelector('[data-ai-status]').textContent = '只评测当前填写内容；修改后需重新评测。'; refreshButtons();
    });
    options.questionHost.addEventListener('click', async event => {
      const button = event.target.closest('[data-ai-grade], [data-ai-cancel], [data-ai-settings]'); if (!button || button.disabled) return;
      if (button.hasAttribute('data-ai-settings')) { options.agentPanel.open = true; host.querySelector('details').open = true; host.scrollIntoView({ behavior: 'smooth' }); $('key').focus(); return; }
      if (button.hasAttribute('data-ai-cancel')) { stop('评测已取消；已发送的请求可能仍由供应商计费。'); refreshButtons(); return; }
      if (!event.isTrusted) return;
      const root = button.closest('.ics-short-answer'), input = root.querySelector('textarea'), status = root.querySelector('[data-ai-status]'), panel = root.querySelector('[data-ai-result]');
      let token;
      try {
        if (!config || request || prompting) return;
        const data = api.payload(options.question(), input.dataset.shortAnswer, input.value), fingerprint = JSON.stringify(data), used = { ...config };
        token = ++generation; prompting = true; refreshButtons();
        const accepted = await confirmation(used); prompting = false;
        if (!accepted || token !== generation || !input.isConnected || input.value !== data.studentAnswer || !options.question() || options.question().id !== data.questionId) { refreshButtons(); return; }
        const controller = new AbortController(), key = data.questionId + ':' + (data.partId || 'root');
        request = { controller, input, status }; refreshButtons(); root.querySelector('[data-ai-cancel]').hidden = false;
        status.textContent = 'AI 正在评测本次回答…'; panel.hidden = true;
        const timeout = setTimeout(() => controller.abort(), 90000);
        try {
          const result = await api.evaluate(used, data, controller.signal);
          if (token !== generation || controller.signal.aborted || !input.isConnected || input.value !== data.studentAnswer || !options.question() || options.question().id !== data.questionId) return;
          const provider = api.PROVIDERS[used.provider].name + ' / ' + used.model;
          cache.set(key, { fingerprint, result, provider }); output(panel, result, provider);
          $('status').textContent = '已成功调用 ' + provider + '。只在主动评测时请求，不会因输入、切题或刷新自动调用。';
          status.textContent = '评测已完成，仅供参考。请自行查看参考答案并确认自评。';
        } finally { clearTimeout(timeout); if (token === generation) { request = null; root.querySelector('[data-ai-cancel]').hidden = true; refreshButtons(); } }
      } catch (error) { if (input.isConnected && (token === undefined || token === generation)) status.textContent = error.message || '评测失败，请人工自评。'; }
      finally { if (token === generation) { prompting = false; refreshButtons(); } }
    });
    window.addEventListener('storage', event => {
      if (event.key === CONFIRM_KEY) {
        try { const value = JSON.parse(event.newValue); skip = value && value.version === 1 ? value : {}; } catch (_) { skip = {}; }
        $('ask').checked = skip[$('provider').value] !== true; return;
      }
      if (event.key !== api.STORAGE_KEY && event.key !== null) return;
      config = null; stop('另一页面已更新密钥，当前评测已取消。'); $('key').value = ''; label(); refreshButtons();
      $('status').textContent = '密钥存储在另一页面发生变化，已停用；请刷新后检查配置。';
    });
    return {
      stop() { stop('已离开当前题，评测已取消。'); },
      render() {
        stop();
        options.questionHost.querySelectorAll('.ics-short-answer').forEach(root => {
          if (root.querySelector('[data-ai-grade]')) return;
          const controls = document.createElement('div'); controls.className = 'ics-ai-controls';
          controls.innerHTML = '<div class="ics-api-actions"><button class="ics-secondary" data-ai-grade type="button" disabled>自动评测简答题答案</button><button class="ics-secondary" data-ai-cancel type="button" hidden>取消评测</button><button class="ics-text-button" data-ai-settings type="button">配置 API</button></div><p data-ai-status role="status" class="ics-composite-note"></p><section data-ai-result class="ics-ai-result" hidden></section>';
          root.append(controls);
          const input = root.querySelector('textarea'), status = root.querySelector('[data-ai-status]');
          try {
            const data = api.payload(options.question(), input.dataset.shortAnswer, input.value), cached = cache.get(data.questionId + ':' + (data.partId || 'root'));
            if (cached && cached.fingerprint === JSON.stringify(data)) output(root.querySelector('[data-ai-result]'), cached.result, cached.provider);
          } catch (_) { /* Empty answer/unavailable reference: leave evaluation disabled. */ }
          status.textContent = config ? '建议评分不自动计分；依赖图片且文字不足时需人工复核。' : '先在 Agent 接入处配置 API；无需连接 MCP。';
        });
        refreshButtons();
      },
    };
  } };
}());
