'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = process.env.ICS_AUDIT_REPO_ROOT || path.join(__dirname, '..');
const api = require(path.join(root, 'site/question-v5.js'));
const papers = require(path.join(root, 'question-bank/authored/papers.json')).papers;
const compiled = require(path.join(root, 'question-bank/web-data/questions.json')).questions;
function source(id) {
  const paper = papers.find(p => p.questionIds.includes(id));
  assert.ok(paper, 'retained authored question: ' + id);
  const text = fs.readFileSync(path.join(root, 'question-bank/authored', paper.id, id + '.md'), 'utf8');
  const end = text.indexOf('\n+++', 7);
  return { meta: JSON.parse(text.slice(7, end)), text: text.slice(end + 4) };
}
function answer(q, id) {
  const value = q.solution.blankAnswers.find(r => r.blankId === id);
  assert.ok(value, 'graded blank: ' + id);
  return value;
}
const sorted = values => [...values].sort();

// Transcribed from the source image, independently of reference prose/keys.
// A branch is a dependency, so it participates in path enumeration exactly like
// a horizontal edge. In particular, A-F and C-H cannot be silently omitted.
const units = { A:60, B:30, C:30, D:40, E:20, F:60, G:40, H:30 };
const edges = ['AB', 'BC', 'CD', 'EF', 'FG', 'GH', 'AF', 'CH'];
function inputOutputPaths() {
  const paths = [];
  function visit(node, prefix) {
    const next = edges.filter(e => e[0] === node).map(e => e[1]);
    const current = prefix.concat(node);
    if (!next.length) paths.push(current);
    else for (const successor of next) visit(successor, current);
  }
  for (const node of Object.keys(units).filter(n => edges.every(e => e[1] !== n))) visit(node, []);
  return paths;
}
function scheduleCost(level, stages) {
  if (level.A !== 0 || level.E !== 0 || level.D !== stages - 1 || level.H !== stages - 1 ||
      edges.some(e => level[e[0]] > level[e[1]])) return null;
  let maximum = 0;
  for (const route of inputOutputPaths()) {
    let previous = -1, subtotal = 0;
    for (const node of route) {
      if (level[node] !== previous) subtotal = 0;
      subtotal += units[node];
      maximum = Math.max(maximum, subtotal);
      previous = level[node];
    }
  }
  // A source/output path must see one register per boundary; an edge skipping
  // levels requires multiple physical registers, even if its endpoints differ.
  const registers = edges.flatMap(edge => Array.from({ length:level[edge[1]] - level[edge[0]] },
    (_, offset) => ({ edge, boundary:level[edge[0]] + offset + 1 })));
  return { period: maximum + 10, registers };
}
function pipelineOptima(stages, count = null) {
  const names = Object.keys(units), optimal = [];
  let minimum = Infinity;
  for (let encoding = 0; encoding < stages ** names.length; encoding++) {
    let rest = encoding;
    const level = Object.fromEntries(names.map(name => {
      const digit = rest % stages; rest = Math.floor(rest / stages); return [name, digit];
    }));
    const cost = scheduleCost(level, stages);
    if (!cost || (count !== null && cost.registers.length !== count)) continue;
    if (cost.period < minimum) { minimum = cost.period; optimal.length = 0; }
    if (cost.period === minimum) optimal.push({ level, ...cost });
  }
  return { minimum, optimal };
}
function pathRegisterTotals(solution, stages) {
  return inputOutputPaths().map(route => {
    const routeEdges = route.slice(1).map((node, i) => route[i] + node);
    // The diagram's existing output register is included in every path.
    return 1 + solution.registers.filter(r => routeEdges.includes(r.edge)).length;
  });
}

test('2017 pipeline examines every dynamic dependency path and proves both stage minima', () => {
  assert.deepEqual(sorted(inputOutputPaths().map(p => p.join(''))), ['ABCD','ABCH','AFGH','EFGH']);
  const two = pipelineOptima(2), three = pipelineOptima(3), restricted = pipelineOptima(2, 2);
  assert.equal(two.minimum, 130); assert.equal(two.optimal.length, 3);
  assert.equal(restricted.minimum, 130); assert.equal(restricted.optimal.length, 2);
  assert.deepEqual(sorted(restricted.optimal.map(s => sorted(s.registers.map(r => r.edge)).join(','))),
    ['AB,FG', 'BC,FG']);
  assert.equal(three.minimum, 80); assert.equal(three.optimal.length, 2);
  for (const stages of [2, 3]) for (const plan of pipelineOptima(stages).optimal)
    assert.deepEqual(pathRegisterTotals(plan, stages), Array(4).fill(stages), 'all branches carry the same item');
  const oldTwo = scheduleCost({ A:0,B:0,C:1,D:1,E:0,F:0,G:1,H:1 }, 2);
  assert.equal(oldTwo.period, 130, 'A-F contributes 120ps, then a 10ps register');
  assert.notEqual(oldTwo.period, 100);
  const threeCuts = three.optimal.map(s => sorted(s.registers.map(r => r.edge)));
  assert.ok(threeCuts.every(cuts => cuts.includes('AF')), 'A-F must synchronize at boundary one');
  const oldCuts = ['AB','BC','EF','FG'];
  const unbalanced = inputOutputPaths().map(route => 1 + route.slice(1).filter((n, i) => oldCuts.includes(route[i] + n)).length);
  assert.notEqual(new Set(unbalanced).size, 1, 'old four-edge split mixes different data items');
  const skippedLevel = scheduleCost({ A:0,B:1,C:2,D:2,E:0,F:2,G:2,H:2 }, 3);
  assert.equal(skippedLevel.registers.filter(r => r.edge === 'AF').length, 2);
  assert.deepEqual(pathRegisterTotals(skippedLevel, 3), [3,3,3,3], 'skip-level edges need a register at both boundaries');
});

// Each arithmetic operation has separate shared-memory read and write events.
// All scheduler branches are visited; successful P decrements atomically, while
// blocked P leaves the thread at that instruction. No scheduler fairness claim
// is inferred from a single successful trace.
function pvOutcomes(slots) {
  const program = [0,1,2].map(t => [slots[t * 2], 'read', 'write', slots[t * 2 + 1]]);
  const visit = (pc, sem, x, saved, writes) => {
    const key = JSON.stringify([pc, sem, x, saved, writes]);
    if (seen.has(key)) return;
    seen.add(key);
    if (pc.every(p => p === 4)) { finals.add(x); orders.add(writes); return; }
    let enabled = 0;
    for (let t = 0; t < 3; t++) {
      if (pc[t] === 4) continue;
      const op = program[t][pc[t]], index = Number(op[1]) - 1;
      if (op[0] === 'p' && sem[index] === 0) continue;
      enabled++;
      const nextPc = [...pc], nextSem = [...sem], nextSaved = [...saved];
      nextPc[t]++;
      let nextX = x, nextWrites = writes;
      if (op === 'read') nextSaved[t] = x;
      else if (op === 'write') {
        nextX = [v => v * 5, v => v + 3, v => Math.trunc(v / 2)][t](saved[t]);
        nextWrites += t + 1;
      } else if (op[0] === 'p') nextSem[index]--;
      else if (op[0] === 'v') nextSem[index]++;
      else assert.equal(op, 'none');
      visit(nextPc, nextSem, nextX, nextSaved, nextWrites);
    }
    if (!enabled) deadlock = true;
  };
  const seen = new Set(), finals = new Set(), orders = new Set();
  let deadlock = false;
  visit([0,0,0], [1,0,0], 1, [null,null,null], '');
  return { finals:sorted(finals), orders:sorted(orders), deadlock };
}

test('2017 semaphore design admits both integer-operation orders, multiple protocols and split RMW scheduling', () => {
  const operations = { 1:v=>v*5, 2:v=>v+3, 3:v=>Math.trunc(v/2) };
  const permutations = ['123','132','213','231','312','321'];
  const good = permutations.filter(order => [...order].reduce((x, t) => operations[t](x), 1) === 10);
  assert.deepEqual(good, ['213','231']);
  for (const [slots, order] of [
    [['p2','v3','p1','v2','p3','none'], '213'],
    [['p2','v3','none','v2','p3','none'], '213'],
    [['p3','none','p1','v2','p2','v3'], '231'],
    [['p3','none','none','v2','p2','v3'], '231'],
    [['p3','v2','none','v3','p2','v1'], '213'],
  ]) assert.deepEqual(pvOutcomes(slots), { finals:[10], orders:[order], deadlock:false });
  const unsynchronized = pvOutcomes(Array(6).fill('none'));
  assert.ok(unsynchronized.finals.includes(10));
  assert.ok(unsynchronized.finals.some(x => x !== 10), 'one successful schedule does not make a protocol correct');
  assert.ok(pvOutcomes(['p2','v3','p3','v2','p1','none']).deadlock,
    'a finite all-blocked state violates the termination requirement');
});

test('2017 pipeline grading follows the independent minima and keeps whole three-stage designs self assessed', () => {
  const q = source('q-78daa36a28b35c57').meta;
  assert.equal(q.publication.state, 'published');
  for (const cut of ['A-B','B-C']) assert.equal(api.gradeBlank(cut, answer(q, 'two-stage-cut-1')), true);
  assert.equal(api.gradeBlank('C-D', answer(q, 'two-stage-cut-1')), false,
    'CD/FG alone omits a required CH synchronizing register');
  assert.equal(api.gradeBlank('F-G', answer(q, 'two-stage-cut-2')), true);
  assert.equal(api.gradeBlank('A→F', answer(q, 'two-stage-path')), true);
  assert.equal(api.gradeBlank('A→B', answer(q, 'two-stage-path')), false,
    'the old main-chain-only answer misses the longer cross-chain dependency');
  for (const [id, correct, wrong] of [
    ['two-stage-delay', '130ps', '100ps'], ['two-stage-rate', '1/130', '1/100'],
    ['three-stage-delay', '80ps', '70ps'], ['three-stage-rate', '1/80', '1/70'],
  ]) {
    assert.equal(api.gradeBlank(correct, answer(q, id)), true, id);
    assert.equal(api.gradeBlank(wrong, answer(q, id)), false, id);
  }
  const wholeDesign = answer(q, 'three-stage-cuts');
  assert.equal(wholeDesign.method, 'self');
  assert.equal(api.gradeBlank('AB BC EF FG AF', wholeDesign), null);
  const partial = Object.fromEntries(q.solution.blankAnswers.filter(r => r.method === 'exact')
    .map(r => [r.blankId, r.acceptedAnswers[0]]));
  assert.equal(api.gradeBlanks({ ...partial, 'three-stage-cuts':'AB BC EF FG' }, q.solution), null,
    'seven correct numeric/edge blanks cannot validate an unsynchronized subjective design');
});

test('2017 semaphore submission is judged as a whole protocol instead of independent fixed slots', () => {
  const { meta:q, text } = source('q-24598d7deeb69df7');
  assert.equal(q.publication.state, 'published');
  assert.equal(q.type, 'short-answer'); assert.equal(q.solution.grading, 'self');
  assert.equal((q.stem.blanks || []).length, 0);
  assert.equal((q.solution.blankAnswers || []).length, 0);
  assert.equal(api.gradeBlanks({ 'slot-3':'none' }, q.solution), null);
  assert.doesNotMatch(text, /执行顺序必须为线程\s*2\s*→\s*线程\s*1\s*→\s*线程\s*3/);
});

// The signal timing is an explicit teaching-model assumption: the one signal
// sent to each fork branch is handled before its read. A read and its later
// printf remain different events. Child continuation is recursively expanded;
// wait constrains the parent's next iteration, not the order of the two lines.
function forkOutputGraph(iterations, childExits, a, b) {
  const events = [];
  const increment = (counters, signal) => counters.map((value, i) => value + (i === signal ? 1 : 0));
  function line(counters, after) {
    const index = events.length;
    events.push({ kind:'read', after, counters, slot:index });
    events.push({ kind:'print', after:[index], counters, slot:index });
    return index + 1;
  }
  function process(remaining, counters, after) {
    if (!remaining) return after;
    const parentCounters = increment(counters, b), childCounters = increment(counters, a);
    const parentPrint = line(parentCounters, after), childPrint = line(childCounters, after);
    const childDone = childExits ? [childPrint] : process(remaining - 1, childCounters, [childPrint]);
    return process(remaining - 1, parentCounters, [parentPrint, ...childDone]);
  }
  process(iterations, [1,1], []);
  return events;
}
function forkLastLines(events) {
  const number = '123456789012345678901234567890', letter = 'abcdefghijklmnopqrstuvwxyz';
  const finals = new Set(), seen = new Set(), complete = 2 ** events.length - 1;
  function visit(mask, offset, buffers, last) {
    // The read subset determines the shared offset, so it need not be repeated
    // in the memo key. Printed buffers can be discarded; they are private.
    const key = JSON.stringify([mask, buffers, last]);
    if (seen.has(key)) return;
    seen.add(key);
    if (mask === complete) { finals.add(last); return; }
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if ((mask & 2 ** i) || event.after.some(parent => !(mask & 2 ** parent))) continue;
      const next = [...buffers];
      let nextOffset = offset, nextLast = last;
      if (event.kind === 'read') {
        next[event.slot] = number.slice(offset, offset + event.counters[0]);
        nextOffset += event.counters[0];
      } else {
        nextLast = next[event.slot] + ' ' + letter.slice(0, event.counters[1]);
        next[event.slot] = null;
      }
      visit(mask | 2 ** i, nextOffset, next, nextLast);
    }
  }
  assert.ok(events.length < 31, 'bit-mask enumeration is deliberately bounded to the two source scenarios');
  visit(0, 0, [], null);
  return sorted(finals);
}

test('2017 finite fork trees terminate and permit reading before another process prints its final line', () => {
  for (const [n, exits] of [[2,false],[3,true]]) {
    for (const [a,b] of [[0,0],[0,1],[1,0],[1,1]]) {
      const graph = forkOutputGraph(n, exits, a, b);
      assert.equal(graph.filter(e => e.kind === 'print').length, 6);
      assert.equal(forkLastLines(graph).length, a === b ? 2 : 4);
      const totalRead = graph.filter(e => e.kind === 'read').reduce((total, e) => total + e.counters[0], 0);
      assert.equal(totalRead, exits ? 6 + 3 * (a === 0) + 9 * (b === 0) : 6 + 5 * (a === 0) + 5 * (b === 0));
    }
  }
  assert.ok(forkLastLines(forkOutputGraph(2, false, 0, 1)).includes('9 abc'),
    'parent can read 9, child reads 01 and prints, then parent prints last');
  assert.ok(forkLastLines(forkOutputGraph(3, true, 1, 0)).includes('9012 a'),
    'last printed bytes need not be the bytes at the final shared offset');
});

test('2017 fork finite line counts and complete multi-selection keys equal all reachable terminal lines', () => {
  const q = source('q-46374f8a549b7cd5').meta;
  assert.equal(q.publication.state, 'published');
  for (const scenario of ['n2','n3']) {
    assert.equal(api.gradeBlank('6', answer(q, scenario + '-lines')), true);
    assert.equal(api.gradeBlank('无穷多', answer(q, scenario + '-lines')), false);
  }
  for (const [scenario,n,exits] of [['n2',2,false],['n3',3,true]]) {
    for (const [suffix,a,b] of [['aa',0,0],['ab',0,1],['ba',1,0],['bb',1,1]]) {
      const id = scenario + '-' + suffix, rule = answer(q, id);
      const blank = q.stem.blanks.find(item => item.id === id);
      assert.ok(blank, id);
      assert.equal(blank.input.kind, 'select'); assert.equal(blank.input.multiple, true);
      const actual = forkLastLines(forkOutputGraph(n, exits, a, b));
      const options = blank.input.options.filter(option => actual.includes(option.label));
      assert.deepEqual(sorted(options.map(option => option.label)), actual, 'all reachable lines have options: ' + id);
      const correct = options.map(option => option.value);
      assert.equal(rule.method, 'selection');
      assert.deepEqual(sorted(rule.correctValues), sorted(correct), id);
      assert.equal(api.gradeBlank(correct, rule), true);
      assert.equal(api.gradeBlank(correct.slice(1), rule), false, 'missing a reachable terminal line: ' + id);
      const extra = blank.input.options.find(option => !actual.includes(option.label));
      assert.equal(api.gradeBlank([...correct, extra ? extra.value : '__unreachable_line__'], rule), false, id);
      assert.equal(api.gradeBlank('调度相关', rule), false, 'a generic scheduling claim is not a complete output set');
    }
  }
});

function revisedLoopTrace() {
  let counter = 0, pointer = 0x8008, pc = 0, zero = false;
  const trace = [];
  do {
    const event = { pc, reads:[], writes:[] };
    switch (pc) {
      case 0: event.reads = ['rdi']; event.writes = ['rbx']; event.address = pointer; event.load = true; break;
      case 2: event.reads = ['rbx','rax']; event.writes = ['rax']; break;
      case 4: event.reads = ['rdi']; event.writes = ['rdi']; pointer += 8; break;
      case 6: event.reads = ['rcx']; event.writes = ['rcx']; counter++; break;
      case 8: event.reads = ['rcx']; event.writes = ['cc']; zero = counter - 8 === 0; break;
      case 10: event.reads = ['cc']; break;
      default: assert.fail('unexpected instruction address');
    }
    trace.push(event);
    pc = pc === 10 && !zero ? 0 : pc + 2;
    assert.ok(trace.length <= 100, 'the revised loop must terminate');
  } while (pc !== 12);
  return trace;
}
function executionTimings(trace) {
  const available = new Map();
  let previousExecute = 2;
  return trace.map(instruction => {
    const execute = Math.max(previousExecute + 1, ...instruction.reads.map(r => available.get(r) || 0));
    for (const register of instruction.writes) available.set(register, execute + (instruction.load ? 2 : 1));
    previousExecute = execute;
    return { ...instruction, execute, writeback:execute + 2 };
  });
}
function directMappedEvents(addresses) {
  const tags = new Map();
  return addresses.map(address => {
    const block = Math.floor(address / 32), index = block % 1024;
    const event = tags.get(index) === block ? 'H' : 'M';
    tags.set(index, block); return event;
  });
}

test('2020 revised compare loop has independently scheduled load stalls and separate cache traces', () => {
  const trace = revisedLoopTrace(), timings = executionTimings(trace);
  assert.equal(trace.length, 48);
  const loads = timings.filter(t => t.load);
  assert.deepEqual(loads.map(t => t.address), [0x8008,0x8010,0x8018,0x8020,0x8028,0x8030,0x8038,0x8040]);
  assert.ok(loads.every(t => Math.floor(t.address / 32) === Math.floor((t.address + 7) / 32)),
    'each eight-byte data access is contained in one cache block');
  assert.ok(trace.every(t => Math.floor(t.pc / 32) === Math.floor((t.pc + 1) / 32)),
    'each two-byte abstract instruction is contained in one cache block');
  assert.equal(timings.at(-1).writeback, 60);
  assert.equal(timings.filter((t, i) => i && t.execute - timings[i - 1].execute === 2).length, 8);
  assert.equal(loads.at(-1).execute, 52); assert.equal(timings.at(-1).execute, 58);
  const instructions = directMappedEvents(trace.map(t => t.pc));
  const data = directMappedEvents(loads.map(t => t.address));
  assert.equal(instructions.filter(e => e === 'H').length, 47);
  assert.equal(data.join(''), 'MHHMHHHM');
  assert.equal(data.filter(e => e === 'H').length, 5);
  const extraCycles = [...instructions, ...data].reduce((n, e) => n + (e === 'M' ? 10 - 1 : 0), 0);
  assert.equal(timings.at(-1).writeback + extraCycles, 96);
  // XOR writes its result back. Exhaust small word sizes instead of assuming
  // that the comparison counter or its eight-iteration trace still applies.
  for (const width of [4,5,8,12]) {
    const modulus = 2 ** width;
    let value = 0, steps = 0;
    const visited = new Set();
    do {
      assert.equal(visited.has(value), false);
      visited.add(value); value = ((value + 1) % modulus) ^ 8; steps++;
    } while (value !== 0 && steps <= modulus);
    assert.equal(steps, modulus); assert.equal(visited.size, modulus);
  }
  let originalCounter = 0n;
  for (let i = 0; i < 8; i++) originalCounter = BigInt.asUintN(64, originalCounter + 1n) ^ 8n;
  assert.equal(originalCounter, 24n); assert.notEqual(originalCounter, 0n);
});

test('2020 published grading applies to the explicitly revised compare version while retaining original XOR', () => {
  const { meta:q, text } = source('q-19c4d964d98fc677');
  assert.equal(q.publication.state, 'published');
  assert.match(text, /0x008\s+cmpq\s+\$8,\s*%rcx/);
  assert.match(text, /未找到2020年官方勘误/);
  const backup = fs.readFileSync(path.join(root, 'question-bank/backups/2020-final-pipeline-original.md'), 'utf8');
  assert.match(backup, /0x008\s+xorq\s+\$8,\s*%rcx/);
  const parts = Object.fromEntries(q.parts.map(p => [p.id, p]));
  const period = Math.max(8,5,9,8,4) + 1;
  assert.equal(api.gradeBlank(String(period), answer(parts['q-83dd71fdca4ab2d3'], 'legacy-gap-0')), true);
  assert.equal(api.gradeBlank('60', answer(parts['q-216b79eb6ccbcf5b'], 'legacy-gap-0')), true);
  assert.equal(api.gradeBlank('62', answer(parts['q-216b79eb6ccbcf5b'], 'legacy-gap-0')), false);
  for (const [index, correct, wrong] of [[0,47,48],[1,5,6],[2,96,100]]) {
    const rule = answer(parts['q-6e8b718edb015123'], 'legacy-gap-' + index);
    assert.equal(api.gradeBlank(String(correct), rule), true);
    assert.equal(api.gradeBlank(String(wrong), rule), false);
  }
});

test('network choices reject every incomplete or extra subset and private subnets include their boundary addresses', () => {
  const address = dotted => dotted.split('.').reduce((value, octet) => value * 256n + BigInt(octet), 0n);
  const interval = cidr => {
    const [dotted, prefix] = cidr.split('/'), start = address(dotted), size = 1n << BigInt(32 - Number(prefix));
    assert.equal(start % size, 0n, 'test subnet starts at its network boundary');
    return { start, end:start + size - 1n };
  };
  const privateRanges = ['10.0.0.0/8','172.16.0.0/12','192.168.0.0/16'].map(interval);
  const isPrivate = value => privateRanges.some(range => value >= range.start && value <= range.end);
  for (const range of privateRanges) {
    assert.equal(isPrivate(range.start), true); assert.equal(isPrivate(range.end), true);
    assert.equal(isPrivate(range.start - 1n), false); assert.equal(isPrivate(range.end + 1n), false);
  }
  const subnets = ['10.0.0.0/12','172.16.0.0/16','192.168.0.0/20'].map(interval);
  const contained = subnets.every(subnet => privateRanges.some(range =>
    subnet.start >= range.start && subnet.end <= range.end));
  assert.equal(contained, true);
  for (const subnet of subnets) {
    assert.equal(isPrivate(subnet.start), true); assert.equal(isPrivate(subnet.end), true);
  }
  const network = source('q-99e5e4f1f599db68'), gateway = source('q-a7e7d2984076c296');
  assert.equal(network.meta.type, 'multiple-choice');
  assert.match(network.text, /常规内核TCP\/IP实现与IPv4单播/);
  assert.match(network.text, /D\s*包含\s*HTTP\/1\.0\s*的\s*Keep-Alive\s*扩展/);
  assert.equal(gateway.meta.type, 'single-choice');
  assert.match(gateway.text, /题库勘误/); assert.match(gateway.text, /新增\s*E/);
  assert.match(gateway.text, /%%% option: E\s+协议转换网关/);
  // HTTP/1.0 can explicitly negotiate Keep-Alive; the three F prefixes need
  // only be contained in private space, not equal the complete reserved blocks.
  // Heterogeneous application stacks require the newly explicit conversion
  // gateway, rather than ordinary packet forwarding by the original C router.
  for (const [q, truth] of [[network.meta, new Set(contained ? ['D','F'] : ['D'])],
    [gateway.meta, new Set(['E'])]]) {
    assert.equal(q.publication.state, 'published');
    const choices = q.options.map(option => option.id);
    for (let mask = 0; mask < 2 ** choices.length; mask++) {
      const selected = choices.filter((_, i) => mask & 2 ** i);
      const valid = selected.length === truth.size && selected.every(choice => truth.has(choice));
      assert.equal(api.gradeChoice(selected, q.solution), valid, q.id + ': ' + selected.join(','));
    }
  }
});

test('underdetermined VM/address sources and explicitly retired questions remain excluded from publication', () => {
  for (const id of ['q-ec77a14af219f706','q-f5038dc497e7b201','q-622ae65ab616a110']) {
    const { meta:q } = source(id);
    assert.equal(q.publication.state, 'review', id);
    assert.equal(compiled.some(p => p.id === id && p.publication.state === 'published'), false, id);
  }
  assert.ok(source('q-622ae65ab616a110').meta.publication.issues.includes('retired-invalid-question'));
  const vm = source('q-ec77a14af219f706').meta;
  assert.equal(0xA00 / 8, 0x140, 'the load reads right-hand page-table entry 0x140');
  const pte = (0x4801n << 12n) | 0x63n;
  const frame = (pte >> 12n) & ((1n << 40n) - 1n);
  assert.equal(api.gradeBlank('0x' + frame.toString(16), answer(vm, 'p1-a')), true);
  assert.equal(api.gradeBlank('0x4812', answer(vm, 'p1-a')), false,
    'the physical page containing the PTE is different from the frame stored in that PTE');
  assert.ok(vm.solution.blankAnswers.filter(r => r.blankId !== 'p1-a').every(r => r.method === 'self'),
    'undefined memory-source value and translation conditions cannot retain numeric/relationship keys');
  // A+5000*sizeof(int) preserves 4-byte alignment; neither an address-width
  // change nor treating a PTE's low flags as an offset resolves the source.
  assert.equal((5000 * 4) % 4, 0);
  assert.notEqual(0xC3F50D % 4, 0);
  assert.notEqual(6 + 10 + 12, 24);
});
