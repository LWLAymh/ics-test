'use strict';
// All provider requests intercepted; no real API keys or model charges.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..'), bank = JSON.parse(fs.readFileSync(path.join(root, '_site/web-data/questions.json'))).questions;
const base = bank.find(q => q.type === 'single-choice'), md = text => ({ format: 'markdown', text });
const short = { ...base, id: 'q-eeeeeeeeeeeeeee1', type: 'short-answer', options: undefined, stem: md('请解释程序的局部性。'),
  solution: { state: 'available', grading: 'self', reference: md('说明时间局部性和空间局部性。'), provenance: { origin: 'official', crossChecked: null } } };
const other = { ...short, id: 'q-eeeeeeeeeeeeeee2', stem: md('另一道简答题。') };
const composite = { ...short, id: 'q-eeeeeeeeeeeeeee3', type: 'composite', stem: md('公共题面 ONLY_COMMON'),
  solution: { ...short.solution, grading: 'parts', reference: md('PARENT_REFERENCE_DO_NOT_SEND') }, parts: [
    { ...base, id: 'part-a', number: { display: '(1)' } },
    { ...short, id: 'part-b', number: { display: '(2)' } },
    { ...short, id: 'part-c', number: { display: '(3)' }, solution: { ...short.solution, reference: md('SIBLING_REFERENCE_DO_NOT_SEND') } },
  ] };
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();', '  window.__test = {state, ui, renderQuestion}; init();');
const result = { score: 7, needs_review: false, reason: '基本正确，但缺少适用条件。<script>window.pwned=1</script>', strengths: ['结论正确'], gaps: ['条件未完整'], suggestions: ['补充前提'], uncertainty: '' };
const openai = value => ({ status: 'completed', output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: JSON.stringify(value) }] }] });
function stub() {
  window.__writes = []; window.supabase = { createClient() { return {
    from() { return { select() { return this; }, order() { return this; }, in() { return Promise.resolve({ data: [] }); },
      range() { return Promise.resolve({ data: [] }); }, eq() { return this; }, maybeSingle() { return Promise.resolve({ data: null }); },
      then(resolve, reject) { return Promise.resolve({ data: [] }).then(resolve, reject); } }; },
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
    const page = await browser.newPage({ viewport: { width: 1280, height: 950 } }), calls = [], errors = [];
    let fail = false, delay = false, release = null, delayedReady = null;
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/vendor/supabase/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: '(' + stub.toString() + ')();' }));
    await page.route('**/ics-test.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    await page.route('**/rest/v1/**', route => route.abort());
    await page.route('https://ics-test-*.ics-test-mcp.workers.dev/**', route => route.abort());
    await page.route(/https:\/\/api\.(openai|deepseek)\.com\/.*/, async route => {
      const req = route.request(), data = req.postDataJSON(); calls.push({ url: req.url(), data, headers: req.headers() });
      if (delay) await new Promise(resolve => { release = resolve; if (delayedReady) delayedReady(); });
      await route.fulfill({ status: fail ? 401 : 200, contentType: 'application/json', body: JSON.stringify(fail
        ? { error: { message: 'TEST_KEY_OPENAI_MUST_NOT_LEAK PRIVATE_ANSWER' } }
        : req.url().includes('deepseek') ? { choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(result) } }] } : openai(result)) }).catch(() => {});
    });
    const field = key => page.locator('[data-api="' + key + '"]'), grade = () => page.locator('[data-ai-grade]').first();
    const settings = async () => { await page.locator('#ics-agent-connection').evaluate(el => { el.open = true; }); await page.locator('#ics-api-settings').evaluate(el => { el.open = true; }); };
    const save = async (key, persist = false) => {
      await settings(); await field('key').fill(key); await field('remember').setChecked(persist); await field('consent').check();
      await field('form').locator('[type="submit"]').click();
    };
    await page.goto(process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/'); await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    assert.equal(calls.length, 0);
    await fixture(page, [short, other]); assert.equal(await grade().isDisabled(), true);
    await save('TEST_KEY_OPENAI_MUST_NOT_LEAK');
    assert.equal(calls.length, 0); assert.equal(await page.evaluate(() => localStorage.getItem('ics-ai-grader-config-v1')), null);
    await page.locator('[data-short-answer="root"]').fill('存在时间与空间局部性。');
    await grade().click(); await page.locator('#ics-api-confirm').waitFor(); await page.locator('[data-confirm="cancel"]').click(); assert.equal(calls.length, 0);
    await grade().click(); await page.locator('[data-confirm="skip"]').check(); await page.locator('[data-confirm="send"]').click();
    await page.locator('[data-ai-result]').waitFor(); assert.equal(calls.length, 1);
    assert.equal(await page.locator('[data-ai-result] script').count(), 0); assert.ok(!(await page.evaluate(() => window.pwned)));
    assert.match(await page.locator('[data-ai-result]').innerText(), /7 \/ 10/);
    assert.equal(await page.locator('#ics-local-attempts').innerText(), '0'); assert.equal((await page.evaluate(() => window.__writes)).length, 0);
    assert.ok(!JSON.stringify(calls[0].data).includes('TEST_KEY_OPENAI_MUST_NOT_LEAK'));
    assert.equal(calls[0].headers.authorization, 'Bearer TEST_KEY_OPENAI_MUST_NOT_LEAK');
    assert.equal(calls[0].data.store, false);
    await grade().click(); await page.waitForFunction(() => document.querySelector('[data-ai-status]').textContent.includes('已完成'));
    assert.equal(calls.length, 2); assert.equal(await page.locator('#ics-api-confirm').isVisible(), false);
    await page.locator('[data-short-answer="root"]').fill('修改后的回答'); assert.equal(await page.locator('[data-ai-result]').isVisible(), false);
    await settings(); await field('ask').check(); await grade().click(); await page.locator('#ics-api-confirm').waitFor(); await page.locator('[data-confirm="cancel"]').click();
    assert.equal(calls.length, 2);
    await field('ask').uncheck();
    delay = true; await grade().click(); await page.waitForFunction(() => !document.querySelector('[data-ai-cancel]').hidden);
    await page.locator('#ics-next').click();
    if (release) release(); delay = false;
    assert.equal(await page.locator('[data-ai-result]').isVisible(), false, 'old response cannot attach to the next question');
    await page.locator('[data-short-answer="root"]').fill('另一题待评测回答'); delay = true;
    let waiting = new Promise(resolve => { delayedReady = resolve; }); await grade().click(); await waiting;
    await page.locator('[data-ai-cancel]').click(); release(); delay = false;
    assert.equal(await grade().isEnabled(), true); assert.equal(await page.locator('[data-ai-result]').isVisible(), false);
    delay = true; waiting = new Promise(resolve => { delayedReady = resolve; }); await grade().click(); await waiting;
    await page.locator('[data-short-answer="root"]').fill('请求发出后又修改'); release(); delay = false;
    assert.equal(await grade().isEnabled(), true); assert.equal(await page.locator('[data-ai-result]').isVisible(), false);
    await fixture(page, [composite]);
    assert.equal(await page.locator('[data-ai-grade]').count(), 2, 'only short-answer parts');
    await page.locator('[data-short-answer="1"]').fill('仅评当前简答'); await page.locator('[data-short-answer="2"]').fill('SIBLING_ANSWER_DO_NOT_SEND');
    await grade().click(); await page.locator('[data-ai-result]').first().waitFor();
    const payload = JSON.parse(calls.at(-1).data.input[0].content);
    assert.equal(payload.partId, 'part-b'); assert.equal(payload.commonQuestion, '公共题面 ONLY_COMMON');
    assert.ok(!JSON.stringify(payload).includes('DO_NOT_SEND'));
    await settings(); await field('provider').selectOption('deepseek'); assert.equal(await field('key').inputValue(), '');
    assert.equal(await grade().isDisabled(), true); await save('TEST_KEY_DEEPSEEK', true);
    await grade().click(); await page.locator('#ics-api-confirm').waitFor(); await page.locator('[data-confirm="send"]').click();
    await page.waitForFunction(() => document.querySelector('[data-ai-status]').textContent.includes('已完成'));
    assert.match(calls.at(-1).url, /api.deepseek.com\/chat\/completions/); assert.equal(calls.at(-1).headers.authorization, 'Bearer TEST_KEY_DEEPSEEK');
    const beforeReload = calls.length; await page.reload(); await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    assert.equal(calls.length, beforeReload); assert.match(await page.locator('#ics-api-summary').innerText(), /DeepSeek/);
    await fixture(page, [short]); await page.locator('[data-short-answer="root"]').fill('重载后的回答');
    await settings(); await field('ask').uncheck(); fail = true; await grade().click();
    await page.waitForFunction(() => document.querySelector('[data-ai-status]').textContent.includes('无效或没有权限'));
    assert.ok(!(await page.locator('body').innerText()).includes('PRIVATE_ANSWER')); assert.equal(calls.length, beforeReload + 1); fail = false;
    if (process.env.ICS_SCREENSHOTS) {
      fs.mkdirSync(process.env.ICS_SCREENSHOTS, { recursive: true }); await grade().click(); await page.locator('[data-ai-result]').waitFor();
      await page.screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'ai-desktop.png'), fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 }); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'ai-mobile.png'), fullPage: true });
      await page.locator('#ics-agent-connection').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'ai-mobile-config.png') });
      await page.locator('#ics-quiz').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'ai-mobile-result.png') });
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      await page.locator('#ics-agent-connection').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'ai-mobile-dark.png') });
    }
    await settings(); await field('clear').click(); assert.equal(await field('key').inputValue(), '');
    assert.equal(await page.evaluate(() => localStorage.getItem('ics-ai-grader-config-v1')), null);
    assert.equal(await page.evaluate(() => localStorage.getItem('ics-ai-grader-confirm-v1')), null); assert.equal(await grade().isDisabled(), true);
    assert.equal(await page.locator('#ics-local-attempts').innerText(), '0'); assert.equal((await page.evaluate(() => window.__writes)).length, 0);
    assert.deepEqual(errors, []);
    console.log('Browser API grading passed: explicit consent, optional remembered prompts/keys, provider isolation, read-only feedback, composite whitelist, cancellation, stale response guards, safe errors and mobile layout.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
