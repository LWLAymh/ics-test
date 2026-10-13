import test from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from '../../community/src/worker.mjs';
import { handleRequest as mcpRequest, callTool } from '../src/worker.mjs';
const q = 'q-0123456789abcdef', id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const token = 'e'.repeat(64);
const env = { SITE_URL:'https://bank.example/', SUPABASE_URL:'https://database.example', SUPABASE_PUBLISHABLE_KEY:'public-test',
  COMMUNITY_PUBLISH_TOKEN:token, PAPER_PUBLISH_RATE_LIMITER:{limit:async()=>({success:true})} };
const body = { paperId:id,visitorId:id,draft:{title:'卷',author:'署名',description:'',ids:[q]} };
function request(data=body, origin='https://bank.example', path='/papers', method='POST') {
  return new Request('https://publisher.example'+path,{method,headers:{'Content-Type':'application/json','CF-Connecting-IP':'203.0.113.1',...(origin?{Origin:origin}:{})},...(method==='POST'?{body:JSON.stringify(data)}:{})});
}
test('separate publisher validates current index, forwards only narrow token, never leaks it', async()=>{
  const calls=[];
  const upstream=async(url,init)=>{
    calls.push({url,init});
    if(url.endsWith('question-index.json')) return Response.json({version:1,modules:[],questions:[{id:q}]});
    assert.ok(url.endsWith('/rpc/publish_ics_community_paper'));
    assert.equal(init.headers.apikey,'public-test'); assert.equal(init.headers.Authorization,undefined);
    assert.equal(JSON.parse(init.body).p_publish_token,token);
    return Response.json(id);
  };
  const response=await handleRequest(request(),env,upstream);
  assert.equal(response.status,201); assert.equal((await response.clone().json()).published,true);
  assert.ok(!(await response.text()).includes(token));
  assert.equal(calls.length,2);
  const bad=await handleRequest(request({...body,draft:{...body.draft,ids:['q-ffffffffffffffff']}}),env,upstream);
  assert.equal(bad.status,422); assert.equal(calls.filter(c=>c.init.method==='POST').length,1);
  // Publication cannot be reached through MCP, even with a valid curation token.
  assert.equal((await mcpRequest(request(body,'https://bank.example','/community-papers'),env)).status,404);
  assert.equal((await callTool('publish_paper',{},env,'test',upstream)).isError,true);
});
test('publisher fails closed for wrong origin, invalid metadata, missing capability and denied rate',async()=>{
  const never=()=>{throw Error('must not fetch')};
  for(const origin of [null,'https://evil.example']) assert.equal((await handleRequest(request(body,origin),env,never)).status,403);
  assert.equal((await handleRequest(request({...body,publishToken:token}),env,never)).status,400);
  assert.equal((await handleRequest(request(),{...env,COMMUNITY_PUBLISH_TOKEN:undefined},never)).status,503);
  assert.equal((await handleRequest(request(),{...env,PAPER_PUBLISH_RATE_LIMITER:{limit:async()=>({success:false})}},never)).status,429);
  assert.equal((await handleRequest(request(body,'https://bank.example','/papers','OPTIONS'),env,never)).status,204);
});
test('upstream failures never expose credentials or response contents',async()=>{
  const upstream=async(url)=>url.endsWith('question-index.json') ? Response.json({version:1,modules:[],questions:[{id:q}]}) : new Response('sensitive '+token,{status:500});
  const result=await handleRequest(request(),env,upstream); assert.equal(result.status,400); assert.ok(!(await result.text()).includes(token));
});
