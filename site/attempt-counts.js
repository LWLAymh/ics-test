(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ICSAttemptCounts = factory();
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const PREFIX = 'ics-completed-attempt-v1:';
  const ID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

  function create(getStorage) {
    let saved = new Set();
    const temporary = new Set();
    let persistent = true;
    function snapshot() {
      return { count: new Set([...saved, ...temporary]).size, persistent: persistent };
    }
    function refresh() {
      try {
        const storage = getStorage();
        const found = new Set();
        for (let index = 0; index < storage.length; index++) {
          const key = storage.key(index);
          if (key && key.startsWith(PREFIX) && ID.test(key.slice(PREFIX.length)) && storage.getItem(key) === '1') {
            found.add(key.slice(PREFIX.length));
          }
        }
        saved = found;
        persistent = temporary.size === 0;
      } catch (_) { persistent = false; }
      return snapshot();
    }
    function add(attemptId) {
      if (!ID.test(attemptId)) throw new Error('Invalid attempt ID');
      // One storage key per completed attempt: parallel tabs cannot overwrite
      // each other's increments. Store no answer text or personal information.
      try {
        getStorage().setItem(PREFIX + attemptId, '1');
        saved.add(attemptId);
        temporary.delete(attemptId);
        persistent = temporary.size === 0;
      } catch (_) {
        temporary.add(attemptId);
        persistent = false;
      }
      return snapshot();
    }
    return { refresh: refresh, add: add, snapshot: snapshot };
  }
  return { PREFIX: PREFIX, create: create };
});
