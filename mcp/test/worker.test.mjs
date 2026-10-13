import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { handleRequest, callTool, reporterId, TOOLS } from '../src/worker.mjs';
const id = 'q-0123456789abcdef';
const packet = { packetVersion: 1, questionId: id, question: { id, stem: { format: 'markdown', text: '题面' } },
  answer: { id, solution: { reference: { format: 'markdown', text: 'ANSWER_ONLY' } } } };
const allow = { limit: async () => ({ success: true }) };
function env(extra = {}) { return { SITE_URL: 'https://lwlaymh.github.io/ics-test/', SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'public-test-key', REPORT_IDENTITY_SECRET: 'test-only-secret',
  MCP_RATE_LIMITER: allow, ISSUE_RATE_LIMITER: allow, ...extra }; }
test('official SDK lists read/report and draft-only curation tools, reads without leaking answers', async () => {
  const calls = [];
  const upstream = async (url, init) => { calls.push([url, init]); return Response.json(packet); };
  const client = new Client({ name: 'test', version: '1' });
  const transport = new StreamableHTTPClientTransport(new URL('https://worker.example/mcp'), {
    fetch: async (url, init) => {
      const headers = new Headers(init?.headers); headers.set('CF-Connecting-IP', '203.0.113.1');
      return handleRequest(new Request(url, { ...init, headers }), env(), upstream);
    },
  });
  await client.connect(transport);
  assert.deepEqual((await client.listTools()).tools.map(t => t.name), ['read_question', 'read_answer', 'report_issue', 'search_questions', 'read_paper_draft', 'update_paper_draft']);
  const question = await client.callTool({ name: 'read_question', arguments: { questionId: id } });
  assert.equal(question.structuredContent.stem.text, '题面');
  assert.ok(!JSON.stringify(question).includes('ANSWER_ONLY'));
  const answer = await client.callTool({ name: 'read_answer', arguments: { questionId: id } });
  assert.ok(JSON.stringify(answer).includes('ANSWER_ONLY'));
  assert.equal(calls.length, 2);
  assert.ok(calls.every(([url, init]) => url.endsWith('/mcp-data/' + id + '.json') && !init.method));
  await client.close();
});
test('invalid tools, path injection, extra grading arguments and unconfirmed reports never fetch', async () => {
  let calls = 0;
  const upstream = async () => { calls++; throw Error('must not call'); };
  for (const [name, args] of [
    ['submit_answer', { questionId: id }], ['read_question', { questionId: '../secret' }],
    ['read_question', { questionId: id, answer: 'A' }], ['report_issue', { questionId: id }],
    ['report_issue', { questionId: id, confirmed: false }], ['report_issue', { questionId: id, confirmed: true, message: 'x'.repeat(1001) }],
  ]) assert.equal((await callTool(name, args, env(), '203.0.113.1', upstream)).isError, true);
  assert.equal(calls, 0);
});
test('report uses only public issue RPC; same network has retry-stable private pseudonym', async () => {
  const calls = [];
  const upstream = async (url, init) => {
    calls.push([url, init]); return Response.json(calls.length % 2 ? packet : []);
  };
  for (let i = 0; i < 2; i++) {
    const response = await callTool('report_issue', { questionId: id, confirmed: true, message: ' typo ' }, env(), '203.0.113.1', upstream);
    assert.equal(response.structuredContent.reported, true);
    assert.ok(!JSON.stringify(response).includes('p_visitor_id'));
  }
  const reports = calls.filter(([, init]) => init.method === 'POST');
  assert.equal(reports.length, 2);
  assert.ok(reports[0][0].endsWith('/rpc/report_ics_question_issue_with_message'));
  assert.equal(reports[0][1].headers.apikey, 'public-test-key');
  assert.equal(reports[0][1].headers.Authorization, undefined);
  assert.deepEqual(JSON.parse(reports[0][1].body), JSON.parse(reports[1][1].body));
  assert.equal(JSON.parse(reports[0][1].body).p_message, 'typo');
  assert.notEqual(await reporterId('203.0.113.1', 'test'), await reporterId('203.0.113.2', 'test'));
});
test('unpublished questions, broken upstream and missing config fail without reports', async () => {
  for (const [config, upstream] of [
    [env(), async () => new Response('', { status: 404 })],
    [env(), async () => Response.json({ ...packet, questionId: 'q-wrong' })],
    [env({ REPORT_IDENTITY_SECRET: '' }), async () => { throw Error('must not fetch'); }],
    [env({ ISSUE_RATE_LIMITER: { limit: async () => ({ success: false }) } }), async () => { throw Error('must not fetch'); }],
  ]) assert.equal((await callTool('report_issue', { questionId: id, confirmed: true }, config, '203.0.113.1', upstream)).isError, true);
  const response = await callTool('report_issue', { questionId: id, confirmed: true }, env(), '203.0.113.1',
    async (url, init) => init.method ? new Response('sensitive upstream info', { status: 500 }) : Response.json(packet));
  assert.ok(!JSON.stringify(response).includes('sensitive'));
  assert.equal(response.isError, true);
});
test('HTTP origin, rate limit, route and body limits', async () => {
  function request(extra = {}) { return new Request('https://worker.example/mcp', {
    method: 'POST', headers: { 'CF-Connecting-IP': '203.0.113.1', 'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream', ...extra },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
  }); }
  assert.equal((await handleRequest(request({ Origin: 'https://evil.example' }), env())).status, 403);
  assert.equal((await handleRequest(request(), env({ MCP_RATE_LIMITER: { limit: async () => ({ success: false }) } }))).status, 429);
  assert.equal((await handleRequest(request(), env({ MCP_RATE_LIMITER: null }))).status, 503);
  const big = request(); const headers = new Headers(big.headers);
  const response = await handleRequest(new Request(big.url, { method: 'POST', headers, body: 'x'.repeat(34000) }), env());
  assert.equal(response.status, 413);
  assert.equal((await handleRequest(new Request('https://worker.example/other'), env())).status, 404);
  assert.equal((await handleRequest(new Request('https://worker.example/'), env())).status, 200);
  assert.equal(TOOLS.length, 6);
});
