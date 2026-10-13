'use strict';
const fs = require('node:fs');
const path = require('node:path');
function artifacts(root, output, questions, papers, catalog) {
  const source = fs.readFileSync(path.join(root, 'supabase/ics_community_papers.sql'), 'utf8');
  const ids = questions.map(q => q.id);
  if (!ids.length || ids.some(id => !/^q-[a-f0-9]{8,64}$/.test(id)) || new Set(ids).size !== ids.length) throw new Error('Invalid community catalog');
  // A generated deployment artifact, not question content conversion.
  const sql = '-- Copy of supabase/ics_community_papers.sql; contains no fixed question-ID registry.\n' + source;
  const sqlDir = path.join(root, 'output/sql'); fs.mkdirSync(sqlDir, { recursive: true });
  fs.writeFileSync(path.join(sqlDir, 'community-setup.sql'), sql);
  const byPaper = new Map(papers.map(p => [p.id, p]));
  const index = { version: 1, modules: catalog.modules.map(m => ({ id: m.id, title: m.title })),
    questions: questions.map(q => ({ id: q.id, type: q.type, moduleIds: q.classification.moduleIds,
      source: byPaper.get(q.paperId).sourceCollection || 'pku-exam', paperId: q.paperId,
      paperName: byPaper.get(q.paperId).displayName, number: q.number.display,
      excerpt: q.stem.text.slice(0, 1200) })) };
  fs.writeFileSync(path.join(output, 'mcp-data/question-index.json'), JSON.stringify(index));
}
module.exports = { artifacts };
