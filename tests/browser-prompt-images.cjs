'use strict';
// Real-browser image regression. All public services are mocked or blocked.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fixtures = require('./prompt-image-fixtures.cjs');
const root = path.resolve(__dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, '_site/web-data/questions.json'))).questions;
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();',
  '  window.__test = {state, ui, renderQuestion}; init();');
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
async function fixture(page, question) {
  await page.evaluate(q => {
    const { state, ui, renderQuestion } = window.__test;
    state.questions = [q]; state.index = 0; state.records = []; state.drafts = []; state.score = 0;
    ui.setup.hidden = true; ui.result.hidden = true; ui.quiz.hidden = false; renderQuestion();
  }, question);
}
async function run() {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 950 } }), errors = [], remote = [];
    page.on('pageerror', error => errors.push(error.message));
    page.context().on('page', popup => popup.on('pageerror', error => errors.push(error.message)));
    const url = process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/';
    await page.route('**/vendor/supabase/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: '(' + stub.toString() + ')();' }));
    await page.route('**/ics-test.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    await page.route(u => /^https?:$/.test(u.protocol) && u.origin !== new URL(url).origin, route => { remote.push(route.request().url()); return route.abort(); });
    await page.goto(url); await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    for (const [id, expected] of fixtures) {
      const q = bank.find(q => q.id === id); assert.ok(q, id);
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 950 }); await fixture(page, q);
        const images = page.locator('#ics-question-content img');
        assert.deepEqual(await images.evaluateAll(nodes => nodes.map(n => decodeURI(new URL(n.src).pathname).split('/web-data/')[1])), expected, id);
        await images.evaluateAll(nodes => Promise.all(nodes.map(n => n.decode())));
        assert.ok(await images.evaluateAll(nodes => nodes.every(n => n.naturalWidth > 0 && n.naturalHeight > 0)), id);
        assert.equal(await page.locator('#ics-question-content [data-composite-part]').count(), q.parts?.length || 0, id);
        const blanks = (q.parts || [q]).reduce((n, p) => n + (p.stem.blanks?.length || 0), 0);
        assert.equal(await page.locator('#ics-question-content .ics-blank-input').count(), blanks, id);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id + ' page width');
        assert.equal(await page.locator('#ics-reference').isVisible(), false, 'reference stays hidden before answering');
        if (process.env.ICS_SCREENSHOTS && ['q-c32ea3cc636c77f7', 'q-80560a1ecf2223dd', 'q-b12725a5ab3fa17b'].includes(id)) {
          fs.mkdirSync(process.env.ICS_SCREENSHOTS, { recursive: true });
          await page.locator('#ics-question-content').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, id + '-' + width + '.png') });
        }
      }
    }
    assert.deepEqual(await page.evaluate(() => window.__writes), [], 'rendering does not submit answers');
    // Loading successfully is stronger than merely checking HTTP 200 (SVGs can contain broken nested images).
    const assets = new Set();
    for (const q of bank) for (const c of [q.stem, ...(q.options || []).map(o => o.content), ...(q.parts || []).flatMap(p => [p.stem, ...(p.options || []).map(o => o.content)])])
      for (const match of c.text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) assets.add(match[1].replace(/^(\.\.\/)+/, ''));
    const failed = await page.evaluate(async paths => {
      const failed = [];
      for (const file of paths) {
        const img = new Image(); img.src = new URL('./web-data/' + file, location.href).href;
        try { await img.decode(); if (!img.naturalWidth) failed.push(file); } catch { failed.push(file); }
      }
      return failed;
    }, [...assets]);
    assert.deepEqual(failed, []);
    // Print previews must carry the same prompt-only figures and no answer section by default.
    for (const id of ['q-c32ea3cc636c77f7', 'q-80560a1ecf2223dd', 'q-d4217f1e765bf0d4', 'q-00a8b5c318a16492']) {
      await page.goto(url); await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
      const question = bank.find(q => q.id === id);
      await page.locator('[name="quiz-mode"][value="exam"]').check();
      await page.locator('#ics-paper').selectOption(question.paperId);
      const opened = page.waitForEvent('popup'); await page.locator('#ics-export-paper').click(); const preview = await opened;
      await preview.waitForFunction(() => {
        const save = document.querySelector('#print-save'); return save && !save.disabled;
      }, null, { timeout: 90000 });
      const images = preview.locator('#paper-questions article[data-question-id="' + id + '"] img');
      assert.deepEqual(await images.evaluateAll(nodes => nodes.map(n => decodeURI(new URL(n.src).pathname).split('/web-data/')[1])), fixtures.find(f => f[0] === id)[1]);
      await images.evaluateAll(nodes => Promise.all(nodes.map(n => n.decode())));
      assert.equal(await preview.locator('#print-answers').isChecked(), false);
      assert.equal(await preview.locator('#paper-answers article').count(), 0);
      assert.equal(await preview.locator('mjx-merror').count(), 0);
      await preview.close();
    }
    assert.deepEqual(await page.evaluate(() => window.__writes), [], 'printing does not record attempts');
    await fixture(page, bank.find(q => q.id === 'q-c32ea3cc636c77f7'));
    await page.locator('[data-choice="C"]').click(); await page.locator('#ics-submit').click();
    assert.equal(await page.evaluate(() => window.__test.state.records[0].points), 1, 'correct key remains C');
    assert.match(await page.locator('#ics-reference').innerText(), /A && \(B \|\| C\)/);
    assert.deepEqual(remote, []); assert.deepEqual(errors, []);
    console.log(JSON.stringify({ success: true, repairedQuestions: fixtures.length, decodedPromptAssets: assets.size, publicRequests: 0 }));
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
