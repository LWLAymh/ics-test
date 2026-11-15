'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const search = require('../site/question-search.js'), ink = require('../site/handwriting.js'), ai = require('../site/ai-grader.js');
const question = { id: 'q-a', revision: 1, paperId: 'p', type: 'fill', number: { display: '第二题 3' }, classification: { moduleIds: ['m'] }, stem: { text: '比较 x + y 与 0xf' },
  solution: { state: 'available', reference: { text: 'SECRET_REFERENCE' }, provenance: { origin: 'official' } },
  parts: [{ type: 'short-answer', stem: { text: '公共小问' }, solution: { state: 'available', reference: { text: 'PART_KEY' }, provenance: { origin: 'official' } } }] };
test('search combines terms and indexes nested prompts, options, metadata without answer spoilers', () => {
  const rows = search.index([question], [{ id: 'p', displayName: '2025阶段测验' }], [{ id: 'm', title: '信息表示' }]);
  assert.equal(search.search(rows, '２０２５ 比较').length, 1);
  assert.equal(search.search(rows, '公共小问 信息表示').length, 1);
  assert.equal(search.search(rows, 'secret_reference').length, 0);
  assert.equal(search.search(rows, 'q-a 第二题').length, 1);
  assert.equal(search.search(rows, '[.*').length, 0);
  assert.equal(search.search(rows, ' ').length, 0);
});
test('stored ink rejects malformed, oversized or executable document data', () => {
  const valid = { version: 1, width: 800, strokes: [{ tool: 'pen', color: '#125dcc', size: 3, anchor: 'a1', points: [[1, 2, 0.5]] }] };
  assert.equal(ink.validDocument(valid), valid);
  for (const change of [{ width: 0 }, { strokes: [{ ...valid.strokes[0], anchor: '" onclick="x' }] }, { strokes: [{ ...valid.strokes[0], points: [[NaN, 2, 0.5]] }] }, { strokes: [{ ...valid.strokes[0], points: Array(100001).fill([1, 1, 1]) }] }]) assert.equal(ink.validDocument({ ...valid, ...change }), null);
});
test('whole-question image requests use only official direct endpoints and correctly shaped multimodal data', () => {
  const image = 'data:image/png;base64,iVBORw0KGgo=';
  const data = ai.imagePayload(question, 'MY_CURRENT_INPUT', [image]);
  for (const provider of ['openai', 'deepseek']) {
    const request = ai.request({ provider, model: ai.PROVIDERS[provider].model, key: 'TEST_KEY' }, data), body = JSON.parse(request.init.body);
    assert.equal(request.url, ai.PROVIDERS[provider].endpoint);
    const parts = provider === 'openai' ? body.input[0].content : body.messages[1].content;
    assert.equal(parts[0].type, provider === 'openai' ? 'input_text' : 'text');
    assert.ok(JSON.stringify(parts).includes('PART_KEY'));
    assert.equal(provider === 'openai' ? parts[1].image_url : parts[1].image_url.url, image);
    assert.equal(request.init.credentials, 'omit'); assert.equal(request.init.redirect, 'error');
    assert.ok(!request.init.body.includes('TEST_KEY'));
  }
  for (const images of [[], ['https://attacker.invalid/photo'], ['data:image/svg+xml;base64,AAAA'], Array(17).fill(image)]) assert.throws(() => ai.imagePayload(question, '', images));
});
