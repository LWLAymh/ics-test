'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'site');
const bank = path.join(root, 'question-bank');
const output = path.join(root, '_site');
const webData = path.join(bank, 'web-data');
const assets = path.join(bank, 'assets');

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
if (catalog.schemaVersion !== 2) fail(`Unsupported question schema: ${catalog.schemaVersion}`);

let questionCount = 0;
let formattedCount = 0;
const referencedAssets = new Set();

for (const module of catalog.modules || []) {
  const modulePath = path.join(output, 'web-data', module.questionFile);
  const data = JSON.parse(fs.readFileSync(modulePath, 'utf8'));
  for (const question of data.questions || []) {
    questionCount += 1;
    if (question.formatted && question.layout) formattedCount += 1;
    for (const asset of question.assets || []) referencedAssets.add(asset);
  }
}

const missingAssets = [...referencedAssets].filter((asset) => !fs.existsSync(path.join(output, 'web-data', asset)));
if (missingAssets.length) fail(`Missing question assets:\n${missingAssets.join('\n')}`);
if (questionCount !== 1009 || formattedCount !== questionCount) {
  fail(`Unexpected question data: ${questionCount} total, ${formattedCount} formatted`);
}

console.log(`Built ${questionCount} questions; ${referencedAssets.size} referenced assets; 0 missing.`);
