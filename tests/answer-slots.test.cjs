'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../site/question-v5.js');
const bank = require('../question-bank/web-data/questions.json').questions;
const md = require('../site/vendor/markdown-it/markdown-it.min.js')();
const question = id => bank.find(q => q.id === id);
const answer = (q, id) => q.solution.blankAnswers.find(a => a.blankId === id);

test('every empty table cell in the published prompts has an explicitly reviewed non-answer purpose', () => {
  const seen = new Set();
  for (const q of bank.filter(q => q.publication.state === 'published')) for (const u of [q, ...(q.parts || [])]) {
    let table = false, row = -1, col = -1;
    const tokens = md.parse(u.stem.text, {});
    for (let i = 0; i < tokens.length; ++i) {
      const t = tokens[i];
      if (t.type === 'table_open') { table = true; row = -1; }
      if (t.type === 'table_close') table = false;
      if (!table) continue;
      if (t.type === 'tr_open') { ++row; col = -1; }
      if (t.type !== 'td_open') continue;
      ++col;
      if (tokens[i + 1].content.trim()) continue;
      seen.add(u.id);
      const reviewed =
        (u.id === 'q-2ad3c4cc427891fb' && [2, 3, 5, 9].includes(row) && col === 0) || // repeated stage label
        (u.id === 'q-d3bfff8fb116c31c' && [5, 6].includes(row) && col === 1) || // thread has no step
        (u.id === 'q-adb65b85c2659c2f' && [2, 4].includes(row) && [2, 3].includes(col)) || // invalid cache line
        (u.id === 'q-0d7bc75a367777ab' && col >= 1 && (col < row || col > row + 4)) || // inactive pipeline cycle
        (u.id === 'q-4fc7a18df82a3d2a' && [7, 8].includes(row) && [1, 2].includes(col)); // no thread step
      assert.ok(reviewed, q.id + '/' + u.id + ': review empty table cell r' + row + ' c' + col);
    }
  }
  assert.equal(seen.size, 5);
});

test('fill prompts have no unbound underscore gaps, except the two source-designated unasked 2026 gaps', () => {
  for (const q of bank.filter(q => q.publication.state === 'published')) for (const u of [q, ...(q.parts || [])]) {
    if (u.type !== 'fill') continue;
    let text = u.stem.text;
    for (const span of api.blankSpans(u.stem).reverse()) text = text.slice(0, span.start) + '<ANSWER>' + text.slice(span.end);
    const lines = text.split('\n').filter(line => /(?<![A-Za-z0-9_])_{2,}(?![A-Za-z0-9_])/.test(line));
    if (u.id === 'q-9d421c3e0a8da37e') {
      assert.equal(lines.length, 2); assert.ok(lines.every(line => line.includes('本题不要求填写')));
    } else assert.deepEqual(lines, [], u.id + ': missing explicit blank declaration');
    assert.doesNotMatch(text, /\|\s*待填写\s*\||(?:=|return)[ \t]{3,};/, u.id);
  }
});

function scientific5(n, d) {
  let e = n.toString().length - d.toString().length;
  const ten = k => 10n ** BigInt(k);
  if (e >= 0 ? n < d * ten(e) : n * ten(-e) < d) --e;
  const scale = 4 - e;
  const numerator = scale >= 0 ? n * ten(scale) : n;
  const denominator = scale >= 0 ? d : d * ten(-scale);
  const rounded = (numerator + denominator / 2n) / denominator;
  const s = rounded.toString();
  return s[0] + '.' + s.slice(1) + 'e' + e;
}
test('80-bit extremes: exact integer arithmetic independently rounds all three five-digit decimals', () => {
  const q = question('q-f056683b1b65eedc');
  const values = [
    ['subnormal', 1n, 2n ** 16445n],
    ['normal', 1n, 2n ** 16382n],
    ['maximum', (2n ** 64n - 1n) * 2n ** 16320n, 1n],
  ];
  for (const [name, n, d] of values) {
    const expected = scientific5(n, d);
    assert.equal(api.gradeBlank(expected, answer(q, name + '-decimal')), true, expected);
    assert.equal(api.gradeBlank(expected.replace('e', 'E'), answer(q, name + '-decimal')), true);
    assert.equal(api.gradeBlank('0', answer(q, name + '-decimal')), false, 'never underflow to JS Number zero');
    assert.equal(api.gradeBlank('Infinity', answer(q, name + '-decimal')), false);
  }
  assert.equal(api.gradeBlank(' 2 ^ (-16445) ', answer(q, 'subnormal-formula')), true);
  assert.equal(api.gradeBlank('2^-16383', answer(q, 'normal-formula')), false);
  assert.equal(q.stem.blanks.length, 6);
});

test('CSAPP 3.32: execute call/ret and arithmetic, then check every pre-instruction table state', () => {
  const q = question('q-7c3a0e945bd1682f');
  const program = new Map([
    [0x400560, { label: 'm1', op: 'callq', next: 0x400565, target: 0x400548 }],
    [0x400548, { label: 'f1', op: 'lea', next: 0x40054c }],
    [0x40054c, { label: 'f2', op: 'sub', next: 0x400550 }],
    [0x400550, { label: 'f3', op: 'callq', next: 0x400555, target: 0x400540 }],
    [0x400540, { label: 'l1', op: 'mov', next: 0x400543 }],
    [0x400543, { label: 'l2', op: 'imul', next: 0x400547 }],
    [0x400547, { label: 'l3', op: 'retq' }],
    [0x400555, { label: 'f4', op: 'repz retq' }],
    [0x400565, { label: 'm2', op: 'mov' }],
  ]);
  let pc = 0x400560, di = 10n, si, ax, sp = 0x7fffffffe820n;
  const memory = new Map(); let fields = 0;
  const hex = n => n === undefined ? '-' : '0x' + n.toString(16);
  const num = n => n === undefined ? '-' : n.toString();
  for (let step = 0; step < 9; ++step) {
    const instruction = program.get(pc); assert.ok(instruction);
    if (instruction.label !== 'm1') {
      const state = { pc: hex(pc), op: instruction.op, di: num(di), si: num(si), ax: num(ax), sp: hex(sp), top: hex(memory.get(sp)) };
      for (const [suffix, value] of Object.entries(state)) {
        const rule = answer(q, instruction.label + suffix);
        assert.equal(api.gradeBlank(value, rule), true, instruction.label + suffix + '=' + value);
        if (!['op'].includes(suffix)) assert.equal(api.gradeBlank('0', rule), false, 'unknown is not zero');
        ++fields;
      }
    }
    if (instruction.label === 'm2') break;
    if (instruction.target) { sp -= 8n; memory.set(sp, BigInt(instruction.next)); pc = instruction.target; }
    else if (instruction.op.includes('retq')) { pc = Number(memory.get(sp)); sp += 8n; }
    else {
      if (instruction.label === 'f1') si = di + 1n;
      if (instruction.label === 'f2') di -= 1n;
      if (instruction.label === 'l1') ax = di;
      if (instruction.label === 'l2') ax *= si;
      pc = instruction.next;
    }
  }
  assert.equal(fields, 56); assert.equal(q.stem.blanks.length, 64);
  assert.equal(q.solution.blankAnswers.filter(a => a.method === 'self').length, 8);
  assert.equal(api.gradeBlank('ret', answer(q, 'l3op')), true);
  assert.equal(api.gradeBlank('retq', answer(q, 'l3op')), true);
  assert.equal(api.gradeBlank('repz   retq', answer(q, 'f4op')), true);
});

test('new expression fields preserve missing-fragment boundaries and open-ended answers remain self-graded', () => {
  const init = question('q-0300000000000041').parts[2];
  assert.equal(api.gradeBlank('sp -> s . y', answer(init, 'init-x')), true);
  assert.equal(api.gradeBlank('& sp -> s . x', answer(init, 'init-p')), true);
  assert.equal(api.gradeBlank('sp->s.x', answer(init, 'init-p')), false, 'value is not an address');
  assert.equal(api.gradeBlank('sp->s.x=sp->s.y;', answer(init, 'init-x')), false);
  const fn = question('q-5d9ff50c3d2ec4b1').parts[0];
  assert.equal(fn.stem.blanks.length, 8);
  assert.equal(api.gradeBlank('c[2 * i + 1]', answer(fn, 'lhs2')), true);
  assert.equal(api.gradeBlank('3', answer(fn, 'limit')), false);
  assert.equal(fn.solution.blankAnswers.filter(a => a.method === 'self').length, 3);
  assert.ok(question('q-0300000000000004').solution.blankAnswers.every(a => a.method === 'self'), 'equivalent instruction sequences are not rejected');
});
