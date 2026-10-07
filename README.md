# ICS Test

PKU Introduction to Computer Systems 历年题随机测试站点。

- 在线地址：<https://lwlaymh.github.io/ics-test/>
- 题库源码：`question-bank/`
- 页面源码：`site/`
- Supabase 数据库脚本：`supabase/ics_stats.sql`
- 自动部署：`.github/workflows/pages.yml`

## 更新题库

1. 在 `question-bank/_curated/` 中修改对应题目的 Markdown。
2. 如有新增或调整分类，同步修改 `question-bank/_cls/`。
3. 本地运行以下检查：

```powershell
cd question-bank
python _tools/validate_cls.py
python _tools/verify_verbatim.py
python _tools/verify_curated.py
python _tools/build_web_data.py
cd ..
npm run check
npm run build
```

推送到 `main` 后，GitHub Actions 会重复执行校验并自动发布 GitHub Pages。

## 本地预览

构建后用任意静态服务器打开 `_site/`，不要直接双击 HTML：

```powershell
npm run build
python -m http.server 4173 --directory _site
```

访问 <http://127.0.0.1:4173/>。

Supabase 前端仅使用 publishable key；请勿把 secret key 提交到仓库。

首次创建或重置统计表时，在 Supabase SQL Editor 中执行
`supabase/ics_stats.sql`。日常修改题目不需要重复执行该脚本。
