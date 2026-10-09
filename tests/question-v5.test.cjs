'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../site/question-v5.js');
test('strict version gate', () => {
  assert.throws(() => api.assertVersion({ schemaVersion: 3 }));
  assert.throws(() => api.assertVersion({ schemaVersion: 5 }));
  assert.equal(api.assertVersion({ schemaVersion: '5' }).schemaVersion, '5');
});
test('single/multiple choice use declared keys only; exact set, no partial credit', () => {
  const solution = { state: 'available', grading: 'choice', correctOptionIds: ['A', 'C'] };
  assert.equal(api.gradeChoice(['C', 'A'], solution), true);
  assert.equal(api.gradeChoice(['A'], solution), false);
  assert.equal(api.gradeChoice(['A', 'B', 'C'], solution), false);
  assert.equal(api.gradeChoice([], solution), false);
  assert.equal(api.gradeChoice(['A'], { state: 'missing', grading: 'none' }), null);
  assert.equal(api.gradeChoice(['A'], { state: 'available', grading: 'self' }), null);
});
test('blanks are literal anchors inside code and tables; repeated logical ID', () => {
  const content = { text: '```c\nint x = ____;\n```\n| answer | ____ |', blanks: [
    { id: 'x', marker: '____', occurrence: 0 }, { id: 'x', marker: '____', occurrence: 1 },
  ] };
  assert.equal(api.blankSpans(content).length, 2);
  assert.equal(api.blankSpans(content)[1].blank.id, 'x');
  assert.throws(() => api.blankSpans({ text: 'abc', blanks: [{ id: 'x', marker: '_', occurrence: 0 }] }));
  assert.throws(() => api.blankSpans({ text: '____', blanks: [
    { id: 'a', marker: '____', occurrence: 0 }, { id: 'b', marker: '___', occurrence: 0 },
  ] }));
});
test('exact matching uses explicit aliases/normalization, never eval or numeric guessing', () => {
  const rule = { blankId: 'x', method: 'exact', acceptedAnswers: ['0xff', '255'],
    normalize: { trimWhitespace: true, caseSensitive: false } };
  const solution = { state: 'available', grading: 'blanks', blankAnswers: [rule] };
  assert.equal(api.gradeBlanks({ x: ' 0xFF ' }, solution), true);
  assert.equal(api.gradeBlanks({ x: '255' }, solution), true);
  assert.equal(api.gradeBlanks({ x: '0X00FF' }, solution), false);
  assert.equal(api.gradeBlanks({ x: '3*85' }, solution), false);
  assert.equal(api.gradeBlanks({}, solution), false);
  rule.normalize = { trimWhitespace: false, caseSensitive: true };
  assert.equal(api.gradeBlanks({ x: ' 255 ' }, solution), false);
  solution.blankAnswers.push({ blankId: 'why', method: 'self' });
  assert.equal(api.gradeBlanks({ x: '255' }, solution), null);
});
