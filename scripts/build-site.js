'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'site');
const bank = path.join(root, 'question-bank');
const output = path.join(root, '_site');
const webData = path.join(bank, 'web-data');
const assets = path.join(bank, 'assets');
const publishedKinds = new Set([
  'single-choice', 'multiple-choice', 'fill', 'short-answer', 'composite',
]);

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
// answer-blocks.json 不再发布：前端从头到尾没有请求过它。题目的
// answer.relatedBlockIds 指向的往往是整份试卷的答案块，与单题并不精确对应，
// 拿来展示会泄题，所以前端只展示 layout.answer。源数据仍保留在
// question-bank/web-data/ 里，供维护与 PDF 审阅使用。
fs.rmSync(path.join(output, 'web-data', 'answer-blocks.json'), { force: true });

const catalog = JSON.parse(fs.readFileSync(path.join(output, 'web-data', 'catalog.json'), 'utf8'));
if (catalog.schemaVersion !== 3) fail(`Unsupported question schema: ${catalog.schemaVersion}`);

let questionCount = 0;
let formattedCount = 0;
const referencedAssets = new Set();
const publishedQuestionIds = new Set();
const verifiedQuestionIds = new Set();
const quizKeyByQuestionId = new Map();
const publishedQuizKeys = new Set();
const groupsById = new Map();

for (const module of catalog.modules || []) {
  const modulePath = path.join(output, 'web-data', module.questionFile);
  const data = JSON.parse(fs.readFileSync(modulePath, 'utf8'));
  data.questions = (data.questions || []).filter((question) =>
    publishedKinds.has(question && question.interaction && question.interaction.kind) &&
    question.presentation && question.presentation.status === 'ready');
  module.questionCount = data.questions.length;
  module.publishedQuestionCount = data.questions.length;
  module.quizQuestionCount = new Set(data.questions.map((question) =>
    (question.group && question.group.questionId) || question.id)).size;
  fs.writeFileSync(modulePath, `${JSON.stringify(data, null, 2)}\n`);
  for (const question of data.questions) {
    questionCount += 1;
    publishedQuestionIds.add(question.id);
    const quizKey = (question.group && question.group.questionId) || question.id;
    quizKeyByQuestionId.set(question.id, quizKey);
    publishedQuizKeys.add(quizKey);
    if (question.group && question.group.questionId) {
      let group = groupsById.get(question.group.questionId);
      if (!group) {
        group = {
          id: question.group.id || '',
          questionId: question.group.questionId,
          title: question.group.title || '',
          paperId: question.paperId || '',
          members: [],
        };
        groupsById.set(question.group.questionId, group);
      }
      group.members.push({
        id: question.id,
        order: Number(question.group.order || 0),
        questionFile: module.questionFile,
      });
    }
    if (question.answer && question.answer.status === 'verified') verifiedQuestionIds.add(question.id);
    if (question.formatted && question.layout) formattedCount += 1;
    for (const asset of question.assets || []) referencedAssets.add(asset);
  }
}

// 组合题索引：前端只凭这份构建期数据补齐片段，不猜文件名、也不读题面文字。
const groupList = [...groupsById.values()].map((group) => {
  group.members.sort((a, b) => a.order - b.order);
  return group;
});
// 组合题只要有一个片段被发布门禁过滤掉，前端就只能拿到残缺题面。
// 这种情况必须在构建期失败，而不是让它静默上线。
const brokenGroups = groupList.filter((group) => group.members.length < 2);
if (brokenGroups.length) {
  fail(`Composite groups with fewer than two published fragments:\n${brokenGroups
    .map((group) => group.questionId)
    .join('\n')}`);
}
fs.writeFileSync(
  path.join(output, 'web-data', 'groups.json'),
  `${JSON.stringify({ schemaVersion: 3, groups: groupList }, null, 2)}\n`,
);

const sourceQuestionCount = catalog.stats.questions;
catalog.stats.sourceQuestions = sourceQuestionCount;
catalog.stats.questions = questionCount;
catalog.stats.publishedQuestions = questionCount;
catalog.stats.quizQuestions = publishedQuizKeys.size;
catalog.stats.quizGroups = groupList.length;
catalog.groupsFile = 'groups.json';
delete catalog.answerBlocksFile;   // 不发布，就不在目录里声明这个文件
fs.writeFileSync(path.join(output, 'web-data', 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);

const papersPath = path.join(output, 'web-data', catalog.papersFile);
const papersPayload = JSON.parse(fs.readFileSync(papersPath, 'utf8'));
papersPayload.papers = (papersPayload.papers || []).map((paper) => {
  paper.questionIds = (paper.questionIds || []).filter((id) => publishedQuestionIds.has(id));
  paper.questionCount = paper.questionIds.length;
  paper.publishedQuestionCount = paper.questionIds.length;
  paper.quizQuestionCount = new Set(paper.questionIds.map((id) => quizKeyByQuestionId.get(id) || id)).size;
  paper.verifiedAnswerCount = paper.questionIds.filter((id) => verifiedQuestionIds.has(id)).length;
  paper.complete = paper.verifiedAnswerCount === paper.questionCount;
  return paper;
}).filter((paper) => paper.questionCount > 0);
fs.writeFileSync(papersPath, `${JSON.stringify(papersPayload, null, 2)}\n`);

const missingAssets = [...referencedAssets].filter((asset) => !fs.existsSync(path.join(output, 'web-data', asset)));
if (missingAssets.length) fail(`Missing question assets:\n${missingAssets.join('\n')}`);
if (questionCount !== catalog.stats.publishedQuestions || formattedCount !== questionCount) {
  fail(`Unexpected question data: ${questionCount} total, ${formattedCount} formatted`);
}

console.log(`Built ${questionCount} published questions from ${sourceQuestionCount} source questions; ${groupList.length} composite groups; ${referencedAssets.size} referenced assets; 0 missing.`);
