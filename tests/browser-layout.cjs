'use strict';
// Layout-only regression: no real service calls, submissions or private browser data.
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
    const screenshot = async name => {
      if (process.env.ICS_SCREENSHOTS) { fs.mkdirSync(process.env.ICS_SCREENSHOTS, { recursive: true }); await page.screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, name + '.png'), fullPage: true }); }
    };
    for (const width of [1280, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.locator('.ics-resource-grid details[open]').count(), 0);
      const boxes = await page.locator('.ics-resource-grid > section > details > summary').evaluateAll(items => items.map(el => ({ top: el.getBoundingClientRect().top, height: el.getBoundingClientRect().height, width: el.clientWidth, scroll: el.scrollWidth })));
      assert.equal(boxes.length, 3); assert.ok(boxes.every(box => Math.abs(box.top - boxes[0].top) < 1), 'collapsed tools share a row');
      assert.ok(boxes.every(box => box.scroll <= box.width + 1), 'summary text fits ' + width);
      assert.ok(boxes.every(box => Math.abs(box.height - boxes[0].height) < 1), 'compact summaries have equal heights ' + width);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'setup fits ' + width);
      await screenshot('setup-' + width);
      await page.locator('#ics-agent-connection > summary').click();
      assert.ok(await page.locator('#ics-agent-connect').isVisible());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'expanded Agent fits ' + width);
      if (width === 390) await screenshot('agent-' + width);
      await page.locator('#ics-agent-connection > summary').click();
    }
    await page.locator('[name="quiz-mode"][value="exam"]').check(); await page.locator('[data-paper-kind="community"]').click();
    assert.equal(await page.locator('.ics-scope-row').isVisible(), false);
    await page.locator('[data-paper-kind="original"]').click(); assert.equal(await page.locator('.ics-scope-row').isVisible(), true);
    await page.evaluate(q => {
      const { state, ui, renderQuestion } = window.__test; state.questions = [q]; state.index = 0; state.records = []; state.drafts = []; state.score = 0;
      ui.setup.hidden = true; ui.quiz.hidden = false; renderQuestion();
    }, bank.find(q => q.type === 'single-choice'));
    for (const width of [1280, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.locator('.ics-attempt-summary').isVisible(), false, 'focus on the active question');
      assert.ok(await page.evaluate(() => document.querySelector('.ics-question-tools').getBoundingClientRect().bottom < document.querySelector('#ics-question-content').getBoundingClientRect().top));
      assert.equal(await page.locator('.ics-answer-actions #ics-favorite, .ics-answer-actions #ics-copy-agent, .ics-answer-actions #ics-mastery').count(), 0);
      assert.equal(await page.locator('.ics-submit-actions button').count(), 3);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'quiz fits ' + width);
      await screenshot('quiz-' + width);
      if (width === 390) { await page.locator('#theme-toggle').click(); await screenshot('quiz-dark-' + width); await page.locator('#theme-toggle').click(); }
    }
    await page.locator('#ics-report-issue').click();
    assert.equal(await page.locator('#ics-issue-message').evaluate(el => el === document.activeElement), true);
    assert.ok(await page.evaluate(() => document.querySelector('#ics-issue-form').getBoundingClientRect().bottom < document.querySelector('#ics-question-content').getBoundingClientRect().top));
    await page.locator('#ics-issue-cancel').click();
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw Error('unavailable'); } } }));
    await page.locator('#ics-copy-agent').click();
    assert.ok(await page.locator('#ics-agent-copy-panel').isVisible());
    assert.ok(await page.evaluate(() => document.querySelector('#ics-agent-copy-panel').getBoundingClientRect().bottom < document.querySelector('#ics-question-content').getBoundingClientRect().top));
    assert.equal(await page.locator('#ics-local-attempts').textContent(), '0');
    assert.deepEqual(await page.evaluate(() => window.__writes), []); assert.deepEqual(errors, []); assert.deepEqual(remote, []);
    console.log('Layout regression passed: compact resources, expanded panels, practice hierarchy, tools above question, nearby feedback, desktop/mobile/dark and no submissions.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
