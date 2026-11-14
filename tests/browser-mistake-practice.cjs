'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),url=process.env.ICS_TEST_URL||'http://127.0.0.1:4189/';
const bank=require('../_site/web-data/questions.json').questions, fixtures=bank.slice(0,20);
const source=fs.readFileSync(path.join(root,'site/ics-test.js'),'utf8').replace('  init();','  window.__test={state,ui,renderQuestion}; init();');
function stub(){
  window.__statsReads=0;window.__inReads=0;window.__writes=[];window.__failStats=false;
  const reports=new Promise(resolve=>{window.__releaseReports=()=>resolve({data:[]});});
  window.supabase={createClient(){return{
    from(table){return{
      select(columns){if(table==='ics_question_stats')window.__lastColumns=columns;return this;},order(){return this;},eq(){return this;},
      maybeSingle(){return Promise.resolve({data:null});},
      in(){window.__inReads++;return Promise.resolve({data:[]});},
      range(start,end){if(table==='ics_question_stats'){window.__statsReads++;return Promise.resolve(window.__failStats?{error:{message:'test offline'}}:{data:window.__statsRows.slice(start,end+1)});}return Promise.resolve({data:[]});},
      then(resolve,reject){return(table==='ics_question_issue_reports'?reports:Promise.resolve({data:[]})).then(resolve,reject);},
    };},
    channel(){return{on(){return this;},subscribe(){return this;}};},removeChannel(){},
    rpc(name){if(!name.startsWith('list_'))window.__writes.push(name);return Promise.resolve({data:[]});},
  };}};
}
async function run(){
  const browser=await chromium.launch({headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:950}}),errors=[],remote=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(({ids})=>{
      window.__statsRows=ids.map((id,i)=>({question_id:id,total_answers:100,correct_answers:i*4}));
      localStorage.setItem('ics-question-mastery-v1',JSON.stringify({version:1,questionIds:[ids[0]]}));
      Object.defineProperty(crypto,'getRandomValues',{value:buffer=>buffer.fill(0)});
    },{ids:fixtures.map(q=>q.id)});
    await page.route('**/vendor/supabase/supabase.js',r=>r.fulfill({contentType:'application/javascript',body:'('+stub.toString()+')();'}));
    await page.route('**/ics-test.js',r=>r.fulfill({contentType:'application/javascript',body:source}));
    await page.route('**/web-data/questions.json',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({schemaVersion:'5',questions:fixtures})}));
    await page.route(u=>/^https?:$/.test(u.protocol)&&u.origin!==new URL(url).origin,r=>{remote.push(r.request().url());return r.abort();});
    await page.goto(url);
    // The reports promise is still unresolved. It must not block normal practice.
    await page.waitForFunction(()=>!document.querySelector('#ics-start').disabled,null,{timeout:10000});
    await page.waitForFunction(()=>window.__test.state.siteStatsLoaded);
    assert.equal(await page.evaluate(()=>window.__statsReads),1);
    assert.match(await page.evaluate(()=>window.__lastColumns),/correct_answers/);
    await page.locator('[name="quiz-mode"][value="mistakes"]').check();
    assert.equal(await page.locator('#ics-mistakes-range').inputValue(),'0.5');
    assert.equal(await page.locator('#ics-mistakes-order').inputValue(),'random');
    assert.equal(await page.locator('#ics-mistakes-skip-mastered').isChecked(),true);
    for(const width of[1280,390,320]){
      await page.setViewportSize({width,height:950});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if(process.env.ICS_SCREENSHOTS){fs.mkdirSync(process.env.ICS_SCREENSHOTS,{recursive:true});await page.locator('#ics-setup').screenshot({path:path.join(process.env.ICS_SCREENSHOTS,'mistake-setup-'+width+'.png')});}
    }
    await page.setViewportSize({width:1280,height:950});
    await page.locator('#ics-count').selectOption('5');await page.locator('#ics-start').click();
    await page.waitForFunction(()=>!document.querySelector('#ics-quiz').hidden);
    assert.deepEqual(await page.evaluate(()=>window.__test.state.questions.map(q=>q.id)),fixtures.slice(2,7).map(q=>q.id));
    assert.match(await page.locator('#ics-question-history').innerText(),/10.*随机.*5/);
    assert.equal(await page.evaluate(()=>window.__statsReads),1,'reuse the existing complete stats snapshot');
    assert.equal(await page.evaluate(()=>window.__inReads),0,'no per-100-question roundtrips');
    await page.locator('#ics-abandon').click();
    await page.locator('#ics-mistakes-order').selectOption('ranked');await page.locator('#ics-mistakes-range').selectOption('0.2');
    await page.locator('#ics-start').click();await page.waitForFunction(()=>!document.querySelector('#ics-quiz').hidden);
    assert.deepEqual(await page.evaluate(()=>window.__test.state.questions.map(q=>q.id)),fixtures.slice(1,5).map(q=>q.id));
    await page.locator('#ics-abandon').click();await page.locator('#ics-mistakes-skip-mastered').uncheck();
    await page.locator('#ics-mistakes-range').selectOption('1');await page.evaluate(()=>{window.__test.state.siteStatsLoadedAt=0;});
    await page.locator('#ics-start').click();await page.waitForFunction(()=>!document.querySelector('#ics-quiz').hidden);
    assert.deepEqual(await page.evaluate(()=>window.__test.state.questions.map(q=>q.id)),fixtures.slice(0,5).map(q=>q.id));
    assert.equal(await page.evaluate(()=>window.__statsReads),2,'refresh a snapshot older than 30 seconds');
    await page.locator('#ics-abandon').click();await page.evaluate(()=>{window.__test.state.siteStatsLoadedAt=0;window.__failStats=true;});
    await page.locator('#ics-start').click();await page.waitForFunction(()=>!document.querySelector('#ics-setup-error').hidden);
    assert.match(await page.locator('#ics-setup-error').innerText(),/无法读取历史错误率/);
    assert.equal(await page.locator('#ics-quiz').isHidden(),true,'do not silently rank stale data after a failed refresh');
    // A second character changes the draft text, not the answer-card status.
    const short=bank.find(q=>q.type==='short-answer');assert.ok(short);
    await page.evaluate(q=>{const{state,ui,renderQuestion}=window.__test;state.questions=[q,...state.questions];state.index=0;state.records=[];state.drafts=[];ui.setup.hidden=true;ui.quiz.hidden=false;renderQuestion();},short);
    const answer=page.locator('[data-short-answer]').first();await answer.fill('x');
    await page.evaluate(()=>{window.__oldCard=document.querySelector('#ics-question-grid').firstElementChild;});
    await answer.fill('xy');
    assert.equal(await page.evaluate(()=>window.__oldCard===document.querySelector('#ics-question-grid').firstElementChild),true,'typing does not rebuild unchanged answer-card buttons');
    assert.match(await page.locator('#ics-navigation-status').innerText(),/草稿/);
    await page.evaluate(()=>window.__releaseReports());
    assert.equal(await page.locator('#ics-local-attempts').textContent(),'0');
    assert.deepEqual(await page.evaluate(()=>window.__writes),[]);assert.deepEqual(errors,[]);assert.deepEqual(remote,[]);
    console.log('Mistake practice passed: scoped random/ranked selection, mastery, cached stats, refresh failure, nonblocking reports and stable answer-card DOM.');
  }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
