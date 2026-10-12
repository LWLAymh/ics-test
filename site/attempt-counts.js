(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ICSAttemptCounts = factory();
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const PREFIX = 'ics-completed-attempt-v1:';
  const ID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

  function validRecord(value) {
    return value && value.version === 1 && /^q-[a-f0-9]{8,64}$/.test(value.questionId) &&
      Number.isInteger(value.revision) && value.revision > 0 &&
      typeof value.answeredAt === 'string' && Number.isFinite(Date.parse(value.answeredAt)) &&
      typeof value.points === 'number' && value.points >= 0 && value.points <= 1 &&
      ['auto', 'self', 'mixed'].includes(value.mode) && typeof value.answer === 'string' && value.answer.length <= 20000;
  }

  function parseRecord(text) {
    try { const value = JSON.parse(text); return validRecord(value) ? value : null; }
    catch (_) { return null; }
  }

  function create(getStorage) {
    let saved = new Set();
    const temporary = new Set();
    let details = new Map();
    const temporaryDetails = new Map();
    let persistent = true;
    function snapshot() {
      return { count: new Set([...saved, ...temporary]).size, persistent: persistent };
    }
    function refresh() {
      try {
        const storage = getStorage();
        const found = new Set();
        const foundDetails = new Map();
        for (let index = 0; index < storage.length; index++) {
          const key = storage.key(index);
          if (key && key.startsWith(PREFIX) && ID.test(key.slice(PREFIX.length))) {
            const id = key.slice(PREFIX.length), text = storage.getItem(key), record = parseRecord(text);
            if (text === '1' || record) found.add(id);
            if (record) foundDetails.set(id, record);
          }
        }
        saved = found;
        details = foundDetails;
        persistent = temporary.size === 0;
      } catch (_) { persistent = false; }
      return snapshot();
    }
    function add(attemptId, record) {
      if (!ID.test(attemptId)) throw new Error('Invalid attempt ID');
      if (record !== undefined && !validRecord(record)) throw new Error('Invalid attempt record');
      if (saved.has(attemptId)) return snapshot();
      if (temporaryDetails.has(attemptId)) record = temporaryDetails.get(attemptId);
      // One storage key per completed attempt: parallel tabs cannot overwrite
      // each other's increments. Old count-only entries remain readable; new
      // entries include local-only answer history, never sent to the server.
      try {
        getStorage().setItem(PREFIX + attemptId, record === undefined ? '1' : JSON.stringify(record));
        saved.add(attemptId);
        if (record) details.set(attemptId, { ...record });
        temporary.delete(attemptId);
        temporaryDetails.delete(attemptId);
        persistent = temporary.size === 0;
      } catch (_) {
        temporary.add(attemptId);
        if (record) temporaryDetails.set(attemptId, { ...record });
        persistent = false;
      }
      return snapshot();
    }
    function remove(attemptIds) {
      if (!Array.isArray(attemptIds) || attemptIds.some(function (id) {
        return typeof id !== 'string' || !ID.test(id);
      })) throw new Error('Invalid attempt IDs');
      refresh();
      const removedIds = [], failedIds = [];
      new Set(attemptIds).forEach(function (id) {
        if (!saved.has(id) && !temporary.has(id)) return;
        // Delete only the selected event keys, never the whole browser store.
        // If a persistent removal fails, keep its history and count intact.
        if (saved.has(id)) {
          try { getStorage().removeItem(PREFIX + id); }
          catch (_) { failedIds.push(id); return; }
        }
        saved.delete(id); details.delete(id);
        temporary.delete(id); temporaryDetails.delete(id);
        removedIds.push(id);
      });
      refresh();
      return { removedIds: removedIds, failedIds: failedIds };
    }
    function history() {
      return Array.from(new Map([...details, ...temporaryDetails]), function (entry) {
        return { ...entry[1], attemptId: entry[0] };
      }).sort(function (a, b) { return Date.parse(b.answeredAt) - Date.parse(a.answeredAt) || b.attemptId.localeCompare(a.attemptId); });
    }
    return { refresh: refresh, add: add, remove: remove, snapshot: snapshot, history: history };
  }
  return { PREFIX: PREFIX, create: create };
});
