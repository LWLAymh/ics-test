'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { create, PREFIX } = require('../site/attempt-counts.js');
const first = '00000000-0000-4000-8000-000000000001';
const second = '00000000-0000-4000-8000-000000000002';
function record(extra = {}) {
  return { version: 1, questionId: 'q-1234567890abcdef', revision: 2,
    answeredAt: '2026-10-11T05:00:00.000Z', points: 0, mode: 'auto', answer: 'n != 1', ...extra };
}
function storage() {
  const values = new Map();
  return {
    get length() { return values.size; },
    key(index) { return Array.from(values.keys())[index] || null; },
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
    clear() { values.clear(); },
  };
}
test('completed attempts persist; the same attempt is idempotent, a new one counts again', () => {
  const db = storage(), counter = create(() => db);
  assert.equal(counter.refresh().count, 0);
  assert.equal(counter.add(first).count, 1);
  assert.equal(counter.add(first).count, 1);
  assert.equal(counter.add(second).count, 2);
  assert.deepEqual(create(() => db).refresh(), { count: 2, persistent: true });
});
test('parallel tabs do not lose increments; clearing browser data resets the count', () => {
  const db = storage(), a = create(() => db), b = create(() => db);
  a.refresh(); b.refresh(); a.add(first); b.add(second);
  assert.equal(a.refresh().count, 2);
  assert.equal(b.refresh().count, 2);
  db.clear(); assert.equal(a.refresh().count, 0);
});
test('ignore other browser settings and malformed ledger entries', () => {
  const db = storage();
  db.setItem('ics-question-mastery-v1', '1'); db.setItem(PREFIX + 'not-an-id', '1');
  db.setItem(PREFIX + first, 'corrupt');
  assert.equal(create(() => db).refresh().count, 0);
  assert.throws(() => create(() => db).add('invalid'), /Invalid attempt ID/);
});
test('blocked storage and quota failures retain an explicit temporary count', () => {
  const blocked = create(() => { throw new Error('blocked'); });
  assert.deepEqual(blocked.refresh(), { count: 0, persistent: false });
  assert.deepEqual(blocked.add(first), { count: 1, persistent: false });
  assert.equal(blocked.refresh().count, 1);
  const db = storage(), counter = create(() => db);
  counter.add(first);
  const set = db.setItem;
  db.setItem = () => { throw new Error('quota'); };
  assert.deepEqual(counter.add(second), { count: 2, persistent: false });
  assert.deepEqual(counter.refresh(), { count: 2, persistent: false });
  db.setItem = set;
  assert.deepEqual(counter.add(second), { count: 2, persistent: true });
});

test('detailed records coexist with old counts, retain repeated questions and survive reload', () => {
  const db = storage(), counter = create(() => db);
  counter.add(first); counter.add(second, record());
  const reloaded = create(() => db);
  assert.deepEqual(reloaded.refresh(), { count: 2, persistent: true });
  assert.deepEqual(reloaded.history(), [{ ...record(), attemptId: second }]);
  reloaded.add(first, record()); // An existing event must not be rewritten.
  assert.equal(reloaded.history().length, 1);
  const third = '00000000-0000-4000-8000-000000000003';
  reloaded.add(third, record({ answeredAt: '2026-10-11T06:00:00.000Z', points: 1 }));
  assert.deepEqual(reloaded.history().map(r=>r.attemptId), [third, second]);
  const copy = reloaded.history(); copy[0].answer = 'mutated';
  assert.equal(reloaded.history()[0].answer, 'n != 1');
});

test('parallel detailed history remains intact; bad entries are ignored', () => {
  const db = storage(), a = create(() => db), b = create(() => db);
  a.add(first, record()); b.add(second, record({points:0.5,mode:'self'}));
  a.refresh(); assert.equal(a.history().length,2);
  for(const extra of [{points:null},{points:2},{mode:'skipped'},{questionId:'bad'},{revision:0},{answer:[]},{answeredAt:'bad'}]) {
    assert.throws(()=>a.add('00000000-0000-4000-8000-000000000003',record(extra)),/Invalid attempt record/);
  }
  db.setItem(PREFIX+'00000000-0000-4000-8000-000000000004',JSON.stringify(record({mode:'unavailable'})));
  assert.equal(a.refresh().count,2);
  db.clear(); assert.equal(a.refresh().count,0); assert.deepEqual(a.history(),[]);
});

test('temporary history survives failed refresh and a later retry can persist it', () => {
  const db=storage(), original=db.setItem;
  db.setItem=()=>{throw new Error('quota')};
  const counter=create(()=>db);counter.add(first,record());
  assert.equal(counter.refresh().persistent,false);
  assert.deepEqual(counter.history(),[{...record(),attemptId:first}]);
  db.setItem=original;
  counter.add(first);
  const reloaded=create(()=>db);
  assert.deepEqual(reloaded.refresh(),{count:1,persistent:true});
  assert.deepEqual(reloaded.history(),[{...record(),attemptId:first}]);
});
