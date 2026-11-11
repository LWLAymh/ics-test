'use strict';
// Render repaired authored math with real Markdown and MathJax, with no service writes.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..'), url = process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/';
const bank = JSON.parse(fs.readFileSync(path.join(root, '_site/web-data/questions.json'))).questions;
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();', '  window.__test = {state, ui, renderQuestion}; init();');
function stub() {
  window.__writes = [];
  window.supabase = { createClient() { return {
    from() { return { select() { return this; }, order() { return this; }, eq() { return this; }, maybeSingle() { return Promise.resolve({ data: null }); },
      in() { return Promise.resolve({ data: [] }); }, range() { return Promise.resolve({ data: [] }); }, then(resolve, reject) { return Promise.resolve({ data: [] }).then(resolve, reject); } }; },
    channel() { return { on() { return this; }, subscribe() { return this; } }; }, removeChannel() {},
    rpc(name) { if (!name.startsWith('list_')) window.__writes.push(name); return Promise.resolve({ data: [] }); },
  }; } };
}
async function run() {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    const page = await browser.newPage(), errors = [], remote = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/vendor/supabase/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: '(' + stub.toString() + ')();' }));
    await page.route('**/ics-test.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    await page.route(u => /^https?:$/.test(u.protocol) && u.origin !== new URL(url).origin, route => { remote.push(route.request().url()); return route.abort(); });
    await page.goto(url); await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    for (const id of ['q-521d76fb06b284d2', 'q-5be6279e59ba1151']) {
      const q = bank.find(q => q.id === id); assert.ok(q);
      await page.evaluate(async question => {
        const { state, ui, renderQuestion } = window.__test; state.questions = [question]; state.index = 0; state.records = []; state.drafts = []; state.score = 0;
        ui.setup.hidden = true; ui.quiz.hidden = false; renderQuestion();
        await MathJax.startup.promise; await MathJax.typesetPromise([ui.questionContent]);
      }, q);
      if (id === 'q-521d76fb06b284d2') {
        assert.equal(await page.locator('#ics-question-content table mjx-msub').count(), 15, 'all binary address bases are actual subscripts');
        assert.equal(await page.locator('#ics-question-content .ics-blank-input').count(), 3);
        assert.ok(!(await page.locator('#ics-question-content').innerText()).includes('_{2}'));
      } else {
        await page.locator('#ics-show-answer').click();
        await page.evaluate(async () => { await MathJax.typesetPromise([document.querySelector('#ics-reference')]); });
        assert.ok(await page.locator('#ics-reference mjx-msub').count() >= 12);
        assert.doesNotMatch(await page.locator('#ics-reference').innerText(), /_\{[012]\}|`|\$/);
        assert.equal(await page.locator('#ics-reference code').count(), 0, 'formulas are not swallowed by code spans');
        assert.equal(await page.locator('#ics-reference ol[start="2"] > li').count(), 5, 'each explanation remains a separate numbered item');
      }
      assert.equal(await page.locator('mjx-merror').count(), 0);
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 900 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id + ' fits ' + width);
        if (process.env.ICS_SCREENSHOTS) {
          fs.mkdirSync(process.env.ICS_SCREENSHOTS, { recursive: true });
          const target = id === 'q-521d76fb06b284d2' ? page.locator('#ics-question-content') : page.locator('#ics-reference');
          await target.screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, id + '-' + width + '.png') });
        }
      }
    }
    assert.equal(await page.locator('#ics-local-attempts').textContent(), '0');
    assert.deepEqual(await page.evaluate(() => window.__writes), []); assert.deepEqual(errors, []); assert.deepEqual(remote, []);
    console.log('Authored math regression passed: all 15 binary subscripts, restored cache formulas, desktop/mobile and zero recorded attempts.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
