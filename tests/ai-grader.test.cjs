'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), api = require('../site/ai-grader.js');
const md = text => ({ format: 'markdown', text });
const short = { id: 'q-0123456789abcdef', revision: 1, type: 'short-answer', stem: md('解释机制。'),
  solution: { state: 'available', grading: 'self', reference: md('参考依据。'), provenance: { origin: 'official' } } };
const good = { score: 7.5, needs_review: false, reason: '核心正确，缺少一个条件。', strengths: ['核心机制'], gaps: ['适用条件'], suggestions: ['补上条件'], uncertainty: '' };
const config = { provider: 'openai', model: 'gpt-5.4-mini', key: 'test-key-local-only' };
const response = value => Response.json({ status: 'completed', output: [{ type: 'reasoning', content: [] },
  { type: 'message', role: 'assistant', content: [{ type: 'output_text', text: JSON.stringify(value) }] }] });

test('credential storage is opt-in, isolated and removable without touching history', () => {
  const map = new Map([['history', 'keep']]), storage = { getItem: key => map.get(key) || null, setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key) };
  const vault = api.vault(() => storage); assert.equal(vault.load(), null);
  vault.save(config, false); assert.equal(map.has(api.STORAGE_KEY), false);
  vault.save(config, true); assert.deepEqual(vault.load(), config);
  vault.save(config, false); assert.equal(vault.load(), null); assert.equal(map.get('history'), 'keep');
  vault.save(config, true); vault.clear(); assert.equal(vault.load(), null);
  map.set(api.STORAGE_KEY, '{broken'); assert.equal(vault.load(), null);
  assert.equal(api.vault(() => { throw Error('blocked'); }).load(), null);
  assert.throws(() => api.vault(() => { throw Error('blocked'); }).save(config, true));
});

test('only the requested short unit and common stem are whitelisted, never sibling answers/history', () => {
  const composite = { ...short, type: 'composite', stem: md('公共条件'), solution: { ...short.solution, reference: md('PARENT_REFERENCE_NOT_SENT') },
    history: 'HISTORY_NOT_SENT', parts: [{ ...short, id: 'part-a' }, { ...short, id: 'part-b', solution: { ...short.solution, reference: md('SIBLING_NOT_SENT') } }] };
  const data = api.payload(composite, '0', '我的回答');
  assert.equal(data.commonQuestion, '公共条件'); assert.equal(data.question, short.stem.text); assert.equal(data.studentAnswer, '我的回答');
  assert.ok(!JSON.stringify(data).includes('NOT_SENT'));
  for (const q of [{ ...short, type: 'fill' }, { ...short, solution: { ...short.solution, state: 'pending' } }]) assert.throws(() => api.payload(q, 'root', 'answer'));
  assert.throws(() => api.payload(short, 'root', ' ')); assert.throws(() => api.payload(short, 'root', 'x'.repeat(10001)));
  assert.throws(() => api.payload({ ...short, stem: md('x'.repeat(100001)) }, 'root', 'answer'));
});

test('provider requests use fixed official destinations and no cookies, referrer, tools or credential in body', () => {
  const data = api.payload(short, 'root', 'answer'), built = api.request({ ...config, endpoint: 'https://must-not-send.example' }, data);
  assert.equal(built.url, 'https://api.openai.com/v1/responses');
  assert.equal(built.init.credentials, 'omit'); assert.equal(built.init.redirect, 'error'); assert.equal(built.init.referrerPolicy, 'no-referrer');
  assert.ok(!built.init.body.includes(config.key));
  const body = JSON.parse(built.init.body); assert.equal(body.store, false); assert.equal(body.tools, undefined); assert.equal(body.text.format.strict, true);
  const deep = api.request({ ...config, provider: 'deepseek', model: 'deepseek-flash' }, data);
  assert.equal(deep.url, 'https://api.deepseek.com/chat/completions'); assert.equal(JSON.parse(deep.init.body).response_format.type, 'json_object');
  assert.match(api.PROMPT, /不可信数据/); assert.match(api.PROMPT, /score=null/); assert.match(api.PROMPT, /不是正式成绩/);
  for (const bad of [{ ...config, provider: '__proto__' }, { ...config, key: 'bad\nkey' }, { ...config, model: 'bad model' }]) assert.throws(() => api.validConfig(bad));
});

test('strict feedback rejects out-of-range, missing, extra, misleading and oversized results', () => {
  assert.equal(api.feedback(good).score, 7.5);
  assert.equal(api.feedback({ ...good, score: null, needs_review: true }).score, null);
  for (const bad of [{ ...good, score: 11 }, { ...good, score: -1 }, { ...good, score: '8' }, { ...good, score: NaN },
    { ...good, score: null }, { ...good, reason: '' }, { ...good, command: 'write grade' }, { ...good, gaps: Array(9).fill('x') },
    { ...good, reason: 'x'.repeat(3001) }]) assert.throws(() => api.feedback(bad));
});

test('both providers parse final content only; requests are single-shot and errors never echo provider body', async () => {
  let calls = 0; const data = api.payload(short, 'root', 'answer');
  assert.equal((await api.evaluate(config, data, null, async () => { calls++; return response(good); })).score, 7.5);
  assert.equal((await api.evaluate({ ...config, provider: 'deepseek' }, data, null, async () => Response.json({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(good), reasoning_content: 'DO_NOT_RENDER' } }] }))).score, 7.5);
  await assert.rejects(api.evaluate(config, data, null, async () => { calls++; return new Response(config.key + ' PRIVATE_INPUT', { status: 401 }); }), error => !error.message.includes(config.key) && !error.message.includes('PRIVATE_INPUT'));
  assert.equal(calls, 2, 'no auto retry');
  await assert.rejects(api.evaluate(config, data, null, async () => Response.json({ status: 'incomplete', output: [] })));
  await assert.rejects(api.evaluate(config, data, null, async () => Response.json({ status: 'completed', output: [{ type: 'message', role: 'assistant', content: [{ type: 'refusal', refusal: 'no' }] }] })));
  await assert.rejects(api.evaluate(config, data, null, async () => new Response('x'.repeat(128001))));
  const controller = new AbortController(); controller.abort();
  await assert.rejects(api.evaluate(config, data, controller.signal, async () => { throw Error(config.key); }), /取消或超时/);
});
