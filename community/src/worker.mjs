import { validPaperDraft, bodyJson, loadQuestionIndex } from '../../mcp/src/curation-session.mjs';
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
// Separate Worker: no MCP endpoint, no administrator key, only a publish capability.
export async function handleRequest(request, env, upstream = fetch) {
  const origin = request.headers.get('Origin'), allowed = new URL(env.SITE_URL).origin;
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', Vary: 'Origin' };
  if (origin === allowed) Object.assign(headers, { 'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
  const json = (data, status = 200) => Response.json(data, { status, headers });
  if (origin !== allowed) return json({ error: '只能从练习网站发布。' }, 403);
  if (new URL(request.url).pathname !== '/papers') return json({ error: '接口不存在。' }, 404);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return json({ error: '接口不存在。' }, 404);
  if (!env.COMMUNITY_PUBLISH_TOKEN || !env.PAPER_PUBLISH_RATE_LIMITER) return json({ error: '发布服务尚未配置，草稿可继续保存在本地。' }, 503);
  try {
    const ip = request.headers.get('CF-Connecting-IP');
    if (!ip || !(await env.PAPER_PUBLISH_RATE_LIMITER.limit({ key: ip })).success) return json({ error: 'rate limit' }, 429);
    let body;
    try { body = await bodyJson(request); } catch { return json({ error: '发布内容无效或过大。' }, 400); }
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some(k => !['paperId', 'visitorId', 'draft'].includes(k)) ||
      typeof body.paperId !== 'string' || !UUID.test(body.paperId) || typeof body.visitorId !== 'string' || !UUID.test(body.visitorId) || !validPaperDraft(body.draft)) return json({ error: '发布内容无效。' }, 400);
    const valid = new Set((await loadQuestionIndex(env, upstream)).questions.map(q => q.id));
    if (body.draft.ids.some(id => !valid.has(id))) return json({ error: 'invalid question id' }, 422);
    const response = await upstream(new URL('/rest/v1/rpc/publish_ics_community_paper', env.SUPABASE_URL).href, {
      method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(10000),
      headers: { 'Content-Type': 'application/json', apikey: env.SUPABASE_PUBLISHABLE_KEY },
      body: JSON.stringify({ p_id: body.paperId, p_visitor_id: body.visitorId, p_title: body.draft.title,
        p_author_name: body.draft.author, p_description: body.draft.description, p_question_ids: body.draft.ids,
        p_publish_token: env.COMMUNITY_PUBLISH_TOKEN }),
    });
    if (!response.ok) {
      const message = (await response.text()).slice(0, 4000);
      const error = /publish limit/.test(message) ? 'publish limit' : /rate limit/.test(message) ? 'rate limit' : /not available/.test(message) ? 'paper not available' : /PGRST20[25]|does not exist|schema cache/.test(message) ? 'schema cache' : '发布未确认成功，请稍后重试。';
      return json({ error }, response.status === 429 ? 429 : 400);
    }
    return json({ id: body.paperId, published: true }, 201);
  } catch { return json({ error: '发布服务暂不可用，草稿仍保留。' }, 503); }
}
export default { fetch(request, env) { return handleRequest(request, env); } };
