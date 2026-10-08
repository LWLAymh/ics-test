'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'site');
const bank = path.join(root, 'question-bank');
const output = path.join(root, '_site');
const webData = path.join(bank, 'web-data');
const assets = path.join(bank, 'assets');
const publishedKinds = new Set(['single-choice', 'multiple-choice']);

function fail(message) {
  console.error(message);
  process.exit(1);
}

for (const required of [source, webData, assets]) {
  if (!fs.existsSync(required)) fail(`Missing required directory: ${required}`);
}

fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(source, output, { recursive: true });
fs.cpSync(webData, path.join(output, 'web-data'), { recursive: true });
fs.cpSync(assets, path.join(output, 'web-data', 'assets'), { recursive: true });
fs.writeFileSync(path.join(output, '.nojekyll'), '');

const catalog = JSON.parse(fs.readFileSync(path.join(output, 'web-data', 'catalog.json'), 'utf8'));
if (catalog.schemaVersion !== 3) fail(`Unsupported question schema: ${catalog.schemaVersion}`);

let questionCount = 0;
let formattedCount = 0;
const referencedAssets = new Set();
const referencedAnswerBlocks = new Set();
const publishedQuestionIds = new Set();
const verifiedQuestionIds = new Set();

for (const module of catalog.modules || []) {
  const modulePath = path.join(output, 'web-data', module.questionFile);
  const data = JSON.parse(fs.readFileSync(modulePath, 'utf8'));
  data.questions = (data.questions || []).filter((question) =>
    publishedKinds.has(question && question.interaction && question.interaction.kind) &&
    question.presentation && question.presentation.status === 'ready');
  module.questionCount = data.questions.length;
  module.publishedQuestionCount = data.questions.length;
  fs.writeFileSync(modulePath, `${JSON.stringify(data, null, 2)}\n`);
  for (const question of data.questions) {
    questionCount += 1;
    publishedQuestionIds.add(question.id);
    if (question.answer && question.answer.status === 'verified') verifiedQuestionIds.add(question.id);
    if (question.formatted && question.layout) formattedCount += 1;
    for (const asset of question.assets || []) referencedAssets.add(asset);
    for (const blockId of (question.answer && question.answer.relatedBlockIds) || []) {
      referencedAnswerBlocks.add(blockId);
    }
  }
}

const sourceQuestionCount = catalog.stats.questions;
catalog.stats.sourceQuestions = sourceQuestionCount;
catalog.stats.questions = questionCount;
catalog.stats.publishedChoiceQuestions = questionCount;
fs.writeFileSync(path.join(output, 'web-data', 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);

const papersPath = path.join(output, 'web-data', catalog.papersFile);
const papersPayload = JSON.parse(fs.readFileSync(papersPath, 'utf8'));
papersPayload.papers = (papersPayload.papers || []).map((paper) => {
  paper.questionIds = (paper.questionIds || []).filter((id) => publishedQuestionIds.has(id));
  paper.questionCount = paper.questionIds.length;
  paper.verifiedAnswerCount = paper.questionIds.filter((id) => verifiedQuestionIds.has(id)).length;
  paper.complete = paper.verifiedAnswerCount === paper.questionCount;
  return paper;
}).filter((paper) => paper.questionCount > 0);
fs.writeFileSync(papersPath, `${JSON.stringify(papersPayload, null, 2)}\n`);

const answerBlocksPath = path.join(output, 'web-data', catalog.answerBlocksFile);
const answerBlocksPayload = JSON.parse(fs.readFileSync(answerBlocksPath, 'utf8'));
answerBlocksPayload.answerBlocks = (answerBlocksPayload.answerBlocks || [])
  .filter((block) => referencedAnswerBlocks.has(block.id));
fs.writeFileSync(answerBlocksPath, `${JSON.stringify(answerBlocksPayload, null, 2)}\n`);

const missingAssets = [...referencedAssets].filter((asset) => !fs.existsSync(path.join(output, 'web-data', asset)));
if (missingAssets.length) fail(`Missing question assets:\n${missingAssets.join('\n')}`);
if (questionCount !== catalog.stats.publishedChoiceQuestions || formattedCount !== questionCount) {
  fail(`Unexpected question data: ${questionCount} total, ${formattedCount} formatted`);
}

console.log(`Built ${questionCount} published choice questions from ${sourceQuestionCount} source questions; ${referencedAssets.size} referenced assets; 0 missing.`);
