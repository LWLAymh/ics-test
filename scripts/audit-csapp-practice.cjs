'use strict';
// Read-only source inventory. This does not extract, rewrite, or publish questions.
const fs = require('node:fs');
const path = require('node:path');

function practiceNumbers(text) {
  return [...new Set([...text.matchAll(/^\s*(?:>\s*)*(?:#{1,6}\s+|\*\*)练习题\s*(\d+\.\d+)\b/gm)].map(match=>match[1]))];
}
module.exports = {practiceNumbers};
if (require.main === module) {
const args = process.argv.slice(2);
const sourceIndex = args.indexOf('--source');
if (sourceIndex < 0 || !args[sourceIndex + 1]) {
  console.error('Usage: npm run audit-csapp -- --source "path/to/csapp-zh-markdown"');
  process.exit(2);
}
const sourceRoot = path.resolve(args[sourceIndex + 1]);
const authoredRoot = path.resolve(__dirname, '../question-bank/authored');
const exercises = new Map();
const chapters = new Set();
const masterFiles = [];
for (const chapter of fs.readdirSync(sourceRoot, {withFileTypes: true})) {
  if (chapter.isDirectory() && /^第\d+章/.test(chapter.name)) {
    chapters.add(Number(chapter.name.match(/^第(\d+)章/)[1]));
    const file = path.join(sourceRoot, chapter.name, 'chapter.md');
    // The chapter master is authoritative; subsection copies and answers are not
    // additional exercises, and prose cross-references are not exercise headings.
    const relative = path.relative(sourceRoot, file).split(path.sep).join('/');
    masterFiles.push(relative);
    for (const number of practiceNumbers(fs.readFileSync(file, 'utf8'))) {
      const files = exercises.get(number) || new Set();
      files.add(relative);
      exercises.set(number, files);
    }
  }
}
const authored = new Map();
for (const directory of fs.readdirSync(authoredRoot, {withFileTypes:true})) {
  if (!directory.isDirectory()) continue;
  for (const name of fs.readdirSync(path.join(authoredRoot, directory.name))) {
    if (!name.endsWith('.md')) continue;
    const file = path.join(authoredRoot, directory.name, name);
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const match = text.match(/^\+\+\+json\n([\s\S]*?)\n\+\+\+\n/);
    if (!match) throw new Error('Invalid authored header: '+file);
    const question = JSON.parse(match[1]);
    if (!question.classification.tags.includes('csapp') || !question.classification.tags.includes('practice')) continue;
    const number = question.number.display;
    const rows = authored.get(number) || [];
    rows.push({id: question.id, state: question.publication.state});
    authored.set(number, rows);
  }
}
const byNumber = (a,b) => Number(a.split('.')[1])-Number(b.split('.')[1]);
const report = [];
for (const chapter of [...chapters].sort((a,b)=>a-b)) {
  const numbers = [...exercises.keys()].filter(number=>Number(number.split('.')[0])===chapter).sort(byNumber);
  const missing = numbers.filter(number=>!authored.has(number));
  report.push({chapter, sourceExercises: numbers.length, authoredExercises: numbers.length-missing.length, missing});
}
const duplicateNumbers = [...authored].filter(([,rows])=>rows.length>1).map(([number,questions])=>({number,questions}));
console.log(JSON.stringify({
  note: 'Inventory only: authored does not prove completeness, correctness, or publication. Missing includes exclusions; consult chapter coverage records.',
  sourceAuthority: 'chapter.md exercise headings', masterFiles,
  chapters: report, duplicateNumbers,
  unrecognizedNumbers: [...authored.keys()].filter(number=>!exercises.has(number)),
}, null, 2));
if (duplicateNumbers.length) process.exitCode=1;
}
