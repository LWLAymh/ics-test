'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const bank = require('../question-bank/web-data/questions.json'), papers = require('../question-bank/web-data/papers.json'), contract = require('../site/question-v5.js');
const paper = papers.papers.find(p => p.id === 'p-9c26b17e83af42d0');
const questions = paper.questionIds.map(id => bank.questions.find(q => q.id === id));
const byNumber = n => questions.find(q => q.number.minor.display === n);
test('2026 stage 2 preserves all 32 source questions and 45 explicit blanks', () => {
  assert.equal(paper.displayName, '2026阶段测验（第2次）'); assert.equal(paper.sequence, 2); assert.equal(paper.sourceCollection, 'pku-exam');
  assert.equal(questions.length, 32); assert.deepEqual(questions.map(q => q.paperOrder), Array.from({ length: 32 }, (_, i) => i + 1));
  assert.deepEqual(Object.fromEntries(['single-choice', 'multiple-choice', 'fill', 'composite', 'short-answer'].map(type => [type, questions.filter(q => q.type === type).length])), { 'single-choice': 9, 'multiple-choice': 6, fill: 14, composite: 2, 'short-answer': 1 });
  assert.equal(questions.flatMap(q => [q, ...(q.parts || [])]).reduce((n, unit) => n + (unit.stem.blanks || []).length, 0), 45);
  assert.equal(byNumber('9.3').solution.grading, 'self');
  assert.match(byNumber('9.3').stem.text, /mux-incomplete/); assert.doesNotMatch(byNumber('9.3').stem.text, /mux-reference/);
  assert.match(byNumber('9.3').solution.reference.text, /mux-reference/);
  assert.deepEqual(byNumber('10.4').parts.map(p => p.type), ['fill', 'multiple-choice']);
  assert.deepEqual(byNumber('16.4').parts.map(p => p.type), ['fill', 'multiple-choice']);
});
test('2026 stage 2 objective keys agree with the supplied answer sheet', () => {
  const keys = { '9.1': ['A', 'C'], '9.2': ['B'], '10.1': ['B'], '11.1': ['D'], '11.3': ['B', 'C'], '11.4': ['A'], '12.1': ['D'], '12.3': ['B', 'C'], '13.1': ['B'], '13.3': ['A', 'C', 'D'], '14.1': ['A'], '14.2': ['A', 'C', 'D'], '14.4': ['A', 'D'], '16.1': ['A'], '16.2': ['C'] };
  for (const [n, expected] of Object.entries(keys)) assert.deepEqual(byNumber(n).solution.correctOptionIds, expected, n);
  const blanks = { '9.4': ['6', '11', '9', '11'], '10.2': ['FF8', '400'], '10.3': ['PC+10', 'rB', 'valB', 'valE', '无', 'PC ← valP'], '11.2': ['160', '480', '1600', '120'], '11.5': ['5', '12'], '12.2': ['128', '8', '89'], '12.4': ['9.16', '72.16'], '13.2': ['5', '1.8'], '13.4': ['6', '1', '16', '32', '32'], '13.5': ['16', '4'], '14.3': ['12', '9'], '14.5': ['00601088', 'FFFFFFBB'], '16.3': ['1', '2', '3', '4'], '16.5': ['11'] };
  for (const [n, values] of Object.entries(blanks)) byNumber(n).solution.blankAnswers.forEach((rule, index) => { assert.equal(contract.gradeBlank(values[index], rule), true, n + '/' + rule.blankId); assert.equal(contract.gradeBlank('WRONG', rule), false); });
  assert.deepEqual(byNumber('10.4').parts[0].solution.blankAnswers.map(rule => rule.correctValues[0]), ['valC', 'valB', 'rB']);
  assert.deepEqual(byNumber('10.4').parts[1].solution.correctOptionIds, ['A', 'B', 'D']);
  assert.equal(contract.gradeBlank('3', byNumber('16.4').parts[0].solution.blankAnswers[0]), true);
  assert.deepEqual(byNumber('16.4').parts[1].solution.correctOptionIds, ['A', 'D']);
});
test('independent address traces confirm cache and relocation answers', () => {
  function misses(k) { const lines = Array(4).fill(null); let misses = 0; for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const block = Math.floor((0x1000 + (i * k + j) * 4) / 16), set = block % 4; if (lines[set] !== block) { misses++; lines[set] = block; } } return misses; }
  assert.equal(misses(8), 16); assert.equal(misses(12), 4);
  const sets = [[], []]; let missesCount = 0, writebacks = 0;
  for (const [op, address] of [['R', 0], ['W', 1], ['R', 16], ['R', 8], ['R', 0], ['W', 32], ['R', 16], ['R', 40]]) {
    const block = Math.floor(address / 8), set = sets[block % 2], found = set.findIndex(line => line.block === block);
    let line; if (found >= 0) line = set.splice(found, 1)[0]; else { missesCount++; if (set.length === 2 && set.shift().dirty) writebacks++; line = { block, dirty: false }; }
    if (op === 'W') line.dirty = true; set.push(line);
  }
  assert.equal(missesCount, 6); assert.equal(writebacks, 1); assert.deepEqual(sets[0].map(line => line.block * 8).sort((a, b) => a - b), [16, 32]); assert.equal(sets[0].find(line => line.dirty).block * 8, 32);
  assert.equal(0x601080 + 8, 0x601088); assert.equal((0x4004e0 - 4 - (0x400500 + 0x21)) >>> 0, 0xffffffbb);
});
