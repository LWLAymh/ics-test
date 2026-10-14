'use strict';
// Favorites never leave the browser. Public services are mocked; print preview uses real local assets.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const contract = require('../site/question-v5.js');
const root = path.resolve(__dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, '_site/web-data/questions.json'))).questions;
const papers = new Map(JSON.parse(fs.readFileSync(path.join(root, '_site/web-data/papers.json'))).papers.map(p => [p.id, p]));
const q1 = bank.find(q => q.type === 'single-choice' && contract.paperCollection(papers.get(q.paperId)) === 'pku-exam');
const q2 = bank.find(q => q.type === 'fill' && q.paperId === q1.paperId) || bank.find(q => q.type === 'fill' && contract.paperCollection(papers.get(q.paperId)) === 'pku-exam');
const q3 = bank.find(q => q.id === 'q-f7d13a9c61e54b28') || bank.find(q => contract.paperCollection(papers.get(q.paperId)) === 'csapp-textbook');
const missing = 'q-deadbeefcafebabe';
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();', '  window.__test = {state, ui, renderQuestion, favorites, refreshFavorites}; init();');
function stub() {
  window.__writes = [];
  window.supabase = { createClient() { return {
    from() { return { select() { return this; }, order() { return this; }, eq() { return this; }, maybeSingle() { return Promise.resolve({ data: null }); },
      in() { return Promise.resolve({ data: [] }); }, range() { return Promise.resolve({ data: [] }); }, then(resolve, reject) { return Promise.resolve({ data: [] }).then(resolve, reject); } }; },
    channel() { return { on() { return this; }, subscribe() { return this; } }; }, removeChannel() {},
    rpc(name, args) { window.__writes.push({ name, args }); return Promise.resolve({ data: [] }); },
  }; } };
}
async function run() {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    const context = await browser.newContext(), page = await context.newPage(), errors = [], remote = [];
    context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
    await context.route('**/vendor/supabase/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: '(' + stub.toString() + ')();' }));
    await context.route('**/ics-test.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    await context.route('**/*', route => {
      if (new URL(route.request().url()).origin !== new URL(process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/').origin) { remote.push(route.request().url()); return route.abort(); }
      return route.fallback();
    });
    page.on('dialog', dialog => dialog.accept());
    const ready = () => page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    await page.goto(process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/'); await ready();
    await page.evaluate(({ ids, missing }) => {
      [[ids[0], 0], [ids[0], 1], [ids[1], 0], [missing, 0]].forEach(([questionId, points], i) => {
        localStorage.setItem('ics-completed-attempt-v1:00000000-0000-4000-8000-' + String(i + 1).padStart(12, '0'), JSON.stringify({
          version: 1, questionId, revision: 1, answeredAt: '2026-10-14T00:00:00Z', points, mode: 'auto', answer: 'PRIVATE_HISTORY',
        }));
      });
    }, { ids: [q1.id, q2.id], missing });
    await page.reload(); await ready();
    await page.locator('#ics-practice-history > summary').click();
    await page.waitForFunction(() => document.querySelector('[data-history-question]:not(:disabled)'));
    await page.locator('#ics-history-wrong-only').check(); await page.locator('#ics-history-select-all').check();
    await page.locator('#ics-history-favorite').click();
    assert.equal(await page.locator('#ics-favorites [data-favorites="count"]').innerText(), '2 题');
    assert.match(await page.locator('#ics-history-delete-status').innerText(), /跳过/);
    await page.locator('#ics-history-favorite').click(); assert.match(await page.locator('#ics-history-delete-status').innerText(), /新增 0/);
    await page.locator('#ics-history-favorites-only').check();
    assert.equal(await page.locator('[data-history-select]').count(), 2);
    await page.locator('#ics-history-wrong-only').uncheck(); assert.equal(await page.locator('[data-history-select]').count(), 3);
    await page.locator('#ics-history-favorites-only').uncheck();
    await page.locator('#ics-favorites > summary').click();
    await page.waitForFunction(() => document.querySelectorAll('[data-favorite-select]').length === 2);
    // An unanswered question can be favorited without creating any attempt or touching mastery.
    await page.evaluate(q => {
      const { state, ui, renderQuestion } = window.__test; state.questions = [q]; state.index = 0; state.records = []; state.drafts = []; state.score = 0;
      ui.setup.hidden = true; ui.quiz.hidden = false; renderQuestion();
    }, q3);
    await page.locator('#ics-favorite').click();
    assert.equal(await page.locator('#ics-favorite').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#ics-local-attempts').innerText(), '4');
    assert.equal(await page.evaluate(() => localStorage.getItem('ics-question-mastery-v1')), null);
    await page.reload(); await ready();
    assert.equal(await page.locator('#ics-favorites [data-favorites="count"]').innerText(), '3 题');
    await page.locator('#ics-favorites > summary').click();
    await page.waitForFunction(() => document.querySelectorAll('[data-favorite-select]').length === 3);
    const panel = page.locator('#ics-favorites'), filter = name => panel.locator('[data-favorites="' + name + '"]');
    await filter('source').selectOption('csapp-textbook'); assert.equal(await panel.locator('[data-favorite-select]').count(), 1);
    await filter('module').selectOption(q3.classification.moduleIds[0]); assert.equal(await panel.locator('[data-favorite-select]').count(), 1);
    await filter('type').selectOption(q3.type); assert.equal(await panel.locator('[data-favorite-select]').count(), 1);
    await filter('search').fill('DOES_NOT_EXIST'); assert.equal(await filter('export-filtered').isDisabled(), true);
    await filter('search').fill(q3.id);
    let opened = page.waitForEvent('popup'); await filter('export-filtered').click(); let preview = await opened;
    await preview.waitForFunction(() => document.querySelector('#print-save') && !document.querySelector('#print-save').disabled, null, { timeout: 90000 });
    assert.deepEqual(await preview.locator('#paper-questions > article').evaluateAll(items => items.map(q => q.dataset.questionId)), [q3.id]);
    assert.equal(await preview.locator('#paper-answers').isVisible(), false);
    assert.equal(await preview.locator('#paper-questions > article').evaluate(el => getComputedStyle(el).breakInside), 'auto');
    if (process.env.ICS_FAVORITES_PDF) {
      fs.mkdirSync(path.dirname(process.env.ICS_FAVORITES_PDF), { recursive: true });
      await preview.pdf({ path: process.env.ICS_FAVORITES_PDF, preferCSSPageSize: true, printBackground: true });
      await preview.locator('#print-answers').check();
      await preview.waitForFunction(() => !document.querySelector('#print-save').disabled);
      await preview.pdf({ path: process.env.ICS_FAVORITES_PDF.replace(/\.pdf$/, '-answers.pdf'), preferCSSPageSize: true, printBackground: true });
    }
    await preview.close();
    await filter('source').selectOption(''); await filter('module').selectOption(''); await filter('type').selectOption('');
    await filter('search').fill(q1.id); await filter('all').check();
    opened = page.waitForEvent('popup'); await filter('export-selected').click(); preview = await opened;
    await preview.waitForFunction(() => document.querySelector('#print-save') && !document.querySelector('#print-save').disabled);
    assert.deepEqual(await preview.locator('#paper-questions > article').evaluateAll(items => items.map(q => q.dataset.questionId)), [q1.id]); await preview.close();
    await filter('search').fill(''); assert.equal(await filter('export-selected').isDisabled(), true, 'filter change clears hidden selection');
    await page.evaluate(id => { window.__test.favorites.add([id]); window.__test.refreshFavorites(); }, missing);
    assert.match(await filter('status').innerText(), /1 道收藏题已下架/);
    opened = page.waitForEvent('popup'); await filter('export-filtered').click(); preview = await opened;
    await preview.waitForFunction(() => document.querySelector('#print-save') && !document.querySelector('#print-save').disabled);
    assert.equal(await preview.locator('#paper-questions > article').count(), 3); await preview.close();
    // Same-origin storage events synchronize favorites, without sending IDs to a service.
    const tab = await context.newPage(); await tab.goto(process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/');
    await tab.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    await tab.evaluate(id => { window.__test.favorites.remove([id]); window.__test.refreshFavorites(); }, q2.id);
    await page.waitForFunction(() => document.querySelector('#ics-favorites [data-favorites="count"]').textContent === '3 题');
    await tab.close();
    // Practice filters and community draft selection both use the same favorites.
    await page.locator('#ics-favorites-only').check(); await page.locator('#ics-start').click();
    await page.waitForFunction(() => !document.querySelector('#ics-quiz').hidden);
    assert.deepEqual(new Set(await page.evaluate(() => window.__test.state.questions.map(q => q.id))), new Set([q1.id, q3.id]));
    await page.locator('#ics-abandon').click(); await page.locator('[name="quiz-mode"][value="exam"]').check();
    await page.locator('[data-paper-kind="community"]').click();
    await page.locator('[data-cp-action="create"]').click(); await page.locator('[data-community="history-range"]').selectOption('favorites');
    assert.equal(await page.locator('[data-community="pool"] article').count(), 2);
    assert.equal(await page.locator('#ics-favorites-only').isVisible(), false);
    // Favorite list excerpts are literal text, not executable HTML or Markdown.
    await page.evaluate(id => {
      const q = window.__test.state.questions.find(q => q.id === id); if (q) q.stem.text = '<img src=x onerror=alert(1)>' + q.stem.text;
      window.__test.refreshFavorites();
    }, q1.id);
    assert.ok((await panel.locator('.ics-favorite-excerpt').allTextContents()).some(text => text.includes('<img src=x onerror=alert(1)>')));
    assert.equal(await panel.locator('img').count(), 0);
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'favorites layout fits ' + width);
      if (process.env.ICS_SCREENSHOTS) { fs.mkdirSync(process.env.ICS_SCREENSHOTS, { recursive: true }); await panel.screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'favorites-' + width + '.png') }); }
    }
    await filter('search').fill(missing); await filter('all').check(); await filter('remove-selected').click();
    assert.equal(await panel.locator('[data-favorite-select]').count(), 0);
    assert.equal(await page.locator('#ics-local-attempts').innerText(), '4');
    // Quota failures must be visible, not claimed as saved to disk.
    await page.evaluate(q => {
      const write = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) { if (key.startsWith('ics-favorite-v1:')) throw new Error('Quota exceeded'); return write.call(this, key, value); };
      const { state, ui, renderQuestion } = window.__test; state.questions = [q]; state.index = 0; state.records = []; state.drafts = []; state.score = 0;
      ui.setup.hidden = true; ui.quiz.hidden = false; renderQuestion();
    }, q2);
    await page.locator('#ics-favorite').click(); assert.match(await page.locator('#ics-favorite-status').innerText(), /临时/);
    assert.equal(await page.evaluate(id => localStorage.getItem('ics-favorite-v1:' + id), q2.id), null);
    await page.locator('#ics-favorite').click(); assert.equal(await page.locator('#ics-favorite').getAttribute('aria-pressed'), 'false');
    assert.deepEqual(await page.evaluate(() => window.__writes.filter(x => !x.name.startsWith('list_'))), []);
    assert.deepEqual(remote, []); assert.deepEqual(errors, []);
    console.log('Favorites browser flow passed: local persistence, history batch selection, filters, print export, hidden questions, multi-tab sync, practice and mobile.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
