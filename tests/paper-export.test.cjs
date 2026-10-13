'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const markdown = require('../site/vendor/markdown-it/markdown-it.min.js')({ html: false, breaks: false });
const contract = require('../site/question-v5.js'), exporter = require('../site/paper-export.js');
const community = require('../site/community-papers.js');
const content = text => ({ format: 'markdown', text });

test('history selection deduplicates questions and retains any previous incorrect attempt', () => {
  const first = 'q-0123456789abcdef', second = 'q-fedcba9876543210';
  const records = [{ questionId: first, points: 0 }, { questionId: first, points: 1 }, { questionId: second, points: 1 },
    { questionId: '../bad', points: 0 }, { questionId: second, points: NaN }];
  assert.deepEqual([...community.historyQuestionIds(records, false)], [first, second]);
  assert.deepEqual([...community.historyQuestionIds(records, true)], [first]);
  assert.deepEqual([...community.historyQuestionIds([], true)], []);
});

test('print uses explicit blank locations, repeated logical IDs and authored dropdown choices', () => {
  const stem = { ...content('```c\nif ({{blank:x}}) {\n    return {{blank:y}};\n}\n```\n\n再次出现 {{blank:x}}。'), blanks: [
    { id: 'x', marker: '{{blank:x}}', occurrence: 0, input: { kind: 'select', multiple: true, options: [{ label: '<', value: '<' }, { label: '!=', value: '!=' }] } },
    { id: 'x', marker: '{{blank:x}}', occurrence: 1 }, { id: 'y', marker: '{{blank:y}}', occurrence: 0 },
  ] };
  const html = exporter.stem(stem, item => markdown.render(item.text), contract);
  assert.ok(!html.includes('{{blank:')); assert.equal((html.match(/<small>1<\/small>/g) || []).length, 2);
  assert.match(html, /    return/); assert.match(html, /空 1（可多选）/); assert.match(html, /&lt; \/ !=/);
  assert.match(html, /<pre><code class="language-c">/);
  assert.equal(stem.text.includes('{{blank:x}}'), true, 'never modifies authored input');
});

test('print packet preserves selected order and composites, isolates answers and escapes option labels', () => {
  const q = { id: 'q-0123456789abcdef', stem: content('题面\n折行\n\n```c\n  x += 1;\n```'),
    options: [{ id: '<bad>', content: content('`x != 0`') }], parts: [{ number: { display: '<小问>' }, stem: content('小问') }] };
  const options = { contract, renderContent: item => markdown.render(item.text), renderSolution: () => '<p>ANSWER_ONLY</p>', source: () => '原卷 / 题号' };
  const result = exporter.packet({ title: '<script>title</script>', author: '作者' }, [q, { ...q, id: 'q-fedcba9876543210' }], options);
  assert.deepEqual(result.questions.map(q => q.id), [q.id, 'q-fedcba9876543210']);
  assert.ok(!result.questions[0].html.includes('ANSWER_ONLY'));
  assert.ok(result.questions[0].answer.includes('ANSWER_ONLY'));
  assert.match(result.questions[0].html, /&lt;bad&gt;/); assert.match(result.questions[0].html, /&lt;小问&gt;/);
  assert.match(result.questions[0].html, /题面\n折行/);
  assert.throws(() => exporter.packet({}, [], options));
});
