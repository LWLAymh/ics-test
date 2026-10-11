'use strict';
// Serialization only: never infer or rewrite manually authored Markdown.
const MarkdownIt = require('../site/vendor/markdown-it/markdown-it.min.js');
const parser = new MarkdownIt({ html: false });
const SITE = 'https://lwlaymh.github.io/ics-test/';
function pick(value, keys) {
  return Object.fromEntries(keys.filter(key => value && value[key] !== undefined).map(key => [key, value[key]]));
}
function content(value) { return pick(value, ['format', 'text']); }
function stem(value) {
  const result = content(value);
  if (value.blanks) result.blanks = value.blanks.map(blank => {
    const result = pick(blank, ['id', 'marker', 'occurrence', 'width', 'label']);
    if (blank.input) result.input = {
      ...pick(blank.input, ['kind', 'multiple', 'exclusiveValues']),
      options: (blank.input.options || []).map(option => pick(option, ['value', 'label'])),
    };
    return result;
  });
  return result;
}
function number(value) {
  return { display: value.display, major: pick(value.major, ['display', 'value']),
    minor: value.minor ? pick(value.minor, ['display', 'value']) : null, parts: value.parts || [] };
}
function questionPart(value) {
  const result = { id: value.id, number: number(value.number), type: value.type, stem: stem(value.stem) };
  if (value.options) result.options = value.options.map(option => ({ id: option.id, content: content(option.content) }));
  if (value.parts) result.parts = value.parts.map(questionPart);
  return result;
}
function answerPart(value) {
  const solution = value.solution;
  const result = { id: value.id, solution: {
    ...pick(solution, ['state', 'grading', 'correctOptionIds']),
    reference: content(solution.reference),
    provenance: pick(solution.provenance, ['origin', 'crossChecked', 'note', 'attribution']),
  } };
  if (solution.blankAnswers) result.solution.blankAnswers = solution.blankAnswers.map(answer => ({
    ...pick(answer, ['blankId', 'method', 'acceptedAnswers', 'correctValues']),
    ...(answer.normalize ? { normalize: pick(answer.normalize, ['caseSensitive', 'trimWhitespace']) } : {}),
  }));
  if (value.parts) result.parts = value.parts.map(answerPart);
  return result;
}
function images(value) {
  const assets = new Map();
  function tokens(items) {
    for (const token of items) {
      if (token.type === 'image') {
        const src = token.attrGet('src');
        const url = new URL(src, SITE + 'web-data/');
        if (url.protocol !== 'https:') throw new Error('Unsupported MCP image URL');
        assets.set(url.href, { url: url.href, alt: token.content || '', title: token.attrGet('title') || '' });
      }
      if (token.children) tokens(token.children);
    }
  }
  function walk(item) {
    if (!item || typeof item !== 'object') return;
    if (item.format === 'markdown') tokens(parser.parse(item.text || '', {}));
    else for (const child of Object.values(item)) {
      if (Array.isArray(child)) child.forEach(walk); else walk(child);
    }
  }
  walk(value);
  return [...assets.values()];
}
function packet(question, paper) {
  if (question.publication.state !== 'published') throw new Error('Unpublished MCP question');
  const publicQuestion = {
    schemaVersion: question.schemaVersion, revision: question.revision,
    paper: pick(paper, ['id', 'displayName', 'sourceCollection', 'year', 'examKind', 'sequence']),
    moduleIds: question.classification.moduleIds,
    ...questionPart(question),
    markdownBaseUrl: SITE + 'web-data/',
  };
  const publicAnswer = { ...answerPart(question), markdownBaseUrl: SITE + 'web-data/' };
  publicQuestion.images = images(publicQuestion);
  publicAnswer.images = images(publicAnswer);
  return { packetVersion: 1, questionId: question.id, question: publicQuestion, answer: publicAnswer };
}
module.exports = { packet };
