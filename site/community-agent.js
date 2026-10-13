(function () {
  'use strict';
  const ENDPOINT = 'https://ics-test-mcp.ics-test-mcp.workers.dev';
  window.ICSCommunityAgent = { mount(community) {
    const host = community.agentHost;
    host.innerHTML = '<details class="ics-community-agent"><summary>让 Agent 帮我组卷（MCP）</summary><p class="ics-community-note">仅共享本份组卷草稿，不共享作答历史或熟知进度。Agent 只能选题和写草稿；检查、载入及发布都由你操作。连接两小时后过期，刷新需重连。</p>' +
      '<div class="ics-community-toolbar"><button class="ics-secondary" type="button" data-ca="connect">授权 Agent 组卷</button><button class="ics-secondary" type="button" data-ca="check" hidden>检查 Agent 草稿</button><button class="ics-secondary" type="button" data-ca="disconnect" hidden>断开授权</button></div>' +
      '<p data-ca="status" role="status" class="ics-community-note"></p><label data-ca="prompt-label" hidden>复制给 Agent（请勿公开）<textarea data-ca="prompt" rows="6" readonly spellcheck="false"></textarea></label><div data-ca="incoming" hidden><p data-ca="incoming-summary" class="ics-community-note"></p><button class="ics-secondary" type="button" data-ca="import">载入此草稿</button></div></details>';
    const $ = key => host.querySelector('[data-ca="' + key + '"]');
    let session = null, incoming = null, busy = false;
    async function request(method, body, current = session) {
      const response = await fetch(ENDPOINT + '/curation-sessions' + (current ? '/' + current.sessionId : ''), {
        method, cache: 'no-store', headers: { 'Content-Type': 'application/json', ...(current ? { Authorization: 'Bearer ' + current.browserToken } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 410) {
          clear();
          if (method === 'DELETE') return { disconnected: true };
        }
        throw new Error(data.error || '连接失败');
      }
      return data;
    }
    function clear() {
      session = incoming = null; $('prompt').value = ''; $('prompt-label').hidden = true; $('incoming').hidden = true;
      $('connect').hidden = false; $('check').hidden = true; $('disconnect').hidden = true;
    }
    host.addEventListener('click', async event => {
      const button = event.target.closest('button[data-ca]'); if (!button || busy) return;
      const action = button.dataset.ca; busy = true; button.disabled = true;
      try {
        if (action === 'connect') {
          let draft = null; try { draft = window.ICSCommunityPapers.validateDraft(community.getDraft()); } catch (_) { /* Empty draft is valid for a new connection. */ }
          session = await request('POST', { draft }, null);
          $('connect').hidden = true; $('check').hidden = false; $('disconnect').hidden = false; $('prompt-label').hidden = false;
          $('prompt').value = '请使用 ICS MCP 帮我筛选题目、组成未发布草稿。\nMCP: ' + ENDPOINT + '/mcp\n组卷凭证 curationToken: ' + session.curationToken +
            '\n先用 search_questions 查题（用 read_question 看全文），再用 read_paper_draft 读取版本，最后 update_paper_draft 写草稿。请向我确认标题、署名和要求；不能发布。完成后提醒我回网页“检查 Agent 草稿”→“载入此草稿”，确认后由我亲自点击发布。';
          $('status').textContent = '已授权。请复制下方信息给 Agent，并说明选题要求；凭证不要公开。';
        }
        if (action === 'check') {
          const data = await request('GET'); incoming = data.draft;
          $('incoming').hidden = !incoming;
          $('incoming-summary').textContent = incoming ? '版本 ' + data.revision + ' · ' + incoming.title + ' · 署名 ' + incoming.author + ' · ' + incoming.ids.length + ' 题。载入会替换本地草稿，但不会发布。' : '';
          $('status').textContent = incoming ? '已取得 Agent 草稿，尚未载入。' : 'Agent 尚未写入草稿。';
        }
        if (action === 'import' && incoming) {
          if (!confirm('用这份 Agent 草稿替换当前本地草稿？这不会发布卷子。')) return;
          await community.importAgentDraft(incoming); $('incoming').hidden = true;
          $('status').textContent = '已载入。请检查下面的题单，发布必须由你亲自点击。';
        }
        if (action === 'disconnect') {
          if (session) await request('DELETE'); clear(); $('status').textContent = '已断开授权，远程草稿已删除；本地草稿仍保留。';
        }
      } catch (error) { $('status').textContent = error.message || '组卷连接失败，请重试。'; }
      finally { busy = false; button.disabled = false; }
    });
    // No polling/import-on-message and no publish callback is available to Agent.
  } };
}());
