'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../site/question-v5.js');
const bank = require('../question-bank/web-data/questions.json').questions;

test('source collections are explicit with a legacy v5 default', () => {
  assert.equal(api.paperCollection({sourceCollection:'csapp-textbook'}),'csapp-textbook');
  assert.equal(api.paperCollection({sourceCollection:'pku-exam'}),'pku-exam');
  assert.equal(api.paperCollection({}),'pku-exam');
});

test('CSAPP practice questions retain independent context and complete code fences', () => {
  const practice=bank.filter(q=>q.classification.tags.includes('csapp')&&q.classification.tags.includes('practice'));
  assert(practice.length>=36);
  const bounded=practice.find(q=>q.id==='q-6decb55123a89740');
  assert.match(bounded.stem.text,/slots=1/);
  assert.match(bounded.stem.text,/items=0/);
  assert.equal((bounded.stem.text.match(/```text\n/g)||[]).length,2);
  assert.deepEqual(bounded.solution.correctOptionIds,['C']);
  const cgi=practice.find(q=>q.id==='q-97e1ac350d5f482c');
  assert.match(cgi.stem.text,/```c\n[\s\S]*fflush\(stdout\);\nexit\(0\);\n```/);
  assert.match(cgi.solution.reference.text,/子进程终止时/);
  assert.match(cgi.options.find(o=>o.id===cgi.solution.correctOptionIds[0]).content.text,/关闭.*描述符/);
});

test('hand-authored assembly keeps labels at column zero and instructions indented', () => {
  const q=bank.find(q=>q.id==='q-cb30db95322d3051');
  const loop=q.parts.find(p=>p.id==='q-4284650c2063ef72').stem.text;
  assert.match(loop,/\nLOOP:\n    movl \(%eax\),%eax\n    add \$1,%ecx/);
  assert.match(loop,/\nLOOP:\n    mrmovl \(%eax\),%eax/);
  const code=q.parts.find(p=>p.id==='q-135a936b527da7c1').stem.text;
  assert.match(code,/movl %edx,\(%ecx\)\n```\n\n```c\nvoid process/);
  const mixed=bank.find(q=>q.id==='q-d5d56ae86119aa5f');
  assert.match(mixed.stem.text,/\n    a\[i\]\[__C__ - i\] = 1;\n```\n\n```asm\n    leaq/);
  const reads=bank.find(q=>q.id==='q-f224f477623e889f');
  assert.equal((reads.stem.text.match(/```c\n/g)||[]).length,2);
});

test('CSAPP explicitly accepts zero constants and states float-format assumptions', () => {
  const macro=bank.find(q=>q.id==='q-c2a9a2f0bcb68b70');
  assert.equal(api.gradeBlanks({nr:'3*n+0',nc:'4*n+1'},macro.solution),true);
  assert.equal(api.gradeBlanks({nr:'3 * n + 0',nc:'4 * n + 1'},macro.solution),true);
  assert.match(bank.find(q=>q.id==='q-72f5f49722d45dcc').stem.text,/2\\le n\\le B/);
});

test('reported invalid questions remain backed up with an explicit non-publishable state', () => {
  for (const id of ['q-f39f4e62d028f8d6','q-3376fb77c2e3a398','q-45d24dbc19ab7615']) {
    const question = bank.find(q=>q.id===id);
    assert.equal(question.publication.state,'review');
    assert(question.publication.issues.includes('retired-invalid-question'));
  }
});

test('reported RGB and structure questions include all reference data', () => {
  const rgb=bank.find(q=>q.id==='q-6c3e0a8f8c9b1472');
  assert.match(rgb.stem.text,/!\[.*\]\(assets\/csapp\/ch2\/ex-2-9-color-lights.jpg\)/);
  for(const code of ['000','001','010','011','100','101','110','111']) assert(rgb.stem.text.includes('`'+code+'`'));
  const structure=bank.find(q=>q.id==='q-7cd9182305e4534c');
  assert.match(structure.stem.text,/```c\ntypedef struct \{\n    short x\[A\]\[B\];/);
  assert.match(structure.stem.text,/32 位 x86/);
  assert.equal(api.gradeBlanks({'value-a':'3','value-b':'7'},structure.solution),true);
  assert.equal(api.gradeBlanks({'value-a':'3','value-b':'8'},structure.solution),false);
  const align4=n=>Math.ceil(n/4)*4;
  const candidates=[];
  for(let a=1;a<=22;a++) for(let b=1;b<=22;b++) {
    if(align4(b)===8&&align4(12+2*b)===28&&align4(2*a*b)===44) candidates.push([a,b]);
  }
  assert.deepEqual(candidates,[[3,7]]);
  const retired=bank.find(q=>q.id==='q-45d24dbc19ab7615');
  assert.match(retired.stem.text,/char s\[8\] = "01234567";/);
  assert.match(retired.solution.reference.text,/返回地址在 `8\(%rbp\)`/);
  assert.deepEqual(retired.solution.correctOptionIds,['D']); // Keep historical key, never publish.
});

test('2014 final bit reversal and disassembly blanks have exact automatic keys', () => {
  const question=bank.find(q=>q.id==='q-7d2647844e7abcf9');
  const [values,assembly]=question.parts;
  assert.equal(api.gradeBlanks({'result-1':'0x800000','result-2':'0'},values.solution),true);
  assert.equal(api.gradeBlanks({'result-1':'0x80000000','result-2':'0'},values.solution),false);
  const answers={'operand-1':'%eax','operand-2':'$8','operand-3':'%rbx','operand-4':'$16',
    'operand-5':'%edx','operand-6':'%eax','operand-7':'$0x8','operand-8':'%eax'};
  assert.equal(api.gradeBlanks(answers,assembly.solution),true);
  assert.equal(api.gradeBlanks({...answers,'operand-3':'%ebx'},assembly.solution),false);
  assert.equal(assembly.stem.blanks.filter(b=>b.id==='operand-3').length,2);
  assert.match(values.solution.reference.text,/c\(1\) = 0x80000000/);
});

test('reported Markdown protects complete expressions and separates the float4 functions', () => {
  const question=bank.find(q=>q.id==='q-31fd3c710550b47e');
  assert.match(question.stem.text,/int4 f2i\(float4 f\) \{\n  return \(int4\) f;\n\}/);
  assert(!/\n2\s*$/.test(question.stem.text));
  assert.match(question.solution.reference.text,/`0110` \| \+∞/);
  assert.match(question.solution.reference.text,/`0111` \| NaN/);
  const minimum=bank.find(q=>q.id==='q-96276f24280880cd');
  assert.deepEqual(minimum.options.map(o=>o.content.text.trim()),['$-2^{32}$','$-2^{32}+1$','$-2^{31}$','$-2^{31}+1$']);
  const small=bank.find(q=>q.id==='q-0a147b905856ecc3');
  assert.match(small.options[1].content.text,/\$2\^\{-149\}\$/);
  const byteSwap=bank.find(q=>q.id==='q-b0a1a7fb9bac4b8c');
  assert(byteSwap.options.every(o=>/^`[^\n]+`\s*$/.test(o.content.text)));
});

test('2014 float normalization distinguishes decimal and explicitly marked binary significands', () => {
  const question=bank.find(q=>q.id==='q-bf82915267634dbd');
  const answers={'value-0375-form':'1.5*2^-2','value-0375-hex':'0x3EC00000',
    'value-neg125-form':'-1.5625*2^3','value-neg125-hex':'0xC1480000'};
  assert.equal(api.gradeBlanks(answers,question.solution),true);
  assert.equal(api.gradeBlanks({...answers,'value-0375-form':'1.1*2^-2'},question.solution),false);
  assert.equal(api.gradeBlanks({...answers,'value-0375-form':'1.1_2*2^-2'},question.solution),true);
  assert.equal(api.gradeBlanks({...answers,'value-neg125-form':'(-1)*1.1001_2*2^3'},question.solution),true);
  assert.match(question.solution.reference.text,/\$\(-1\)\^1\\times 1\.5625\\times 2\^\{3\}\$/);
  for(const id of ['q-b64bee7e95173543','q-62e446c0bb6e29fe']) {
    assert.match(bank.find(q=>q.id===id).stem.text,/```c\n/);
  }
});

test('all declared select keys grade by values; wrong and missing selections fail', () => {
  for (const question of bank) for (const unit of question.parts || [question]) {
    if (unit.type !== 'fill') continue;
    for (const blank of unit.stem.blanks) {
      if (blank.input?.kind !== 'select') continue;
      const rule = unit.solution.blankAnswers.find(r=>r.blankId===blank.id);
      const solution = {state:'available',grading:'blanks',blankAnswers:[rule]};
      if (rule.method === 'self') {
        assert.equal(api.gradeBlanks({},solution),null);
        continue;
      }
      const correct = blank.input.multiple ? rule.correctValues : rule.correctValues[0];
      assert.equal(api.gradeBlanks({[blank.id]:correct},solution),true,question.id+'/'+blank.id);
      assert.equal(api.gradeBlanks({},solution),false);
      const wrong = blank.input.options.find(o=>!rule.correctValues.includes(o.value));
      const changed = wrong ? [...rule.correctValues,wrong.value] : rule.correctValues.slice(1);
      assert.equal(api.gradeBlanks({[blank.id]:changed},solution),false);
    }
  }
});

test('bounded comparison uses full candidates, while numeric/code answers stay text', () => {
  const comparison=bank.find(q=>q.id==='q-be9654f19b9b4b25');
  assert.deepEqual(comparison.stem.blanks[0].input.options.map(o=>o.label),['大于','小于','等于']);
  assert.equal(api.gradeBlanks({'q2-relation':'gt'},comparison.solution),true);
  assert.equal(api.gradeBlanks({'q2-relation':'lt'},comparison.solution),false);
  const mixed=bank.find(q=>q.id==='q-7b8ae9d0614c29bf');
  assert.equal(mixed.stem.blanks.find(b=>b.id==='q3').input.multiple,true);
  assert.equal(mixed.stem.blanks.find(b=>b.id==='q2a').input,undefined);
  assert.equal(mixed.stem.blanks.find(b=>b.id==='q4b').input,undefined);
});

test('inline assembly underscores are not blanks; restored judgments include numeric output', () => {
  const question=bank.find(q=>q.id==='q-48830bbf91e759fa');
  const first=question.parts.find(p=>p.id==='q-49ad744352e4e33c');
  assert.match(first.stem.text,/__asm__ __volatile__/);
  assert.deepEqual(first.stem.blanks.map(b=>b.id),['portable','equivalent','output']);
  assert.equal(api.gradeBlanks({portable:'no',equivalent:'yes',output:'3.75'},first.solution),true);
  assert.equal(api.gradeBlanks({portable:'no',equivalent:'yes'},first.solution),false);
  const third=question.parts.find(p=>p.id==='q-50d8c8bfdff1fa9f');
  assert.equal(api.gradeBlanks({'legacy-gap-0':'no','legacy-gap-1':'no','union-output':'-1105'},third.solution),true);
  assert.equal(api.gradeBlanks({'legacy-gap-0':'no','legacy-gap-1':'no'},third.solution),false);
  const symbols=bank.find(q=>q.id==='q-53b7581785c41178');
  assert(!symbols.stem.blanks.some(b=>b.marker==='__'));
});
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
