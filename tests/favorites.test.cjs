'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const { create, PREFIX } = require('../site/favorites.js');
const ids = ['q-aaaaaaaa', 'q-bbbbbbbb', 'q-cccccccc'];
function memory() {
  const values = new Map();
  return { values, get length() { return values.size; }, key(i) { return Array.from(values.keys())[i] || null; },
    getItem(key) { return values.get(key) ?? null; }, setItem(key, value) { values.set(key, value); }, removeItem(key) { values.delete(key); } };
}
test('favorites persist as unique IDs, do not change timestamps on repeated additions, and remove only their own keys', () => {
  const storage = memory(), store = create(() => storage);
  storage.setItem('ics-question-mastery-v1', 'PRIVATE_MASTERY'); storage.setItem('ics-completed-attempt-v1:example', 'PRIVATE_HISTORY');
  assert.equal(store.refresh().count, 0);
  assert.deepEqual(store.add([ids[0], ids[0], ids[1]]).addedIds, ids.slice(0, 2));
  const before = storage.getItem(PREFIX + ids[0]);
  assert.deepEqual(store.add([ids[0]]).addedIds, []); assert.equal(storage.getItem(PREFIX + ids[0]), before);
  const reload = create(() => storage); assert.equal(reload.refresh().count, 2); assert.equal(reload.has(ids[0]), true);
  assert.deepEqual(reload.remove([ids[0], ids[0]]).removedIds, [ids[0]]); assert.equal(reload.has(ids[1]), true);
  assert.equal(storage.getItem('ics-question-mastery-v1'), 'PRIVATE_MASTERY'); assert.equal(storage.getItem('ics-completed-attempt-v1:example'), 'PRIVATE_HISTORY');
});
test('independent keys retain concurrent additions and observe removals from other tabs', () => {
  const storage = memory(), a = create(() => storage), b = create(() => storage);
  a.refresh(); b.refresh(); a.add([ids[0]]); b.add([ids[1]]);
  assert.equal(a.refresh().count, 2); b.remove([ids[0]]); a.refresh();
  assert.equal(a.has(ids[0]), false); assert.equal(a.has(ids[1]), true);
  storage.values.clear(); assert.equal(a.refresh().count, 0);
});
test('blocked storage retains temporary favorites, can be retried, and supports temporary removal', () => {
  const storage = memory(); let blocked = true;
  const store = create(() => { if (blocked) throw new Error('blocked'); return storage; });
  assert.equal(store.refresh().persistent, false);
  assert.equal(store.add([ids[0]]).persistent, false); store.refresh(); assert.equal(store.has(ids[0]), true);
  assert.deepEqual(store.remove([ids[0]]).removedIds, [ids[0]]); assert.equal(store.snapshot().count, 0);
  store.add([ids[1]]); blocked = false;
  assert.equal(store.refresh().persistent, false); assert.equal(store.add([ids[1]]).persistent, true);
  assert.equal(create(() => storage).refresh().count, 1);
});
test('quota and delete failures are explicit and never discard saved favorites', () => {
  const storage = memory(), store = create(() => storage); store.add([ids[0]]);
  const remove = storage.removeItem; storage.removeItem = () => { throw new Error('denied'); };
  assert.deepEqual(store.remove([ids[0]]).failedIds, [ids[0]]); assert.equal(store.has(ids[0]), true);
  storage.removeItem = remove;
  const write = storage.setItem; storage.setItem = () => { throw new Error('quota'); };
  assert.equal(store.add([ids[1]]).persistent, false); assert.equal(store.snapshot().count, 2);
  storage.setItem = write; store.add([ids[1]]); assert.equal(store.snapshot().persistent, true);
});
test('malformed and foreign entries cannot become IDs or HTML and are not overwritten', () => {
  const storage = memory(), store = create(() => storage);
  storage.setItem(PREFIX + ids[0], '{'); storage.setItem(PREFIX + ids[1], JSON.stringify({ version: 2, savedAt: new Date().toISOString() }));
  storage.setItem(PREFIX + '<img onerror=alert(1)>', '1'); storage.setItem('foreign', 'private');
  assert.deepEqual(store.refresh(), { count: 0, persistent: true, invalidCount: 2 });
  for (const bad of [null, 'q-aaaaaaaa', [null], ['__proto__'], ['q-<script>']]) assert.throws(() => store.add(bad));
  assert.throws(() => store.remove(['foreign'])); assert.equal(storage.getItem('foreign'), 'private');
  store.add([ids[0]]); assert.equal(store.snapshot().count, 1); assert.equal(store.snapshot().invalidCount, 1);
});
