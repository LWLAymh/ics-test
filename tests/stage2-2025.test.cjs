'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const api = require('../site/question-v5.js');
const bank = require('../question-bank/web-data/questions.json').questions;
const paper = require('../question-bank/authored/papers.json').papers.find(p => p.id === 'p-0439188e8c4bdac1');
const qs = paper.questionIds.map(id => bank.find(q => q.id === id));
const q = n => qs[n - 1];

test('2025 stage test 2 retains all 24 source questions and grades every objective blank', () => {
  assert.equal(qs.length, 24); assert.equal(new Set(paper.questionIds).size, 24);
  assert.deepEqual(qs.map(q => q.paperOrder), Array.from({ length: 24 }, (_, i) => i + 1));
  assert.equal(paper.coverage.state, 'complete');
  for (const question of qs) for (const unit of question.parts || [question]) {
    if (unit.type !== 'fill') continue;
    assert.equal(unit.solution.blankAnswers.length, unit.stem.blanks.length);
    for (const rule of unit.solution.blankAnswers) {
      assert.notEqual(rule.method, 'self', question.id);
      for (const correct of rule.acceptedAnswers || rule.correctValues) assert.ok(api.gradeBlank(correct, rule), rule.blankId);
      assert.equal(api.gradeBlank('', rule), false); assert.equal(api.gradeBlank('WRONG_VALUE', rule), false);
    }
  }
});
test('register feedback and SEQ HCL blanks use independently derived values', () => {
  let out = 0;
  const sequence = [1, 3, 5, 7, 9, 11].map((input, i) => out = [1, 0, 0, 1, 0, 0][i] ? input : out + input);
  assert.equal(q(4).type, 'fill');
  assert.deepEqual(q(4).solution.blankAnswers.map(r => Number(r.acceptedAnswers[0])), sequence);
  assert.equal(q(6).type, 'fill'); assert.equal(q(6).stem.blanks.length, 8);
  const restored = q(6).stem.text.replace(/\{\{blank:([^}]+)\}\}/g, (_, id) => q(6).solution.blankAnswers.find(r => r.blankId === id).acceptedAnswers[0]);
  assert.match(restored, /IRRMOVQ, IOPQ \} : valA/);
  assert.match(restored, /IIRMOVQ, IRMMOVQ, IMRMOVQ \} : valC/);
  assert.match(restored, /ICALL, IPUSHQ \} : -8/);
  assert.match(restored, /IRET, IPOPQ \} : 8/);
  assert.match(q(5).stem.text, /B0 rAF/);
  assert.ok(api.gradeBlank('PC + 1', q(5).solution.blankAnswers[0]));
  assert.ok(api.gradeBlank('rsp', q(5).solution.blankAnswers[1]));
  assert.deepEqual(q(7).solution.blankAnswers.map(r => Number(r.acceptedAnswers[0])), [40 + 160 + 80 + 3 * 20, 160 + 20, 7 * (40 + 20), 40 + 20]);
  assert.doesNotMatch(q(8).stem.text, /^\d+\s+(?:irmovq|rmmovq|mrmovq|addq)/m);
});
test('cache trace starts with explicitly invalid groups and distinguishes tag bits from decimal', () => {
  const cache = [null, 1, null, null]; // block number, initially only Mem[4-7]
  const trace = [18, 40, 50, 16, 43, 48].map(address => {
    const block = Math.floor(address / 4), set = block % 4, hit = cache[set] === block;
    cache[set] = block; return hit;
  });
  assert.deepEqual(trace, [false, false, false, false, true, false]);
  assert.deepEqual(cache, [12, 1, 10, null]);
  const rules = q(17).solution.blankAnswers, values = rules.map(r => r.acceptedAnswers?.[0] || r.correctValues[0]);
  assert.deepEqual(values, ['1', (cache[0] >> 2).toString(2), 'Mem[48-51]', '1', (cache[2] >> 2).toString(2), 'Mem[40-43]', String(trace.filter(Boolean).length), String(trace.filter(h => !h).length)]);
  assert.match(q(17).stem.text, /`set0` \| 0 \| — \| —/);
  const initial = q(17).stem.text.split('依次访问')[0]; assert.doesNotMatch(initial, /\{\{blank:/);
  assert.ok(api.gradeBlank('M [ 48 - 51 ]', rules[2]));
  assert.equal(api.gradeBlank('3', rules[1]), false, 'tag requires two binary digits');
  assert.equal(api.gradeBlank('2', rules[6]), false, 'old hit count is incorrect under the stated premise');
});
test('linker symbols exclude preprocessing; fork tasks share their program with every part', () => {
  assert.deepEqual(q(20).solution.correctOptionIds, ['D', 'E', 'G']);
  assert.match(q(20).solution.reference.text, /预处理/);
  for (const question of [q(23), q(24)]) {
    assert.match(question.stem.text, /```c[\s\S]*fork\(\)/);
    assert.match(question.stem.text, /标准输出/);
    for (const part of question.parts) assert.doesNotMatch(part.stem.text, /```c/);
  }
  assert.equal(q(23).parts[0].solution.blankAnswers[0].acceptedAnswers[0], '3');
  assert.equal(q(24).parts[0].solution.blankAnswers[0].acceptedAnswers[0], '3');
  assert.equal(q(24).parts[1].solution.blankAnswers[0].acceptedAnswers[0], '6');
  assert.deepEqual(q(24).parts[2].solution.correctOptionIds, ['D']);
});
