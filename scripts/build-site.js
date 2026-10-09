'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '_site');
// Fixed, resolved generated directory only. No user-supplied deletion targets.
if (path.dirname(output) !== root || path.basename(output) !== '_site') throw new Error('Unsafe build output');
const python = process.env.ICS_PYTHON || 'python';
function run(...args) { execFileSync(python, args, { cwd: root, stdio: 'inherit', env: { ...process.env, PYTHONUTF8: '1' } }); }
run('question-bank/_tools/validate_v5.py');
fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(path.join(root, 'site'), output, { recursive: true });
run('question-bank/_tools/build_web_data.py', '--deploy', path.join(output, 'web-data'));
fs.cpSync(path.join(root, 'question-bank/assets'), path.join(output, 'web-data/assets'), { recursive: true });
fs.writeFileSync(path.join(output, '.nojekyll'), '');
run('question-bank/_tools/validate_v5.py', '--web', path.join(output, 'web-data'));
console.log('Built native v5 site; unpublished questions and legacy payloads excluded.');
