'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { packet } = require('../scripts/mcp-data.cjs');
const root = path.resolve(__dirname, '..');
const bank = require('../question-bank/web-data/questions.json');
const papers = new Map(require('../question-bank/web-data/papers.json').papers.map(p => [p.id, p]));
test('all published MCP projections preserve Markdown, isolate answers, resolve images', () => {
  let count = 0;
  function compare(source, projected, answer) {
    assert.equal(projected.stem.text, source.stem.text);
    assert.equal(answer.solution.reference.text, source.solution.reference.text);
    assert.equal(projected.type, source.type);
    for (let i = 0; i < (source.options || []).length; i++) assert.equal(projected.options[i].content.text, source.options[i].content.text);
    for (let i = 0; i < (source.parts || []).length; i++) compare(source.parts[i], projected.parts[i], answer.parts[i]);
  }
  function inspect(value) {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      assert.ok(!['solution', 'correctOptionIds', 'blankAnswers', 'acceptedAnswers', 'correctValues', 'sources', 'editorNote', 'issues'].includes(key), key);
      inspect(child);
    }
  }
  for (const question of bank.questions) {
    if (question.publication.state !== 'published') {
      assert.throws(() => packet(question, papers.get(question.paperId)), /Unpublished/); continue;
    }
    const result = packet(question, papers.get(question.paperId));
    compare(question, result.question, result.answer); inspect(result.question);
    for (const image of [...result.question.images, ...result.answer.images]) {
      const url = new URL(image.url);
      if (url.pathname.startsWith('/ics-test/web-data/assets/')) {
        const relative = decodeURIComponent(url.pathname.slice('/ics-test/web-data/assets/'.length));
        assert.ok(fs.existsSync(path.join(root, 'question-bank/assets', relative)), image.url);
      }
    }
    count++;
  }
  assert.ok(count >= 970);
});
