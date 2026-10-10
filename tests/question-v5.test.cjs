'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../site/question-v5.js');
const bank = require('../question-bank/web-data/questions.json').questions;

test('Markdown rendering preserves every declared blank, including table cells containing operators', () => {
  const md=require('../site/vendor/markdown-it/markdown-it.min.js')({html:false,breaks:false,linkify:false,typographer:false});
  for(const question of bank) for(const unit of question.parts||[question]) {
    const spans=api.blankSpans(unit.stem);
    let cursor=0,markdown='';
    spans.forEach((span,index)=>{markdown+=unit.stem.text.slice(cursor,span.start)+'ICSBLANKTOKEN'+index+'END';cursor=span.end;});
    markdown+=unit.stem.text.slice(cursor);
    const html=md.render(markdown);
    spans.forEach((span,index)=>assert.equal(html.split('ICSBLANKTOKEN'+index+'END').length-1,1,
      question.id+'/'+unit.id+'/'+span.blank.id+' disappeared during Markdown rendering'));
  }
});

test('accepted report repairs keep complete code listings and explicit stack assumptions', () => {
  const md=require('../site/vendor/markdown-it/markdown-it.min.js')({html:false,breaks:false});
  const transform=bank.find(q=>q.id==='q-2d3657e2f402ef3b');
  const assembly=md.parse(transform.parts[0].stem.text,{}).find(t=>t.type==='fence').content;
  assert.match(assembly,/add \$1, %rdi/);
  assert.match(assembly,/add \$1, %rsi/);
  assert(!/\$r[sd]i/.test(assembly));
  const code=md.parse(transform.parts[1].stem.text,{}).filter(t=>t.type==='fence');
  assert.equal(code.length,1);
  for(const fragment of ['void transform(', 'short x =', 'src += 2;', 'tgt += 2;', '{{blank:mask}};'])
    assert(code[0].content.includes(fragment),fragment);
  assert(!code[0].content.includes('`'));
  const stack=bank.find(q=>q.id==='q-9270f741d613d9a2');
  const dump=md.parse(stack.parts[1].stem.text,{}).filter(t=>t.type==='fence');
  assert.equal(dump.length,1);
  assert(dump[0].content.includes('0x7fffffffe558'));
  assert(dump[0].content.includes('0x7fffffffe4f8'));
  assert.equal((dump[0].content.match(/\{\{blank:/g)||[]).length,4);
  const frame=bank.find(q=>q.id==='q-5667f7a0eca8dc57');
  assert.equal(frame.publication.state,'published');
  assert.match(frame.stem.text,/省略的部分不改变栈指针/);
  assert.match(frame.stem.text,/qux.*恢复调用前/);
  assert.equal(api.gradeChoice(['A','B','D','E'],frame.solution),true);
});

test('round-table semaphore question has real answers without accepting inconsistent lock order', () => {
  const question=bank.find(q=>q.id==='q-ca36da4b1e755039');
  assert.equal(question.type,'fill');
  assert.equal(question.stem.blanks.length,13);
  const answers=Object.fromEntries(question.solution.blankAnswers.map(r=>[r.blankId,r.acceptedAnswers[0]]));
  assert.equal(api.gradeBlanks(answers,question.solution),true);
  assert.equal(api.gradeBlanks({...answers,'mutex-index':'25'},question.solution),true);
  assert.equal(api.gradeBlanks({...answers,'mutex-index':'26'},question.solution),false);
  assert.equal(api.gradeBlanks({...answers,'order-c':'1'},question.solution),false);
  assert.equal(api.gradeBlanks({...answers,'binary-c':'<='},question.solution),false);
  assert.equal(api.gradeBlanks({...answers,'binary-f':'<'},question.solution),false);
  assert.equal(question.stem.blanks.filter(b=>b.id==='mutex-index').length,2);
  assert.match(question.stem.text,/先锁较小编号、再锁较大编号/);
  assert.match(question.solution.reference.text,/先锁较小编号、再锁较大编号/);
});

test('source inventory finds exercises in section headings and quoted boxes, without counting prose references', () => {
  const {practiceNumbers}=require('../scripts/audit-csapp-practice.cjs');
  assert.deepEqual(practiceNumbers('**练习题 2.45** 表格\n\n> **练习题 9.1**\n\n### 练习题 3.1\n\n**练习题 2.45**\n参见练习题 2.99。'),['2.45','9.1','3.1']);
});

test('every declared objective fill has usable explicit keys; no missing/partial submission passes', () => {
  for (const question of bank) for (const unit of question.parts || [question]) {
    if (unit.solution.grading !== 'blanks') continue;
    const rules = unit.solution.blankAnswers;
    if (rules.some(rule=>rule.method==='self')) continue;
    const answers = Object.fromEntries(rules.map(rule=>[rule.blankId,
      rule.method==='selection' ? rule.correctValues : rule.acceptedAnswers[0]]));
    assert.equal(api.gradeBlanks(answers,unit.solution),true,question.id+'/'+unit.id);
    assert.equal(api.gradeBlanks({},unit.solution),false,question.id+'/'+unit.id);
    for (const rule of rules) {
      const incomplete = {...answers}; delete incomplete[rule.blankId];
      assert.equal(api.gradeBlanks(incomplete,unit.solution),false,question.id+'/'+rule.blankId);
    }
    const unique = new Set((unit.stem.blanks||[]).map(blank=>blank.id));
    assert.deepEqual(new Set(rules.map(rule=>rule.blankId)),unique);
  }
});

test('CSAPP floating-point section retains full tables and explicit judgment choices', () => {
  const chapter = bank.filter(q=>q.paperId==='p-f4835e390ee6ce49');
  for (const number of ['2.45','2.46','2.47','2.48','2.49','2.50','2.51','2.52','2.54']) {
    assert.equal(chapter.filter(q=>q.number.display===number).length,1,number);
  }
  const byNumber = number=>chapter.find(q=>q.number.display===number);
  assert.equal(byNumber('2.45').stem.blanks.length,12);
  assert.equal(byNumber('2.50').stem.blanks.length,12);
  assert.equal(byNumber('2.52').stem.blanks.length,12);
  const conversion = byNumber('2.52');
  assert.equal(api.gradeBlanks({'a-value':'15/2','a-bits':'1001 111','a-rounded':'15/2',
    'b-value':'25/32','b-bits':'0110 100','b-rounded':'3/4',
    'c-value':'31/2','c-bits':'1011 000','c-rounded':'16',
    'd-value':'1/64','d-bits':'0001 000','d-rounded':'1/64'},conversion.solution),true);
  const judgments=byNumber('2.54');
  assert.equal(judgments.stem.blanks.length,8);
  assert(judgments.stem.blanks.every(blank=>blank.input.options.length===2));
  assert.equal(api.gradeBlanks({a:'true',b:'false',c:'false',d:'true',e:'true',f:'true',g:'true',h:'false'},judgments.solution),true);
  assert.match(judgments.solution.reference.text,/16777217/);
});

test('CSAPP chapter 5 keeps all eligible exercises and grades complete operation tables', () => {
  const chapter=bank.filter(q=>q.paperId==='p-0db63d22232f572c'&&q.classification.tags.includes('practice'));
  assert.deepEqual(chapter.map(q=>q.number.display).sort(),['5.1','5.10','5.2','5.3','5.4','5.5','5.6','5.8']);
  const byNumber=number=>chapter.find(q=>q.number.display===number);
  assert.equal(byNumber('5.2').stem.blanks.length,4);
  assert.equal(byNumber('5.3').stem.blanks.length,12);
  assert.match(byNumber('5.5').stem.text,/double poly\(double a\[\], double x, long degree\)/);
  assert.match(byNumber('5.6').stem.text,/double polyh\(double a\[\], double x, long degree\)/);
  assert.equal(api.gradeBlanks({a1:'5',a2:'10/3',a3:'5/3',a4:'5/3',a5:'10/3'},byNumber('5.8').solution),true);
  assert.equal(api.gradeBlanks({a1:'5',a2:'10/3',a3:'5/3',a4:'5/3',a5:'5/3'},byNumber('5.8').solution),false);
});

test('CSAPP chapter 2 preserves givens and separates bounded judgments from open constructions', () => {
  const chapter=bank.filter(q=>q.paperId==='p-f4835e390ee6ce49'&&q.classification.tags.includes('practice'));
  assert.equal(chapter.length,50);
  assert(!chapter.some(q=>['2.32','2.35','2.36','2.37'].includes(q.number.display)));
  const byNumber=number=>chapter.find(q=>q.number.display===number);
  assert.match(byNumber('2.20').stem.text,/T2U_w\(x\)/);
  assert.match(byNumber('2.20').stem.text,/-8, -3, -2, -1, 0, 5/);
  for(const row of byNumber('2.24').parts.slice(0,5)) assert.equal(row.stem.blanks.length,2);
  assert.match(byNumber('2.29').stem.text,/-32 <= z < -16/);
  assert.equal(api.gradeBlanks({multipliers:['1','2','3','4','5','8','9']},byNumber('2.38').solution),true);
  const truth=byNumber('2.44').parts[0];
  assert.equal(truth.stem.blanks.length,7);
  assert.equal(api.gradeBlanks({A:'false',B:'true',C:'false',D:'true',E:'false',F:'true',G:'true'},truth.solution),true);
  assert.equal(api.gradeBlanks({pos:'1.0/0.0',neg:'-POS_INFINITY',zero:'-0.0'},byNumber('2.53').solution),null);
});

test('reported source artifacts are removed in authored Markdown, not renderer heuristics', () => {
  const builtin=bank.find(q=>q.id==='q-0e17d6371642c853');
  assert.match(builtin.stem.text,/__builtin_return_address\(1\)/);
  assert(!builtin.stem.text.includes('\\_\\_builtin'));
  for(const id of ['q-7d29433073c3ab5d','q-70e351f742b73d89']) {
    assert(!/[正错]．[确误]．/.test(bank.find(q=>q.id===id).stem.text));
  }
});

test('reported 2018 and 2016 large questions expose original-position grading and readable options', () => {
  const translation=bank.find(q=>q.id==='q-24321282fb032032');
  assert.equal(translation.solution.grading,'blanks');
  assert.equal(translation.stem.blanks.length,12);
  const mapping=bank.find(q=>q.id==='q-f8e10c8048661052');
  for(const letter of ['A','B','C','D'])assert.match(mapping.stem.text,new RegExp('^- \\*\\*'+letter+'\\.\\*\\*','m'));
  const io=bank.find(q=>q.id==='q-54e55a2556b716c4');
  assert.equal(io.type,'composite');
  assert.deepEqual(io.parts.map(part=>part.type),['short-answer','fill','fill','short-answer']);
  assert.equal(io.parts[1].stem.blanks.length,12);
  assert.equal(io.parts[2].solution.grading,'blanks');
});

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

test('2018 midterm Q1.5 states byte-order and char-signedness uncertainty before answering', () => {
  const question=bank.find(q=>q.id==='q-e35ce7e3697036eb');
  assert.match(question.stem.text,/提示：本题未规定大小端，也未规定 `char` 是 `signed` 还是 `unsigned`。/);
  assert.equal(question.type,'multiple-choice');
  assert.deepEqual(question.solution.correctOptionIds,['A','B','C']);
});

test('reported invalid questions remain backed up with an explicit non-publishable state', () => {
  for (const id of ['q-f39f4e62d028f8d6','q-3376fb77c2e3a398','q-45d24dbc19ab7615',
    'q-b8edc298950e949d','q-19c4d964d98fc677']) {
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

test('2024 final large memory questions retain tables and complete automatic blanks', () => {
  const virtual=bank.find(q=>q.id==='q-492c07fd54f9b065');
  assert.equal(virtual.stem.blanks.length,8);
  assert(!virtual.stem.text.includes('page-21.png'));
  assert.match(virtual.stem.text,/\| 6 \| 1 \| 4 \| 0 \| 0 \| C \| 1 \|/);
  assert.match(virtual.stem.text,/\| 06 \| C \| 1 \| 0E \| D \| 1 \|/);
  const answers={entries:'64','table-pages':'1','physical-address':'0x6a1','memory-accesses':'8',
    'access-1':'B','access-2':'C','ia32-l1-pte':'0xe77190','ia32-l2-pte':'0xd000980'};
  assert.equal(api.gradeBlanks(answers,virtual.solution),true);
  assert.equal(api.gradeBlanks({...answers,'access-1':'A'},virtual.solution),false);
  assert.equal((0x721>>>7),0x0e);
  assert.equal(0xd*128+(0x721&127),0x6a1);
  assert.equal(0xe77000+(0x19260817>>>22)*4,0xe77190);
  assert.equal(0xd000000+((0x19260817>>>12)&1023)*4,0xd000980);
  const allocation=bank.find(q=>q.id==='q-69a53f8a7ed107eb');
  assert.equal(allocation.stem.blanks.length,9);
  assert(!allocation.stem.text.includes('page-23.png'));
  assert.match(allocation.stem.text,/calloc\(1, 28\)/);
  assert.match(allocation.stem.text,/不一定是块末尾/);
  const mallocAnswers={'pointer-position':'C','header-byte':'0x11','deferred-combine':'C','immediate-combine':'A',
    utilization:'1/16','footer-space':'A','attack-write-offset':'12','attack-write-value':'16','false-free-offset':'12'};
  assert.equal(api.gradeBlanks(mallocAnswers,allocation.solution),true);
  assert.equal(api.gradeBlanks({...mallocAnswers,'false-free-offset':'16'},allocation.solution),true);
  assert.equal(api.gradeBlanks({...mallocAnswers,'attack-write-offset':'16'},allocation.solution),false);
  assert.equal(Math.ceil((28+4)/8)*8-4-16,12); // Fake header before p2; payload starts four bytes later.
});

test('2024 final concurrent questions retain complete code, choices and repeated blanks', () => {
  const cinema=bank.find(q=>q.id==='q-a01a9f044af56d47');
  assert.equal(cinema.stem.blanks.length,21);
  assert.equal(cinema.solution.blankAnswers.length,12);
  assert.equal((cinema.stem.text.match(/```c\n/g)||[]).length,2);
  assert.match(cinema.stem.text,/while \(n--\) \{\n\s+\{\{blank:part2-f\}\};/);
  assert(!/\n2\n/.test(cinema.stem.text));
  const cinemaKeys={a:'4',b:'5',c:'3',d:'2',e:'3',starvation:'possible',
    'part2-a':'1','part2-b':'1','part2-c':'7','part2-d':'8','part2-e':'3','part2-f':'9'};
  assert.equal(api.gradeBlanks(cinemaKeys,cinema.solution),true);
  assert.equal(api.gradeBlanks({...cinemaKeys,starvation:'impossible'},cinema.solution),false);
  const signals=bank.find(q=>q.id==='q-c686bf5ca67f4ed8');
  assert.equal(signals.stem.blanks.length,8);
  assert.equal((signals.stem.text.match(/```c\n/g)||[]).length,1);
  assert.match(signals.stem.text,/\| G \| 由于磁盘太慢等原因，产生写不足 \|/);
  assert.equal(api.gradeBlanks({'legacy-gap-0':'2','legacy-gap-1':'no','legacy-gap-2':'no',
    'legacy-gap-3':'yes','legacy-gap-4':'no','legacy-gap-5':'D','legacy-gap-6':'A','legacy-gap-7':'C'},signals.solution),true);
});

test('large linking and producer-consumer questions keep separate files and stable line numbers', () => {
  for(const id of ['q-96576bae25379ede','q-0db09198d5c9f64c']) {
    const q=bank.find(q=>q.id===id);
    assert.equal((q.stem.text.match(/```asm\n/g)||[]).length,2);
    assert.equal((q.stem.text.match(/```c\n/g)||[]).length,2);
    assert(!/0000000000.*<main>:[^\n]*0000000000/.test(q.stem.text));
    assert(!q.stem.text.includes('48 c7 05 00 00 00 00 00 00 00 00 00'));
  }
  const final2019=bank.find(q=>q.id==='q-96576bae25379ede');
  assert(!final2019.stem.text.includes('<func>'));
  assert.match(final2019.stem.text,/原卷.*`1018`.*重复/);
  const producer=bank.find(q=>q.id==='q-59acf52820891cfb');
  assert.match(producer.stem.text,/\n15\. static void sync_var_init\(\) \{\n16\.     Sem_init/);
  assert.match(producer.stem.text,/\n59\.     for .*\n60\.         Pthread_create/);
  assert.match(producer.stem.text,/\n86\. \}\n```/);
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
