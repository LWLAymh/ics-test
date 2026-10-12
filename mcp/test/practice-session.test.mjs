import test from 'node:test';
import assert from 'node:assert/strict';
import { PracticeSession, SESSION_TTL, CONTEXT_TTL, keyHash, validContext, validDraft } from '../src/practice-session.mjs';
import { callTool, handleRequest } from '../src/worker.mjs';
const q1 = 'q-0123456789abcdef', q2 = 'q-fedcba9876543210';
const writeKey = '1'.repeat(64), readKey = '2'.repeat(64), id = 'a'.repeat(32);
function harness() {
  const store = new Map();
  let lock = Promise.resolve();
  const ctx = { storage: {
    get: async key => store.has(key) ? structuredClone(store.get(key)) : undefined,
    put: async (key, value) => { store.set(key, structuredClone(value)); },
    deleteAll: async () => { store.clear(); }, setAlarm: async at => { ctx.alarmAt = at; },
  }, blockConcurrencyWhile(callback) { const next = lock.then(callback); lock = next.catch(() => {}); return next; } };
  const object = new PracticeSession(ctx);
  function invoke(path, key, body) {
    return object.fetch(new Request('https://internal/' + path, { method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}) }));
  }
  return { object, ctx, store, invoke };
}
async function initialized(h, context = { questionId: q1, partId: null }) {
  assert.equal((await h.invoke('initialize', '', { writeHash: await keyHash(writeKey), readHash: await keyHash(readKey),
    expiresAt: Date.now() + SESSION_TTL, context })).status, 201);
}
test('DO separates keys, rejects replayed updates, and revocation cannot be undone by late writes', async () => {
  const h = harness(); await initialized(h);
  assert.equal((await h.invoke('read', writeKey)).status, 403);
  assert.equal((await h.invoke('update', readKey, { questionId: q2, partId: null, sequence: 1 })).status, 403);
  assert.equal((await h.invoke('revoke', readKey)).status, 403);
  assert.equal((await h.invoke('update', writeKey, { questionId: q2, partId: null, sequence: 2 })).status, 200);
  assert.equal((await h.invoke('update', writeKey, { questionId: q1, partId: null, sequence: 1 })).status, 409);
  const read = await (await h.invoke('read', readKey)).json();
  assert.equal(read.questionId, q2);
  assert.ok(!JSON.stringify(read).includes('Hash'));
  assert.equal((await h.invoke('revoke', writeKey)).status, 200);
  assert.equal(h.store.size, 0);
  assert.equal((await h.invoke('update', writeKey, { questionId: q1, partId: null, sequence: 3 })).status, 410);
  assert.equal((await h.invoke('read', readKey)).status, 410);
  assert.equal((await h.invoke('revoke', writeKey)).status, 200);
});
test('empty context, stale heartbeat, fixed expiry and alarm all fail closed', async t => {
  let now = 1000000;
  t.mock.method(Date, 'now', () => now);
  const h = harness(); await initialized(h, { questionId: null });
  assert.equal((await h.invoke('read', readKey)).status, 409);
  const expiresAt = h.ctx.alarmAt;
  now += 1000;
  assert.equal((await h.invoke('update', writeKey, { questionId: q1, sequence: 1 })).status, 200);
  now += CONTEXT_TTL;
  assert.equal((await h.invoke('read', readKey)).status, 409);
  assert.equal((await h.invoke('update', writeKey, { questionId: q1, sequence: 2 })).status, 200);
  assert.equal((await h.invoke('read', readKey)).status, 200);
  assert.equal(h.store.get('session').expiresAt, expiresAt);
  now = expiresAt;
  assert.equal((await h.invoke('read', readKey)).status, 410);
  assert.equal(h.store.size, 0);
  const other = harness(); await initialized(other);
  await other.object.alarm(); assert.equal(other.store.size, 0);
});
test('MCP pairing reads only context and still refuses connection tokens for answers or reports', async () => {
  const h = harness(); await initialized(h);
  const env = { SITE_URL: 'https://bank.example/', PRACTICE_SESSIONS: {
    idFromName: value => value, get: name => { assert.equal(name, id); return { fetch: request => h.object.fetch(request) }; },
  } };
  const token = id + '.' + readKey, calls = [];
  const upstream = async url => {
    calls.push(url);
    const q = url.includes(q2) ? q2 : q1;
    return Response.json({ packetVersion: 1, questionId: q, question: { id: q, stem: { text: 'QUESTION' } }, answer: { id: q, solution: { reference: { text: 'ANSWER_ONLY' } } } });
  };
  const first = await callTool('read_question', { connectionToken: token }, env, 'test', upstream);
  assert.equal(first.structuredContent.id, q1);
  assert.equal(first.structuredContent.practice.questionId, q1);
  assert.ok(!JSON.stringify(first).includes('ANSWER_ONLY'));
  assert.ok(!JSON.stringify(first).includes(readKey));
  await h.invoke('update', writeKey, { questionId: q2, sequence: 1 });
  assert.equal((await callTool('read_question', { connectionToken: token }, env, 'test', upstream)).structuredContent.id, q2);
  for (const [name, args] of [
    ['read_question', { questionId: q1, connectionToken: token }],
    ['read_answer', { connectionToken: token }],
    ['report_issue', { connectionToken: token, confirmed: true }],
    ['read_question', { connectionToken: id + '.' + writeKey }],
  ]) assert.equal((await callTool(name, args, env, 'test', upstream)).isError, true);
  assert.equal(calls.length, 2);
  await h.invoke('revoke', writeKey);
  assert.equal((await callTool('read_question', { connectionToken: token }, env, 'test', upstream)).isError, true);
  assert.equal(calls.length, 2);
});
test('context API refuses private data, arbitrary questions, invalid parts, oversize bodies, wrong origins and absent limits', async () => {
  assert.equal(validContext({ questionId: q1, answer: 'PRIVATE' }), false);
  assert.equal(validContext({ questionId: null, partId: 'part-a' }), false);
  const objects = new Map(), allow = { limit: async () => ({ success: true }) };
  const env = { SITE_URL: 'https://bank.example/', MCP_RATE_LIMITER: allow, SESSION_CREATE_RATE_LIMITER: allow,
    PRACTICE_SESSIONS: { idFromName: value => value, get: value => {
      if (!objects.has(value)) objects.set(value, harness());
      return { fetch: request => objects.get(value).object.fetch(request) };
    } } };
  const upstream = async () => Response.json({ packetVersion: 1, questionId: q1, question: { id: q1, parts: [{ id: 'part-a' }] }, answer: { id: q1 } });
  const request = (body, headers = {}) => new Request('https://worker.example/practice-sessions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.1', ...headers }, body: JSON.stringify(body),
  });
  for (const body of [{ questionId: q1, answer: 'PRIVATE' }, { questionId: q1, partId: 'wrong-part' }, { questionId: null, partId: 'part-a' }])
    assert.equal((await handleRequest(request(body), env, upstream)).status, 400);
  assert.equal((await handleRequest(request({ questionId: q2 }), env, upstream)).status, 422);
  assert.equal((await handleRequest(request({ questionId: q1 }, { Origin: 'https://evil.example' }), env, upstream)).status, 403);
  assert.equal((await handleRequest(request({ questionId: q1, noise: 'x'.repeat(65536) }), env, upstream)).status, 413);
  assert.equal((await handleRequest(request({ questionId: null }), { ...env, SESSION_CREATE_RATE_LIMITER: null }, upstream)).status, 503);
  assert.equal(objects.size, 0);
  const response = await handleRequest(request({ questionId: q1, partId: 'part-a' }, { Origin: 'https://bank.example' }), env, upstream);
  assert.equal(response.status, 201);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://bank.example');
  const created = await response.json();
  assert.match(created.connectionToken, /^[a-f0-9]{32}\.[a-f0-9]{64}$/);
  assert.notEqual(created.writeToken, created.connectionToken.split('.')[1]);
  const stored = objects.get(created.sessionId).store.get('session');
  assert.ok(!JSON.stringify(stored).includes(created.writeToken));
  assert.ok(!JSON.stringify(stored).includes(created.connectionToken.split('.')[1]));
});
test('short-answer text is bounded, read-only, and restricted to the correct question type', async () => {
  const draft={choices:[],blanks:[],parts:[],text:'回答\n<用户文本>'};
  assert.equal(validDraft(draft),true);
  assert.equal(validDraft({...draft,text:'x'.repeat(10000)}),true);
  for(const text of [null,[],{},'x'.repeat(10001)])assert.equal(validDraft({...draft,text}),false);
  assert.equal(validDraft({...draft,parts:[{id:'part-c',choices:[],blanks:[],text:'简答'}]}),true);
  assert.equal(validDraft({...draft,parts:[{id:'part-c',choices:[],blanks:[],text:5}]}),false);
  const h=harness();await initialized(h,{questionId:q1,shareDraft:true,draft});
  const env={SITE_URL:'https://bank.example/',PRACTICE_SESSIONS:{
    idFromName:value=>value,get:()=>({fetch:request=>h.object.fetch(request)})}};
  const upstream=async()=>Response.json({packetVersion:1,questionId:q1,
    question:{id:q1,type:'short-answer'},answer:{id:q1,solution:{reference:{text:'ANSWER_ONLY'}}}});
  const result=await callTool('read_question',{connectionToken:id+'.'+readKey},env,'test',upstream);
  assert.equal(result.structuredContent.practice.draft.text,draft.text);
  assert.ok(!JSON.stringify(result).includes('ANSWER_ONLY'));
  assert.equal((await h.invoke('update',readKey,{questionId:q1,shareDraft:true,draft:{...draft,text:'修改'},sequence:1})).status,403);
  await h.invoke('update',writeKey,{questionId:q1,shareDraft:false,sequence:1});
  assert.equal((await (await h.invoke('read',readKey)).json()).draft,null);
  assert.ok(!JSON.stringify(h.store.get('session')).includes('用户文本'));
  const allow={limit:async()=>({success:true})};
  const apiEnv={...env,MCP_RATE_LIMITER:allow,SESSION_CREATE_RATE_LIMITER:allow};
  const request=body=>new Request('https://worker.example/practice-sessions',{
    method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':'203.0.113.1'},body:JSON.stringify(body)});
  const choiceUpstream=async()=>Response.json({packetVersion:1,questionId:q1,
    question:{id:q1,type:'single-choice',options:[]},answer:{id:q1}});
  assert.equal((await handleRequest(request({questionId:q1,shareDraft:true,draft}),apiEnv,choiceUpstream)).status,400);
});

test('draft sharing is explicit, current-only and revocable; read capabilities cannot alter it', async () => {
  const h = harness();
  const draft = { choices: ['A'], blanks: [{ id: 'x', value: 'USER_ONLY' }],
    parts: [{ id: 'part-a', choices: ['B'], blanks: [{ id: 'y', value: ['<', '='] }] }] };
  assert.equal(validContext({ questionId: q1, shareDraft: false, draft }), false);
  assert.equal(validContext({ questionId: null, shareDraft: true, draft }), false);
  assert.equal(validContext({ questionId: q1, shareDraft: true, draft: { ...draft, history: [] } }), false);
  assert.equal(validContext({ questionId: q1, shareDraft: true, draft }), true);
  await initialized(h, { questionId: q1, shareDraft: true, draft });
  assert.deepEqual((await (await h.invoke('read', readKey)).json()).draft, draft);
  assert.equal((await h.invoke('update', readKey, { questionId: q1, shareDraft: false, sequence: 1 })).status, 403);
  await h.invoke('update', writeKey, { questionId: q1, shareDraft: false, sequence: 1 });
  assert.equal((await (await h.invoke('read', readKey)).json()).draft, null);
  assert.ok(!JSON.stringify(h.store.get('session')).includes('USER_ONLY'));
  await h.invoke('update', writeKey, { questionId: q2, shareDraft: true, sequence: 2 });
  assert.equal((await (await h.invoke('read', readKey)).json()).draft, null);
});
