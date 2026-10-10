(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ICSQuestionV5 = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = '5';
  const EXAM_LABELS = { midterm: '期中', final: '期末', 'stage-test': '阶段测验',
    'lab-quiz': 'Lab测验', quiz: '小测', practice: '练习', other: '其他' };

  function assertVersion(payload) {
    if (!payload || payload.schemaVersion !== VERSION) throw new Error('题库版本不兼容，请刷新页面（需要 v5）。');
    return payload;
  }

  function blankSpans(content) {
    const spans = (content.blanks || []).map(function (blank) {
      let start = -1;
      for (let i = 0; i <= blank.occurrence; i += 1) {
        start = content.text.indexOf(blank.marker, start + 1);
        if (start < 0) throw new Error('填空位置不存在：' + blank.id);
      }
      return { start: start, end: start + blank.marker.length, blank: blank };
    }).sort(function (a, b) { return a.start - b.start; });
    if (spans.some(function (span, index) { return index && spans[index - 1].end > span.start; })) {
      throw new Error('填空位置重叠');
    }
    return spans;
  }

  function gradeChoice(selected, solution) {
    if (solution.state !== 'available' || solution.grading !== 'choice') return null;
    const actual = Array.from(new Set(selected)).sort();
    const expected = solution.correctOptionIds.slice().sort();
    return actual.length === expected.length && actual.every(function (id, index) { return id === expected[index]; });
  }

  function gradeBlanks(values, solution) {
    if (solution.state !== 'available' || solution.grading !== 'blanks' ||
        solution.blankAnswers.some(function (rule) { return rule.method !== 'exact' && rule.method !== 'selection'; })) return null;
    return solution.blankAnswers.every(function (rule) {
      if (!Object.prototype.hasOwnProperty.call(values, rule.blankId)) return false;
      if (rule.method === 'selection') {
        const value = values[rule.blankId];
        const actual = (Array.isArray(value) ? value : [value]).slice().sort();
        const expected = rule.correctValues.slice().sort();
        return actual.length === expected.length && actual.every(function (item, index) {
          return typeof item === 'string' && item === expected[index];
        });
      }
      function normalize(value) {
        let result = String(value);
        if (rule.normalize.trimWhitespace) result = result.trim();
        if (!rule.normalize.caseSensitive) result = result.toLowerCase();
        return result;
      }
      return rule.acceptedAnswers.some(function (accepted) { return normalize(accepted) === normalize(values[rule.blankId]); });
    });
  }

  return { VERSION: VERSION, EXAM_LABELS: EXAM_LABELS, assertVersion: assertVersion,
    blankSpans: blankSpans, gradeChoice: gradeChoice, gradeBlanks: gradeBlanks };
}));
