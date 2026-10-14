'use strict';
// No provider, Worker or Supabase writes: showing a reference is not an attempt.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const contract = require('../site/question-v5.js');
const root = path.resolve(__dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, '_site/web-data/questions.json'))).questions;
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
async function fixture(page, questions) {
  await page.evaluate(qs => {
    const { state, ui, renderQuestion } = window.__test;
    state.questions = qs; state.index = 0; state.records = []; state.drafts = []; state.score = 0;
    ui.setup.hidden = true; ui.result.hidden = true; ui.quiz.hidden = false; renderQuestion();
  }, questions);
}
async function run() {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 950 } }), errors = [], remote = [];
    page.on('pageerror', error => errors.push(error.message));
    const url = process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/';
    await page.route('**/vendor/supabase/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: '(' + stub.toString() + ')();' }));
    await page.route('**/ics-test.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    await page.route(u => /^https?:$/.test(u.protocol) && u.origin !== new URL(url).origin, route => { remote.push(route.request().url()); return route.abort(); });
    await page.goto(url); await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    const single = bank.find(q => q.type === 'single-choice'), multiple = bank.find(q => q.type === 'multiple-choice');
    const fill = bank.find(q => q.id === 'q-f7d13a9c61e54b28'), select = bank.find(q => q.id === 'q-1737c983c32fea14');
    const short = bank.find(q => q.type === 'short-answer');
    const composite = { ...single, type: 'composite', options: undefined, stem: { format: 'markdown', text: '公共题面。' },
      solution: { state: 'available', grading: 'parts', reference: { format: 'markdown', text: '' } },
      parts: [single, fill, select, short].map((q, i) => ({ ...q, id: 'reveal-part-' + i, number: { display: '(' + (i + 1) + ')' } })) };
    for (const question of [single, multiple, fill, select, composite]) {
      await fixture(page, [question, single]);
      for (const input of await page.locator('input.ics-blank-input:not([type="hidden"])').all()) await input.fill('USER_DRAFT');
      const before = await page.locator('.ics-blank-input').evaluateAll(nodes => nodes.map(n => n.value));
      if (question.type === 'single-choice') await page.locator('[data-choice="' + question.options.find(o => !question.solution.correctOptionIds.includes(o.id)).id + '"]').click();
      await page.locator('#ics-show-answer').click();
      for (const unit of question.parts || [question]) {
        const scope = question.parts ? '#ics-question-content [data-composite-part="' + question.parts.indexOf(unit) + '"]' : '#ics-app';
        if (unit.type === 'fill') {
          const expected = unit.stem.blanks.map(b => contract.blankReferenceText(unit.solution.blankAnswers.find(r => r.blankId === b.id), b));
          assert.deepEqual(await page.locator(scope + ' .ics-blank-reference').allTextContents(), expected);
        }
        if (unit.solution.grading === 'choice') assert.equal(await page.locator(scope + ' .ics-choice.is-correct').count(), unit.solution.correctOptionIds.length);
      }
      assert.equal(await page.locator('.ics-choice.is-incorrect,.ics-blank-result').count(), 0, 'references do not judge the unfinished draft');
      assert.deepEqual(await page.locator('.ics-blank-input').evaluateAll(nodes => nodes.map(n => n.value)), before);
      assert.ok(await page.locator('.ics-blank-input').evaluateAll(nodes => nodes.every(n => n.hidden && n.disabled)));
      assert.equal(await page.evaluate(() => window.__test.state.records[0].mode), 'skipped');
      assert.equal(await page.locator('#ics-self-grade').isVisible(), false);
      if (process.env.ICS_SCREENSHOTS && question.type === 'composite') {
        fs.mkdirSync(process.env.ICS_SCREENSHOTS, { recursive: true });
        for (const width of [1280, 390]) {
          await page.setViewportSize({ width, height: 950 });
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          await page.locator('#ics-quiz').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'revealed-' + width + '.png') });
          await page.locator('[data-composite-part="0"]').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'revealed-choice-' + width + '.png') });
          await page.locator('[data-composite-part="1"]').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'revealed-fill-' + width + '.png') });
        }
        await page.setViewportSize({ width: 1280, height: 950 });
      }
      const references = await page.locator('.ics-blank-reference').allTextContents();
      await page.locator('#ics-next').click(); await page.locator('#ics-previous').click();
      assert.deepEqual(await page.locator('.ics-blank-reference').allTextContents(), references);
      assert.equal(await page.evaluate(() => window.__test.state.score), 0);
    }
    // Only literal text is inserted; self-graded blanks are not guessed from prose.
    const special = { ...fill, stem: { format: 'markdown', text: '{{blank:x}} / {{blank:y}}', blanks: [
      { id: 'x', marker: '{{blank:x}}', occurrence: 0, width: 'long' }, { id: 'y', marker: '{{blank:y}}', occurrence: 0, width: 'short' }] },
      solution: { ...fill.solution, blankAnswers: [{ blankId: 'x', method: 'exact', acceptedAnswers: ['<img src=x onerror=alert(1)>'], normalize: { trimWhitespace: true, caseSensitive: true } }, { blankId: 'y', method: 'self' }] } };
    await fixture(page, [special]); await page.locator('#ics-show-answer').click();
    assert.deepEqual(await page.locator('.ics-blank-reference').allTextContents(), ['<img src=x onerror=alert(1)>', '见下方解析']);
    assert.equal(await page.locator('.ics-blank-reference img').count(), 0);
    assert.equal(await page.locator('#ics-local-attempts').innerText(), '0');
    assert.deepEqual(await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('ics-completed-attempt-v1:'))), []);
    assert.deepEqual(await page.evaluate(() => window.__writes), []); assert.deepEqual(remote, []); assert.deepEqual(errors, []);
    console.log('Inline reference viewing passed: literal blanks, dropdowns, choices, composites, restored drafts and zero recorded attempts.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
