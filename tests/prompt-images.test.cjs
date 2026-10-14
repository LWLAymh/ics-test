'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const markdown = require('../site/vendor/markdown-it/markdown-it.min.js')({ html: false });
const bank = require('../question-bank/web-data/questions.json').questions;
const fixtures = require('./prompt-image-fixtures.cjs');

function contents(q) {
  return [q.stem, ...(q.options || []).map(o => o.content), ...(q.parts || []).flatMap(contents)];
}
function images(q) {
  const found = [];
  function visit(tokens) {
    for (const token of tokens) {
      if (token.type === 'image') found.push(decodeURI(token.attrGet('src')).replace(/^(\.\.\/)+/, ''));
      if (token.children) visit(token.children);
    }
  }
  for (const c of contents(q)) visit(markdown.parse(c.text || '', {}));
  return found;
}

test('published prompts and options do not embed uncropped original pages or externally dependent SVGs', () => {
  const assets = new Set();
  for (const q of bank.filter(q => q.publication.state === 'published')) {
    for (const file of images(q)) {
      assert.doesNotMatch(file, /(^|\/)page-\d+\.(?:png|jpe?g|webp|svg)$/i,
        q.id + ': extract and visually review the needed figure instead of inserting a whole page');
      assets.add(file);
    }
  }
  assert.ok(assets.size > 0);
  for (const file of assets) {
    assert.ok(fs.existsSync(path.join(__dirname, '../question-bank', file)), file);
    if (file.endsWith('.svg')) {
      assert.doesNotMatch(fs.readFileSync(path.join(__dirname, '../question-bank', file), 'utf8'),
        /<\s*(?:image|script|foreignObject)\b|\b(?:href|on\w+)\s*=/i,
        file + ': prompt SVGs must be self-contained, not wrappers around an answer page');
    }
  }
});

test('all manually repaired questions reference only their intended figures', () => {
  for (const [id, expected] of fixtures) {
    const q = bank.find(q => q.id === id);
    assert.ok(q, id); assert.deepEqual(images(q), expected, id);
  }
  const circuit = bank.find(q => q.id === 'q-c32ea3cc636c77f7');
  assert.deepEqual(circuit.solution.correctOptionIds, ['C']);
  assert.match(circuit.solution.reference.text, /A && \(B \|\| C\)/);
  assert.doesNotMatch(circuit.stem.text, /答案\s*[:：]/);
  const pipeline = bank.find(q => q.id === 'q-80560a1ecf2223dd');
  assert.match(pipeline.stem.text, /mrmovq/);
  assert.equal(images({ ...pipeline, parts: [] }).length, 1, 'one shared figure in the common prompt');
  assert.ok(pipeline.parts.every(p => images(p).length === 0), 'no duplicate full-page figures in subquestions');
  assert.equal(pipeline.parts.length, 6, 'the complete problem stays together');
});
