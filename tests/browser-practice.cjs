'use strict';
// Real-browser pairing regression. All session/Supabase traffic is mocked.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'question-bank/web-data/questions.json'))).questions;
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();',
  '  window.__test = {state, ui, renderQuestion}; init();');
const base = bank.find(q => q.type === 'single-choice');
const markdown = text => ({ format: 'markdown', text });
const single = { ...base, stem: markdown('当前选择题'), options: [
  { id: 'A', content: markdown('甲') }, { id: 'B', content: markdown('乙') },
], solution: { ...base.solution, correctOptionIds: ['B'] } };
const fill = { ...base, id: 'q-0000000000000003', type: 'fill', options: undefined,
  stem: { ...markdown('填写 {{blank:x}}，再次出现 {{blank:x}}。'),
    blanks: [0, 1].map(occurrence => ({ id: 'x', marker: '{{blank:x}}', occurrence, width: 'short' })) },
  solution: { state: 'available', grading: 'blanks', reference: markdown('REFERENCE_PRIVATE'),
    provenance: { origin: 'unknown', crossChecked: null },
    blankAnswers: [{ blankId: 'x', method: 'exact', acceptedAnswers: ['REFERENCE_PRIVATE'] }] } };
const multiFill = { ...fill, stem: { ...markdown('请选择 {{blank:x}}。'), blanks: [
  { id: 'x', marker: '{{blank:x}}', occurrence: 0, width: 'short',
    input: { kind: 'select', multiple: true, options: [
      { value: '<', label: '小于' }, { value: '=', label: '等于' }, { value: '>', label: '大于' },
    ] } },
] } };
const composite = { ...base, id: 'q-0000000000000005', type: 'composite', options: undefined,
  stem: markdown('综合题'), solution: { ...base.solution, grading: 'parts' }, parts: [
    { ...single, id: 'part-a', number: { display: '(1)' } },
    { ...multiFill, id: 'part-b', number: { display: '(2)' } },
  ] };
function installSupabaseMock() {
  window.__writes = [];
  window.supabase = { createClient() { return {
    from() { return {
      select() { return this; }, order() { return this; }, in() { return Promise.resolve({ data: [] }); },
      then(resolve, reject) { return Promise.resolve({ data: [] }).then(resolve, reject); },
      range() { return Promise.resolve({ data: [] }); }, eq() { return this; },
      maybeSingle() { return Promise.resolve({ data: null }); },
    }; },
    channel() { return { on() { return this; }, subscribe() { return this; } }; }, removeChannel() {},
    rpc(name, args) { window.__writes.push({ name, args }); return Promise.resolve({ data: null }); },
  }; } };
}
async function fixture(page, questions) {
  await page.evaluate(questions => {
    const { state, ui, renderQuestion } = window.__test;
    state.questions = questions; state.index = 0; state.records = []; state.drafts = []; state.score = 0;
    ui.setup.hidden = true; ui.result.hidden = true; ui.quiz.hidden = false; renderQuestion();
  }, questions);
}
async function run() {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [], calls = [];
    page.on('pageerror', error => errors.push(error.message));
    const sessionId = 'a'.repeat(32), writeToken = 'b'.repeat(64), readToken = 'c'.repeat(64);
    let remote = null, revoked = false;
    await page.route('**/vendor/supabase/supabase.js', route => route.fulfill({
      contentType: 'application/javascript', body: '(' + installSupabaseMock.toString() + ')();',
    }));
    await page.route('**/ics-test.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    await page.route('**/rest/v1/**', route => route.abort());
    await page.route('https://ics-test-mcp.ics-test-mcp.workers.dev/**', async route => {
      const request = route.request(), method = request.method();
      if (method === 'OPTIONS') return route.fulfill({ status: 204 });
      const body = request.postDataJSON();
      calls.push({ method, body, headers: request.headers() });
      if (method === 'POST') remote = { ...body, updatedAt: Date.now(), expiresAt: Date.now() + 7200000 };
      if (method === 'PUT') {
        assert.equal(request.headers().authorization, 'Bearer ' + writeToken);
        remote = { ...remote, ...body, updatedAt: Date.now() };
      }
      if (method === 'DELETE') revoked = true;
      await route.fulfill({ status: method === 'POST' ? 201 : 200, contentType: 'application/json',
        body: JSON.stringify(method === 'POST'
          ? { ...remote, sessionId, writeToken, connectionToken: sessionId + '.' + readToken }
          : method === 'DELETE' ? { disconnected: true } : remote) });
    });
    await page.goto(process.env.ICS_TEST_URL || 'http://127.0.0.1:4187/');
    await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    await fixture(page, [single, fill]);
    await page.locator('[data-choice="A"]').click();
    await page.waitForTimeout(1800);
    assert.equal(calls.length, 0, 'opt-in: displaying and filling questions must not create sessions');
    await page.locator('#ics-agent-connection summary').click();
    await page.locator('#ics-agent-connect').click();
    await page.waitForFunction(() => !document.querySelector('#ics-agent-copy-connection').disabled);
    assert.deepEqual(remote.draft.choices, ['A']);
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true,
      value: { writeText: async text => { window.__copied = text; } } }));
    await page.locator('#ics-agent-copy-connection').click();
    const prompt = await page.evaluate(() => window.__copied);
    assert.ok(prompt.includes(readToken)); assert.ok(!prompt.includes(writeToken));
    assert.equal(await page.evaluate(() => Object.values(localStorage).some(v => v.includes('c'.repeat(64)))), false);
    await page.locator('[data-choice="B"]').click();
    await page.waitForTimeout(1800); assert.deepEqual(remote.draft.choices, ['B']);
    await page.locator('#ics-next').click();
    await page.waitForTimeout(100);
    assert.equal(remote.questionId, fill.id); assert.deepEqual(remote.draft.choices, []);
    await page.locator('.ics-blank-input').first().fill('retq');
    await page.waitForTimeout(1800);
    assert.deepEqual(remote.draft.blanks, [{ id: 'x', value: 'retq' }], 'deduplicate repeated blank');
    assert.equal(await page.locator('.ics-blank-input').last().inputValue(), 'retq');
    assert.ok(!JSON.stringify(calls).includes('REFERENCE_PRIVATE'));
    await page.locator('#ics-previous').click();
    await page.waitForTimeout(100); assert.deepEqual(remote.draft.choices, ['B'], 'restore current draft on navigation');
    await page.uncheck('#ics-agent-share-draft');
    await page.waitForTimeout(100);
    assert.equal(remote.shareDraft, false); assert.equal(remote.draft, null);
    const count = calls.length;
    await page.locator('[data-choice="A"]').click();
    await page.waitForTimeout(1800); assert.equal(calls.length, count);
    await page.check('#ics-agent-share-draft');
    await page.waitForTimeout(100); assert.deepEqual(remote.draft.choices, ['A']);
    await fixture(page, [composite]);
    await page.locator('[data-composite-choice="B"]').click();
    await page.waitForTimeout(1800);
    assert.equal(remote.partId, 'part-a'); assert.deepEqual(remote.draft.parts[0].choices, ['B']);
    await page.locator('[data-blank-toggle]').click();
    await page.locator('[data-blank-option][value="<"]').check();
    await page.locator('[data-blank-option][value="="]').check();
    await page.waitForTimeout(1800);
    assert.equal(remote.partId, 'part-b');
    assert.deepEqual(remote.draft.parts[1].blanks, [{ id: 'x', value: ['<', '='] }]);
    assert.equal(calls.filter(call => call.method === 'POST').length, 1, 'navigation reuses a single pairing');
    await page.locator('#ics-abandon').click();
    await page.waitForTimeout(100);
    assert.equal(remote.questionId, null); assert.equal(remote.draft, null);
    await page.locator('#ics-agent-disconnect').click();
    await page.waitForTimeout(100); assert.equal(revoked, true);
    assert.equal(await page.locator('#ics-agent-connection-prompt').inputValue(), '');
    const finalCount = calls.length;
    await fixture(page, [single]); await page.locator('[data-choice="B"]').click();
    await page.waitForTimeout(1800); assert.equal(calls.length, finalCount);
    assert.deepEqual(await page.evaluate(() => window.__writes), [], 'pairing never submits answers');
    assert.deepEqual(errors, []);
    await page.setViewportSize({ width: 390, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'mobile layout should not overflow');
    if (process.env.ICS_SCREENSHOTS) {
      fs.mkdirSync(process.env.ICS_SCREENSHOTS, { recursive: true });
      await page.screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'practice-connection-mobile.png'), fullPage: true });
    }
    console.log('Browser pairing passed: consent, current choices/fills/composite, read-key-only copy, sharing toggle, clear, revoke, no grading writes.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
