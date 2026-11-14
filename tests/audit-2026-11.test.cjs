'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const api = require('../site/question-v5.js');
const bank = require('../question-bank/web-data/questions.json').questions.filter(q => q.publication.state === 'published');
const papers = require('../question-bank/authored/papers.json').papers;
const question = id => {
  const found = bank.find(q => q.id === id);
  assert.ok(found, 'published question: ' + id);
  return found;
};
const rule = (unit, id) => {
  const found = unit.solution.blankAnswers.find(r => r.blankId === id);
  assert.ok(found, 'graded blank: ' + id);
  return found;
};
const authored = id => {
  const paper = papers.find(p => p.questionIds.includes(id));
  assert.ok(paper, 'retained source record: ' + id);
  const text = fs.readFileSync(path.join(__dirname, '../question-bank/authored', paper.id, id + '.md'), 'utf8');
  return JSON.parse(text.slice('+++json'.length, text.indexOf('\n+++', '+++json'.length)));
};
const ordered = values => [...values].sort();

function structureSize(fields) {
  let offset = 0, largest = 1;
  for (const [bytes, alignment] of fields) {
    offset = Math.ceil(offset / alignment) * alignment + bytes;
    largest = Math.max(largest, alignment);
  }
  return Math.ceil(offset / largest) * largest;
}

test('2013 LP64 layout admits four coupled size solutions and preserves recursive side-effect order', () => {
  const q = question('q-6f4c44345bb516e8');
  const sizes = (n, m) => [structureSize([[n, 1], [8 * n, 8], [n, 1]]),
    structureSize([[4 * m, 4], [m, 1], [2 * m, 2]])];
  const solutions = [];
  // Larger positive lengths already exceed 76 bytes, under the stated no-wrap model.
  for (let n = 1; n <= 76; n++) for (let m = 1; m <= 76; m++) {
    const valid = sizes(n, m).reduce((a, b) => a + b, 0) === 76;
    if (valid) solutions.push([n, m]);
    assert.equal(api.gradeBlank(n + ',' + m, rule(q, 'n')), valid, `${n},${m}`);
  }
  assert.deepEqual(solutions, [[1, 7], [2, 6], [3, 5], [4, 4]]);
  for (const pair of solutions) {
    const freshFunction = () => {
      let [x, y] = sizes(...pair);
      const f = n => {
        if (n <= 1) return 1;
        if (n % 2 === 0) x++; else y++;
        const result = f(n - 1);
        return result + y + x;
      };
      return f;
    };
    const f = freshFunction();
    assert.deepEqual([f(1), f(2), f(3)].map(x => x.toString(16)), ['1', '4e', '9f']);
    const independentRun = freshFunction(), calls = [independentRun(2), independentRun(2)];
    for (const output of [calls, [...calls].reverse()])
      assert.equal(api.gradeBlank(output.map(x => x.toString(16)).join(', '), rule(q, 'twice-run')), true);
  }
  assert.equal(api.gradeBlank('4e, 4e', rule(q, 'twice-run')), false);
  assert.equal(api.gradeBlank('f(n-1)+x+y', rule(q, 'recursive-return')), false);
  assert.match(q.stem.text, /unsigned int r\s*=\s*f\(n\s*-\s*1\)/);
});

// Independent cache model: a line is identified by its full block number; the
// array in each set stores replacement order, not the published tags or keys.
function cacheTrace(addresses, blockBytes, setCount, ways) {
  const sets = Array.from({ length: setCount }, () => []);
  let misses = 0;
  for (const address of addresses) {
    const block = Math.floor(address / blockBytes), set = sets[block % setCount];
    const index = set.indexOf(block);
    if (index < 0) {
      misses++;
      if (set.length === ways) set.pop();
    } else set.splice(index, 1);
    set.unshift(block);
  }
  return { misses, sets: sets.map(set => [...set].sort((a, b) => a - b)) };
}

test('2015 column-first writes derive cache misses, aligned resident blocks and all 32 graded blanks', () => {
  const q = question('q-6422fce8a943ccfa'), [setAssociative, fullyAssociative] = q.parts;
  assert.equal(q.parts.reduce((n, p) => n + p.stem.blanks.length, 0), 32);
  for (const part of q.parts) assert.ok(part.solution.blankAnswers.every(r => r.method !== 'self'));
  for (const [part, base, setCount, ways, prefix, tagBits, expected] of [
    [setAssociative, 64, 4, 2, 's1', 3, [4, 16, 14]],
    [fullyAssociative, 128, 1, 4, 's2', 6, [4, 4, 7]],
  ]) {
    const runs = [8, 16, 17].map(length => {
      const addresses = [];
      for (let col = 0; col < 4; col++) for (let row = 0; row < 4; row++)
        addresses.push(base + row * length + col);
      assert.ok(addresses.every(a => a < 2 ** (tagBits + Math.log2(setCount) + 2)));
      return cacheTrace(addresses, 4, setCount, ways);
    });
    assert.deepEqual(runs.map(r => r.misses), expected);
    const number = prefix === 's1' ? '1' : '2';
    assert.ok(api.gradeBlank(String(runs[0].misses), rule(part, 'miss-' + number + 'a')));
    assert.ok(api.gradeBlank(String(runs[1].misses), rule(part, 'miss-' + number + 'b')));
    if (number === '1') assert.ok(api.gradeBlank(String(runs[2].misses), rule(part, 'miss-1c')));
    const comparison = runs[1].misses > runs[2].misses ? 'A' : runs[1].misses === runs[2].misses ? 'B' : 'C';
    assert.ok(api.gradeBlank(comparison, rule(part, 'desc-' + number)));
    const blocks = (number === '1' ? runs[2].sets.slice(0, 2) : runs[2].sets).flat();
    assert.equal(blocks.length, 4);
    blocks.forEach((block, index) => {
      const address = block * 4, tag = Math.floor(block / setCount).toString(2).padStart(tagBits, '0');
      assert.ok(api.gradeBlank('1', rule(part, `${prefix}-v${index}`)));
      assert.ok(api.gradeBlank(tag, rule(part, `${prefix}-tag${index}`)));
      assert.ok(api.gradeBlank(`M[${address}-${address + 3}]`, rule(part, `${prefix}-block${index}`)));
      assert.equal(api.gradeBlank(`M[${address + 1}-${address + 4}]`, rule(part, `${prefix}-block${index}`)), false,
        'a row segment is not necessarily a complete aligned cache block');
    });
  }
  assert.ok(api.gradeBlank('6', rule(fullyAssociative, 'tag-bits')));
});

function forkOutputs(parent, waitForChild = false) {
  const child = 'BD', outputs = new Set();
  const visit = (ci, pi, output) => {
    if (ci === child.length && pi === parent.length) { outputs.add('A' + output); return; }
    if (ci < child.length) visit(ci + 1, pi, output + child[ci]);
    if (pi < parent.length && !(waitForChild && pi === parent.length - 1 && ci !== child.length))
      visit(ci, pi + 1, output + parent[pi]);
  };
  visit(0, 0, '');
  return outputs;
}

test('2013 fork answer lists equal all independent process interleavings, including the wait edge', () => {
  const part = question('q-a694e52c9a6493d6').parts.find(p => p.id === 'q-f53b15929aeee7a3');
  for (const [id, actual, count] of [
    ['outputs-empty', forkOutputs('CD'), 4],
    ['outputs-wait', forkOutputs('CD', true), 3],
    ['outputs-extra', forkOutputs('CED'), 7],
  ]) {
    const answer = rule(part, id), blank = part.stem.blanks.find(b => b.id === id);
    assert.equal(actual.size, count);
    assert.deepEqual(ordered(answer.correctValues), ordered(actual));
    assert.equal(blank.input.kind, 'select'); assert.equal(blank.input.multiple, true);
    assert.ok([...actual].every(output => blank.input.options.some(o => o.value === output)));
    assert.equal(api.gradeBlank([...actual], answer), true);
    assert.equal(api.gradeBlank([...actual].slice(1), answer), false);
    assert.equal(api.gradeBlank([...actual, 'ADCBD'], answer), false);
  }
  assert.ok(forkOutputs('CD').has('ACDBD'));
  assert.equal(forkOutputs('CD', true).has('ACDBD'), false, 'parent D must wait for child D');
});

test('IA32 recursive page-table addressing removes all 12 offset bits before scaling the PTE index', () => {
  const q = question('q-d4217f1e765bf0d4'), uvpt = 0xef400000, recursiveIndex = uvpt >>> 22;
  assert.ok(api.gradeBlank('12', rule(q, 'pte_shift')));
  assert.equal(api.gradeBlank('10', rule(q, 'pte_shift')), false);
  assert.ok(api.gradeBlank('UVPT >> 10', rule(q, 'pde_uvpt_offset')));
  assert.match(q.stem.text, /PGNUM\s*\*\s*4/);
  for (const va of [0, 0xfff, 0x12345000, 0x12345c00, 0x12345fff, 0xffffffff]) {
    const vpn = va >>> 12, pteAddress = (uvpt + vpn * 4) >>> 0;
    // Recursive directory points to itself: [recursiveIndex][original PDX]
    // locates the original page-table frame, with 4-byte original PTX offset.
    assert.equal(pteAddress >>> 22, recursiveIndex);
    assert.equal((pteAddress >>> 12) & 1023, va >>> 22);
    assert.equal(pteAddress & 4095, ((va >>> 12) & 1023) * 4);
    const pdeAddress = (uvpt + recursiveIndex * 4096 + (va >>> 22) * 4) >>> 0;
    assert.equal(pdeAddress >>> 22, recursiveIndex);
    assert.equal((pdeAddress >>> 12) & 1023, recursiveIndex);
    assert.equal(pdeAddress & 4095, (va >>> 22) * 4);
  }
  assert.equal((0x12345c00 >>> 12) * 4, 0x48d14);
  assert.notEqual(0x12345c00 >>> 10, 0x48d14, 'shifting by 10 leaks page-offset bits into the PTE address');
});

test('2020 n=512 TLB keys follow row-page reuse and reject the old six simulation errors', () => {
  const q = question('q-36cdda52cd922bd2'), n = 512n;
  const totals = [n ** 3n + n ** 2n + n, n ** 3n + 2n * n ** 2n,
    2n * n ** 3n + n ** 2n, 2n * n ** 3n + n ** 2n, 2n * n ** 2n + n, n ** 2n + 2n * n];
  const old = ['266436157', '268661500', '252182591', '252182591', '235241284', '521528'];
  assert.deepEqual(totals.map(String), ['134480384', '134742016', '268697600', '268697600', '524800', '263168']);
  totals.forEach((total, i) => {
    const answer = rule(q, `b512-r4-c${i + 2}`);
    assert.equal(api.gradeBlank(String(total), answer), true);
    assert.equal(api.gradeBlank(old[i], answer), false);
  });
  assert.equal(api.gradeBlank(String(3n * n * n / 512n), rule(q, 'b512-r4-c1')), true);
  for (const [size, row] of [[8, 1], [16, 2], [64, 3]]) {
    const pages = Math.ceil(3 * size * size / 512);
    assert.ok(pages <= 64, 'all row pages fit in the cold full-associative TLB');
    for (let col = 1; col <= 7; col++) assert.ok(api.gradeBlank(String(pages), rule(q, `b${size}-r${row}-c${col}`)));
  }
});

test('retired source questions and duplicate drafts remain backed up but do not enter published papers', () => {
  for (const id of ['q-31ee90deffa851b8', 'q-22e21e814eafb32d']) {
    const q = authored(id);
    assert.equal(q.publication.state, 'review');
    assert.ok(q.publication.issues.includes('retired-invalid-question'));
    assert.equal(bank.some(item => item.id === id), false);
  }
  const paper = papers.find(p => p.id === 'p-2c2b56c4452255b1');
  const duplicates = paper.questionIds.map(authored).filter(q => q.publication.issues.includes('duplicate-source-question'));
  assert.equal(duplicates.length, 26);
  for (const q of duplicates) {
    const canonicalId = q.publication.issues.find(s => s.startsWith('duplicate-of:')).slice('duplicate-of:'.length);
    assert.equal(q.publication.state, 'review');
    assert.equal(bank.some(item => item.id === q.id), false);
    assert.equal(question(canonicalId).publication.state, 'published');
  }
  const recursiveJump = question('q-bcf23ec71ae6c080');
  assert.equal(recursiveJump.parts.some(p => p.id === 'q-46ca868fd841b060'), false);
  assert.ok(fs.existsSync(path.join(__dirname, '../question-bank/backups/2021-mid-indirect-jump-original.md')));
});

test('2020 deadlock prefixes agree with all reachable finite completions, not only immediate blocking', () => {
  const code = [
    [['P','a'],['P','b'],['P','d'],['P','c'],['V','d'],['V','a'],['V','b'],['V','c']],
    [['P','c'],['P','b'],['V','c'],['V','b'],['P','a'],['V','a']],
    [['P','d'],['P','a'],['V','d'],['P','b'],['V','a'],['V','b']],
  ];
  const ids = [[1,2,3,4,5,6,7,8],[9,10,11,12,13,14],[15,16,17,18,19,20]];
  const step = (state, thread) => {
    const instruction = code[thread][state.pc[thread]];
    if (!instruction) return null;
    const [operation, name] = instruction;
    if (operation === 'P' && state.semaphores[name] === 0) return null;
    const next = { pc: [...state.pc], semaphores: { ...state.semaphores } };
    next.pc[thread]++; next.semaphores[name] += operation === 'P' ? -1 : 1;
    return next;
  };
  const outcomes = (state, memo = new Map()) => {
    const key = JSON.stringify(state);
    if (memo.has(key)) return memo.get(key);
    if (state.pc.every((pc, i) => pc === code[i].length)) return new Set(['complete']);
    const next = code.map((_, thread) => step(state, thread)).filter(Boolean);
    const result = new Set(next.length ? next.flatMap(s => [...outcomes(s, memo)]) : ['deadlock']);
    memo.set(key, result); return result;
  };
  const prefixes = { A:[9,1,10,2,11,15], B:[1,9,10,2,15,16], C:[15,1,9,10,16,2], D:[1,2,3,4,9,15] };
  for (const [answer, prefix] of Object.entries(prefixes)) {
    let state = { pc:[0,0,0], semaphores:{ a:1,b:1,c:1,d:1 } };
    for (const id of prefix) {
      const thread = ids.findIndex(list => list.includes(id));
      assert.equal(ids[thread][state.pc[thread]], id);
      state = step(state, thread) || state; // an attempted blocking P does not advance its PC
    }
    assert.deepEqual([...outcomes(state)], answer === 'D' ? ['complete'] : ['deadlock']);
  }
  const q = question('q-4fc7a18df82a3d2a');
  assert.equal(q.type, 'multiple-choice');
  assert.equal(api.gradeChoice(['A','B','C'], q.solution), true);
  assert.equal(api.gradeChoice(['B'], q.solution), false);
});
