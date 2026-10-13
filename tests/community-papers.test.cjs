'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const api = require('../site/community-papers.js');
const ids = Array.from({ length: 201 }, (_, i) => 'q-' + i.toString(16).padStart(16, '0'));
const draft = { title: ' 精选 ', author: ' 署名 ', description: ' 描述 ', ids: ids.slice(0, 5) };
test('draft bounds, uniqueness and explicit metadata', () => {
  assert.equal(api.validateDraft(draft).title, '精选');
  for (const value of [null, { ...draft, title: '' }, { ...draft, author: ' ' }, { ...draft, title: 'x'.repeat(61) },
    { ...draft, author: 'x'.repeat(41) }, { ...draft, description: 'x'.repeat(501) }, { ...draft, ids: [] },
    { ...draft, ids }, { ...draft, ids: [ids[0], ids[0]] }, { ...draft, ids: ['../secret'] }, { ...draft, ids: [null] }]) assert.throws(() => api.validateDraft(value));
});
test('sampling is fixed, respects selected IDs and never splits composite questions', () => {
  const pool = ids.slice(0, 10).map(id => ({ id, type: 'composite', parts: [{ id: 'part-a' }] }));
  const result = api.sample(pool, [ids[0]], 5, () => 0.5);
  assert.equal(result.length, 5); assert.equal(new Set(result).size, 5); assert.ok(!result.includes(ids[0]));
  assert.throws(() => api.sample(pool, [], 11)); assert.throws(() => api.sample(pool, [], 1.5));
  assert.throws(() => api.sample([{ id: 'q-ffffffffffffffff' }], ids.slice(0, 200), 1));
  assert.equal(pool.length, 10);
});
test('published-only ordered resolution; unavailable questions never silently substituted', () => {
  const bank = ids.slice(0, 3).map(id => ({ id, type: 'composite', publication: { state: 'published' } }));
  assert.deepEqual(api.resolveQuestions([ids[2], ids[0]], bank).map(q => q.id), [ids[2], ids[0]]);
  assert.throws(() => api.resolveQuestions([ids[3]], bank));
  assert.throws(() => api.resolveQuestions([ids[0]], [{ ...bank[0], publication: { state: 'review' } }]));
});
test('MCP index artifact has no answer, receipts or user content', () => {
  const root = path.resolve(__dirname, '..');
  const source = fs.readFileSync(path.join(root, 'scripts/community-data.cjs'), 'utf8');
  assert.ok(!/solution:|reference:|correctOptionIds:|blankAnswers:/.test(source));
  const ui = fs.readFileSync(path.join(root, 'site/community-papers.js'), 'utf8');
  assert.match(ui, /action === 'publish' && event.isTrusted/);
  const bridge = fs.readFileSync(path.join(root, 'site/community-agent.js'), 'utf8');
  assert.ok(!bridge.includes("rpc('publish_"));
});
