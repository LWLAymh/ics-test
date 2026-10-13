'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const root = path.resolve(__dirname, '..'), read = file => fs.readFileSync(path.join(root, 'site', file), 'utf8');

test('both HTML entry points enforce a script CSP without inline code or eval', () => {
  for (const name of ['index.html', 'paper-print.html']) {
    const html = read(name), csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
    assert.ok(html.indexOf('Content-Security-Policy') < html.indexOf('<script'));
    const directives = Object.fromEntries(csp.split(';').map(part => part.trim().split(/\s+/)).filter(x => x[0]).map(([key, ...values]) => [key, values]));
    assert.deepEqual(directives['default-src'], ["'none'"]);
    assert.deepEqual(directives['script-src'], ["'self'"]);
    for (const key of ['script-src-attr', 'object-src', 'base-uri', 'form-action', 'frame-src']) assert.deepEqual(directives[key], ["'none'"]);
    assert.ok(!csp.includes("'unsafe-eval'"));
    assert.deepEqual(directives['img-src'], ["'self'", 'data:']);
    assert.deepEqual(directives['font-src'], ["'self'"]);
    if (name === 'paper-print.html') assert.deepEqual(directives['connect-src'], ["'self'"]);
    else assert.deepEqual(directives['connect-src'], ["'self'", 'https://mecmgiejovjmyzptuela.supabase.co',
      'wss://mecmgiejovjmyzptuela.supabase.co', 'https://ics-test-mcp.ics-test-mcp.workers.dev',
      'https://ics-test-community.ics-test-mcp.workers.dev', 'https://api.openai.com', 'https://api.deepseek.com']);
    assert.doesNotMatch(html, /<script\b(?![^>]*\bsrc=)[^>]*>/i);
    assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
    assert.match(html, /name="referrer" content="no-referrer"/);
    assert.ok(html.indexOf('purify.min.js') < html.indexOf('security.js'));
    assert.ok(html.indexOf('security.js') < html.indexOf(name === 'index.html' ? './ics-test.js' : './paper-print.js'));
  }
});

test('MathJax uses the safe extension and cannot dynamically require TeX extensions', () => {
  const boot = read('boot.js');
  assert.match(boot, /load: \['ui\/safe'\]/);
  assert.match(boot, /'\[-\]': \['require', 'autoload'\]/);
  for (const field of ['URLs', 'classes', 'cssIDs', 'styles']) assert.ok(boot.includes(field + ": 'none'"));
});

test('Markdown and received print HTML pass through the same sanitizer', () => {
  assert.match(read('ics-test.js'), /return window\.ICSSecurity\.sanitizeHtml\(md \? md\.render\(content\.text\)/);
  assert.match(read('paper-print.js'), /content\.innerHTML = window\.ICSSecurity\.sanitizeHtml\(answer \? q\.answer : q\.html\)/);
  assert.match(read('security.js'), /ALLOW_DATA_ATTR: false/);
  assert.match(read('security.js'), /SANITIZE_NAMED_PROPS: true/);
});

test('vendored sanitization and formula assets match pinned upstream checksums', () => {
  const { files } = JSON.parse(read('vendor/security-manifest.json'));
  assert.equal(files.length, 3);
  for (const file of files) {
    const digest = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'site/vendor', file.path))).digest('hex');
    assert.equal(digest, file.sha256, file.path);
    assert.equal(new URL(file.source).hostname, 'registry.npmjs.org');
  }
  assert.match(read('vendor/dompurify/purify.min.js'), /DOMPurify 3\.4\.17/);
});
