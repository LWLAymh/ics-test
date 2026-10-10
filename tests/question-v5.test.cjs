'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../site/question-v5.js');
const bank = require('../question-bank/web-data/questions.json').questions;
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

test('select blanks compare explicit option values as exact sets, not Markdown or substrings', () => {
  const solution = {state:'available', grading:'blanks', blankAnswers:[
    {blankId:'single', method:'selection', correctValues:['lt']},
    {blankId:'multi', method:'selection', correctValues:['A','D']},
  ]};
  assert.equal(api.gradeBlanks({single:'lt',multi:['D','A']},solution),true);
  for (const multi of [[], ['A'], ['A','D','E'], ['A','D','D'], 'AD', 'A,D']) {
    assert.equal(api.gradeBlanks({single:'lt',multi},solution),false);
  }
  assert.equal(api.gradeBlanks({single:'<',multi:['A','D']},solution),false);
  assert.equal(api.gradeBlanks({multi:['A','D']},solution),false);
  solution.blankAnswers.push({blankId:'text',method:'exact',acceptedAnswers:['42'],
    normalize:{trimWhitespace:true,caseSensitive:true}});
  assert.equal(api.gradeBlanks({single:'lt',multi:['A','D'],text:'42'},solution),true);
  solution.blankAnswers.push({blankId:'why',method:'self'});
  assert.equal(api.gradeBlanks({},solution),null);
});

test('2015 final assembly loop boundary matches the C loop and both outputs', () => {
  const question = bank.find(q=>q.id==='q-8c4d8b2b8d02717d');
  const rule = question.solution.blankAnswers.find(r=>r.blankId==='q2-f8');
  const solution = {state:'available',grading:'blanks',blankAnswers:[rule]};
  assert.equal(api.gradeBlanks({'q2-f8':'40'},solution),true);
  assert.equal(api.gradeBlanks({'q2-f8':'0x28'},solution),true);
  assert.equal(api.gradeBlanks({'q2-f8':'0x40'},solution),false);
  assert.equal(api.gradeBlanks({'q2-f8':'64'},solution),false);
  const array = [1,0,0,0,0,0], outputs = [];
  let count = 0;
  for(let call=0;call<2;call++){
    for(let i=0;i<5;i++,count++) array[i+1] = count%2===0 ? array[i]+count : array[i]*count;
    outputs.push(array.slice());
  }
  assert.deepEqual(outputs,[[1,1,1,3,9,13],[1,5,11,77,85,765]]);
  assert.equal(5*8,parseInt(rule.acceptedAnswers[0],16));
  assert.match(question.stem.text,/movq  a\(,%rbx,8\), %rsi/);
  assert.match(question.stem.text,/movl  \$\.LC0, %edi/);
});

test('2021 midterm union answers are restored and big-endian output has two graded blanks', () => {
  const question = bank.find(q=>q.id==='q-b0ef359a9e930155');
  assert.match(question.stem.text,/struct s_element/);
  const first = question.parts.find(p=>p.id==='q-4b04af65cec464e8');
  assert.equal(api.gradeBlanks({'q6-1-sizeof':'4'},first.solution),true);
  assert.equal(api.gradeBlanks({'q6-1-sizeof':'16'},first.solution),false);
  for(const part of question.parts) assert(!/^（\d+分）$/.test(part.solution.reference.text.trim()));
  const output = question.parts.find(p=>p.id==='q-793aaab0d5e579d8');
  assert.equal(api.gradeBlanks({'q6-7-hex':'0x4098','q6-7-distance':'-1'},output.solution),true);
  assert.equal(api.gradeBlanks({'q6-7-hex':'0x4098','q6-7-distance':'-2'},output.solution),false);
  const view = new DataView(new ArrayBuffer(4));
  view.setFloat32(0,Math.fround(Math.fround(1.2)+Math.fround(3.55)),false);
  assert.equal(view.getUint32(0,false),0x40980000);
  assert.equal(view.getInt16(0,false)-view.getInt16(2,false),0x4098);
});
