(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ICSMistakePractice = factory();
}(typeof window === 'object' ? window : globalThis, function () {
  'use strict';

  function rankQuestions(pool, stats, minimum, excludedIds) {
    if (!Number.isInteger(minimum) || minimum < 1) throw new Error('请选择有效的最低作答人数。');
    return pool.flatMap(function (question) {
      if (excludedIds && excludedIds.has(question.id)) return [];
      const row = stats.get(question.id);
      const total = row && Number(row.total_answers), correct = row && Number(row.correct_answers);
      if (!row || row.correct_answers == null || row.correct_answers === '' || !Number.isInteger(total) || total < minimum || !Number.isInteger(correct) || correct < 0 || correct >= total) return [];
      return [Object.assign({}, question, { practiceStats: { total: total, errorRate: (total - correct) / total } })];
    }).sort(function (a, b) {
      return b.practiceStats.errorRate - a.practiceStats.errorRate ||
        b.practiceStats.total - a.practiceStats.total || a.id.localeCompare(b.id);
    });
  }

  function selectQuestions(ranked, options, shuffle) {
    const coverage = Number(options.coverage), count = Number(options.count), order = options.order;
    if (![0.2, 0.5, 1].includes(coverage) || !Number.isInteger(count) || count < 1 || !['random', 'ranked'].includes(order))
      throw new Error('请选择有效的高错题范围、数量和顺序。');
    if (!ranked.length) throw new Error('当前范围没有符合条件的有错题，可降低人数门槛、取消跳过熟知或扩大范围。');
    let end = Math.ceil(ranked.length * coverage);
    // Equal error rates at the boundary enter together, rather than being
    // excluded by an arbitrary question ID or the size of their sample.
    const boundary = ranked[end - 1].practiceStats.errorRate;
    while (end < ranked.length && ranked[end].practiceStats.errorRate === boundary) end++;
    const candidates = ranked.slice(0, end);
    const chosen = (order === 'random' ? shuffle(candidates) : candidates).slice(0, count);
    return chosen.map(function (question) {
      return Object.assign({}, question, { practiceStats: Object.assign({}, question.practiceStats, {
        order: order, candidateCount: candidates.length, selectedCount: chosen.length,
      }) });
    });
  }
  return { rankQuestions: rankQuestions, selectQuestions: selectQuestions };
}));
