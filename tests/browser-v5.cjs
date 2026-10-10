'use strict';
// Optional real-browser regression: npm install --no-save playwright, start _site
// on port 4186, then node tests/browser-v5.cjs. No Supabase requests are made.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const all = JSON.parse(fs.readFileSync(path.join(root, 'question-bank/web-data/questions.json'))).questions;
const source = fs.readFileSync(path.join(root, 'site/ics-test.js'), 'utf8').replace('  init();',
  '  window.__test = {state, ui, renderQuestion, renderSolution, renderContent, rankByErrorRate, loadQuestionBank}; init();');
const stub = `window.__writes=[];window.__rows={};window.supabase={createClient(){return {
from(){return {select(){return this},order(){return Promise.resolve({data:[]})},
in(k,ids){return Promise.resolve({data:ids.map(id=>window.__rows[id]).filter(Boolean)})},
eq(k,id){this.id=id;return this},maybeSingle(){return Promise.resolve({data:window.__rows[this.id]||null})}}},
channel(){return {on(){return this},subscribe(){return this}}},removeChannel(){},
rpc(name,args){window.__writes.push({name,args});return Promise.resolve({data:null})}}}};`;
function content(text, blanks) { return { format: 'markdown', text, ...(blanks ? {blanks} : {}) }; }
function solution(grading, extra = {}) {
  return { state:'available', grading, reference:content('人工参考答案。'), provenance:{origin:'unknown',crossChecked:null}, ...extra };
}
function blank(id, occurrence=0) { return {id, marker:'{{blank:'+id+'}}', occurrence, width:'short'}; }
function rule(id, answer) { return {blankId:id, method:'exact', acceptedAnswers:[answer], normalize:{trimWhitespace:true,caseSensitive:true}}; }
const base = all.find(q=>q.type==='single-choice');
const single = {...base, stem:content('选择正确结果。\n\n```c\nint x = 3;\n```'),
  options:[{id:'A',content:content('`3`')},{id:'B',content:content('`6`')}], solution:solution('choice',{correctOptionIds:['B']})};
const multiple = {...single,id:'q-0000000000000002',type:'multiple-choice',solution:solution('choice',{correctOptionIds:['A','B']})};
const fill = {...base,id:'q-0000000000000003',type:'fill', options:undefined,
  stem:content('```c\nint x = {{blank:x}};\n```\n\n| 值 | 结果 |\n| --- | --- |\n| x | {{blank:x}} |', [blank('x'),blank('x',1)]),
  solution:solution('blanks',{blankAnswers:[rule('x','42')]})};
const short = {...base,id:'q-0000000000000004',type:'short-answer',options:undefined,stem:content('解释原因。'),solution:solution('self')};
const composite = {...base,id:'q-0000000000000005',type:'composite',options:undefined,stem:content('共用题面。'),solution:solution('parts'),parts:[
  {...single,id:'part-a',number:{display:'(1)'}},
  {...fill,id:'part-b',number:{display:'(2)'}},
  {...short,id:'part-c',number:{display:'(3)'}},
]};
async function fixture(page, qs) {
  await page.evaluate(questions=>{const {state,ui,renderQuestion}=window.__test;
    state.questions=questions;state.index=0;state.score=0;state.records=[];state.drafts=[];
    ui.setup.hidden=true;ui.result.hidden=true;ui.quiz.hidden=false;document.querySelector('#ics-question-map').open=true;
    renderQuestion();}, qs);
}
async function run() {
  const browser = await chromium.launch({headless:true, ...(process.env.PLAYWRIGHT_CHANNEL ? {channel:process.env.PLAYWRIGHT_CHANNEL} : {})});
  try {
    const page = await browser.newPage({viewport:{width:1280,height:900}});
    const errors=[]; page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/vendor/supabase/supabase.js',route=>route.fulfill({contentType:'application/javascript',body:stub}));
    await page.route('**/ics-test.js',route=>route.fulfill({contentType:'application/javascript',body:source}));
    await page.route('**/rest/v1/**',route=>route.abort());
    await page.goto(process.env.ICS_TEST_URL || 'http://127.0.0.1:4186/');
    await page.waitForFunction(()=>!document.querySelector('#ics-start').disabled);
    const initialPapers=await page.evaluate(()=>window.__test.state.papers);
    assert.equal(await page.locator('#ics-paper option').count(),initialPapers.length+1);
    assert.equal(await page.locator('#ics-source-picker input:checked').count(),2);
    assert.equal(initialPapers.filter(p=>p.sourceCollection==='csapp-textbook').length,11);
    for(const collection of ['csapp-textbook','pku-exam']){
      const other=collection==='pku-exam'?'csapp-textbook':'pku-exam';
      await page.check('#ics-source-picker input[value="'+collection+'"]');
      await page.uncheck('#ics-source-picker input[value="'+other+'"]');
      const expectedPapers=initialPapers.filter(p=>p.sourceCollection===collection);
      assert.deepEqual(await page.locator('#ics-paper option[value^="p-"]').evaluateAll(options=>options.map(o=>o.value)),expectedPapers.map(p=>p.id));
      await page.check('input[value="random"]');await page.selectOption('#ics-count','50');await page.click('#ics-start');
      await page.waitForFunction(()=>!document.querySelector('#ics-quiz').hidden);
      assert(await page.evaluate(source=>{const {state}=window.__test;return state.questions.length>0&&state.questions.every(q=>state.papers.find(p=>p.id===q.paperId).sourceCollection===source);},collection));
      await page.click('#ics-abandon');
      await page.check('input[value="module-all"]');
      await page.check('#ics-modules input[value="data_representation"]');await page.click('#ics-start');
      await page.waitForFunction(()=>!document.querySelector('#ics-quiz').hidden);
      const selectedIds=new Set(expectedPapers.flatMap(p=>p.questionIds));
      const moduleIds=all.filter(q=>selectedIds.has(q.id)&&q.classification.moduleIds.includes('data_representation')).map(q=>q.id).sort();
      assert.deepEqual((await page.evaluate(()=>window.__test.state.questions.map(q=>q.id))).sort(),moduleIds);
      await page.click('#ics-abandon');
    }
    await page.check('input[value="exam"]');
    await page.selectOption('#ics-paper',initialPapers.find(p=>p.sourceCollection==='pku-exam').id);
    await page.uncheck('#ics-source-picker input[value="pku-exam"]');
    assert.equal(await page.locator('#ics-paper').inputValue(),'');
    assert.equal(await page.locator('#ics-paper option').count(),1);
    await page.click('#ics-start');assert.match(await page.locator('#ics-setup-error').innerText(),/至少选择一个题目来源/);
    await page.check('#ics-source-picker input[value="csapp-textbook"]');
    await page.check('input[value="random"]');
    assert.equal(await page.locator('#ics-exam-type option').count(),2);
    await page.selectOption('#ics-exam-type','练习');
    await page.check('#ics-source-picker input[value="pku-exam"]');
    await page.uncheck('#ics-source-picker input[value="csapp-textbook"]');
    assert.equal(await page.locator('#ics-exam-type').inputValue(),'');
    await page.check('#ics-source-picker input[value="csapp-textbook"]');
    // Reported questions: actual math rendering, intact C blocks, and mirrored
    // assembly operands. These checks exercise source repairs, not heuristics.
    const minimum = all.find(q=>q.id==='q-96276f24280880cd');
    await fixture(page,[minimum]);
    await page.waitForFunction(()=>document.querySelectorAll('#ics-choice-list mjx-container').length===4);
    assert.equal(await page.locator('#ics-choice-list mjx-merror').count(),0);
    const normalization=all.find(q=>q.id==='q-bf82915267634dbd');
    await fixture(page,[normalization]);
    await page.waitForFunction(()=>document.querySelectorAll('#ics-question-content thead mjx-container').length===2);
    assert.equal(await page.locator('#ics-question-content table input').count(),4);
    assert.equal(await page.locator('#ics-question-content mjx-merror').count(),0);
    const float4 = all.find(q=>q.id==='q-31fd3c710550b47e');
    await fixture(page,[float4]);
    const code = await page.locator('#ics-question-content pre').first().innerText();
    assert.match(code,/int4 f2i\(float4 f\) \{\n  return \(int4\) f;\n\}/);
    await page.click('#ics-submit');
    const reversal = all.find(q=>q.id==='q-7d2647844e7abcf9');
    await fixture(page,[reversal]);
    assert.equal(await page.locator('#ics-question-content pre input').count(),11);
    const mirrored=page.locator('input[data-blank-id="operand-3"]');
    assert.equal(await mirrored.count(),2);
    await mirrored.first().fill('%rbx');
    assert.equal(await mirrored.last().inputValue(),'%rbx');
    await page.click('#ics-abandon');
    // Every real published paper: exact membership/order; composite never split.
    await page.check('input[value="exam"]');
    const papers=await page.evaluate(()=>window.__test.state.papers);
    for(const paper of papers){
      await page.selectOption('#ics-paper',paper.id);await page.click('#ics-start');
      await page.waitForFunction(()=>!document.querySelector('#ics-quiz').hidden);
      assert.deepEqual(await page.evaluate(()=>window.__test.state.questions.map(q=>q.id)),paper.questionIds);
      await page.click('#ics-abandon');
    }
    await fixture(page,[single,multiple,fill,short,composite]);
    await page.click('[data-choice="B"]');await page.click('#ics-next');
    await page.click('[data-choice="A"]');await page.click('[data-choice="B"]');await page.click('#ics-previous');
    assert.equal(await page.locator('#ics-answer').inputValue(),'B');await page.click('#ics-submit');
    await page.click('#ics-next');assert.equal(await page.locator('#ics-answer').inputValue(),'AB');await page.click('#ics-submit');
    await page.click('#ics-previous');assert(await page.locator('[data-choice="B"]').isDisabled());
    assert.equal(await page.evaluate(()=>window.__test.state.score),2);
    await page.click('[data-question-index="2"]');assert.equal(await page.locator('.ics-blank-input').count(),2);
    await page.locator('.ics-blank-input').first().fill('42');assert.equal(await page.locator('.ics-blank-input').nth(1).inputValue(),'42');
    assert.equal(await page.locator('#ics-question-content pre input').count(),1);
    assert.equal(await page.locator('#ics-question-content table input').count(),1);
    await page.click('#ics-next');await page.click('#ics-submit');assert(await page.locator('#ics-self-grade').isVisible());
    await page.click('#ics-previous');assert.equal(await page.locator('.ics-blank-input').first().inputValue(),'42');await page.click('#ics-submit');
    assert.match(await page.locator('#ics-verdict').innerText(),/正确/);
    await page.click('#ics-next');await page.click('[data-grade="0.5"]');await page.click('#ics-next');
    await page.click('[data-composite-choice="B"]');await page.locator('.ics-blank-input').first().fill('42');await page.click('#ics-submit');
    assert(await page.locator('#ics-self-grade').isVisible());await page.click('[data-grade="1"]');
    assert.equal(await page.evaluate(()=>window.__test.state.score),4.5);
    await page.click('#ics-finish');assert.match(await page.locator('#ics-final-summary').innerText(),/已计分 5/);
    assert.equal(await page.evaluate(()=>window.__writes.filter(r=>r.name==='record_ics_answer').length),5);
    await fixture(page,[{...composite,parts:composite.parts.slice(0,2)}]);
    await page.click('[data-composite-choice="A"]');await page.locator('.ics-blank-input').first().fill('42');await page.click('#ics-submit');
    assert.equal(await page.evaluate(()=>window.__test.state.score),0.5);
    // Explicit select widgets: repeated anchors, exact sets, exclusivity, drafts,
    // missing-value focus, keyboard close, table/code placement and submitted locks.
    const dropdown = all.find(q=>q.id==='q-1737c983c32fea14');
    assert.equal(dropdown.type,'fill');
    const mixedDropdown = all.find(q=>q.id==='q-d3c830eb8ed35d68');
    const tableFill = all.find(q=>q.id==='q-dc4e632066c6ca4a');
    await fixture(page,[dropdown,single]);
    assert.equal(await page.locator('[data-blank-toggle]').count(),8);
    await page.click('#ics-submit');
    assert.equal(await page.locator('[data-blank-toggle]').first().evaluate(el=>el===document.activeElement),true);
    const first = page.locator('.ics-inline-blank').first();
    await first.locator('[data-blank-toggle]').click();
    await first.locator('[value="A"]').check();
    await first.locator('[value="E"]').check();
    assert.equal(await first.locator('[value="A"]').isChecked(),false);
    await first.locator('[value="D"]').check();
    assert.equal(await first.locator('[value="E"]').isChecked(),false);
    await page.keyboard.press('Escape');
    assert(await first.locator('.ics-blank-menu').isHidden());
    await page.click('#ics-next');await page.click('#ics-previous');
    assert.match(await first.locator('[data-blank-toggle]').innerText(),/D · !=/);
    const expected = [['D'],['D'],['B','D'],['E'],['A','D'],['E'],['C'],['C']];
    for(let i=0;i<8;i++){
      const row = page.locator('.ics-inline-blank').nth(i);
      await row.locator('[data-blank-toggle]').click();
      for(const value of expected[i]) await row.locator('[value="'+value+'"]').check();
      await row.locator('[data-blank-close]').click();
    }
    await page.click('#ics-submit');assert.equal(await page.evaluate(()=>window.__test.state.score),1);
    assert(await first.locator('[data-blank-toggle]').isDisabled());
    assert(await first.locator('[data-blank-option]').first().isDisabled());
    await page.click('#ics-next');await page.click('#ics-previous');
    assert(await first.locator('[data-blank-toggle]').isDisabled());
    await fixture(page,[mixedDropdown,single]);
    assert.equal(await page.locator('table select.ics-blank-input').count(),2);
    await page.locator('input[data-blank-id="negative-zero"]').fill('-0');
    await page.locator('input[data-blank-id="nine-half"]').fill('9.5');
    await page.selectOption('select[data-blank-id="association"]','yes');
    await page.selectOption('select[data-blank-id="accumulation"]','no');
    await page.click('#ics-next');await page.click('#ics-previous');
    assert.equal(await page.locator('select[data-blank-id="association"]').inputValue(),'yes');
    await page.click('#ics-submit');assert.equal(await page.evaluate(()=>window.__test.state.score),1);
    assert(await page.locator('select[data-blank-id="association"]').isDisabled());
    await fixture(page,[tableFill]);
    assert.equal(await page.locator('table .ics-blank-input').count(),10);
    assert(!await page.locator('#ics-question-content').innerText().then(text=>text.includes('0 000 0001')));
    const repeatedSelect = {...fill,stem:content('值：{{blank:x}} / {{blank:x}}',[
      {...blank('x'),input:{kind:'select',multiple:true,options:[{value:'a',label:'甲'},{value:'b',label:'乙'}]}},
      {...blank('x',1),input:{kind:'select',multiple:true,options:[{value:'a',label:'甲'},{value:'b',label:'乙'}]}},
    ]),solution:solution('blanks',{blankAnswers:[{blankId:'x',method:'selection',correctValues:['a']}]})};
    await fixture(page,[{...composite,parts:[{...repeatedSelect,id:'select-part',number:{display:'(1)'}}]}]);
    await page.locator('[data-blank-toggle]').first().click();await page.locator('[data-blank-option][value="a"]').first().check();
    assert.match(await page.locator('[data-blank-toggle]').nth(1).innerText(),/甲/);
    await page.keyboard.press('Escape');await page.click('#ics-submit');
    assert.equal(await page.evaluate(()=>window.__test.state.score),1);
    // Native single-select is also disabled for unavailable root/part answers.
    // Real finite-domain additions: screenshot example, dense tables, composite
    // controls and mixed text/select grading, without network writes.
    const relation=all.find(q=>q.id==='q-be9654f19b9b4b25');
    await fixture(page,[relation,single]);
    const finiteOutput=process.env.ICS_SCREENSHOTS;
    if(finiteOutput){
      fs.mkdirSync(finiteOutput,{recursive:true});
      await page.screenshot({path:path.join(finiteOutput,'finite-comparison-desktop.png'),fullPage:true});
    }
    assert.equal(await page.locator('select[data-blank-id="q2-relation"]').count(),1);
    await page.selectOption('select[data-blank-id="q2-relation"]','gt');
    await page.click('#ics-next');await page.click('#ics-previous');
    assert.equal(await page.locator('select[data-blank-id="q2-relation"]').inputValue(),'gt');
    await page.click('#ics-submit');
    assert.equal(await page.evaluate(()=>window.__test.state.score),1);
    assert(await page.locator('select[data-blank-id="q2-relation"]').isDisabled());
    const symbolTable=all.find(q=>q.id==='q-c448153415e0dd8d');
    await fixture(page,[symbolTable]);
    assert.equal(await page.locator('table select.ics-blank-input').count(),20);
    assert.equal(await page.locator('table td code').first().evaluate(el=>getComputedStyle(el).whiteSpace),'nowrap');
    await page.setViewportSize({width:390,height:844});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.setViewportSize({width:1280,height:900});
    if(finiteOutput)await page.screenshot({path:path.join(finiteOutput,'finite-table-desktop.png'),fullPage:true});
    const assembly=all.find(q=>q.id==='q-48830bbf91e759fa');
    await fixture(page,[assembly]);
    assert.match(await page.locator('#ics-question-content pre').first().innerText(),/__asm__ __volatile__/);
    assert.equal(await page.locator('#ics-question-content pre select').count(),0);
    assert.equal(await page.locator('select[data-blank-id="portable"]').count(),1);
    const network=all.find(q=>q.id==='q-b72158b8a694d842');
    await fixture(page,[network]);
    assert.equal(await page.locator('table select.ics-blank-input').count(),6);
    for(const answer of network.solution.blankAnswers){
      const el=page.locator('[data-blank-id="'+answer.blankId+'"]');
      if(answer.method==='selection')await el.selectOption(answer.correctValues[0]);
      else await el.fill(answer.acceptedAnswers[0]);
    }
    await page.click('#ics-submit');
    assert.equal(await page.evaluate(()=>window.__test.state.score),1);
    await fixture(page,[{...mixedDropdown,solution:{...solution('none'),state:'missing',reason:'待复核'}}]);
    assert(await page.locator('select.ics-blank-input').first().isDisabled());
    // Declared missing answer must not be blocked by required fill inputs.
    await fixture(page,[{...fill,solution:{...solution('none'),state:'missing',reason:'待复核'}}]);
    assert(await page.locator('.ics-blank-input').first().isDisabled());await page.click('#ics-submit');
    assert.equal(await page.evaluate(()=>window.__test.state.records[0].mode),'unavailable');
    await fixture(page,[single,multiple]);await page.click('#ics-skip');await page.click('#ics-previous');
    assert(await page.locator('#ics-submit').isVisible());
    await page.evaluate(()=>{window.__rows={a:{question_id:'a',total_answers:10,correct_answers:1},b:{question_id:'b',total_answers:20,correct_answers:2}}});
    assert.deepEqual(await page.evaluate(async()=>{document.querySelector('#ics-min-attempts').value='5';return (await window.__test.rankByErrorRate([{id:'a'},{id:'b'}])).map(q=>q.id)}),['b','a']);
    // Real reported questions: corrected keys, restored references and explicit retirement.
    const deployedIds = await page.evaluate(async()=> (await (await fetch('./web-data/questions.json')).json()).questions.map(q=>q.id));
    assert(!deployedIds.includes('q-622ae65ab616a110'));
    assert.equal(deployedIds.length,all.filter(q=>q.publication.state==='published').length);
    const final2015 = all.find(q=>q.id==='q-8c4d8b2b8d02717d');
    await fixture(page,[final2015]);
    assert.equal(await page.locator('#ics-question-content pre').count(),3);
    for(const answer of final2015.solution.blankAnswers){
      await page.locator('.ics-blank-input[data-blank-id="'+answer.blankId+'"]').fill(answer.acceptedAnswers[0]);
    }
    await page.click('#ics-submit');
    assert.equal(await page.evaluate(()=>window.__test.state.score),1);
    assert.match(await page.locator('#ics-reference').innerText(),/0x28/);
    const mid2021 = all.find(q=>q.id==='q-b0ef359a9e930155');
    await fixture(page,[mid2021]);
    assert.equal(await page.locator('[data-composite-part]').count(),7);
    assert.match(await page.locator('#ics-question-content > pre').innerText(),/struct s_element/);
    for(let i=0;i<mid2021.parts.length;i++){
      for(const answer of mid2021.parts[i].solution.blankAnswers||[]){
        await page.locator('[data-composite-part="'+i+'"] .ics-blank-input[data-blank-id="'+answer.blankId+'"]')
          .first().fill(answer.method==='exact' ? answer.acceptedAnswers[0] : '解释草稿，按参考含义自评');
      }
    }
    await page.click('#ics-submit');
    assert(await page.locator('#ics-self-grade').isVisible());
    assert.match(await page.locator('#ics-verdict').innerText(),/4 \/ 4/);
    assert.match(await page.locator('#ics-reference').innerText(),/寄存器溢出/);
    assert.match(await page.locator('#ics-reference').innerText(),/0x4098/);
    await page.click('[data-grade="1"]');
    assert.equal(await page.evaluate(()=>window.__test.state.score),1);
    // Full bank browser parse, including withheld questions' Markdown, all options/references.
    const result=await page.evaluate(questions=>{
      window.MathJax=undefined;
      const {state,ui,renderQuestion,renderSolution,renderContent}=window.__test;
      state.questions=questions;state.records=[];state.drafts=[];ui.result.hidden=true;ui.quiz.hidden=false;
      const assets=new Set();let sections=0;
      for(let i=0;i<questions.length;i++){
        state.index=i;renderQuestion();ui.reference.innerHTML=renderSolution(questions[i]);
        const expectedSelects=(questions[i].parts||[questions[i]]).reduce((n,u)=>
          n+(u.stem.blanks||[]).filter(b=>b.input?.kind==='select').length,0);
        const actualSelects=ui.questionContent.querySelectorAll('select.ics-blank-input,[data-blank-toggle]').length;
        if(actualSelects!==expectedSelects)throw new Error('Lost select: '+questions[i].id+' '+actualSelects+'/'+expectedSelects);
        for(const node of questions[i].parts||[questions[i]]){
          const el=document.createElement('div');el.innerHTML=renderContent(node.stem)+(node.options||[]).map(o=>renderContent(o.content)).join('');
          el.querySelectorAll('img').forEach(img=>assets.add(img.src));sections++;
        }
        ui.reference.querySelectorAll('img').forEach(img=>assets.add(img.src));
        if(questions[i].type==='composite'&&ui.questionContent.querySelectorAll('[data-composite-part]').length!==questions[i].parts.length)
          throw new Error('Lost part: '+questions[i].id);
      }
      return {questions:questions.length,sections,assets:[...assets]};
    },all);
    const failed=await page.evaluate(async urls=>{const bad=[];for(const url of urls){const r=await fetch(url);if(!r.ok)bad.push(url)}return bad},result.assets);
    assert.deepEqual(failed,[]);
    await fixture(page,[composite]);
    const output=process.env.ICS_SCREENSHOTS;
    if(output){fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,'v5-desktop.png'),fullPage:true});}
    await page.setViewportSize({width:390,height:844});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(output)await page.screenshot({path:path.join(output,'v5-mobile.png'),fullPage:true});
    await fixture(page,[dropdown]);
    await page.locator('[data-blank-toggle]').nth(2).click();
    await page.locator('.ics-inline-blank').nth(2).locator('[value="B"]').check();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    const popup = await page.locator('.ics-blank-menu:visible').boundingBox();
    assert(popup.x>=0 && popup.x+popup.width<=390 && popup.y>=0 && popup.y+popup.height<=844);
    if(output)await page.screenshot({path:path.join(output,'dropdown-mobile.png')});
    await page.keyboard.press('Escape');
    await page.setViewportSize({width:1280,height:900});
    await page.locator('[data-blank-toggle]').nth(2).click();
    if(output)await page.screenshot({path:path.join(output,'dropdown-desktop.png')});
    await fixture(page,[relation]);
    await page.setViewportSize({width:390,height:844});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(output)await page.screenshot({path:path.join(output,'finite-comparison-mobile.png'),fullPage:true});
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({success:true,...result,assets:result.assets.length}));
  } finally { await browser.close(); }
}
run().catch(error=>{console.error(error);process.exitCode=1});
