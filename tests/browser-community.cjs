'use strict';
// Real browser; all Supabase and Worker traffic mocked. No public test papers.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, '_site/web-data/questions.json'))).questions;
const singles = bank.filter(q => q.type === 'single-choice');
const q1 = singles[0], q2 = singles[1], q3 = singles[2];
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();', '  window.__test = {state, ui}; init();');
function stub() {
  window.__calls = []; window.__papers = window.__seedPaper ? [window.__seedPaper] : []; window.__reports = []; window.__participants = [];
  window.supabase = { createClient() { return {
    channel() { return { on() { return this; }, subscribe() { return this; } }; }, removeChannel() {},
    from(table) { return {
      filters: {}, select() { return this; }, order() { return this; }, eq(k, v) { this.filters[k] = v; return this; },
      in() { return Promise.resolve({ data: [] }); },
      maybeSingle() { return Promise.resolve({ data: table === 'ics_community_papers' ? window.__papers.find(p => p.id === this.filters.id && p.status === 'published') || null : null }); },
      range(start, end) { return Promise.resolve({ data: table === 'ics_community_paper_reports' ? window.__reports.slice(start, end + 1) : [] }); },
      then(resolve, reject) { return Promise.resolve({ data: [] }).then(resolve, reject); },
    }; },
    async rpc(name, args) {
      window.__calls.push({ name, args });
      if (name === 'publish_ics_community_paper') {
        if (window.__publishFail) return { error: { message: 'temporary error' } };
        if (!window.__papers.some(p => p.id === args.p_id)) window.__papers.unshift({ id: args.p_id, title: args.p_title, author_name: args.p_author_name,
          description: args.p_description, question_ids: args.p_question_ids, created_at: new Date().toISOString(), status: 'published', like_count: 0, participant_count: 0, liked: false });
        return { data: args.p_id };
      }
      if (name === 'list_ics_community_papers') {
        if (window.__listFail) return { error: { message: 'Could not find the function in the schema cache' } };
        const papers = window.__papers.filter(p => p.status === 'published').slice();
        if (args.p_sort === 'popular') papers.sort((a, b) => b.like_count - a.like_count);
        return { data: papers.slice(args.p_offset, args.p_offset + 12) };
      }
      const p = window.__papers.find(p => p.id === args.p_id);
      if (name === 'like_ics_community_paper' && p) { p.liked = args.p_liked; p.like_count = Number(p.liked); }
      if (name === 'participate_ics_community_paper' && p && !window.__participants.includes(p.id)) { window.__participants.push(p.id); p.participant_count++; }
      if (name === 'report_ics_community_paper' && p) window.__reports = [{ id: crypto.randomUUID(), paper_id: p.id, paper_title: p.title, message: args.p_message, created_at: new Date().toISOString() }];
      return { data: null };
    },
  }; } };
}
async function main() {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });
    const errors = [], sessions = [], remote = { title: 'Agent 精选', author: '测试署名', description: '固定题单', ids: [q1.id, q2.id, q3.id] };
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => {
      window.__seedPaper = JSON.parse(localStorage.getItem('ics-test-fixture-paper') || 'null');
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { async writeText(text) {
        if (window.__clipboardFail) throw new Error('Clipboard unavailable'); window.__copiedLink = text;
      } } });
    });
    await page.addInitScript(({ ids }) => {
      const attempts = [[ids[0], 0], [ids[0], 1], [ids[1], 1], [ids[2], 0.5], ['q-deadbeefcafebabe', 0]];
      attempts.forEach(([questionId, points], i) => localStorage.setItem('ics-completed-attempt-v1:00000000-0000-4000-8000-' + String(i + 1).padStart(12, '0'), JSON.stringify({
        version: 1, questionId, revision: 1, answeredAt: '2026-10-13T00:00:00Z', points, mode: 'auto', answer: 'LOCAL_ANSWER_PRIVATE',
      })));
    }, { ids: [q1.id, q2.id, q3.id] });
    let accept = true;
    page.on('dialog', dialog => accept ? dialog.accept() : dialog.dismiss());
    await page.route('**/vendor/supabase/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: '(' + stub.toString() + ')();' }));
    await page.route('**/ics-test.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    await page.route('**/rest/v1/**', route => route.abort());
    await page.route('https://ics-test-*.ics-test-mcp.workers.dev/**', async route => {
      const req = route.request();
      if (req.url().endsWith('/papers')) {
        const body = req.postDataJSON();
        const result = await page.evaluate(async b => window.supabase.createClient().rpc('publish_ics_community_paper', {
          p_id:b.paperId,p_visitor_id:b.visitorId,p_title:b.draft.title,p_author_name:b.draft.author,p_description:b.draft.description,p_question_ids:b.draft.ids,
        }), body);
        return route.fulfill({ status: result.error ? 400 : 201, contentType:'application/json', body:JSON.stringify(result.error ? { error:result.error.message } : { id:result.data,published:true }) });
      }
      sessions.push({ method: req.method(), body: req.postData(), headers: req.headers() });
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(req.method() === 'POST'
        ? { sessionId: 'a'.repeat(32), browserToken: 'b'.repeat(64), curationToken: 'a'.repeat(32) + '.' + 'c'.repeat(64) }
        : req.method() === 'GET' ? { draft: remote, revision: 1 } : { disconnected: true }) });
    });
    const cp = key => page.locator('[data-community="' + key + '"]');
    const action = key => page.locator('[data-cp-action="' + key + '"]');
    await page.goto(process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/');
    await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    await page.locator('[name="quiz-mode"][value="exam"]').check();
    await page.locator('[data-paper-kind="community"]').click();
    await page.waitForFunction(() => document.querySelector('[data-community="status"]').textContent.includes('还没有'));
    assert.equal(await page.locator('#ics-start').isVisible(), false);
    await action('create').click(); await cp('pool').locator('article').first().waitFor();
    await cp('history-range').selectOption('attempted'); assert.equal(await cp('pool').locator('article').count(), 3);
    await cp('history-range').selectOption('wrong'); assert.equal(await cp('pool').locator('article').count(), 2);
    await action('add-filtered').click();
    assert.deepEqual(new Set(await page.evaluate(() => JSON.parse(localStorage.getItem('ics-community-draft-v1')).ids)), new Set([q1.id, q3.id]));
    await action('clear').click(); await cp('history-range').selectOption('all');
    await cp('title').fill('手工精选'); await cp('author').fill('作者');
    await cp('search').fill(q1.id); await cp('pool').locator('[data-cp-action="preview"]').click();
    assert.equal(await cp('preview').isVisible(), true);
    assert.equal(await cp('preview-content').locator('script').count(), 0);
    await action('close-preview').click();
    await cp('pool').locator('[data-cp-action="add"]').click();
    await cp('search').fill(q2.id); await cp('pool').locator('[data-cp-action="add"]').click();
    await cp('selected').locator('[data-cp-action="up"]').last().click();
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ics-community-draft-v1')).ids), [q2.id, q1.id]);
    const firstHandle = cp('selected').locator('[data-sort-handle]').first();
    const startBox = await firstHandle.boundingBox(), targetBox = await cp('selected').locator('article').nth(1).boundingBox();
    await page.mouse.move(startBox.x + startBox.width / 2, startBox.y + startBox.height / 2); await page.mouse.down();
    await page.mouse.move(startBox.x + startBox.width / 2, targetBox.y + targetBox.height - 8, { steps: 8 }); await page.mouse.up();
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ics-community-draft-v1')).ids), [q1.id, q2.id], 'mouse drag persists the new order');
    assert.equal(await page.locator('.ics-sort-ghost').count(), 0);
    await cp('selected').locator('[data-sort-handle]').first().press('End');
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ics-community-draft-v1')).ids), [q2.id, q1.id], 'keyboard can move directly to the end');
    const cancelHandle = await cp('selected').locator('[data-sort-handle]').first().boundingBox();
    await page.mouse.move(cancelHandle.x + 10, cancelHandle.y + 10); await page.mouse.down();
    await page.mouse.move(cancelHandle.x + 12, cancelHandle.y + 50, { steps: 3 }); await page.keyboard.press('Escape'); await page.mouse.up();
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ics-community-draft-v1')).ids), [q2.id, q1.id], 'Escape cancels without saving a reorder');
    await cp('search').fill(''); await cp('type').selectOption('fill'); await cp('random-count').fill('2'); await action('random').click();
    assert.equal((await page.evaluate(() => JSON.parse(localStorage.getItem('ics-community-draft-v1')).ids)).length, 4);
    await page.reload(); await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    await page.locator('[name="quiz-mode"][value="exam"]').check(); await page.locator('[data-paper-kind="community"]').click();
    await action('create').click(); await cp('pool').locator('article').first().waitFor();
    assert.equal(await cp('title').inputValue(), '手工精选');
    assert.match(await cp('selected-heading').innerText(), /4 \/ 200/);
    await page.locator('.ics-community-agent > summary').click();
    await page.locator('[data-ca="connect"]').click(); await page.locator('[data-ca="prompt-label"]').waitFor();
    assert.equal(sessions.length, 1); assert.deepEqual(Object.keys(JSON.parse(sessions[0].body)), ['draft']);
    await page.locator('[data-ca="check"]').click(); await page.locator('[data-ca="incoming"]').waitFor();
    assert.equal(await cp('title').inputValue(), '手工精选', 'no automatic replacement');
    assert.equal((await page.evaluate(() => window.__papers)).length, 0, 'Agent cannot publish');
    await page.locator('[data-ca="import"]').click();
    assert.equal(await cp('title').inputValue(), remote.title);
    assert.equal((await page.evaluate(() => window.__papers)).length, 0, 'import is still unpublished');
    // Real touch pointer events, including a stationary drag near the scroll edge.
    await page.setViewportSize({ width: 390, height: 844 });
    await cp('selected').scrollIntoViewIfNeeded(); await cp('selected').evaluate(el => { el.scrollTop = 0; });
    const touch = await page.context().newCDPSession(page);
    await touch.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
    const touchHandle = await cp('selected').locator('[data-sort-handle]').first().boundingBox(), listBox = await cp('selected').boundingBox();
    const touchX = touchHandle.x + touchHandle.width / 2, touchY = touchHandle.y + touchHandle.height / 2;
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: touchX, y: touchY, id: 1 }] });
    await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touchX, y: listBox.y + listBox.height - 5, id: 1 }] });
    await page.waitForFunction(() => { const list = document.querySelector('[data-community="selected"]'); return list.scrollTop > 10 && list.scrollTop + list.clientHeight >= list.scrollHeight - 2; });
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ics-community-draft-v1')).ids), [q2.id, q3.id, q1.id], 'touch drag auto-scrolls and persists');
    await cp('selected').locator('[data-sort-handle="' + q1.id + '"]').press('Home');
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ics-community-draft-v1')).ids), remote.ids);
    await touch.send('Emulation.setTouchEmulationEnabled', { enabled: false }); await touch.detach();
    await page.setViewportSize({ width: 1280, height: 950 });
    if (process.env.ICS_SCREENSHOTS) {
      fs.mkdirSync(process.env.ICS_SCREENSHOTS, { recursive: true });
      await page.locator('#ics-setup').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'community-editor.png') });
      await page.setViewportSize({ width: 390, height: 844 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.locator('#ics-setup').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'community-editor-mobile.png') });
      await page.setViewportSize({ width: 1280, height: 950 });
    }
    await page.evaluate(() => document.querySelector('[data-cp-action="publish"]').click());
    assert.equal((await page.evaluate(() => window.__papers)).length, 0, 'synthetic DOM click cannot publish');
    accept = false; await action('publish').click();
    assert.equal((await page.evaluate(() => window.__papers)).length, 0, 'cancelled confirmation cannot publish'); accept = true;
    await page.evaluate(() => { window.__publishFail = true; }); await action('publish').click();
    await page.waitForFunction(() => document.querySelector('[data-community="editor-status"]').textContent.includes('草稿仍保留'));
    const attemptedId = await page.evaluate(() => window.__calls.find(c => c.name === 'publish_ics_community_paper').args.p_id);
    await page.evaluate(() => { window.__publishFail = false; }); await action('publish').click(); await cp('list').locator('article').waitFor();
    assert.equal((await page.evaluate(() => window.__papers))[0].id, attemptedId, 'same publish ID on retry');
    assert.deepEqual((await page.evaluate(() => window.__papers))[0].question_ids, remote.ids);
    const published = (await page.evaluate(() => window.__papers))[0];
    await action('share').click();
    const sharedUrl = await page.evaluate(() => window.__copiedLink);
    assert.equal(new URL(sharedUrl).search, '?paper=' + published.id);
    assert.equal(new URL(sharedUrl).hash, '');
    await page.evaluate(() => { window.__clipboardFail = true; }); await action('share').click();
    assert.equal(await page.locator('.ics-paper-share-feedback input').inputValue(), sharedUrl);
    await page.evaluate(() => { window.__clipboardFail = false; });
    const popupPromise = page.waitForEvent('popup'); await action('export').click(); const printed = await popupPromise;
    await printed.waitForFunction(() => document.querySelector('#print-save') && !document.querySelector('#print-save').disabled);
    assert.equal(await printed.locator('#paper-questions > article').count(), 3);
    assert.deepEqual(await printed.locator('#paper-questions > article').evaluateAll(items => items.map(item => item.dataset.questionId)), remote.ids);
    assert.equal(await printed.locator('#paper-answers').isVisible(), false);
    assert.ok(!(await printed.locator('body').innerText()).includes('LOCAL_ANSWER_PRIVATE'));
    assert.equal((await page.evaluate(() => window.__calls.filter(c => c.name === 'participate_ics_community_paper'))).length, 0, 'export does not count');
    await printed.close();
    await action('like').click(); await page.waitForFunction(() => document.querySelector('[data-cp-action="like"]').textContent === '取消赞');
    await cp('sort').selectOption('popular'); await cp('list').locator('article').waitFor();
    assert.match(await cp('list').innerText(), /1 赞/);
    await cp('reports').locator('summary').click(); await action('report').click(); await cp('report-message').fill('<script>bad()</script>题单有问题');
    await cp('report').locator('[type="submit"]').click(); await page.waitForFunction(() => document.querySelector('[data-community="report-status"]').textContent.includes('已报告'));
    await cp('reports-list').locator('article').waitFor(); assert.equal(await cp('reports-list').locator('script').count(), 0);
    await action('close-report').click();
    if (process.env.ICS_SCREENSHOTS) {
      fs.mkdirSync(process.env.ICS_SCREENSHOTS, { recursive: true });
      await page.locator('#ics-setup').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'community-desktop.png') });
      await page.setViewportSize({ width: 390, height: 844 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.locator('#ics-setup').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'community-mobile.png') });
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      await page.locator('#ics-setup').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'community-dark.png') });
      await page.setViewportSize({ width: 1280, height: 950 });
    }
    await action('start').click(); await page.locator('#ics-quiz').waitFor();
    assert.match(await page.locator('#ics-community-current').innerText(), /Agent 精选/);
    assert.equal(new URL(page.url()).searchParams.get('paper'), published.id);
    await page.locator('#ics-community-share').click();
    assert.equal(await page.evaluate(() => window.__copiedLink), sharedUrl);
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 950 });
      const quizBox = await page.locator('#ics-quiz').boundingBox(), titleBox = await page.locator('#ics-community-title').boundingBox();
      assert.ok(titleBox.x >= quizBox.x + 16, 'paper title has the same intentional inset as the toolbar');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (process.env.ICS_SCREENSHOTS) await page.locator('#ics-quiz').screenshot({ path: path.join(process.env.ICS_SCREENSHOTS, 'community-quiz-' + width + '.png') });
    }
    await page.setViewportSize({ width: 1280, height: 950 });
    assert.equal((await page.evaluate(() => window.__calls.filter(c => c.name === 'participate_ics_community_paper'))).length, 0, 'opening does not count');
    await page.locator('#ics-skip').click();
    assert.equal((await page.evaluate(() => window.__calls.filter(c => c.name === 'participate_ics_community_paper'))).length, 0, 'skip does not count');
    await page.locator('#ics-show-answer').click(); await page.locator('#ics-next').click();
    assert.equal((await page.evaluate(() => window.__calls.filter(c => c.name === 'participate_ics_community_paper'))).length, 0, 'revealing does not count');
    await page.locator('[data-choice="' + q3.solution.correctOptionIds[0] + '"]').click(); await page.locator('#ics-submit').click();
    await page.waitForFunction(() => window.__calls.some(c => c.name === 'participate_ics_community_paper'));
    assert.equal((await page.evaluate(() => window.__calls.filter(c => c.name === 'participate_ics_community_paper'))).length, 1);
    await page.locator('#ics-abandon').click();
    await page.evaluate(() => { window.__papers[0].status = 'hidden'; }); await action('start').click();
    await page.waitForFunction(() => document.querySelector('[data-community="status"]').textContent.includes('已下架'));
    await page.evaluate(() => { window.__listFail = true; }); await action('refresh').click();
    await page.waitForFunction(() => document.querySelector('[data-community="status"]').textContent.includes('数据库尚未初始化'));
    await page.locator('[data-paper-kind="original"]').click(); assert.equal(await page.locator('#ics-start').isVisible(), true);
    // Reopening a public link reads the current published row; it neither submits nor counts participation.
    await page.evaluate(paper => localStorage.setItem('ics-test-fixture-paper', JSON.stringify(paper)), published);
    await page.goto(sharedUrl); await page.locator('#ics-quiz').waitFor();
    assert.deepEqual(await page.evaluate(() => window.__test.state.questions.map(q => q.id)), remote.ids);
    assert.equal((await page.evaluate(() => window.__calls.filter(c => c.name === 'participate_ics_community_paper'))).length, 0);
    await page.evaluate(paper => localStorage.setItem('ics-test-fixture-paper', JSON.stringify({ ...paper, status: 'hidden' })), published);
    await page.goto(sharedUrl);
    await page.waitForFunction(() => document.querySelector('[data-community="status"]').textContent.includes('已下架'));
    assert.equal(await page.locator('#ics-quiz').isVisible(), false);
    await page.goto(sharedUrl + '&paper=' + published.id);
    await page.waitForFunction(() => document.querySelector('#ics-setup-error').textContent.includes('编号无效'));
    assert.deepEqual(errors, []);
    console.log('Community browser flow passed: drafts, filters, fixed order, MCP manual import, trusted confirmation, retry, likes, reports, counts, mobile, hide and DB-unavailable fallback.');
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
