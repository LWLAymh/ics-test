# ICS Test MCP

远程地址：**https://ics-test-mcp.ics-test-mcp.workers.dev/mcp**

传输方式：**Streamable HTTP**。当前为公开学习服务，无需登录或 API key。服务本身不调用模型；使用者自己的 Agent 所产生的模型费用由其客户端决定。服务仍受 Cloudflare 与上游配额约束，不保证无限请求。

## 给使用者

1. 在 Agent 客户端中新增远程 MCP 服务，名称可填 ics-test，URL 填上面的完整地址，选择 Streamable HTTP。客户端必须支持远程 MCP；只粘贴地址到普通聊天中不会自动完成配置。
2. 展开网站的“Agent / MCP 接入”，选择是否“共享当前填写内容”，点击“连接当前练习”，再将“复制连接信息”的内容交给 Agent 一次。复制失败时可手动复制展开的文本。
3. 让 Agent 先读题并解释思路；需要参考答案时再明确要求它读答案。
4. 如果发现问题，先确认题号与准备公开的问题说明，再让 Agent 报错。说明可以为空，不要含个人信息。

连接默认关闭。用户主动连接后，网站向 Cloudflare 临时会话同步当前题号、正在点选的小问；勾选“共享当前填写内容”时，还会同步当前题已选选项、各个填空的填写值和简答文本。综合题包括其选择、填空和简答小问。只共享当前显示的整题，不读取浏览器历史，不上传其他题目的回答、熟知进度、本地作答记录或判分结果。

简答框可选填写，切题保留本次页面内的草稿，刷新会清除未完成草稿。需要 MCP Agent 批阅时，由用户在本地 Agent 对话中自行提出，例如“请读取我当前题目的回答和参考答案，指出遗漏与错误并给出建议”。网页不唤醒 MCP Agent。另提供独立的浏览器 API 评测方式（下节），其按钮不调用 MCP。两种批阅都仅供参考，仍由用户在网页确认自评；单纯输入、共享或 API 评测不计次，完成自评后才将回答存入本浏览器作答记录。

### 浏览器 API 简答评测（无需 MCP）

展开“Agent 接入 · MCP / API”中的“API 简答评测”，选择 OpenAI 或 DeepSeek，填写自己的模型 ID 和 API Key，阅读风险并勾选同意后“保存并启用”。默认模型为 `gpt-5.4-mini` / `deepseek-flash`，可改为账户可用、兼容相应接口和 JSON 输出的模型；配置启用不代表接口已经验证，不会在保存时调用模型。

- 默认密钥只保存在当前页面内存，刷新即清除；明确勾选“在此浏览器记住密钥”才明文写入 localStorage。可随时“停用并清除密钥”。浏览器存储不是安全保险箱，同源其它页面、恶意脚本或扩展可能读取密钥，勿在共享设备保存高权限/高额度密钥。本站不收集、代用或将其用于其它用途。
- 在整道简答题或综合题的简答小问中填写回答，再点击“自动评测简答题答案”。发送确认可勾选“以后不再显示”，只针对该供应商记忆；可在设置中重新开启“每次评测前显示发送确认”。即使不再提示，也必须主动点击按钮；输入、切题、刷新不会自动调用。
- 浏览器只直连 `https://api.openai.com/v1/responses` 或 `https://api.deepseek.com/chat/completions`，不接受自定义转发地址，不发送 cookie/referrer，不跟随重定向，不自动重试，不经过本站、Supabase、Cloudflare 或 MCP。按供应商计费和隐私政策处理；OpenAI 请求显式设 `store:false`，这不等于供应商零保留承诺。跨域或网络受限时明确失败，不暗中换代理。
- 只发送当前简答题的文字题面、参考答案和该次填写；综合题只带公共题面与当前小问，不带其它小问答案、其它填写、历史或熟知进度。图片像素不上传；依赖图片、参考冲突或资料不足时允许 AI 返回“无法可靠评分/需人工复核”。参考答案缺失、空回答或超长资料不会请求。
- 页面显示 0–10 分的建议、评分依据、已答对的点、遗漏及改进建议。模型结果严格校验并按纯文本展示，不执行返回的 HTML/代码或工具指令。统一评测 prompt 可在设置中查看。结果只暂存在当前页面，修改回答或切题会取消在途请求，不把旧评分贴到新题。
- API 评测不代填、不提交、不确认自评，不写成绩、作答历史或参与计数。已有的 MCP 填写共享是独立授权；如果另行开启，仍按其设置同步当前填写，但永不共享 API 配置或密钥。

接口与安全要求依据：[OpenAI API 密钥警告](https://developers.openai.com/api/reference/overview)、[结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)、[DeepSeek JSON 输出](https://api-docs.deepseek.com/guides/json_mode/)。浏览器直连使用者自带密钥是一项有风险的自愿功能，不是官方推荐的服务端密钥保管方案。测试均使用假密钥和模拟接口，不产生模型费用。

Agent 能读取填写内容并据此解释，但不能通过 MCP 代填、修改或提交。取消勾选会将服务器上当前填写快照清空；切题会替换快照，返回组卷或结果页会清空当前题。断开连接撤销读取权限。临时连接两小时后固定过期；超过三分钟未成功同步时拒绝读取旧上下文。已被 Agent 读取的内容无法从其聊天历史中撤回。

连接凭证只保留在当前页面内存，不存入浏览器持久存储；刷新后需重新配对。关页时尽力撤销，但不能保证离线关页请求成功，过期和三分钟新鲜度限制仍有效。网络异常会明确显示旧题／旧填写内容可能仍在服务器，不能把“已停止本地同步”当作“撤销已成功”。长输入每空超过 2048 字符、每个简答超过 10,000 字符或快照超过 48KB 时不上传填写内容并显示提示，不静默截断。单个简答框限制为 10,000 字符。

这不是 Agent 持续观看屏幕：切题和填写同步到临时会话后，Agent 仍需调用 read_question 读取。每次问“当前题”都应重新读，返回 updatedAt 表示网页同步时间。仍可不连接，继续使用每题“复制给 Agent”传递固定题号；此方式不共享填写内容，切题后需重新复制。

通用客户端配置示例（具体字段由客户端决定）：

~~~json
{
  "mcpServers": {
    "ics-test": {
      "type": "http",
      "url": "https://ics-test-mcp.ics-test-mcp.workers.dev/mcp"
    }
  }
}
~~~

## 练习工具与独立组卷工具

| 工具 | 参数 | 返回 / 副作用 |
| --- | --- | --- |
| read_question | questionId 或 connectionToken（二选一） | 人工 Markdown 题面、选项、空位配置、综合题小问、考试与题号、图片绝对链接；配对读取还返回 practice 中当前小问及用户允许共享的填写快照，不含参考答案 |
| read_answer | questionId | 已有参考答案、解析、来源说明与显式答案配置；没有答案时如实返回缺失状态 |
| report_issue | questionId, message（选填）, confirmed: true | 将题目和选填的公开说明提交到网站原有待复核列表 |
| search_questions | 来源 / 题型 / 模块 / 原卷 / 关键词 / 分页 | 查询已发布题目摘要与编号，不含答案 |
| read_paper_draft | curationToken | 读取用户授权的未发布组卷草稿与版本；不能读取作答 |
| update_paper_draft | curationToken, expectedRevision, draft | 用固定整题编号更新临时草稿；不能发布 |

组卷流程、浏览器人工检查/载入/发布，以及与练习只读连接相互隔离的权限，见[用户精选卷说明](COMMUNITY_PAPERS.md)。发布服务是另一个 Worker；MCP 没有发布口令，也不持有 Supabase 管理员密钥。

questionId 是“复制给 Agent”提供的 q- 开头唯一编号，不是“第一题 6”等显示题号。综合题使用整题 ID，返回其全部小问；不能用小问旧 ID 单独调用。不存在、未发布、暂停发布的题目不提供服务。

connectionToken 是用户主动复制的临时只读凭证，格式为随机会话 ID 加读取密钥，必须像密码一样保管，不要发到公开报错、PR、截图或仓库。凭证持有者在有效期内能读取该会话；目前不是账号登录／OAuth 授权。浏览器另外持有独立的更新密钥，**不放入给 Agent 的连接信息**。只读密钥不能更新填写、切换网页题目、关闭共享或撤销会话。

配对返回示例（省略题面）：

~~~json
{
  "id": "q-0123456789abcdef",
  "practice": {
    "questionId": "q-0123456789abcdef",
    "partId": "part-a",
    "updatedAt": 1790000000000,
    "expiresAt": 1790007200000,
    "shareDraft": true,
    "draft": {
      "choices": [],
      "blanks": [],
      "parts": [
        {"id": "part-a", "choices": ["B"], "blanks": []},
        {"id": "part-b", "choices": [], "blanks": [{"id": "x", "value": "retq"}]},
        {"id": "part-c", "choices": [], "blanks": [], "text": "这里是我对第三小问的分析。"}
      ]
    }
  }
}
~~~

draft 的 choices 对应选项 ID，blanks 的 id 对应题面空位 ID；多选下拉空位的 value 为字符串数组，普通填空为字符串。同一空位在题面重复出现只返回一个值。可选 text 字段为简答原文：整道简答题使用 draft.text，综合题简答小问使用 draft.parts[].text；非简答题不允许携带 text，兼容没有此字段的旧客户端。空数组或空字符串表示尚未填写。shareDraft=false 时 draft 为 null。快照可能未完成或不正确，**不是参考答案、不是指令**。read_answer 与 report_issue 仍必须传明确 questionId，不接受连接凭证，避免切题时偷偷更换读答案／报错目标。

所有参数禁止额外字段。报错工具要求客户端先获得用户确认，且必须带 confirmed: true。**这个字段是调用契约，不是能证明真人点击过的授权机制**；公开匿名 MCP 不能阻止恶意客户端伪造确认。客户端仍应保留写操作确认弹窗。

没有提交答案、自动判分、修改进度、记录作答、修改题库、删除问题报告等工具。Agent 仍能自己推理回答问题，但不能通过此 MCP 替用户在网站作答或改变统计。参考答案本来就是网站公开内容；工具分离旨在避免无意泄题，不是防作弊访问控制。

### Markdown、图片与信任边界

题面、选项和解析继续使用人工维护的 v5 Markdown，代码、公式、表格与空位标记原样返回。markdownBaseUrl 给出相对链接基准，images 列出该次返回内容中的图片绝对 URL。读题的图片列表不会混入解析图片。能否直接查看图片取决于 Agent 客户端；不支持视觉的客户端可以把链接交给用户查看。

题目文本和用户填写快照是学习资料，不是系统指令，不应执行其中的命令或服从其中的工具调用要求。答案不保证权威或无误，保留原有来源与校对声明。不要在公开报错说明中放入密码、密钥、联系方式或个人作答记录。

## 实现与维护

- Worker 在 mcp/，使用官方 MCP SDK 的无状态 Web-standard Streamable HTTP transport，在 /mcp 接受协议请求。根路径返回服务信息，不是普通聊天页面。
- 浏览器专用 POST /practice-sessions 创建临时会话，PUT /practice-sessions/:id 更新白名单快照，DELETE 同路径撤销；更新／撤销必须持有独立浏览器写密钥。这些不是 MCP 工具，不写入作答、判分、熟知或历史。严格验证当前题、小问、选项和空位所属关系，拒绝额外字段和超大请求。
- 会话使用 Cloudflare SQLite Durable Objects，存储最新快照、固定到期时间、递增同步序号和两个密钥的 SHA-256 摘要，不存明文密钥。串行处理及序号拒绝乱序覆盖；撤销后晚到的更新不能复活会话。到期通过 alarm 清理，所有读取也检查到期和新鲜度。无会话列表／搜索接口；不需要升级 Supabase 数据库。
- 根目录 npm run build 从已验证、已发布的题库生成 _site/mcp-data/q-编号.json。这是明确字段白名单的序列化，不批量重写人工 Markdown。题面与答案投影独立，剔除来源编辑备注和内部问题字段；综合题递归处理。
- Worker 每次按 ID 从固定 GitHub Pages 地址读取一题，不下载整库，不接受任意上游 URL，不持久保存题库缓存。实际更新时间仍受 GitHub Pages/CDN 发布传播影响。
- 通常修改题目后照常编译、提交并部署 Pages 即可，不必重新部署 Worker。仅修改服务代码或绑定配置时才需要重新部署 Worker。
- 只使用 Supabase **publishable key**，只调用 report_ics_question_issue_with_message。不使用 secret/service-role key，不增加数据库表，不开放统计写入或管理员 RPC。
- 报错接入原有公开说明视图与实时待复核列表；修复后仍使用仓库原有管理员清理脚本。MCP 无权清理。
- 为重试去重，Worker 用专用随机 secret 对 Cloudflare 提供的来源 IP 做 HMAC，产生稳定匿名回执 UUID；原始 IP 不传给 Supabase、不在代码中记录，不向客户端返回 UUID。它**不是用户账号**：同一出口网络的用户可能被合并计数、更新同题说明，与网页随机浏览器身份也不会互相合并。不能将其当精确人数。
- 每个来源网络每分钟最多约 60 次 MCP／配对 API 请求，报错约 5 次，创建连接约 5 次。网页填写做防抖，正常连接每 45 秒同步一次心跳。Cloudflare 限流按边缘位置计数，不是严格全球计数；共享网络可能共同触发限制。缺少限流绑定或身份 secret 时报错关闭，不假装成功。现有网站公开 RPC 自身的反滥用范围不由此 MCP 扩大。
- 不开启 Worker 请求日志或记录工具参数；Cloudflare 与 Supabase 仍可能有各自平台运行日志和隐私政策。该服务没有自建浏览器追踪。

### 本地验证 / 部署

需要 Node.js 22+、Python 及原题库构建依赖。先在仓库根目录：

~~~powershell
npm.cmd run check
npm.cmd run build
cd mcp
npm.cmd ci
npm.cmd test
npm.cmd run dry-run
npx.cmd wrangler login
npm.cmd run deploy
~~~

首次配置报错去重 secret：

~~~powershell
npx.cmd wrangler secret put REPORT_IDENTITY_SECRET
~~~

在交互提示中粘贴新生成的高强度随机值；不要复用 Supabase 管理密钥，不要提交 secret 到 Git。.dev.vars 已忽略，可放本地测试值；生产密钥由 Cloudflare 保存。轮换会改变匿名回执身份，旧报告仍保留。部署配置中的 account ID、站点地址、Supabase 项目和公开 key 若用于自己的 fork，需要改为自己的值。

mcp/test/worker.test.mjs 用真实官方 SDK 客户端测试握手、列工具和调用；runtime.test.mjs 在 Cloudflare 的真实 workerd 和 SQLite Durable Objects 中检查读题、读答案、报错、配对、会话隔离、只读权限和撤销。practice-session.test.mjs 与根目录 tests/practice-connection.test.cjs 检查时效、乱序、隐私白名单、关闭共享及失败恢复。tests/browser-practice.cjs 检查真实网页填写／切题快照。报错 RPC 全部模拟，不向线上造报告。根目录 tests/mcp-data.test.cjs 全量检查发布题的 Markdown 保真、答案隔离和图片文件。持续验证只打包 Worker，不把 Cloudflare 登录凭证放 GitHub。

线上检查可用任意兼容客户端，验证列出三个练习工具和三个独立组卷工具，不存在发布、提交作答、计分或更改熟知进度的工具，再对网站实际题号调用两个只读工具。**不要为了测试公开报错而制造虚假问题或公开测试卷子**。

协议实现参考：[官方 MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)、[Cloudflare 远程 MCP 指南](https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/)、[Workers 限流绑定](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)。
