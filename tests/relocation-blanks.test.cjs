'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../site/question-v5.js');
const bank = require('../question-bank/web-data/questions.json').questions;
const md = require('../site/vendor/markdown-it/markdown-it.min.js')({ html: false });
function littleEndian(value) {
  const bytes = Buffer.alloc(4); bytes.writeUInt32LE(value >>> 0);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(' ');
}
for (const example of [
  { id: 'q-c448153415e0dd8d', part: 'q-47cb6ca285432b91', total: 18,
    fields: [['relocation-x', 0x601020], ['relocation-addvec', 0x40057c - 4 - (0x400528 + 0x2b)]] },
  { id: 'q-c799f2158ed1e841', part: 'q-dc2cb1d34ff2b09f', total: 12,
    fields: [['relocation-arr', 0x402010], ['relocation-sum-array', 0x1180 - 4 - (0x1149 + 0x0f)]] },
]) test(example.id + ': relocation table cells are explicit, independently graded little-endian blanks', () => {
  const q = bank.find(q => q.id === example.id), part = q.parts.find(p => p.id === example.part);
  assert.equal(part.stem.blanks.length, example.total);
  assert.equal(part.solution.blankAnswers.length, example.total);
  const lines = part.stem.text.split('\n');
  const tables = md.parse(part.stem.text, {}).filter(t => t.type === 'table_open')
    .map(t => lines.slice(...t.map).join('\n'));
  for (const [id, number] of example.fields) {
    const blank = part.stem.blanks.find(b => b.id === id);
    const rule = part.solution.blankAnswers.find(b => b.blankId === id);
    assert.ok(blank && rule);
    assert.equal(tables.filter(t => t.includes(blank.marker)).length, 1, 'the actual table cell must contain the field');
    const bytes = littleEndian(number);
    for (const answer of [bytes, bytes.replaceAll(' ', ''), ' ' + bytes.replaceAll(' ', '  \t') + ' ']) {
      assert.equal(api.gradeBlank(answer, rule), true, answer);
    }
    for (const answer of ['', bytes.split(' ').reverse().join(' '), littleEndian(number + 1)]) {
      assert.equal(api.gradeBlank(answer, rule), false, answer);
    }
  }
  assert.ok(part.solution.blankAnswers.filter(a => a.blankId.startsWith('legacy-gap-')).length >= 10,
    'existing assembly fields remain answerable');
  if (q.id === 'q-c448153415e0dd8d') {
    assert.deepEqual(part.solution.blankAnswers.filter(a => a.method === 'self').map(a => a.blankId),
      ['legacy-gap-13', 'legacy-gap-14'], 'unknown format-string address must not acquire invented keys');
    assert.equal(api.gradeBlank(littleEndian(0x601020), part.solution.blankAnswers.find(a => a.blankId === 'legacy-gap-5')), true);
    assert.equal(api.gradeBlank(littleEndian(0x25), part.solution.blankAnswers.find(a => a.blankId === 'legacy-gap-7')), true);
  } else {
    assert.equal(part.solution.blankAnswers.slice(0, 4).map(a => a.acceptedAnswers[0]).join(' '), littleEndian(0x402010));
    assert.equal(part.solution.blankAnswers.slice(5, 9).map(a => a.acceptedAnswers[0]).join(' '), littleEndian(0x24));
  }
});
