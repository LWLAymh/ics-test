# ICS Test

独立的 PKU 计算机系统导论历年题练习站，不依赖博客。

- [在线练习](https://lwlaymh.github.io/ics-test/)
- [仓库 / 提交 PR](https://github.com/LWLAymh/ics-test)
- **当前题目接口为 v5**，人工编辑入口是 `question-bank/authored/`，不再是 `_curated/`。
- 完整指导：[v5 题目编写与接口](docs/QUESTION_AUTHORING_V5.md)
- 设计审查、迁移证据与限制：[v5 迁移说明](docs/MIGRATION_V5.md)
- 有限候选填空支持原位单选/多选下拉，按空位显式配置；[编写方式](docs/QUESTION_AUTHORING_V5.md#候选项有限单选下拉--多选下拉)。
- [有限候选填空核对记录](docs/FINITE_BLANK_AUDIT_2026-10-10.md)：69 道题共 434 处下拉选择（含多选），开放式答案仍保留文本输入或自评。
- [选项噪声逐卷审阅记录](docs/OPTION_NOISE_AUDIT.md)（2026-10-10；28 份卷子、2,150 个选项）。

## 本地维护与验证

需要 Node.js 20+、Python 3.11+。首次安装校验依赖：

```powershell
python -m pip install -r question-bank/_tools/requirements.txt
```

修改 `question-bank/authored/<paper ID>/<question ID>.md`；新增题目还需要在 `authored/papers.json` 中登记位置，必要时在 `authored/index.json` 登记模块。然后运行：

```powershell
npm run compile-bank
npm run check
npm run build
python -m http.server 4173 --bind 127.0.0.1 --directory _site
```

访问 `http://127.0.0.1:4173/`。`web-data/`、`_site/` 均为生成结果，不应手工编辑。构建只读取 v5 人工 Markdown，不进行 OCR、代码围栏补全、公式猜测、答案抽取或题型推断；校验依赖缺失或数据不一致会直接失败。

`npm run verify-migration` 是本轮迁移的**交付对照**，会比较冻结的 v3 基线与 v5 全库；后续正常改题会使它报差异，不应通过改写基线消除差异。日常门禁是 `check` 与 `build`。

## 当前数据结构

```text
question-bank/
  authored/index.json           # 模块登记
  authored/papers.json          # 试卷、考试类型、题目顺序
  authored/p-*/q-*.md           # 每道完整题目，一份 Markdown
  schema/*-v5.schema.json       # 严格 JSON Schema
  templates/question-v5.md      # 可校验的单选示例（未登记，不发布）
  assets/                      # 题面/选项/解析使用的图片
  web-data/                    # v5 编译结果
  migration/                   # 冻结的迁移基线、ID 映射、逐项验证报告
  _curated/、原文/、_cls/、模块/  # 历史转写与来源证据，不再驱动线上内容
site/                          # 独立页面与 v5 前端
scripts/                       # 构建、PDF 导出、维护脚本
supabase/                      # 统计与报错的数据库脚本
```

738 道完整题目来自 861 个旧片段，包含 56 道综合题；当前 712 道发布，26 道保留但不上线（25 道单／多选尚未明确，另 1 道已停用错题）。迁移不意味着题目内容全部人工审定；26 个填空小问仍缺少可靠的显式空位，已记录为待补标注，暂时显示参考答案并自评，不伪装成简答题。

### 停用错题与备份

2017 期中第一题第 6 小题（`q-622ae65ab616a110`）按维护要求停用：`publication.state = review`，并标记 `retired-invalid-question`。原题面、选项、原参考及旧判分元数据仍保留在 [原 Markdown 备份](question-bank/authored/p-5e37064fe519258d/q-622ae65ab616a110.md)，原始资料及 Git 历史也不删除。

本地全量维护数据保留这条记录供复核；**部署构建的 questions、试卷列表、模块列表和所有练习方式均排除它**。校验会拒绝带停用标记的题目重新进入 published。今后只有明确修好并移除停用标记、再经过审核，才应重新发布。

v3、v4 和 v4.1 的文档、模板与解析工具仅留作历史参考；**不要混用旧控制标记，不要编辑旧文件后期待网站改变**。

## 练习方式与题目导航

支持多模块随机、单模块全练、按卷练习和高错题优先。综合题是一道完整题目，不因跨模块而拆开。已发布但答案缺失的题可以展示，但不计分。

高错题优先按当前范围内 `(total_answers - correct_answers) / total_answers` 降序排序，错误率相同时依次按样本人数、稳定 ID 排序。可选择最低作答人数；无统计或样本不足的题不入选。组卷后顺序固定，答题统计仍实时更新。简答和综合题统计包含自评，不等同于严格的题目难度。

提供上一题、下一题、跳过、答题卡跳转和结果页返回继续。切换题目保留当前页面内的草稿与已评分状态，不重复加分、重复提交统计；刷新或重新组卷会清除草稿。

单选/多选按显式正确选项集合核对；填空按人工配置的答案白名单匹配，不执行表达式、不猜数制或近似值。简答没有大输入框，显示参考答案后自评。综合题可混合上述题型；可评分小问等权合成整题分，缺答案的小问不计入分母。

## Supabase：统计与实时问题报告

首次启用在 SQL Editor 执行 `supabase/ics_stats.sql` 和 `supabase/ics_issue_reports.sql`。前端连接配置位于 `site/index.html` 的 `data-supabase-url` / `data-supabase-key`；只能使用公开 publishable key，**不能放 secret/service-role key**。本轮 v5 不需要新增 SQL：题目 ID、整题统计 ID 保持不变，旧片段 ID 仍可定位到综合题的小问。

每题的“您认为此题有误”按钮会提交报告，首页默认折叠的列表通过 Realtime 更新。公开端只能提交和读取聚合结果，不能删除报告或读取逐浏览器回执。统计与报错仍采用匿名浏览器 ID，客户端自报成绩，不是防作弊考试系统。

修复后，维护者在**本地进程环境**设置 `SUPABASE_URL` / `SUPABASE_SECRET_KEY`，再运行：

```powershell
npm run resolve-issue -- -QuestionId q-0123456789abcdef
```

只清理实际修复的题。脚本调用仅管理员可用的 RPC，删除报告及防重复回执；首页随实时事件移除，以后仍可重新报告。不要将管理员密钥放到仓库、网页、命令参数、截图或 Actions 日志。v5 迁移本身不会清空任何线上统计或报告。

## 题面审阅 PDF

```powershell
npm run review-pdfs
npm run review-paper -- -ListPapers
npm run review-paper -- -Paper "2025期末"
```

也可用 `-Paper p-...` 的稳定 ID，`-Module machine_prog` 选择模块，`-Output` 指定仓库内输出子目录。模块与试卷筛选不能同时使用，避免导出残卷。首次运行若缺依赖会创建隔离的 PDF 环境。

默认模块输出在 `output/pdf/question-review/`，试卷在 `output/pdf/paper-review/`。附带 `manifest.csv` / `manifest.json`，记录题型、唯一 ID、试卷、题号、页码及来源。综合题保留整题与各小问 ID；跨模块题可能在多份模块 PDF 中重复出现，同 ID 不是新增题。导出不附加答案，未发布待复核题也保留供审阅；数学内容不是浏览器 MathJax 的等价排版，以网页为显示基准。

## 部署与分支

`.github/workflows/pages.yml` 只在 `main` push 时自动验证、构建并发布 Pages。工作分支 push / PR 运行 `validate.yml`，**只校验、不部署**。手动部署工作流也限制在 `main`，避免误发布尚未合并的迁移。

本次迁移已在维护者确认后从 `schema-v5-migration` 合并到 `main`，当前主分支使用 v5。普通改题须一起提交人工 Markdown 和重新编译的 `web-data/`；生成结果漂移会被 CI 拦截。

## 题目来源与致谢

题目及参考材料主要整理自 [zhuozhiyongde/Introduction-to-Computer-System-2023Fall-PKU](https://github.com/zhuozhiyongde/Introduction-to-Computer-System-2023Fall-PKU)，感谢原仓库作者与贡献者的整理和分享。本仓库在此基础上进行分类、人工排版和交互练习开发，来源归属原作者及相关权利人，不代表北京大学官方题库。整理和参考答案可能存在错误，欢迎报告问题或提交 PR；转用材料请保留来源并遵守原材料的许可与使用要求。
