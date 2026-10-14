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

  function paperCollection(paper) {
    return paper && paper.sourceCollection || 'pku-exam';
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

  // These are lexical comparisons, not a compiler, evaluator or algebra engine.
  // Enable explicitly for a reviewed code blank; ordinary text stays exact.
  function codeTokens(text, dialect, caseSensitive) {
    const tokens = [];
    let i = 0;
    while (i < text.length) {
      const rest = text.slice(i);
      const whitespace = /^[ \t\r\n\v\f]+/.exec(rest);
      if (whitespace) { i += whitespace[0].length; continue; }
      // Comments and preprocessing are outside this fragment grammar. Inserting
      // a line comment in an inline blank could hide the surrounding code.
      if (/^(?:\/\/|\/\*)/.test(rest)) return null;
      const quoted = /^(?:u8|u|U|L)?["']/.exec(rest);
      if (quoted) {
        const quote = quoted[0].slice(-1);
        let end = i + quoted[0].length;
        let closed = false;
        while (end < text.length) {
          if (text[end] === '\n' || text[end] === '\r') return null;
          if (text[end] === '\\') {
            if (end + 1 >= text.length || /[\r\n]/.test(text[end + 1])) return null;
            end += 2;
          } else if (text[end++] === quote) { closed = true; break; }
        }
        if (!closed) return null;
        // Literal contents, including whitespace, escapes and case, stay exact.
        tokens.push(['literal', text.slice(i, end)]);
        i = end;
        continue;
      }
      let token, kind;
      if (dialect === 'asm' && rest[0] === '%') {
        token = /^%[A-Za-z][A-Za-z0-9]*/.exec(rest);
        if (!token) return null; // "% rax" is not a register.
        kind = 'register';
      } else if ((token = /^(?:[0-9]|\.[0-9])(?:[eEpP][+-]|[A-Za-z0-9_.])*/.exec(rest))) {
        kind = 'number'; // Keep spelling; never evaluate or convert the number.
      } else if ((token = (dialect === 'c' ? /^[A-Za-z_][A-Za-z0-9_]*/ : /^[A-Za-z_.][A-Za-z0-9_.]*/).exec(rest))) {
        kind = 'word';
      } else {
        const punctuation = dialect === 'c'
          ? /^(?:>>=|<<=|\.\.\.|->|\+\+|--|<<|>>|<=|>=|==|!=|&&|\|\||[+\-*\/%&|^]=|[()[\]{}.,;?:~!%^&*+\-/<>=|])/
          : /^(?:<<|>>|[()[\],:$~!^&*+\-/<>=|])/;
        token = punctuation.exec(rest);
        if (!token) return null;
        kind = 'punctuation';
      }
      tokens.push([kind, caseSensitive ? token[0] : token[0].toLowerCase()]);
      i += token[0].length;
    }
    return tokens.length ? tokens : null;
  }

  function normalizeCodeAnswer(value, options) {
    if (value.length > 4096 || options.trimWhitespace !== true) return null;
    const text = value.trim();
    const syntax = options.syntax;
    let tokens;
    if (syntax === 'c-tokens') {
      if (options.caseSensitive !== true) return null;
      tokens = codeTokens(text, 'c', true);
    } else if (syntax === 'att-operand' || syntax === 'att-instruction') {
      // A single operand/instruction only: never merge separate statements.
      if (/[\r\n\v\f;#]/.test(text)) return null;
      if (syntax === 'att-instruction') {
        const instruction = /^([A-Za-z][A-Za-z0-9]*)(?:[ \t]+(.+))?$/.exec(text);
        if (!instruction || /^(?:lock|rep|repe|repne|repz|repnz|data16|addr32)$/i.test(instruction[1])) return null;
        // Preserve the required mnemonic/operand boundary: "addq%rax" fails.
        tokens = instruction[2] ? codeTokens(instruction[2], 'asm', options.caseSensitive) : [];
        if (tokens === null) return null;
        tokens.unshift(['mnemonic', options.caseSensitive ? instruction[1] : instruction[1].toLowerCase()]);
      } else tokens = codeTokens(text, 'asm', options.caseSensitive);
    } else return null;
    return tokens === null ? null : JSON.stringify(tokens);
  }

  function gradeBlank(value, rule) {
    if (!rule || (rule.method !== 'exact' && rule.method !== 'selection')) return null;
    if (rule.method === 'selection') {
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
    if (value == null || Array.isArray(value)) return false;
    if (rule.normalize.syntax) {
      const actual = normalizeCodeAnswer(String(value), rule.normalize);
      return actual !== null && rule.acceptedAnswers.some(function (accepted) {
        return normalizeCodeAnswer(accepted, rule.normalize) === actual;
      });
    }
    return rule.acceptedAnswers.some(function (accepted) { return normalize(accepted) === normalize(value); });
  }

  function gradeBlanks(values, solution) {
    if (solution.state !== 'available' || solution.grading !== 'blanks' ||
        solution.blankAnswers.some(function (rule) { return rule.method !== 'exact' && rule.method !== 'selection'; })) return null;
    return solution.blankAnswers.every(function (rule) {
      return Object.prototype.hasOwnProperty.call(values, rule.blankId) && gradeBlank(values[rule.blankId], rule);
    });
  }

  function blankReferenceText(rule, blank) {
    if (!rule) return null;
    if (rule.method === 'exact') return rule.acceptedAnswers[0] ?? null;
    if (rule.method === 'selection' && blank && blank.input) {
      return rule.correctValues.map(function (value) {
        const option = blank.input.options.find(function (item) { return item.value === value; });
        return option ? option.label : value;
      }).join('、');
    }
    // Subjective blanks have no structured key. Never parse prose or guess an answer.
    return null;
  }

  return { VERSION: VERSION, EXAM_LABELS: EXAM_LABELS, assertVersion: assertVersion, paperCollection: paperCollection,
    blankSpans: blankSpans, gradeChoice: gradeChoice, gradeBlank: gradeBlank, gradeBlanks: gradeBlanks,
    blankReferenceText: blankReferenceText };
}));
