'use strict';
// Providers and public services are mocked: no real keys, charges or public writes.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..'), url = process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/';
const bank = JSON.parse(fs.readFileSync(path.join(root, '_site/web-data/questions.json'))).questions;
const choice = bank.find(q => q.type === 'single-choice' && q.solution.state === 'available');
const fill = bank.find(q => q.type === 'fill' && q.solution.state === 'available' && q.stem.blanks.some(b => b.input === 'text')) || bank.find(q => q.type === 'fill' && q.solution.state === 'available');
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();', '  window.__test = {state, ui, renderQuestion}; init();');
function stub() { window.__writes = []; window.supabase = { createClient() { return {
  from() { return { select() { return this; }, order() { return this; }, eq() { return this; }, maybeSingle() { return Promise.resolve({ data: null }); }, in() { return Promise.resolve({ data: [] }); }, range() { return Promise.resolve({ data: [] }); }, then(resolve, reject) { return Promise.resolve({ data: [] }).then(resolve, reject); } }; },
  channel() { return { on() { return this; }, subscribe() { return this; } }; }, removeChannel() {}, rpc(name, args) { window.__writes.push({ name, args }); return Promise.resolve({ data: [] }); },
}; } }; }
async function fixture(page, questions) { await page.evaluate(questions => { const { state, ui, renderQuestion } = window.__test; state.questions = questions; state.index = 0; state.records = []; state.drafts = []; state.score = 0; ui.setup.hidden = true; ui.result.hidden = true; ui.quiz.hidden = false; renderQuestion(); }, questions); }
const ink = (page, key) => page.locator('[data-ink="' + key + '"]');
async function draw(page) {
  await page.waitForFunction(() => document.querySelector('.ics-ink-overlay').width > 1);
  const paragraph = page.locator('#ics-question-content > *').first(); await paragraph.scrollIntoViewIfNeeded();
  const box = await paragraph.boundingBox();
  await page.mouse.move(box.x + 15, box.y + 15); await page.mouse.down(); await page.mouse.move(box.x + 75, box.y + 30, { steps: 12 }); await page.mouse.up();
  await page.waitForFunction(() => !document.querySelector('[data-ink="undo"]').disabled);
}
async function run() {
  const artifacts = process.env.ICS_SCREENSHOTS || path.join(require('node:os').tmpdir(), 'ics-study-tools'); fs.mkdirSync(artifacts, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, hasTouch: true }), page = await context.newPage(), errors = [], calls = [], foreign = [];
    page.on('pageerror', error => errors.push(error.message));
    await context.route('**/vendor/supabase/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: '(' + stub.toString() + ')();' }));
    await context.route('**/ics-test.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    await context.route(/^https:\/\/api\.(openai|deepseek)\.com\//, async route => {
      calls.push({ url: route.request().url(), body: route.request().postDataJSON() });
      const result = { score: 8, needs_review: false, reason: '<img src=x onerror="window.pwned=1">本次整题评分', strengths: ['正确'], gaps: [], suggestions: [], uncertainty: '' };
      const content = JSON.stringify(result);
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(route.request().url().includes('deepseek') ? { choices: [{ finish_reason: 'stop', message: { content } }] } : { status: 'completed', output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: content }] }] }) });
    });
    await context.route('**/*', route => { const origin = new URL(route.request().url()).origin; if (origin !== new URL(url).origin && !/^https:\/\/api\.(openai|deepseek)\.com$/.test(origin)) { foreign.push(route.request().url()); return route.abort(); } return route.fallback(); });
    const ready = () => page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    await page.goto(url); await ready();
    // Search is lazy and treats both query and snippets as plain text.
    await page.locator('#ics-question-search summary').click();
    await page.locator('#ics-search-query').fill(choice.id); await page.locator('.ics-search-form button').click();
    await page.waitForFunction(() => document.querySelectorAll('.ics-search-results article').length === 1);
    await page.locator('.ics-search-results button').click();
    assert.equal(await page.locator('#ics-question-meta').getAttribute('data-question-id'), choice.id);
    assert.equal(await page.locator('[data-ink-mode="typing"]').getAttribute('aria-pressed'), 'true');
    assert.ok(await page.evaluate(() => document.querySelector('.ics-question-navigation').getBoundingClientRect().bottom < document.querySelector('#ics-question-content').getBoundingClientRect().top));
    assert.equal(await page.locator('#ics-scratchpad').getAttribute('open'), null);
    await page.locator('[data-ink-mode="handwriting"]').click(); await draw(page);
    await ink(page, 'undo').click(); await page.waitForFunction(() => !document.querySelector('[data-ink="redo"]').disabled); await ink(page, 'redo').click();
    await ink(page, 'clear').click(); await ink(page, 'undo').click(); await page.waitForFunction(() => !document.querySelector('[data-ink="undo"]').disabled);
    // Real Chromium pen PointerEvents write over a choice without selecting it.
    const pen = await context.newCDPSession(page), option = page.locator('[data-choice]').first(); await option.scrollIntoViewIfNeeded();
    const penBox = await option.boundingBox(), x = penBox.x + 80, y = penBox.y + 20;
    await pen.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, pointerType: 'pen' });
    await pen.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, pointerType: 'pen', button: 'left', buttons: 1, clickCount: 1, force: 0.5 });
    await pen.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x + 40, y: y + 10, pointerType: 'pen', button: 'left', buttons: 1, force: 0.6 });
    await pen.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: x + 40, y: y + 10, pointerType: 'pen', button: 'left', buttons: 0, clickCount: 1 });
    assert.equal(await page.locator('#ics-answer').inputValue(), '', 'pen annotation must not choose an option');
    // Finger taps still operate choices while the pen/mouse layer is enabled.
    const correct = choice.solution.correctOptionIds[0]; await page.locator('[data-choice="' + correct + '"]').tap();
    assert.equal(await page.locator('#ics-answer').inputValue(), correct);
    assert.equal(await page.locator('#ics-local-attempts').innerText(), '0'); assert.equal(calls.length, 0);
    await page.locator('#ics-submit').click(); await page.waitForFunction(() => document.querySelector('#ics-local-attempts').textContent === '1');
    // Browser-local persistence survives a full reload, including the mode preference.
    await page.waitForFunction(() => document.querySelector('[data-ink="status"]').textContent.includes('已保存'));
    await page.reload(); await ready(); await fixture(page, [choice, fill]);
    await page.waitForFunction(() => document.querySelector('[data-ink="status"]').textContent.includes('已恢复'));
    assert.equal(await page.locator('[data-ink-mode="handwriting"]').getAttribute('aria-pressed'), 'true');
    await page.locator('#ics-next').click(); await page.waitForFunction(() => document.querySelector('.ics-ink-overlay').width > 1);
    // Both text and menu blanks stay usable; switching questions doesn't mix ink.
    const blank = page.locator('.ics-blank-input').first();
    if (await blank.evaluate(el => el.tagName === 'SELECT')) await blank.selectOption({ index: 1 }); else await blank.fill('MY_FILL_INPUT');
    assert.ok(await blank.inputValue()); await draw(page);
    await page.locator('#ics-scratchpad summary').click(); assert.equal(await page.locator('[data-ink-paper]').isVisible(), true);
    await page.locator('#ics-scratchpad summary').click();
    // API configuration causes no request. A text-only remembered consent cannot skip image preview.
    await page.locator('#ics-agent-connection').evaluate(el => { el.open = true; }); await page.locator('#ics-api-settings').evaluate(el => { el.open = true; });
    await page.locator('[data-api="key"]').fill('TEST_ONLY_KEY'); await page.locator('[data-api="consent"]').check(); await page.locator('[data-api="form"] [type="submit"]').click();
    await page.locator('[data-api="ask"]').uncheck(); assert.equal(calls.length, 0);
    await ink(page, 'grade').click();
    await page.waitForFunction(() => document.querySelector('#ics-api-confirm').open || /失败|无法|超过|过长|不支持/.test(document.querySelector('[data-ink="status"]').textContent), null, { timeout: 30000 });
    assert.equal(await page.locator('#ics-api-confirm').isVisible(), true, await ink(page, 'status').innerText());
    const previews = page.locator('[data-confirm="images"] img'); assert.ok(await previews.count() > 0);
    const preview = await previews.first().getAttribute('src'); fs.writeFileSync(path.join(artifacts, 'study-preview.png'), Buffer.from(preview.split(',')[1], 'base64'));
    assert.equal(calls.length, 0);
    await page.locator('[data-confirm="cancel"]').click(); assert.equal(calls.length, 0);
    await ink(page, 'grade').click(); await page.locator('#ics-api-confirm').waitFor();
    await page.locator('[data-confirm="send"]').click();
    await page.waitForFunction(() => !document.querySelector('[data-ink="result"]').hidden);
    assert.equal(calls.length, 1); assert.equal(calls[0].body.input[0].content[1].type, 'input_image');
    assert.ok(!JSON.stringify(calls[0].body).includes('TEST_ONLY_KEY'));
    assert.equal(await page.locator('[data-ink="result"] img').count(), 0); assert.equal(await page.evaluate(() => window.pwned), undefined);
    assert.equal(await page.locator('#ics-local-attempts').innerText(), '1', 'AI suggestion never records an attempt');
    assert.equal(await page.locator('#ics-feedback').isVisible(), false);
    await blank.fill('CHANGED_AFTER_AI'); assert.equal(await page.locator('[data-ink="result"]').isVisible(), false, 'changing an answer invalidates image feedback');
    // Self-grading handwritten fill does not incorrectly mark empty typed fields red.
    await ink(page, 'self').click(); await page.locator('[data-grade="1"]').click();
    assert.equal(await page.locator('#ics-local-attempts').innerText(), '2');
    assert.equal(await page.locator('.ics-inline-blank[data-result="incorrect"]').count(), 0);
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.screenshot({ path: path.join(artifacts, 'study-tools.png'), fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false);
    // The same document remains usable on a narrow screen and in dark mode.
    await page.setViewportSize({ width: 390, height: 844 }); await page.locator('#theme-toggle').click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false);
    await page.locator('[data-ink-mode="typing"]').click(); assert.equal(await blank.inputValue(), 'CHANGED_AFTER_AI');
    assert.equal(await page.locator('[data-ink-mode="typing"]').getAttribute('aria-pressed'), 'true');
    assert.deepEqual(errors, []); assert.deepEqual(foreign, []);
    console.log('Search, touch choices and blanks, ink undo/storage, screenshot consent, AI feedback and self-grading passed.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
