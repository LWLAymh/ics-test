'use strict';
// Read-only display audit. Human/source review remains in docs/AUDIT_*.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..'), url = process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/';
const all = require('../_site/web-data/questions.json').questions;
const selected = process.env.ICS_AUDIT_PAPERS?.split(',');
const bank = selected ? all.filter(q => selected.includes(q.paperId)) : all;
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();', '  window.__test = {state, ui, renderQuestion}; init();');
function stub() {
  window.supabase = { createClient() { return {
    from() { return { select() { return this; }, order() { return this; }, eq() { return this; }, maybeSingle() { return Promise.resolve({ data: null }); },
      in() { return Promise.resolve({ data: [] }); }, range() { return Promise.resolve({ data: [] }); }, then(resolve, reject) { return Promise.resolve({ data: [] }).then(resolve, reject); } }; },
    channel() { return { on() { return this; }, subscribe() { return this; } }; }, removeChannel() {},
    rpc() { return Promise.resolve({ data: [] }); },
  }; } };
}
async function run() {
  const browser = await chromium.launch({ headless: true });
  const failures = [], errors = [], remote = []; let images = 0;
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/vendor/supabase/supabase.js', r => r.fulfill({ contentType: 'application/javascript', body: '(' + stub.toString() + ')();' }));
    await page.route('**/ics-test.js', r => r.fulfill({ contentType: 'application/javascript', body: source }));
    await page.route(u => /^https?:$/.test(u.protocol) && u.origin !== new URL(url).origin, r => { remote.push(r.request().url()); return r.abort(); });
    await page.goto(url); await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    for (const [index, q] of bank.entries()) {
      try {
        await page.evaluate(async question => {
          const { state, ui, renderQuestion } = window.__test;
          state.questions = [question]; state.index = 0; state.records = []; state.drafts = []; state.score = 0;
          ui.setup.hidden = true; ui.result.hidden = true; ui.quiz.hidden = false; renderQuestion();
          await MathJax.startup.promise; await MathJax.typesetPromise([ui.questionContent]);
        }, q);
        assert.doesNotMatch(await page.locator('#ics-question-content').innerText(), /\{\{blank:/, 'unreplaced marker');
        const expected = (q.stem.blanks?.length || 0) + (q.parts || []).reduce((n, p) => n + (p.stem.blanks?.length || 0), 0);
        assert.equal(await page.locator('#ics-question-content [data-blank-id]').count(), expected, 'rendered blank count');
        await page.locator('#ics-show-answer').click();
        await page.evaluate(async () => { await MathJax.typesetPromise([document.querySelector('#ics-reference')]); });
        assert.equal(await page.locator('mjx-merror').count(), 0, 'MathJax error');
        const decoded = await page.locator('#ics-question-content img, #ics-reference img').evaluateAll(async imgs => Promise.all(imgs.map(async img => {
          img.loading = 'eager'; try { await img.decode(); } catch (_) {} return { src: img.src, ok: img.complete && img.naturalWidth > 0 };
        })));
        images += decoded.length; for (const img of decoded) assert.ok(img.ok, img.src);
        for (const width of [1280, 390]) {
          await page.setViewportSize({ width, height: 950 });
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'page overflow at ' + width);
          if (process.env.ICS_AUDIT_OUTPUT && process.env.ICS_AUDIT_CAPTURE?.split(',').includes(q.id)) {
            fs.mkdirSync(process.env.ICS_AUDIT_OUTPUT, { recursive: true });
            await page.locator('#ics-quiz').screenshot({ path: path.join(process.env.ICS_AUDIT_OUTPUT, q.id + '-' + width + '.png') });
          }
        }
      } catch (e) {
        failures.push({ id: q.id, paperId: q.paperId, number: q.number.display, error: e.message });
        if (process.env.ICS_AUDIT_OUTPUT) {
          fs.mkdirSync(process.env.ICS_AUDIT_OUTPUT, { recursive: true });
          await page.screenshot({ path: path.join(process.env.ICS_AUDIT_OUTPUT, q.id + '.png'), fullPage: true });
        }
      }
      if ((index + 1) % 50 === 0) console.log('Rendered ' + (index + 1) + '/' + bank.length);
    }
    assert.equal(await page.locator('#ics-local-attempts').textContent(), '0');
    const result = { questions: bank.length, decodedImages: images, failures, errors, remote };
    if (process.env.ICS_AUDIT_OUTPUT) {
      fs.mkdirSync(process.env.ICS_AUDIT_OUTPUT, { recursive: true });
      fs.writeFileSync(path.join(process.env.ICS_AUDIT_OUTPUT, 'result.json'), JSON.stringify(result, null, 2));
    }
    console.log(JSON.stringify(result));
    assert.deepEqual(failures, []); assert.deepEqual(errors, []); assert.deepEqual(remote, []);
  } finally { await browser.close(); }
}
run().catch(e => { console.error(e); process.exitCode = 1; });
