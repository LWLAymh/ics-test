'use strict';
// Source-specific acceptance test. All model/Worker/Supabase traffic is mocked or blocked.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..'), paperId = 'p-9c26b17e83af42d0';
const bank = JSON.parse(fs.readFileSync(path.join(root, '_site/web-data/questions.json'))).questions;
const paper = JSON.parse(fs.readFileSync(path.join(root, '_site/web-data/papers.json'))).papers.find(p => p.id === paperId);
const questions = paper.questionIds.map(id => bank.find(q => q.id === id));
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();', '  window.__test = {state, ui, renderQuestion}; init();');
function stub() {
  window.__writes = [];
  window.supabase = { createClient() { return {
    from() { return { select() { return this; }, order() { return this; }, eq() { return this; }, maybeSingle() { return Promise.resolve({ data: null }); },
      in() { return Promise.resolve({ data: [] }); }, range() { return Promise.resolve({ data: [] }); },
      then(resolve, reject) { return Promise.resolve({ data: [] }).then(resolve, reject); } }; },
    channel() { return { on() { return this; }, subscribe() { return this; } }; }, removeChannel() {},
    rpc(name, args) { window.__writes.push({ name, args }); return Promise.resolve({ data: null }); },
  }; } };
}
async function fixture(page, q) {
  await page.evaluate(question => {
    const { state, ui, renderQuestion } = window.__test;
    state.questions = [question]; state.index = 0; state.records = []; state.drafts = []; state.score = 0;
    ui.setup.hidden = true; ui.result.hidden = true; ui.quiz.hidden = false; renderQuestion();
  }, q);
}
async function answer(page, q, wrong = false) {
  const units = q.type === 'composite' ? q.parts : [q];
  for (const [index, unit] of units.entries()) {
    const scope = q.type === 'composite' ? page.locator('[data-composite-part="' + index + '"]') : page;
    for (const rule of unit.solution.blankAnswers || []) {
      const input = scope.locator('[data-blank-id="' + rule.blankId + '"]').first();
      const value = wrong ? rule.method === 'selection' ? unit.stem.blanks.find(b => b.id === rule.blankId).input.options.find(o => !rule.correctValues.includes(o.value)).value : 'WRONG_VALUE' : rule.acceptedAnswers?.[0] || rule.correctValues[0];
      if (rule.method === 'selection') await input.selectOption(value); else await input.fill(value);
    }
    for (const id of unit.solution.correctOptionIds || []) await scope.locator('[' + (q.type === 'composite' ? 'data-composite-choice' : 'data-choice') + '="' + id + '"]').click();
  }
  if (q.type === 'short-answer') await page.locator('[data-short-answer="root"]').fill('补上非门、另一个与门和最终或门，连接到已有的与门输出。');
  await page.locator('#ics-submit').click();
  if (q.type === 'short-answer') { assert.equal(await page.locator('#ics-self-grade').isVisible(), true); await page.locator('[data-grade="1"]').click(); }
}
async function run() {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 950 } }), errors = [], remote = [];
    page.on('pageerror', error => errors.push(error.message));
    page.context().on('page', popup => popup.on('pageerror', error => errors.push(error.message)));
    await page.route('**/vendor/supabase/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: '(' + stub.toString() + ')();' }));
    await page.route('**/ics-test.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    const url = process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/';
    await page.route(u => /^https?:$/.test(u.protocol) && u.origin !== new URL(url).origin, route => { remote.push(route.request().url()); return route.abort(); });
    await page.goto(url); await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    await page.locator('[name="quiz-mode"][value="exam"]').check(); await page.locator('#ics-paper').selectOption(paperId);
    const opened = page.waitForEvent('popup'); await page.locator('#ics-export-paper').click(); const preview = await opened;
    await preview.waitForFunction(() => document.querySelector('#print-save') && !document.querySelector('#print-save').disabled, null, { timeout: 90000 });
    assert.deepEqual(await preview.locator('#paper-questions > article').evaluateAll(items => items.map(q => q.dataset.questionId)), paper.questionIds);
    assert.equal(await preview.locator('.paper-blank').count(), 45); assert.equal(await preview.locator('mjx-merror').count(), 0);
    await preview.locator('#print-answers').check(); await preview.waitForFunction(() => !document.querySelector('#print-save').disabled);
    assert.equal(await preview.locator('#paper-answers > article').count(), 32); assert.equal(await preview.locator('mjx-merror').count(), 0);
    assert.equal(await preview.locator('img').evaluateAll(images => images.filter(img => img.getAttribute('src')?.includes('/2026-stage2/')).every(img => img.complete && img.naturalWidth > 0)), true);
    await preview.close(); assert.deepEqual(await page.evaluate(() => window.__writes), [], 'export does not record answers');
    await page.locator('#ics-start').click();
    await page.waitForFunction(() => !document.querySelector('#ics-quiz').hidden);
    assert.deepEqual(await page.evaluate(() => window.__test.state.questions.map(q => q.id)), paper.questionIds);
    for (const q of questions) {
      await fixture(page, q); await page.evaluate(() => MathJax.startup.promise);
      assert.ok((await page.locator('#ics-question-content').innerText()).includes(q.number.minor.display));
      assert.equal(await page.locator('#ics-question-content').innerText().then(t => t.includes('{{blank:')), false);
      if (q.stem.text.includes('```')) assert.ok(await page.locator('#ics-question-content pre code').count());
      if (q.type === 'fill') assert.equal(await page.locator('[data-blank-id]').count(), q.stem.blanks.length);
      await answer(page, q); assert.equal(await page.evaluate(() => window.__test.state.records[0].points), 1, q.number.display);
      assert.equal(await page.locator('#ics-self-grade').isVisible(), false, 'objective answers auto-grade; drawing has been explicitly self-graded');
      if (process.env.ICS_SCREENSHOTS && ['q-2dca73d5dccf444f', 'q-9a77d7cdffb04e4d', 'q-dfa03ba70b524f0c', 'q-32cbf14686394a86', 'q-cad504128e474aa5'].includes(q.id)) {
        fs.mkdirSync(process.env.ICS_SCREENSHOTS, { recursive: true });
        await page.evaluate(() => MathJax.typesetPromise([document.querySelector('#ics-question-content'), document.querySelector('#ics-reference')]));
        await page.locator('#ics-quiz').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, q.id + '-desktop.png') });
        await page.setViewportSize({ width: 390, height: 844 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), q.number.display + ' mobile width');
        await page.locator('#ics-quiz').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, q.id + '-mobile.png') });
        await page.setViewportSize({ width: 1280, height: 950 });
      }
    }
    for (const q of questions.filter(q => q.type === 'fill')) {
      await fixture(page, q); await answer(page, q, true);
      assert.equal(await page.evaluate(() => window.__test.state.records[0].points), 0, q.number.display + ' wrong answers');
      assert.equal(await page.locator('.ics-inline-blank[data-result="incorrect"]').count(), q.stem.blanks.length);
    }
    assert.deepEqual(remote, []); assert.deepEqual(errors, []);
    console.log(JSON.stringify({ success: true, paper: paper.displayName, questions: questions.length, blanks: 45, publicRequests: 0 }));
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
