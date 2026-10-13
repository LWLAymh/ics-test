import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { fileURLToPath } from 'node:url';

test('real Workers runtime reads and reports through a mocked outbound service without following redirects', async () => {
  const id = 'q-0123456789abcdef';
  const packet = { packetVersion: 1, questionId: id, question: { id, stem: { text: 'QUESTION' } }, answer: { id, solution: { reference: { text: 'ANSWER' } } } };
  const bundle = await build({ entryPoints: [fileURLToPath(new URL('../src/worker.mjs', import.meta.url))],
    bundle: true, format: 'esm', platform: 'browser', write: false });
  const calls = [];
  let redirect = false;
  const runtime = new Miniflare(convertV4MiniflareOptions({
    modules: true, script: bundle.outputFiles[0].text, compatibilityDate: '2026-10-11',
    stripCfConnectingIp: false,
    bindings: { SITE_URL: 'https://bank.example/', SUPABASE_URL: 'https://database.example',
      SUPABASE_PUBLISHABLE_KEY: 'test-public-key', REPORT_IDENTITY_SECRET: 'test-secret' },
    ratelimits: {
      MCP_RATE_LIMITER: { namespace_id: '1', simple: { limit: 60, period: 60 } },
      ISSUE_RATE_LIMITER: { namespace_id: '2', simple: { limit: 5, period: 60 } },
    },
    outboundService: async request => {
      calls.push({ url: request.url, method: request.method, body: await request.text() });
      if (redirect) return new Response(null, { status: 302, headers: { Location: 'https://must-not-follow.example/' } });
      return Response.json(request.method === 'POST' ? [] : packet);
    },
  }));
  async function call(name, args) {
    const response = await runtime.dispatchFetch('https://worker.example/mcp', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'CF-Connecting-IP': '203.0.113.1' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
    });
    assert.equal(response.status, 200);
    return (await response.json()).result;
  }
  try {
    assert.equal((await call('read_question', { questionId: id })).structuredContent.stem.text, 'QUESTION');
    assert.equal((await call('read_answer', { questionId: id })).structuredContent.solution.reference.text, 'ANSWER');
    assert.equal((await call('report_issue', { questionId: id, confirmed: true, message: 'test' })).structuredContent.reported, true);
    assert.equal(calls.filter(call => call.method === 'POST').length, 1);
    assert.ok(calls.find(call => call.method === 'POST').url.endsWith('/rpc/report_ics_question_issue_with_message'));
    redirect = true;
    assert.equal((await call('read_question', { questionId: id })).isError, true);
    assert.ok(calls.every(call => !call.url.includes('must-not-follow')));
  } finally { await runtime.dispose(); }
});

test('real SQLite curation sessions enforce separate capabilities and optimistic revisions', async () => {
  const q = 'q-0123456789abcdef';
  const draft = { title: 'Selected questions', author: 'Reader', description: '', ids: [q] };
  const bundle = await build({ entryPoints: [fileURLToPath(new URL('../src/worker.mjs', import.meta.url))],
    bundle: true, format: 'esm', platform: 'browser', write: false });
  const runtime = new Miniflare(convertV4MiniflareOptions({
    modules: true, script: bundle.outputFiles[0].text, compatibilityDate: '2026-10-11', stripCfConnectingIp: false,
    bindings: { SITE_URL: 'https://curation-bank.example/' },
    durableObjects: { CURATION_SESSIONS: { className: 'CurationSession', useSQLite: true } },
    ratelimits: {
      MCP_RATE_LIMITER: { namespace_id: '21', simple: { limit: 60, period: 60 } },
      SESSION_CREATE_RATE_LIMITER: { namespace_id: '22', simple: { limit: 5, period: 60 } },
    },
    outboundService: async request => {
      assert.equal(request.method, 'GET');
      assert.equal(request.url, 'https://curation-bank.example/mcp-data/question-index.json');
      return Response.json({ version: 1, modules: [], questions: [{ id: q }] });
    },
  }));
  const api = (path, method, body, key) => runtime.dispatchFetch('https://worker.example' + path, {
    method, headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.3',
      ...(key ? { Authorization: 'Bearer ' + key } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}),
  });
  async function tool(name, args) {
    const response = await runtime.dispatchFetch('https://worker.example/mcp', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'CF-Connecting-IP': '203.0.113.3' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
    });
    assert.equal(response.status, 200); return (await response.json()).result;
  }
  try {
    const response = await api('/curation-sessions', 'POST', { draft: null });
    assert.equal(response.status, 201);
    const session = await response.json(), path = '/curation-sessions/' + session.sessionId;
    const token = { curationToken: session.curationToken };
    assert.equal((await tool('read_paper_draft', token)).structuredContent.revision, 0);
    assert.equal((await api(path, 'GET', null, session.curationToken.split('.')[1])).status, 403);
    assert.equal((await api(path, 'DELETE', null, session.curationToken.split('.')[1])).status, 403);
    assert.equal((await tool('update_paper_draft', { ...token, expectedRevision: 0, draft })).structuredContent.revision, 1);
    assert.equal((await tool('update_paper_draft', { ...token, expectedRevision: 0, draft })).isError, true);
    assert.deepEqual((await (await api(path, 'GET', null, session.browserToken)).json()).draft, draft);
    assert.equal((await tool('read_paper_draft', { curationToken: session.sessionId + '.' + session.browserToken })).isError, true);
    assert.equal((await api('/papers', 'POST', {})).status, 404, 'MCP Worker has no publication endpoint');
    assert.equal((await api(path, 'DELETE', null, session.browserToken)).status, 200);
    assert.equal((await tool('read_paper_draft', token)).isError, true);
  } finally { await runtime.dispose(); }
});

test('real separate publisher runtime forwards only its narrow publication capability', async () => {
  const id = 'q-0123456789abcdef', capability = 'a'.repeat(64), calls = [];
  const bundle = await build({ entryPoints: [fileURLToPath(new URL('../../community/src/worker.mjs', import.meta.url))],
    bundle: true, format: 'esm', platform: 'browser', write: false });
  const runtime = new Miniflare(convertV4MiniflareOptions({
    modules: true, script: bundle.outputFiles[0].text, compatibilityDate: '2026-10-11', stripCfConnectingIp: false,
    bindings: { SITE_URL: 'https://publisher-bank.example/', SUPABASE_URL: 'https://database.example',
      SUPABASE_PUBLISHABLE_KEY: 'public-key', COMMUNITY_PUBLISH_TOKEN: capability },
    ratelimits: { PAPER_PUBLISH_RATE_LIMITER: { namespace_id: '31', simple: { limit: 3, period: 60 } } },
    outboundService: async request => {
      calls.push(request.url);
      if (request.method === 'GET') return Response.json({ version: 1, modules: [], questions: [{ id }] });
      assert.equal(request.url, 'https://database.example/rest/v1/rpc/publish_ics_community_paper');
      assert.equal(request.headers.get('apikey'), 'public-key');
      assert.equal(request.headers.get('Authorization'), null);
      assert.equal((await request.json()).p_publish_token, capability);
      return Response.json('00000000-0000-4000-8000-000000000001');
    },
  }));
  try {
    const response = await runtime.dispatchFetch('https://publisher.example/papers', {
      method: 'POST', headers: { Origin: 'https://publisher-bank.example', 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.4' },
      body: JSON.stringify({ paperId: '00000000-0000-4000-8000-000000000001', visitorId: '00000000-0000-4000-8000-000000000002',
        draft: { title: 'Runtime test', author: 'Reader', description: '', ids: [id] } }),
    });
    assert.equal(response.status, 201);
    assert.ok(!(await response.text()).includes(capability));
    assert.equal(calls.length, 2);
    assert.equal((await runtime.dispatchFetch('https://publisher.example/mcp', { headers: { Origin: 'https://publisher-bank.example' } })).status, 404);
  } finally { await runtime.dispose(); }
});
test('real SQLite Durable Objects isolate sessions, share only current drafts and enforce read-only capabilities', async () => {
  const q1 = 'q-0123456789abcdef', q2 = 'q-fedcba9876543210';
  const draft = { choices: ['A'], blanks: [], parts: [
    { id: 'part-a', choices: [], blanks: [{ id: 'x', value: 'USER_ONLY' }] },
    { id: 'part-c', choices: [], blanks: [], text: '简答\n只读 USER_ONLY' }] };
  const bundle = await build({ entryPoints: [fileURLToPath(new URL('../src/worker.mjs', import.meta.url))],
    bundle: true, format: 'esm', platform: 'browser', write: false });
  const runtime = new Miniflare(convertV4MiniflareOptions({
    modules: true, script: bundle.outputFiles[0].text, compatibilityDate: '2026-10-11',
    stripCfConnectingIp: false, bindings: { SITE_URL: 'https://bank.example/' },
    durableObjects: { PRACTICE_SESSIONS: { className: 'PracticeSession', useSQLite: true } },
    ratelimits: {
      MCP_RATE_LIMITER: { namespace_id: '11', simple: { limit: 100, period: 60 } },
      SESSION_CREATE_RATE_LIMITER: { namespace_id: '12', simple: { limit: 5, period: 60 } },
    },
    outboundService: async request => {
      assert.equal(request.method, 'GET');
      const id = request.url.includes(q2) ? q2 : q1;
      return Response.json({ packetVersion: 1, questionId: id,
        question: { id, options: [{ id: 'A' }], parts: [
          { id: 'part-a', stem: { blanks: [{ id: 'x' }] } }, { id: 'part-c', type: 'short-answer' }] },
        answer: { id, solution: { reference: { text: 'ANSWER_ONLY' } } } });
    },
  }));
  function api(path, method, body, key) {
    return runtime.dispatchFetch('https://worker.example' + path, {
      method, headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.2',
        ...(key ? { Authorization: 'Bearer ' + key } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  }
  async function read(token) {
    const response = await runtime.dispatchFetch('https://worker.example/mcp', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'CF-Connecting-IP': '203.0.113.2' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call',
        params: { name: 'read_question', arguments: { connectionToken: token } } }),
    });
    assert.equal(response.status, 200); return (await response.json()).result;
  }
  try {
    const response = await api('/practice-sessions', 'POST', { questionId: q1, partId: 'part-a', shareDraft: true, draft });
    assert.equal(response.status, 201);
    const session = await response.json(), path = '/practice-sessions/' + session.sessionId;
    const other = await (await api('/practice-sessions', 'POST', { questionId: q2 })).json();
    let result = await read(session.connectionToken);
    assert.deepEqual(result.structuredContent.practice.draft, draft);
    assert.ok(!JSON.stringify(result).includes('ANSWER_ONLY'));
    assert.ok(!JSON.stringify(result).includes(session.writeToken));
    assert.equal((await read(other.connectionToken)).structuredContent.id, q2);
    const readKey = session.connectionToken.split('.')[1];
    assert.equal((await api(path, 'PUT', { questionId: q2, sequence: 1 }, readKey)).status, 403);
    assert.equal((await api(path, 'DELETE', null, readKey)).status, 403);
    assert.equal((await api(path, 'PUT', { questionId: q1, shareDraft: true,
      draft: { ...draft, choices: ['WRONG'] }, sequence: 1 }, session.writeToken)).status, 400);
    assert.equal((await api(path, 'PUT', { questionId: q1, shareDraft: false, draft: null, sequence: 2 }, session.writeToken)).status, 200);
    result = await read(session.connectionToken);
    assert.equal(result.structuredContent.practice.draft, null);
    assert.equal(result.structuredContent.practice.shareDraft, false);
    assert.equal((await api(path, 'PUT', { questionId: q2, sequence: 1 }, session.writeToken)).status, 409);
    assert.equal((await api(path, 'PUT', { questionId: null, sequence: 3 }, session.writeToken)).status, 200);
    assert.equal((await read(session.connectionToken)).isError, true);
    assert.equal((await api(path, 'DELETE', null, session.writeToken)).status, 200);
    assert.equal((await read(session.connectionToken)).isError, true);
    assert.equal((await api(path, 'PUT', { questionId: q1, sequence: 4 }, session.writeToken)).status, 410);
    assert.equal((await read(other.connectionToken)).structuredContent.id, q2);
    await api('/practice-sessions/' + other.sessionId, 'DELETE', null, other.writeToken);
  } finally { await runtime.dispose(); }
});
