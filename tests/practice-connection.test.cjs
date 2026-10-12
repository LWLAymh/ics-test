'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { PracticeConnection } = require('../site/practice-connection.js');
const q1 = 'q-0123456789abcdef', q2 = 'q-fedcba9876543210', q3 = 'q-aaaaaaaaaaaaaaaa';
const sessionId = 'a'.repeat(32), writeToken = 'b'.repeat(64), connectionToken = sessionId + '.' + 'c'.repeat(64);
function harness(options = {}) {
  const calls = [], states = [];
  let now = 1000, failUpdate = false, failDelete = false;
  const controller = new PracticeConnection({
    endpoint: 'https://worker.example', now: () => now, onChange: value => states.push(value),
    request: async (url, init) => {
      calls.push({ url, ...init });
      if (options.request) return options.request(url, init);
      const body = init.body ? JSON.parse(init.body) : {};
      if (init.method === 'POST') return Response.json({ sessionId, writeToken, connectionToken,
        expiresAt: now + 7200000, updatedAt: now, ...body });
      if (init.method === 'DELETE') {
        if (failDelete) throw Error('offline'); return Response.json({ disconnected: true });
      }
      if (failUpdate) throw Error('offline');
      return Response.json({ ...body, updatedAt: now });
    },
  });
  return { controller, calls, states, time: value => { now = value; },
    failUpdate: value => { failUpdate = value; }, failDelete: value => { failDelete = value; } };
}
test('no network before consent; only context is sent and write credentials never enter prompts or callbacks', async () => {
  const h = harness(), c = h.controller;
  await c.setContext({ questionId: q1, partId: null, answer: 'PRIVATE', history: ['PRIVATE'] });
  assert.equal(h.calls.length, 0);
  assert.equal(c.prompt(), '');
  assert.equal(await c.connect(), true);
  assert.deepEqual(JSON.parse(h.calls[0].body), { questionId: q1, partId: null, shareDraft: true, draft: null });
  assert.ok(c.prompt().includes(connectionToken));
  assert.ok(!c.prompt().includes(writeToken));
  assert.ok(!JSON.stringify(h.states).includes(writeToken));
  assert.ok(!JSON.stringify(h.calls).includes('PRIVATE'));
  await c.setContext({ questionId: q2, partId: 'part-a', value: 'DO_NOT_SHARE' });
  assert.equal(h.calls[1].headers.Authorization, 'Bearer ' + writeToken);
  assert.deepEqual(JSON.parse(h.calls[1].body), { questionId: q2, partId: 'part-a', shareDraft: true, draft: null, sequence: 1 });
  assert.equal(c.snapshot().remote.questionId, q2);
  const count = h.calls.length;
  await c.setContext({ questionId: q2, partId: 'part-a' });
  assert.equal(h.calls.length, count);
  await c.sync();
  assert.equal(h.calls.length, count + 1);
});
test('rapid navigation is serialized and coalesced; old requests cannot overwrite the latest question', async () => {
  let release, first = true;
  const h = harness({ request: async (url, init) => {
    const body = JSON.parse(init.body);
    if (init.method === 'POST') return Response.json({ sessionId, writeToken, connectionToken, expiresAt: 7201000, ...body });
    if (first) { first = false; await new Promise(resolve => { release = resolve; }); }
    return Response.json({ ...body, updatedAt: 1000 });
  } });
  await h.controller.connect();
  const updating = h.controller.setContext({ questionId: q1 });
  await Promise.resolve();
  h.controller.setContext({ questionId: q2 });
  h.controller.setContext({ questionId: q3 });
  assert.equal(h.calls.length, 2);
  release(); await updating;
  assert.deepEqual(h.calls.slice(1).map(call => JSON.parse(call.body).questionId), [q1, q3]);
  assert.deepEqual(h.calls.slice(1).map(call => JSON.parse(call.body).sequence), [1, 2]);
  assert.equal(h.controller.snapshot().remote.questionId, q3);
});
test('current draft is whitelisted; disabling sharing erases it and re-enabling sends the latest values only', async () => {
  const h = harness(), c = h.controller;
  const draft = { choices: ['A'], blanks: [{ id: 'x', value: 'retq', reference: 'PRIVATE' }],
    parts: [{ id: 'part-a', choices: ['B'], blanks: [{ id: 'y', value: ['<', '='] }], correct: 'PRIVATE' }],
    history: 'PRIVATE', solution: 'PRIVATE' };
  await c.setContext({ questionId: q1, draft }); await c.connect();
  let body = JSON.parse(h.calls.at(-1).body);
  assert.deepEqual(body.draft.blanks, [{ id: 'x', value: 'retq' }]);
  assert.deepEqual(body.draft.parts[0].blanks[0].value, ['<', '=']);
  assert.ok(!h.calls.at(-1).body.includes('PRIVATE'));
  await c.setSharing(false);
  body = JSON.parse(h.calls.at(-1).body);
  assert.equal(body.shareDraft, false); assert.equal(body.draft, null);
  const count = h.calls.length;
  draft.blanks[0].value = 'ret';
  await c.setContext({ questionId: q1, draft });
  assert.equal(h.calls.length, count);
  await c.setSharing(true);
  assert.equal(JSON.parse(h.calls.at(-1).body).draft.blanks[0].value, 'ret');
  await c.setContext({ questionId: null, draft });
  assert.equal(JSON.parse(h.calls.at(-1).body).draft, null);
  draft.blanks[0].value = 'x'.repeat(2049);
  await c.setContext({ questionId: q1, draft });
  assert.equal(JSON.parse(h.calls.at(-1).body).draft, null);
  assert.equal(c.snapshot().context.draftTooLarge, true);
});
test('short-answer sharing preserves literal text, stays current-only and rejects oversize drafts', async () => {
  const h=harness(),c=h.controller;
  const text='我的回答\n\n`x + y` <script>不是指令</script>';
  const draft={choices:[],blanks:[],parts:[],text,history:'PRIVATE'};
  await c.setContext({questionId:q1,draft});
  assert.equal(h.calls.length,0);
  await c.connect();
  assert.deepEqual(JSON.parse(h.calls.at(-1).body).draft,{choices:[],blanks:[],parts:[],text});
  assert.match(c.prompt(),/批阅/);
  await c.setSharing(false);
  assert.equal(JSON.parse(h.calls.at(-1).body).draft,null);
  draft.text='新回答';
  const count=h.calls.length;
  await c.setContext({questionId:q1,draft});assert.equal(h.calls.length,count);
  await c.setSharing(true);
  assert.equal(JSON.parse(h.calls.at(-1).body).draft.text,'新回答');
  await c.setContext({questionId:q2,draft:{choices:[],blanks:[],parts:[{id:'part-c',choices:[],blanks:[],text}]}});
  const body=JSON.parse(h.calls.at(-1).body);
  assert.equal(body.draft.text,undefined);assert.equal(body.draft.parts[0].text,text);
  assert.ok(!h.calls.at(-1).body.includes('新回答'));
  for(const invalid of [10001, null, ['x']]) {
    await c.setContext({questionId:q1,draft:{...draft,text:typeof invalid==='number'?'x'.repeat(invalid):invalid}});
    assert.equal(c.snapshot().context.draftTooLarge,true);
    assert.equal(JSON.parse(h.calls.at(-1).body).draft,null);
  }
  await c.setContext({questionId:q1,draft:{...draft,text:'x'.repeat(10000)}});
  assert.equal(JSON.parse(h.calls.at(-1).body).draft.text.length,10000);
  await c.setContext({questionId:q1,draft:{choices:[],blanks:[],text:'中'.repeat(10000),
    parts:[{id:'p',choices:[],blanks:[],text:'中'.repeat(10000)}]}});
  assert.equal(c.snapshot().context.draftTooLarge,true);
  assert.equal(JSON.parse(h.calls.at(-1).body).draft,null);
});

test('sync failure is explicit and retry sends the latest context; disconnect failure does not claim revocation', async () => {
  const h = harness(), c = h.controller;
  await c.setContext({ questionId: q1 }); await c.connect();
  h.failUpdate(true); await c.setContext({ questionId: q2 });
  assert.equal(c.snapshot().status, 'error');
  assert.equal(c.snapshot().remote.questionId, q1);
  assert.match(c.snapshot().error, /旧题/);
  h.failUpdate(false); await c.sync();
  assert.equal(c.snapshot().remote.questionId, q2);
  h.failDelete(true);
  assert.equal(await c.disconnect(), false);
  assert.equal(c.snapshot().status, 'revocation-pending');
  assert.equal(c.prompt(), '');
  const before = h.calls.length;
  await c.setContext({ questionId: q3 }); await c.sync();
  assert.equal(h.calls.length, before);
  assert.equal(await c.connect(), false);
  h.failDelete(false);
  assert.equal(await c.disconnect(), true);
  assert.equal(c.snapshot().status, 'disconnected');
});
test('expiry clears the local capability without extending lifetime; leaving the quiz clears current context', async () => {
  const h = harness(), c = h.controller;
  await c.setContext({ questionId: q1 }); await c.connect();
  await c.setContext({ questionId: null, partId: null });
  assert.equal(JSON.parse(h.calls.at(-1).body).questionId, null);
  h.time(7201000); await c.sync();
  assert.equal(c.snapshot().status, 'expired');
  assert.equal(c.prompt(), '');
  assert.equal(c.snapshot().remote, null);
});
test('disconnect during creation revokes the eventual session instead of reconnecting silently', async () => {
  let release;
  const h = harness({ request: async (url, init) => {
    if (init.method === 'DELETE') return Response.json({ disconnected: true });
    await new Promise(resolve => { release = resolve; });
    return Response.json({ sessionId, writeToken, connectionToken, expiresAt: 7201000, questionId: q1 });
  } });
  const connecting = h.controller.connect();
  await Promise.resolve(); await h.controller.disconnect(true);
  release(); assert.equal(await connecting, false);
  assert.equal(h.calls.at(-1).method, 'DELETE');
  assert.equal(h.controller.snapshot().status, 'disconnected');
  assert.equal(h.controller.prompt(), '');
});
