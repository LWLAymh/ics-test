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
