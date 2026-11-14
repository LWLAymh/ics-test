'use strict';
// Source-specific regression; never send answers/reports to live services.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..'), paperId = 'p-0439188e8c4bdac1';
const bank = require('../_site/web-data/questions.json').questions;
const paper = require('../_site/web-data/papers.json').papers.find(p => p.id === paperId);
const questions = paper.questionIds.map(id => bank.find(q => q.id === id));
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();', '  window.__test = {state, ui, renderQuestion}; init();');
function stub() {
  window.__writes = [];
  window.supabase = { createClient() { return {
    from() { return { select() { return this; }, order() { return this; }, eq() { return this; }, maybeSingle() { return Promise.resolve({ data: null }); },
      in() { return Promise.resolve({ data: [] }); }, range() { return Promise.resolve({ data: [] }); }, then(resolve, reject) { return Promise.resolve({ data: [] }).then(resolve, reject); } }; },
    channel() { return { on() { return this; }, subscribe() { return this; } }; }, removeChannel() {},
    rpc(name, args) { window.__writes.push({ name, args }); return Promise.resolve({ data: [] }); },
  }; } };
}
async function fixture(page, q) {
  await page.evaluate(async question => {
    const { state, ui, renderQuestion } = window.__test;
    state.questions = [question]; state.index = 0; state.records = []; state.drafts = []; state.score = 0;
    ui.setup.hidden = true; ui.result.hidden = true; ui.quiz.hidden = false; renderQuestion();
    await MathJax.startup.promise; await MathJax.typesetPromise([ui.questionContent]);
  }, q);
}
async function images(page) {
  const results = await page.locator('#ics-question-content img, #paper-questions img, #paper-answers img').evaluateAll(async nodes => Promise.all(nodes.map(async img => {
    img.loading = 'eager'; try { await img.decode(); } catch (_) {} return { src: img.src, ok: img.complete && img.naturalWidth > 0 };
  })));
  for (const result of results) assert.ok(result.ok, result.src);
}
async function answer(page, q, wrong = false) {
  for (const [index, unit] of (q.parts || [q]).entries()) {
    const scope = q.parts ? page.locator('[data-composite-part="' + index + '"]') : page.locator('#ics-app');
    for (const rule of unit.solution.blankAnswers || []) {
      const input = scope.locator('[data-blank-id="' + rule.blankId + '"]').first();
      const value = wrong ? rule.method === 'selection' ? unit.stem.blanks.find(b => b.id === rule.blankId).input.options.find(o => !rule.correctValues.includes(o.value)).value : 'WRONG_VALUE' : rule.acceptedAnswers?.[0] || rule.correctValues[0];
      if (rule.method === 'selection') await input.selectOption(value); else await input.fill(value);
    }
    for (const id of unit.solution.correctOptionIds || []) await scope.locator('[' + (q.parts ? 'data-composite-choice' : 'data-choice') + '="' + id + '"]').click();
  }
  await page.locator('#ics-submit').click();
}
async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 950 } }), errors = [], remote = [];
    page.on('pageerror', error => errors.push(error.message));
    const url = process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/';
    await page.route('**/vendor/supabase/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: '(' + stub.toString() + ')();' }));
    await page.route('**/ics-test.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    await page.route(u => /^https?:$/.test(u.protocol) && u.origin !== new URL(url).origin, route => { remote.push(route.request().url()); return route.abort(); });
    await page.goto(url); await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    await page.locator('[name="quiz-mode"][value="exam"]').check(); await page.locator('#ics-paper').selectOption(paperId);
    const opened = page.waitForEvent('popup'); await page.locator('#ics-export-paper').click(); const preview = await opened;
    preview.on('pageerror', e => errors.push(e.message));
    await preview.waitForFunction(() => document.querySelector('#print-save') && !document.querySelector('#print-save').disabled, null, { timeout: 90000 });
    assert.deepEqual(await preview.locator('#paper-questions > article').evaluateAll(items => items.map(q => q.dataset.questionId)), paper.questionIds);
    const blanks = questions.reduce((n, q) => n + (q.stem.blanks?.length || 0) + (q.parts || []).reduce((s, p) => s + (p.stem.blanks?.length || 0), 0), 0);
    assert.equal(await preview.locator('.paper-blank').count(), blanks); await images(preview);
    await preview.locator('#print-answers').check(); await preview.waitForFunction(() => !document.querySelector('#print-save').disabled);
    assert.equal(await preview.locator('#paper-answers > article').count(), 24); await images(preview);
    assert.equal(await preview.locator('mjx-merror').count(), 0); await preview.close();
    assert.deepEqual(await page.evaluate(() => window.__writes), []);
    await page.locator('#ics-start').click(); await page.waitForFunction(() => !document.querySelector('#ics-quiz').hidden);
    assert.deepEqual(await page.evaluate(() => window.__test.state.questions.map(q => q.id)), paper.questionIds);
    for (const q of questions) {
      await fixture(page, q); await images(page);
      assert.doesNotMatch(await page.locator('#ics-question-content').innerText(), /\{\{blank:/);
      assert.equal(await page.locator('mjx-merror').count(), 0);
      if (q.type !== 'short-answer') {
        await answer(page, q); assert.equal(await page.evaluate(() => window.__test.state.records[0].points), 1, q.number.display);
        assert.equal(await page.locator('#ics-self-grade').isVisible(), false);
        if (q.type === 'fill') assert.equal(await page.locator('.ics-inline-blank[data-result="correct"]').count(), q.stem.blanks.length);
      } else {
        await page.locator('#ics-show-answer').click();
        assert.equal(await page.evaluate(() => window.__test.state.records[0].mode), 'skipped');
      }
      if (q.paperOrder === 17) {
        assert.doesNotMatch(await page.locator('#ics-question-content').innerText(), /\*\*/);
        assert.doesNotMatch(await page.locator('#ics-reference').innerText(), /\*\*/);
      }
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 950 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), q.id + ' width ' + width);
        if (process.env.ICS_SCREENSHOTS && [4, 6, 17, 23, 24].includes(q.paperOrder)) {
          fs.mkdirSync(process.env.ICS_SCREENSHOTS, { recursive: true });
          await page.locator('#ics-quiz').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'q' + q.paperOrder + '-' + width + '.png') });
        }
      }
    }
    for (const q of questions.filter(q => q.type === 'fill')) {
      await fixture(page, q); await answer(page, q, true);
      assert.equal(await page.evaluate(() => window.__test.state.records[0].points), 0, q.number.display);
      assert.equal(await page.locator('.ics-inline-blank[data-result="incorrect"]').count(), q.stem.blanks.length);
    }
    assert.deepEqual(errors, []); assert.deepEqual(remote, []);
    console.log(JSON.stringify({ success: true, paper: paper.displayName, questions: questions.length, blanks, remoteRequests: 0 }));
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
