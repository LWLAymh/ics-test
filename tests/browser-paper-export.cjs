'use strict';
// Headless print QA. Real local assets; all Supabase writes/network are blocked.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..'), output = path.join(root, 'output/pdf/web-export-qa');
const bank = JSON.parse(fs.readFileSync(path.join(root, '_site/web-data/questions.json'))).questions;
const papers = JSON.parse(fs.readFileSync(path.join(root, '_site/web-data/papers.json'))).papers;
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();', '  window.__test = {exportPaper, community}; init();');
function stub() {
  window.__writes = [];
  window.supabase = { createClient() { return {
    from() { return { select() { return this; }, order() { return this; }, in() { return Promise.resolve({ data: [] }); },
      range() { return Promise.resolve({ data: [] }); }, then(resolve, reject) { return Promise.resolve({ data: [] }).then(resolve, reject); } }; },
    channel() { return { on() { return this; }, subscribe() { return this; } }; }, removeChannel() {},
    rpc(name, args) { window.__writes.push({ name, args }); return Promise.resolve({ data: [] }); },
  }; } };
}
async function run() {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    const context = await browser.newContext(), page = await context.newPage(), errors = [];
    context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
    page.on('pageerror', e => errors.push(e.message));
    await context.route('**/vendor/supabase/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: '(' + stub.toString() + ')();' }));
    await context.route('**/ics-test.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    await context.route('**/rest/v1/**', route => route.abort());
    await context.route('https://ics-test-*.ics-test-mcp.workers.dev/**', route => route.abort());
    await page.goto(process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/');
    await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    await page.locator('[name="quiz-mode"][value="exam"]').check();
    const original = papers.find(p => p.displayName === '2025期末') || papers[0];
    await page.locator('#ics-paper').selectOption(original.id);
    let opened = page.waitForEvent('popup'); await page.locator('#ics-export-paper').click(); let preview = await opened;
    await preview.waitForFunction(() => document.querySelector('#print-save') && !document.querySelector('#print-save').disabled, null, { timeout: 90000 });
    assert.deepEqual(await preview.locator('#paper-questions > article').evaluateAll(items => items.map(q => q.dataset.questionId)), original.questionIds);
    await preview.close();
    const choose = predicate => bank.find(predicate);
    const selected = [...new Map([
      choose(q => q.type === 'composite' && q.stem.text.includes('```') && q.parts.some(p => p.stem.blanks?.length)),
      choose(q => /!\[.*\]\(/.test(q.stem.text)),
      choose(q => q.stem.text.includes('| ---') || q.parts?.some(p => p.stem.text.includes('| ---'))),
      choose(q => q.stem.text.includes('$') && q.type === 'multiple-choice'),
      choose(q => q.stem.text.split('\n').some(line => line.startsWith('|') && line.split('|').length > 12)),
    ].filter(Boolean).map(q => [q.id, q])).values()];
    assert.ok(selected.length >= 3);
    opened = page.waitForEvent('popup');
    await page.evaluate(questions => window.__test.exportPaper(async () => ({
      paper: { title: '打印排版核验：代码、图片、表格、公式', author_name: 'QA', description: '仅本地生成，不发布到精选卷。' }, questions,
    })), selected);
    preview = await opened; await preview.waitForFunction(() => document.querySelector('#print-save') && !document.querySelector('#print-save').disabled, null, { timeout: 90000 });
    assert.equal(await preview.locator('#paper-questions > article').count(), selected.length);
    assert.ok(await preview.locator('img').count() > 0); assert.ok(await preview.locator('pre').count() > 0);
    assert.ok(await preview.locator('table').count() > 0); assert.ok(await preview.locator('mjx-container').count() > 0);
    assert.ok(!(await preview.locator('#paper-questions').innerText()).includes('{{blank:'));
    assert.ok(await preview.locator('.paper-table-wide').count() > 0);
    assert.ok(await preview.locator('table').evaluateAll(tables => tables.every(table => table.scrollWidth <= table.clientWidth + 1)), 'wide tables are not clipped');
    assert.equal(await preview.locator('#paper-answers').isVisible(), false);
    fs.mkdirSync(output, { recursive: true });
    await preview.pdf({ path: path.join(output, 'questions.pdf'), preferCSSPageSize: true, printBackground: true });
    await preview.locator('#print-answers').check();
    await preview.waitForFunction(() => !document.querySelector('#print-save').disabled, null, { timeout: 90000 });
    assert.equal(await preview.locator('#paper-answers > article').count(), selected.length);
    await preview.pdf({ path: path.join(output, 'with-answers.pdf'), preferCSSPageSize: true, printBackground: true });
    await preview.screenshot({ path: path.join(output, 'preview.png'), fullPage: true });
    await preview.setViewportSize({ width: 390, height: 844 });
    assert.ok(await preview.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'mobile preview fits');
    assert.equal(await page.locator('#ics-local-attempts').innerText(), '0');
    assert.equal((await page.evaluate(() => window.__writes)).length, 0, 'printing does not write stats, participation or history');
    assert.deepEqual(errors, []); await preview.close();
    // Missing assets must disable printing, not silently produce an incomplete PDF.
    await context.route('**/web-data/assets/**', route => route.abort());
    opened = page.waitForEvent('popup');
    await page.evaluate(questions => window.__test.exportPaper(async () => ({ paper: { title: 'Missing image check' }, questions })), [selected.find(q => /!\[.*\]\(/.test(q.stem.text))]);
    preview = await opened; await preview.waitForFunction(() => document.querySelector('#print-retry') && !document.querySelector('#print-retry').hidden);
    assert.equal(await preview.locator('#print-save').isDisabled(), true); await preview.close();
    console.log(JSON.stringify({ success: true, originalPaper: original.displayName, printFixtures: selected.length, output,
      includes: ['code', 'images', 'tables', 'math', 'blanks', 'optional answers'], publicWrites: 0 }));
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
