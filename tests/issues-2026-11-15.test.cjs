'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../site/question-v5.js');
const bank = require('../question-bank/web-data/questions.json').questions;
const loopQuestion = bank.find(q => q.id === 'q-0324b364e9cc3917');
const rule = id => loopQuestion.solution.blankAnswers.find(a => a.blankId === id);

test('authored pipe tables do not absorb following question paragraphs or explanations', () => {
  const md = require('../site/vendor/markdown-it/markdown-it.min.js')({ html: false, breaks: true });
  const failures = [];
  for (const q of bank) for (const unit of [q, ...(q.parts || [])]) {
    for (const content of [unit.stem, unit.solution?.reference, ...(unit.options || []).map(o => o.content)]) {
      if (!content) continue;
      const lines = content.text.split(/\r?\n/);
      for (const token of md.parse(content.text, {})) {
        if (token.type !== 'table_open') continue;
        for (let i = token.map[0] + 1; i < token.map[1]; ++i) {
          if (/^\s*\|.*\|\s*$/.test(lines[i - 1]) && lines[i].trim() && !/^\s*\|/.test(lines[i])) {
            failures.push(q.id + ' / ' + unit.id + ': ' + lines[i]);
          }
        }
      }
    }
  }
  assert.deepEqual(failures, []);
});

// Small-word executable model of the actual program, not its answer prose.
// E-stage updates stand for ALU forwarding; all instructions below are ALU,
// branch or ret, so there is no load/use stall. Resolve branches in E, redirect
// from M, squash the two younger predicted instructions, and stop at ret.W.
function pipelineBar(bits, x) {
  const mask = (1n << BigInt(bits)) - 1n, sign = 1n << BigInt(bits - 1);
  const regs = { rdi: BigInt(x), rsi: 0n, r9: 0n, rax: 0n };
  let cc = { z: false, s: false, o: false }, pc = 0, cycles = 0, loops = 0;
  let D = null, E = null, M = null, W = null;
  function flags(a, b, result, add) {
    cc = { z: result === 0n, s: Boolean(result & sign),
      o: add && Boolean((~(a ^ b) & (a ^ result)) & sign) };
  }
  while (++cycles < 10000) {
    if (W?.pc === 8) return { cycles, loops, rdi: regs.rdi };
    let branch = null;
    if (E) {
      let a, b, value;
      switch (E.pc) {
        case 0: regs.rax = 0n; flags(0n, 0n, 0n, false); break;
        case 1: regs.rsi = 1n; break;
        case 2: regs.r9 = regs.rsi; break;
        case 3:
          ++loops; regs.rsi ^= regs.r9;
          flags(0n, 0n, regs.rsi, false); break;
        case 4: {
          const condition = (cc.s !== cc.o) || cc.z;
          b = regs.rdi; a = mask; value = (a + b) & mask;
          flags(a, b, value, true);
          if (condition) regs.rdi = value;
          break;
        }
        case 5:
          a = regs.rax; b = regs.rdi; regs.rax = (a + b) & mask;
          flags(a, b, regs.rax, true); break;
        case 6: flags(0n, 0n, regs.rdi, false); break;
        case 7: branch = { taken: !cc.z }; break;
      }
    }
    if (M?.pc === 7 && M.taken === false) pc = 8;
    const stalledForRet = [D, E, M].some(i => i?.pc === 8);
    let fetched = null;
    if (!stalledForRet) {
      fetched = { pc };
      pc = pc === 7 ? 3 : pc + 1;
    }
    W = M; M = E && { ...E, ...branch };
    if (branch?.taken === false) { E = null; D = null; }
    else { E = D; D = fetched; }
  }
  throw new Error('small-word program did not terminate');
}

test('2024 final II: modulo decrement and PIPE branch recovery determine both cycle answers', () => {
  assert.match(loopQuestion.stem.text, /irmovq\s+\$1, %rsi/);
  assert.match(loopQuestion.stem.text, /xorq\s+%r9, %rsi\s+cdecle\s+%rdi/);
  assert.match(loopQuestion.stem.text, /\| PC Update \|[^\n]+\n\n2）/, 'part 2 must not become a GFM table row');
  // Exhaust every unsigned argument in small machines, including negative
  // signed bit patterns, rather than special-casing the reported x=0.
  for (let bits = 2; bits <= 8; ++bits) {
    for (let x = 0; x < 2 ** bits; ++x) {
      const trace = pipelineBar(bits, x);
      const decrements = x || 2 ** bits;
      assert.equal(trace.loops, 2 * decrements - 1, `bits=${bits}, x=${x}`);
      assert.equal(trace.rdi, 0n);
      assert.equal(trace.cycles, 3 + 5 * trace.loops + 1 + 4 + 2);
    }
  }
  assert.equal(pipelineBar(8, 3).cycles, 35);
  assert.equal(pipelineBar(8, 1).cycles, 15);
  const loops64 = 2n * (1n << 64n) - 1n;
  const cycles64 = 5n * loops64 + 10n;
  assert.equal(cycles64.toString(), '184467440737095516165');
  for (const value of [cycles64.toString(), ' 10 * 2 ^ 64 + 5 ', '5 * (2 ^ 65 - 1) + 10', '10 * 2 ** 64 + 5']) {
    assert.equal(api.gradeBlank(value, rule('cycles-x0')), true, value);
  }
  for (const value of ['15', '35', '无限', 'infinity', '10*2^64', (cycles64 - 1n).toString(), (cycles64 + 1n).toString()]) {
    assert.equal(api.gradeBlank(value, rule('cycles-x0')), false, value);
  }
  assert.equal(api.gradeBlank('35', rule('cycles-x3')), true);
  assert.equal(loopQuestion.stem.blanks.length, 9);
  assert.equal(loopQuestion.solution.blankAnswers.length, 9);
});

// Construct a concrete ten-byte family using the unused irmovq ifun values.
// This validates the report's counterexample without altering the explicit
// independent-icode scheme of the currently published question.
function sharedImmediate(fn, dst, value, cc) {
  const bytes = Buffer.alloc(10);
  bytes[0] = 0x30 | fn; bytes[1] = 0xf0 | dst;
  bytes.writeBigInt64LE(value, 2);
  const decodedFn = bytes[0] & 15;
  const slt = cc.s !== cc.o;
  const predicates = [true, slt || cc.z, slt, cc.z, !cc.z, !slt, !slt && !cc.z];
  assert.equal(bytes[0] >> 4, 3);
  assert.equal(bytes[1] >> 4, 15);
  return { bytes, value: bytes.readBigInt64LE(2), dst: predicates[decodedFn] ? bytes[1] & 15 : 15 };
}
test('2022 midterm I.14: shared irmovq encoding works, while the specified independent scheme keeps C', () => {
  const q = bank.find(q => q.id === 'q-808ef382fdee45fc');
  assert.match(q.stem.text, /分配独立的 `icode`/);
  assert.deepEqual(q.solution.correctOptionIds, ['C']);
  const example = sharedImmediate(1, 7, -12n, { s: false, o: false, z: true });
  assert.equal(example.bytes.toString('hex'), '31f7f4ffffffffffffff');
  assert.equal(example.value, -12n); assert.equal(example.dst, 7);
  assert.equal(sharedImmediate(1, 7, -12n, { s: false, o: false, z: false }).dst, 15);
  for (const s of [false, true]) for (const o of [false, true]) for (const z of [false, true]) {
    const cc = { s, o, z };
    assert.equal(sharedImmediate(0, 7, 123n, cc).dst, 7, 'old irmovq remains unconditional');
    for (let fn = 1; fn <= 6; ++fn) {
      const instruction = sharedImmediate(fn, 7, 123n, cc);
      assert.equal(instruction.bytes.length, 10);
      assert.equal(instruction.value, 123n);
      assert.ok(instruction.dst === 7 || instruction.dst === 15);
    }
  }
});
