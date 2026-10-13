import test from 'node:test';
import assert from 'node:assert/strict';
import { CurationSession, validPaperDraft } from '../src/curation-session.mjs';
import { callTool, handleRequest, TOOLS } from '../src/worker.mjs';
const q = 'q-0123456789abcdef', draft = { title: '精选', author: '测试', description: '', ids: [q] };
const allow = { limit: async () => ({ success: true }) };
function harness() {
  const objects = new Map();
  const env = { SITE_URL: 'https://bank.example/', MCP_RATE_LIMITER: allow, SESSION_CREATE_RATE_LIMITER: allow,
    CURATION_SESSIONS: { idFromName: id => id, get(id) {
      if (!objects.has(id)) {
        const store = new Map(); let lock = Promise.resolve();
        const object = new CurationSession({ storage: { get: async k => structuredClone(store.get(k)), put: async (k, v) => store.set(k, structuredClone(v)), deleteAll: async () => store.clear(), setAlarm: async () => {} },
          blockConcurrencyWhile(fn) { const next = lock.then(fn); lock = next.catch(() => {}); return next; } });
        objects.set(id, { object, store });
      }
      return { fetch: request => objects.get(id).object.fetch(request) };
    } } };
  const request = (path, method, body, key, origin = 'https://bank.example') => handleRequest(new Request('https://worker.example' + path, {
    method, headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': '203.0.113.1', ...(key ? { Authorization: 'Bearer ' + key } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }), env);
  return { env, objects, request };
}
const upstream = async url => { assert.ok(url.endsWith('/mcp-data/question-index.json')); return Response.json({ version: 1, modules: [{ id: 'data', title: '数据' }], questions: [
  { id: q, type: 'fill', source: 'pku-exam', moduleIds: ['data'], paperId: 'p-one', paperName: '原卷', excerpt: '题面' },
] }); };
test('curation schema refuses extra permissions, unsupported IDs and oversized fields', () => {
  assert.equal(validPaperDraft(draft), true);
  for (const d of [{ ...draft, publish: true }, { ...draft, ids: [] }, { ...draft, ids: [q, q] },
    { ...draft, ids: [null] }, { ...draft, author: '' }, { ...draft, title: 'a'.repeat(61) }, { ...draft, answers: [] }]) assert.equal(validPaperDraft(d), false);
  assert.ok(!TOOLS.some(t => /publish|submit_answer|grade|like_paper/.test(t.name)));
});
test('curation capability can only stage drafts; browser imports manually, never publishes', async () => {
  const h = harness();
  const created = await (await h.request('/curation-sessions', 'POST', { draft: null })).json();
  const path = '/curation-sessions/' + created.sessionId;
  assert.notEqual(created.browserToken, created.curationToken.split('.')[1]);
  const args = { curationToken: created.curationToken };
  assert.equal((await callTool('read_paper_draft', args, h.env, 'test', upstream)).structuredContent.revision, 0);
  const stored = await callTool('update_paper_draft', { ...args, expectedRevision: 0, draft }, h.env, 'test', upstream);
  assert.equal(stored.structuredContent.revision, 1); assert.deepEqual(stored.structuredContent.draft, draft);
  assert.equal((await callTool('update_paper_draft', { ...args, expectedRevision: 0, draft }, h.env, 'test', upstream)).isError, true, 'stale updates rejected');
  assert.equal((await callTool('update_paper_draft', { ...args, expectedRevision: 1, draft: { ...draft, ids: ['q-ffffffffffffffff'] } }, h.env, 'test', upstream)).isError, true);
  const browserRead = await h.request(path, 'GET', null, created.browserToken);
  assert.deepEqual((await browserRead.json()).draft, draft);
  assert.equal((await h.request(path, 'GET', null, created.curationToken.split('.')[1])).status, 403);
  assert.equal((await h.request(path, 'DELETE', null, created.curationToken.split('.')[1])).status, 403);
  assert.equal((await h.request(path, 'PUT', { draft }, created.browserToken)).status, 404);
  assert.equal((await callTool('read_question', { connectionToken: created.curationToken }, h.env, 'test', upstream)).isError, true);
  const badArgs = { ...args, expectedRevision: 1, draft, publish: true };
  assert.equal((await callTool('update_paper_draft', badArgs, h.env, 'test', upstream)).isError, true);
  assert.equal((await callTool('publish_paper', args, h.env, 'test', upstream)).isError, true);
  assert.equal((await h.request(path, 'DELETE', null, created.browserToken)).status, 200);
  assert.equal((await callTool('read_paper_draft', args, h.env, 'test', upstream)).isError, true);
  assert.equal(h.objects.get(created.sessionId).store.size, 0);
});
test('search is bounded, filterable, answer-free and cannot fetch caller URLs', async () => {
  const h = harness();
  const result = await callTool('search_questions', { source: 'pku-exam', type: 'fill', moduleId: 'data', query: '题面' }, h.env, 'test', upstream);
  assert.equal(result.structuredContent.total, 1); assert.equal(result.structuredContent.nextOffset, null);
  assert.equal((await callTool('search_questions', { source: 'csapp-textbook' }, h.env, 'test', upstream)).structuredContent.total, 0);
  for (const args of [{ url: 'https://evil.example' }, { offset: -1 }, { source: 'evil' }, { query: 5 }]) assert.equal((await callTool('search_questions', args, h.env, 'test', upstream)).isError, true);
  assert.equal((await h.request('/curation-sessions', 'POST', { draft: null }, null, 'https://evil.example')).status, 403);
  assert.equal((await h.request('/curation-sessions', 'POST', { draft: null, history: [] })).status, 400);
});
test('fixed expiry deletes all temporary content and prevents further writes', async t => {
  let now = 1000000; t.mock.method(Date, 'now', () => now);
  const h = harness(), created = await (await h.request('/curation-sessions', 'POST', { draft })).json();
  now = created.expiresAt;
  const result = await callTool('read_paper_draft', { curationToken: created.curationToken }, h.env, 'test', upstream);
  assert.equal(result.isError, true); assert.equal(h.objects.get(created.sessionId).store.size, 0);
});
