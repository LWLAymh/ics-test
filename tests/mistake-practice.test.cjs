'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { rankQuestions, selectQuestions } = require('../site/mistake-practice.js');
const pool = ['a','b','c','d','e','f'].map(id => ({id}));
const stats = new Map(pool.map((q, i) => [q.id, {total_answers:10, correct_answers:i + 1}]));

test('high-error ranking rejects missing, invalid, all-correct and mastered data without mutating questions', () => {
  const rows = new Map(stats);
  rows.set('a',{total_answers:0,correct_answers:0}); rows.set('b',{total_answers:10,correct_answers:11});
  rows.set('c',{total_answers:10,correct_answers:null}); rows.set('d',{total_answers:10,correct_answers:10});
  assert.deepEqual(rankQuestions(pool, rows, 5, new Set(['e'])).map(q=>q.id),['f']);
  assert.equal(pool.some(q=>'practiceStats' in q),false);
  assert.equal(rankQuestions(pool,stats,11).length,0);
  assert.throws(()=>rankQuestions(pool,stats,0));
  assert.throws(()=>rankQuestions(pool,stats,1.5));
  const tied = new Map([['a',{total_answers:10,correct_answers:1}],['b',{total_answers:20,correct_answers:2}]]);
  assert.deepEqual(rankQuestions(pool,tied,1).map(q=>q.id),['b','a']);
});
test('random selection samples the chosen high-error range rather than slicing the same prefix', () => {
  const ranked = rankQuestions(pool,stats,1); let input;
  const chosen = selectQuestions(ranked,{coverage:0.5,count:2,order:'random'},items=>{input=items.slice();return items.reverse();});
  assert.deepEqual(input.map(q=>q.id),['a','b','c']);
  assert.deepEqual(chosen.map(q=>q.id),['c','b']);
  assert.deepEqual(ranked.map(q=>q.id),['a','b','c','d','e','f']);
  assert.ok(chosen.every(q=>q.practiceStats.order==='random' && q.practiceStats.candidateCount===3 && q.practiceStats.selectedCount===2));
  assert.equal(ranked[0].practiceStats.order,undefined);
});
test('rank-boundary ties stay together and explicit ranked practice keeps its deterministic order', () => {
  const rows=new Map(stats); rows.set('c',{total_answers:20,correct_answers:4});
  const ranked=rankQuestions(pool,rows,1);
  // ceil(6*20%)=2, but both 80%-error questions at the boundary must enter.
  const chosen=selectQuestions(ranked,{coverage:0.2,count:50,order:'ranked'},()=>assert.fail('ranked mode must not shuffle'));
  assert.deepEqual(chosen.map(q=>q.id),['a','c','b']);
  const same=rankQuestions(pool,new Map(pool.map(q=>[q.id,{total_answers:5,correct_answers:0}])),1);
  assert.equal(selectQuestions(same,{coverage:0.2,count:50,order:'random'},x=>x).length,6);
  assert.equal(selectQuestions(ranked,{coverage:1,count:50,order:'ranked'}).length,6);
  for(const options of [{coverage:0,count:1,order:'random'},{coverage:1,count:0,order:'random'},{coverage:1,count:NaN,order:'ranked'},{coverage:1,count:1,order:'other'}])
    assert.throws(()=>selectQuestions(ranked,options,x=>x));
  assert.throws(()=>selectQuestions([],{coverage:1,count:1,order:'ranked'}),/没有符合条件/);
});
test('reported 2018 pipeline figures retain the correct 110ps/90ps optimum, including AF and CF', () => {
  const units={A:40,B:20,C:20,D:80,E:20,F:30,G:30,H:40}, names=Object.keys(units);
  const edges=['AB','BC','CD','AF','CF','EF','FG','GH'];
  function cost(level,k){
    if(level.A!==0||level.E!==0||level.D!==k-1||level.H!==k-1||edges.some(e=>level[e[0]]>level[e[1]]))return Infinity;
    const delay={};
    for(const n of names)delay[n]=units[n]+Math.max(0,...edges.filter(e=>e[1]===n&&level[e[0]]===level[n]).map(e=>delay[e[0]]));
    return Math.max(...Object.values(delay))+10;
  }
  function optimum(k){let best=Infinity;for(let code=0;code<k**8;code++){
    let n=code;const level=Object.fromEntries(names.map(id=>{const v=n%k;n=Math.floor(n/k);return[id,v];}));
    best=Math.min(best,cost(level,k));
  }return best;}
  assert.equal(cost(Object.fromEntries(names.map(n=>[n,0])),1),190);
  assert.equal(optimum(2),110); assert.equal(optimum(3),90);
  assert.equal(cost({A:0,B:0,C:0,D:1,E:0,F:1,G:1,H:1},2),110);
  assert.equal(cost({A:0,B:1,C:1,D:2,E:0,F:1,G:2,H:2},3),90);
  assert.equal(cost({A:0,B:0,C:1,D:2,E:0,F:1,G:1,H:2},3),90);
  const q=require('../question-bank/web-data/questions.json').questions.find(q=>q.id==='q-c7cbe7724a1752f2');
  assert.match(q.solution.reference.text,/110ps/);assert.match(q.solution.reference.text,/90ps/);
  assert.match(q.solution.reference.text,/AF、CF、EF/);
});
