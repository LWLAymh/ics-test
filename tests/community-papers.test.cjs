'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const api = require('../site/community-papers.js');
const ids = Array.from({ length: 201 }, (_, i) => 'q-' + i.toString(16).padStart(16, '0'));
const draft = { title: ' 精选 ', author: ' 署名 ', description: ' 描述 ', ids: ids.slice(0, 5) };

test('drag and keyboard reorder stable question IDs without mutating or duplicating the draft', () => {
  const source = ids.slice(0, 5);
  assert.deepEqual(api.moveQuestion(source, ids[0], 4), [ids[1], ids[2], ids[3], ids[4], ids[0]]);
  assert.deepEqual(api.moveQuestion(source, ids[4], 0), [ids[4], ids[0], ids[1], ids[2], ids[3]]);
  assert.deepEqual(api.moveQuestion(source, ids[1], 3), [ids[0], ids[2], ids[3], ids[1], ids[4]]);
  for (const [id, destination] of [[ids[8], 0], [ids[0], -1], [ids[0], 5], [ids[0], 1.5]]) assert.deepEqual(api.moveQuestion(source, id, destination), source);
  assert.deepEqual(source, ids.slice(0, 5));
});

test('public paper links contain only a UUID and safely reject invalid or duplicate routing', () => {
  const id = '00000000-0000-4000-8000-000000000001';
  const link = api.shareUrl(id, 'https://example.test/ics-test/?layout-fix=1&apiKey=PRIVATE#private');
  assert.equal(link, 'https://example.test/ics-test/?paper=' + id);
  assert.equal(api.sharedPaperId(link), id);
  assert.equal(api.shareUrl(id, 'https://name:private@example.test/ics-test/'), 'https://example.test/ics-test/?paper=' + id);
  assert.equal(api.sharedPaperId('https://example.test/?paper=' + id.toUpperCase()), id);
  for (const base of ['not a URL', 'javascript:alert(1)', 'https://example.test/?paper=<script>', 'https://example.test/?paper=' + id + '&paper=' + id]) assert.equal(api.sharedPaperId(base), null);
  assert.throws(() => api.shareUrl('../secret', 'https://example.test/'));
  assert.throws(() => api.shareUrl(id, 'javascript:alert(1)'));
});
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
