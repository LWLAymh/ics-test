(function (root) {
  'use strict';
  const ENDPOINT = 'https://ics-test-mcp.ics-test-mcp.workers.dev';
  const TOKEN = /^[a-f0-9]{32}\.[a-f0-9]{64}$/;
  const ID = /^q-[a-f0-9]{8,64}$/;
  const KEY = /^[a-f0-9]{64}$/;
  const SID = /^[a-f0-9]{32}$/;
  function copyDraft(value) {
    // Explicit whitelist: never serialize saved records, grading or reference answers.
    const identifier = id => typeof id === 'string' && id.length > 0 && id.length <= 128;
    function unit(item, part) {
      if (!item || (part && !identifier(item.id)) || !Array.isArray(item.choices) || item.choices.length > 64 ||
          !item.choices.every(identifier) || !Array.isArray(item.blanks) || item.blanks.length > 256) throw Error();
      return { ...(part ? { id: item.id } : {}), choices: [...new Set(item.choices)],
        blanks: item.blanks.map(blank => {
          if (!blank || !identifier(blank.id) ||
              !(typeof blank.value === 'string' ? blank.value.length <= 2048 : Array.isArray(blank.value) &&
                blank.value.length <= 64 && blank.value.every(value => typeof value === 'string' && value.length <= 2048))) throw Error();
          return { id: blank.id, value: Array.isArray(blank.value) ? [...blank.value] : blank.value };
        }) };
    }
    try {
      if (!value || !Array.isArray(value.parts) || value.parts.length > 128) return null;
      const draft = { ...unit(value, false), parts: value.parts.map(part => unit(part, true)) };
      return new TextEncoder().encode(JSON.stringify(draft)).byteLength <= 48000 ? draft : null;
    } catch (_) { return null; }
  }
  const copyContext = value => {
    const questionId = value && ID.test(value.questionId || '') ? value.questionId : null;
    const draft = questionId ? copyDraft(value.draft) : null;
    return { questionId, partId: questionId && typeof value.partId === 'string' ? value.partId : null,
      draft, draftTooLarge: !!(questionId && value.draft && !draft) };
  };

  class PracticeConnection {
    constructor(options) {
      options = options || {};
      this.endpoint = options.endpoint || ENDPOINT;
      this.request = options.request || ((url, init) => fetch(url, init));
      this.now = options.now || Date.now;
      this.onChange = options.onChange || function () {};
      this.context = copyContext(null); this.shareDraft = true;
      this.session = null; this.revoking = null; this.sequence = 0;
      this.status = 'disconnected'; this.error = ''; this.remote = null;
      this.pending = false; this.flushPromise = null;
      this.creating = false; this.generation = 0;
    }
    snapshot() {
      // Never return browser write credentials to callbacks or the DOM.
      return { status: this.status, error: this.error, context: { ...this.context },
        remote: this.remote && { ...this.remote }, shareDraft: this.shareDraft, expiresAt: this.session && this.session.expiresAt };
    }
    wireContext() {
      return { questionId: this.context.questionId, partId: this.context.partId,
        shareDraft: this.shareDraft, draft: this.shareDraft ? this.context.draft : null };
    }
    setSharing(enabled) {
      this.shareDraft = enabled === true; this.emit(); return this.sync();
    }
    emit() { this.onChange(this.snapshot()); }
    expire() {
      this.session = null; this.pending = false; this.remote = null;
      this.status = 'expired'; this.error = '临时连接已过期，请重新连接。'; this.emit();
    }
    async api(path, method, body, key, keepalive) {
      const response = await this.request(this.endpoint + path, {
        method, headers: { 'Content-Type': 'application/json', ...(key ? { Authorization: 'Bearer ' + key } : {}) },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(10000), cache: 'no-store', redirect: 'error', keepalive: !!keepalive,
      });
      let data;
      try { data = await response.json(); } catch (_) { data = {}; }
      if (!response.ok) {
        const error = new Error(typeof data.error === 'string' ? data.error : '连接服务暂不可用，请重试。');
        error.status = response.status; throw error;
      }
      return data;
    }
    async connect() {
      if (this.session || this.revoking || this.creating) return false;
      this.creating = true;
      const generation = ++this.generation;
      this.status = 'connecting'; this.error = ''; this.emit();
      try {
        const initial = this.wireContext();
        const data = await this.api('/practice-sessions', 'POST', initial);
        if (!SID.test(data.sessionId || '') || !KEY.test(data.writeToken || '') ||
            !TOKEN.test(data.connectionToken || '') || data.connectionToken.split('.')[0] !== data.sessionId ||
            !Number.isFinite(data.expiresAt) || data.expiresAt <= this.now()) throw new Error('连接响应无效，请重试。');
        const session = { sessionId: data.sessionId, writeToken: data.writeToken,
          connectionToken: data.connectionToken, expiresAt: data.expiresAt };
        if (this.generation !== generation) {
          this.revoking = session; await this.disconnect(true); return false;
        }
        this.session = session;
        this.sequence = 0; this.remote = this.remoteState(data);
        this.status = 'connected'; this.emit();
        if (JSON.stringify(initial) !== JSON.stringify(this.wireContext())) await this.sync();
        return true;
      } catch (error) {
        this.status = this.generation === generation ? 'error' : 'disconnected';
        this.error = this.generation === generation ? error.message : '';
        this.emit(); return false;
      } finally { this.creating = false; }
    }
    remoteState(data) {
      return { questionId: data.questionId || null, partId: data.partId || null,
        shareDraft: data.shareDraft === true, updatedAt: data.updatedAt, lastReadAt: data.lastReadAt || null };
    }
    setContext(value) {
      const before = JSON.stringify(this.wireContext()), next = copyContext(value);
      this.context = next; this.emit();
      if (JSON.stringify(this.wireContext()) === before) return this.flushPromise || Promise.resolve();
      return this.sync();
    }
    sync() {
      if (!this.session) return Promise.resolve();
      if (this.now() >= this.session.expiresAt) { this.expire(); return Promise.resolve(); }
      this.pending = true;
      if (this.flushPromise) return this.flushPromise;
      this.flushPromise = this.flush().finally(() => {
        this.flushPromise = null;
        if (this.pending && this.session) this.sync();
      });
      return this.flushPromise;
    }
    async flush() {
      while (this.pending && this.session) {
        this.pending = false;
        const session = this.session, context = this.wireContext(), sequence = ++this.sequence;
        this.status = 'syncing'; this.error = ''; this.emit();
        try {
          const data = await this.api('/practice-sessions/' + session.sessionId, 'PUT', { ...context, sequence }, session.writeToken);
          if (this.session !== session) return;
          this.remote = this.remoteState(data); this.status = 'connected'; this.emit();
        } catch (error) {
          if (this.session !== session) return;
          if (error.status === 410 || this.now() >= session.expiresAt) { this.expire(); return; }
          this.status = 'error';
          this.error = '同步失败，Agent 可能仍看到旧题或旧填写内容；共享关闭也尚未在服务器生效。' + error.message;
          this.emit(); return;
        }
      }
    }
    prompt() {
      if (!this.session || this.now() >= this.session.expiresAt) return '';
      return '请通过 ICS Test MCP 连接我当前的练习。\n' +
        'MCP 地址：' + this.endpoint + '/mcp（Streamable HTTP）\n' +
        '临时只读连接凭证 connectionToken：' + this.session.connectionToken + '\n' +
        '每次我问“当前这题”时，请重新调用 read_question({connectionToken:"' + this.session.connectionToken + '"})，不要沿用旧题号。\n' +
        'practice.draft 是我允许共享的当前填写内容，不是参考答案；可只读分析，不能修改、代填或提交。shareDraft=false 时不读取我的填写内容。\n' +
        '仅在我要求查看答案时，用刚读取到的明确题目 ID 调用 read_answer。\n' +
        '报错前先向我展示明确题号和将公开的说明，得到确认后调用 report_issue。\n' +
        '凭证只用于当前临时会话，不要公开、写进报错或提交到仓库；断开或过期后失效。';
    }
    async disconnect(keepalive) {
      this.generation++;
      if (!this.revoking) this.revoking = this.session;
      this.session = null; this.pending = false; this.remote = null;
      if (!this.revoking) { this.status = this.creating ? 'disconnecting' : 'disconnected'; this.error = ''; this.emit(); return true; }
      const target = this.revoking;
      this.status = 'disconnecting'; this.error = ''; this.emit();
      try {
        await this.api('/practice-sessions/' + target.sessionId, 'DELETE', undefined, target.writeToken, keepalive);
        if (this.revoking === target) this.revoking = null;
        this.status = 'disconnected'; this.error = ''; this.emit(); return true;
      } catch (_) {
        this.status = 'revocation-pending';
        this.error = '已停止同步，但尚未确认服务器撤销。请重试断开；旧上下文在最后同步三分钟后不可读取。';
        this.emit(); return false;
      }
    }
  }

  if (typeof module === 'object' && module.exports) module.exports = { PracticeConnection };
  else root.IcsPracticeConnection = { PracticeConnection };

  if (!root.document) return;
  const $ = id => root.document.getElementById(id);
  const panel = $('ics-agent-connection');
  if (!panel) return;
  const controls = {
    connect: $('ics-agent-connect'), disconnect: $('ics-agent-disconnect'), retry: $('ics-agent-sync'),
    copy: $('ics-agent-copy-connection'), status: $('ics-agent-connection-status'), summary: $('ics-agent-summary'),
    prompt: $('ics-agent-connection-prompt'), copyStatus: $('ics-agent-connection-copy-status'),
    promptPanel: $('ics-agent-connection-copy-panel'),
    share: $('ics-agent-share-draft'),
  };
  const connection = new PracticeConnection({ onChange: function (state) {
    const active = !!state.expiresAt;
    controls.connect.hidden = active || state.status === 'disconnecting' || state.status === 'revocation-pending';
    controls.connect.disabled = state.status === 'connecting';
    controls.disconnect.hidden = !active && state.status !== 'revocation-pending' && state.status !== 'disconnecting';
    controls.disconnect.disabled = state.status === 'disconnecting';
    controls.disconnect.textContent = state.status === 'revocation-pending' ? '重试断开' : '断开连接';
    controls.retry.hidden = !(active && state.status === 'error');
    controls.copy.hidden = !active;
    controls.copy.disabled = state.status !== 'connected';
    if (!active) {
      controls.prompt.value = ''; controls.promptPanel.hidden = true;
      controls.copyStatus.textContent = '';
    }
    const labels = { disconnected: '未连接', connecting: '正在创建…', connected: '已启用同步',
      syncing: '同步中…', error: '连接异常', expired: '已过期', disconnecting: '正在断开…', 'revocation-pending': '断开待确认' };
    controls.summary.textContent = labels[state.status] || '未连接';
    controls.summary.dataset.state = state.status;
    controls.status.dataset.state = state.status;
    // The summary already shows in-flight progress. Preserve the last status
    // during routine updates so this panel above the quiz does not change height
    // and trigger scroll-dismissal of an open answer menu.
    if (state.status === 'syncing' && state.remote) return;
    let text = state.error || (state.status === 'disconnected' ? '尚未开启同步。'
      : state.status === 'connecting' ? '正在创建临时练习连接…'
      : state.status === 'disconnecting' ? '已停止同步，正在撤销服务器上的连接…'
      : state.status === 'syncing' ? '正在同步当前题目…'
      : state.remote && state.remote.questionId ? '当前题目已同步。'
      : '已启用同步，当前未打开练习题。');
    if (active) {
      text += state.remote && state.remote.shareDraft ? ' · 已共享当前填写内容（只读）' : ' · 未共享填写内容';
      if (state.shareDraft && state.context.draftTooLarge) text += ' · 填写内容过长，暂只同步题号；每空限 2048 字符、合计 48KB';
      text += ' · 到期 ' + new Date(state.expiresAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      text += state.remote && state.remote.lastReadAt ? ' · Agent 曾读取此会话' : ' · 复制连接信息交给 Agent 后即可读取';
    }
    controls.status.textContent = text;
  } });
  controls.connect.addEventListener('click', () => {
    if (latestContext) connection.setContext(latestContext);
    connection.connect();
  });
  controls.disconnect.addEventListener('click', () => connection.disconnect());
  controls.retry.addEventListener('click', () => connection.sync());
  controls.copy.addEventListener('click', async function () {
    const prompt = connection.prompt();
    if (!prompt) { connection.expire(); return; }
    controls.prompt.value = prompt; controls.promptPanel.hidden = false;
    try {
      await root.navigator.clipboard.writeText(prompt);
      controls.copyStatus.textContent = '已复制。只需在这段 Agent 对话中提供一次；请勿公开此凭证。';
    } catch (_) {
      controls.copyStatus.textContent = '浏览器未允许自动复制，请手动复制下面的连接信息。';
      controls.prompt.focus(); controls.prompt.select();
    }
  });
  $('ics-agent-copy-url').addEventListener('click', async function () {
    const field = $('ics-agent-service-url'), status = $('ics-agent-url-status');
    try {
      await root.navigator.clipboard.writeText(field.textContent.trim());
      status.textContent = '服务地址已复制。';
    } catch (_) {
      const range = root.document.createRange();
      range.selectNodeContents(field);
      const selection = root.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      status.textContent = '请手动复制已选中的服务地址。';
    }
  });
  let draftTimer = null, lastInputSync = 0, latestContext = null;
  controls.share.addEventListener('change', () => {
    if (latestContext) connection.context = copyContext(latestContext);
    connection.setSharing(controls.share.checked);
  });
  root.document.addEventListener('ics:practice-context', event => {
    latestContext = event.detail;
    clearTimeout(draftTimer);
    const next = copyContext(latestContext);
    if (next.questionId !== connection.context.questionId || next.partId !== connection.context.partId) {
      connection.setContext(latestContext); return;
    }
    // Debounce typing and bound update frequency; navigation remains immediate.
    draftTimer = root.setTimeout(() => {
      lastInputSync = Date.now(); connection.setContext(latestContext);
    }, Math.max(600, 1500 - (Date.now() - lastInputSync)));
  });
  root.addEventListener('online', () => connection.revoking ? connection.disconnect() : connection.sync());
  root.document.addEventListener('visibilitychange', () => { if (!root.document.hidden) connection.sync(); });
  root.addEventListener('pagehide', () => connection.disconnect(true));
  root.setInterval(() => { if (connection.revoking) connection.disconnect(); else connection.sync(); }, 45000);
  connection.shareDraft = controls.share.checked;
  connection.emit();
})(typeof window !== 'undefined' ? window : globalThis);
