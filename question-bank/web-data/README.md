# 网页题库数据

这里是由 `_tools/build_web_data.py` 从 `原文/` 和 `_cls/` 生成的网页友好数据。不要直接
手改生成的 JSON；题目文字应改在原文，分类、题号或摘要应改在 `_cls/*.json`，然后重新运行：

```bash
python _tools/build_web_data.py
```

## 入口与文件

- `catalog.json`：题库入口，包含模块、筛选项、统计信息及各模块文件路径。
- `questions/*.json`：按模块拆分的题目；正文是 Markdown 字符串。
- `answer-blocks.json`：试卷中暂时无法可靠拆到单题的整段答案或解析。**站点不发布它**：
  题目的 `answer.relatedBlockIds` 指向的往往是整份试卷的答案块，与单题并不精确对应，
  前端展示会泄题；因此 `scripts/build-site.js` 不再把它复制进 `_site/`，前端只展示
  人工录入的 `answer`（`layout.answer`）。这个文件保留在这里供维护与 PDF 审阅使用。
- `../assets/`：图片文件。`catalog.json` 的 `assetBase` 指向题库目录的上一级，题目正文中的
  图片路径统一为 `assets/...`。部署时应保持 `web-data/` 与 `assets/` 的相对位置，或由前端
  在渲染 Markdown 前统一改写资源 URL。

## 题目结构

```json
{
  "id": "q-...",
  "moduleId": "data_representation",
  "year": 2024,
  "examType": "期中",
  "exam": "2024期中-带答案",
  "questionNo": "第一题 1",
  "summary": "32位有符号整数位运算表达式的恒真判断",
  "content": "题目 Markdown 原文",
  "assets": [],
  "answer": {
    "inline": false,
    "relatedBlockIds": ["a-..."]
  },
  "source": {
    "document": "原文/期中/2024期中-带答案.md",
    "lines": { "start": 49, "end": 55 },
    "aliases": []
  }
}
```

`answer.relatedBlockIds` 只表示“这份材料的相关答案块”，不保证答案块已精确对应到这一小题；
前端应标成“相关答案 / 解析”，不要直接标成“本题答案”。若 `answer.inline` 为 `true`，则答案
已经出现在题目原文中。

## 前端使用建议

1. 首屏只加载 `catalog.json`，用户选模块后再加载对应的 `questions/*.json`。
2. 用 `id` 作为路由、收藏和本地做题记录的主键，不要用数组下标。
3. 筛选直接使用 `moduleId`、`year`、`examType`；搜索可覆盖 `exam`、`questionNo`、
   `summary` 与去除 Markdown 标记后的 `content`。
4. Markdown 渲染器需支持 GFM 表格、围栏代码块和 LaTeX；渲染原始 HTML 时应做白名单清洗。
5. 题目顺序已经按类别、年份、试卷和原文位置固定，重新生成不会随机变化。
