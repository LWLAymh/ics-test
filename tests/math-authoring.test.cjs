'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const bank = require('../question-bank/web-data/questions.json').questions;
const api = require('../site/question-v5.js');

// Read-only authoring check. Never rewrite Markdown or guess math in the renderer.
function proseOutsideLiteralAndMath(text) {
  return text.replace(/```[\s\S]*?```/g, ' ').replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/`+[^`\n]+`+/g, ' ').replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/(?<!\\)\$[^$]*?(?<!\\)\$/g, ' ');
}
test('authoring audit catches exposed TeX without rejecting explicit math or literal code', () => {
  for (const valid of ['$000000_{2}$', '$$\nN=2N_0\n$$', '`000000_{2}`', '```c\nint pid_2;\n```']) {
    assert.doesNotMatch(proseOutsideLiteralAndMath(valid), /_\{[^}]+\}/);
  }
  assert.match(proseOutsideLiteralAndMath('| R | 0 [000000_{2}] |'), /_\{[^}]+\}/);
  assert.match(proseOutsideLiteralAndMath('由于`N=2N$`_{0}$时$S_{1}$发生切换'), /_\{[^}]+\}/);
});
test('all authored question stems, options and references keep TeX subscripts in math or literal code', () => {
  let sections = 0;
  for (const q of bank) for (const unit of [q, ...(q.parts || [])]) {
    for (const content of [unit.stem, unit.solution?.reference, ...(unit.options || []).map(o => o.content)]) {
      if (!content) continue; sections++;
      assert.doesNotMatch(proseOutsideLiteralAndMath(content.text), /_\{[^}]+\}|\b[01]+(?:\.[01]+)?_(?:2|16)\b|\\(?:times|frac|cdot|mathrm|ldots|log|leq|geq|neq)\b|<\/?(?:sub|sup)>/i,
        q.id + ' / ' + unit.id + ': review exposed math markup in authored Markdown');
    }
  }
  assert.ok(sections >= bank.length * 2);
});
test('2020 midterm cache tables retain all 15 addresses with explicit binary subscript formulas', () => {
  const q = bank.find(q => q.id === 'q-521d76fb06b284d2'); assert.ok(q.revision >= 5);
  const expected = [[0, 1, 7, 4, 0], [0, 1, 7, 12, 9], [0, 1, 7, 8, 9]];
  q.parts.forEach((part, index) => {
    const matches = Array.from(part.stem.text.matchAll(/\|\s[RW]\s\|\s(\d+)\s\[\$([01]{6})_\{2\}\$\]/g));
    assert.deepEqual(matches.map(match => Number(match[1])), expected[index]);
    matches.forEach(match => assert.equal(parseInt(match[2], 2), Number(match[1])));
    assert.equal(part.stem.blanks.length, [4, 2, 1][index]);
    assert.equal(part.solution.blankAnswers.length, part.stem.blanks.length);
    assert.ok(part.solution.blankAnswers.every(rule => rule.method !== 'self'));
  });
  // All referenced blocks fit without eviction here. Split a 2-byte operation
  // only at block boundaries, and never allocate a missing write in part 2.
  const count = (addresses, blockSize, writeAllocate, writeIndex = -1) => {
    const resident = new Set(); let hits = 0, misses = 0;
    addresses.forEach((address, index) => {
      for (let block = Math.floor(address / blockSize); block <= Math.floor((address + 1) / blockSize); block++) {
        if (resident.has(block)) hits++;
        else { misses++; if (index !== writeIndex || writeAllocate) resident.add(block); }
      }
    });
    return { hits, misses, resident };
  };
  const first = count(expected[0], 4, true), second = count(expected[1], 4, false, 2);
  assert.equal(first.misses, 3); assert.equal(second.hits, 1);
  assert.ok(first.resident.has(2)); assert.equal(second.resident.has(1), false);
  const grade = (part, id, answer) => api.gradeBlank(answer, part.solution.blankAnswers.find(r => r.blankId === id));
  for (const [id, answer] of Object.entries({valid:'1', tag:'00', block:'M[8-11]', 'legacy-gap-0':String(first.misses)}))
    assert.equal(grade(q.parts[0], id, answer), true);
  assert.equal(grade(q.parts[1], 'valid', '0'), true);
  assert.equal(grade(q.parts[1], 'legacy-gap-0', String(second.hits)), true);
  assert.equal(grade(q.parts[1], 'legacy-gap-0', '5'), false, 'two bytes in one block are not two accesses');
  const a = count(expected[2], 8, true), b = count(expected[2], 4, true);
  const totalMissTime = (4 * a.hits - 2 * b.hits) / (b.misses - a.misses);
  assert.equal(totalMissTime, 10);
  assert.equal(grade(q.parts[2], 'legacy-gap-0', String(totalMissTime)), true);
  assert.equal(grade(q.parts[2], 'legacy-gap-0', '12'), false, 'the revised stem explicitly asks total miss time, not an extra penalty');
});
test('2021 cache explanation does not split N0 and S2 formulas with code delimiters', () => {
  const q = bank.find(q => q.id === 'q-c4db69af5ae828fe'); assert.ok(q.revision >= 4);
  assert.match(q.solution.reference.text, /\$N=2N_0\$/);
  assert.match(q.solution.reference.text, /\$S=S_2\$、\$N=4N_0\$/);
  assert.doesNotMatch(q.solution.reference.text, /`[^`\n]*\$|\$`/);
  assert.match(q.stem.text, /`T = \(结束计时的时刻 - 开始计时的时刻\) \/ 6\.0`/);
});
