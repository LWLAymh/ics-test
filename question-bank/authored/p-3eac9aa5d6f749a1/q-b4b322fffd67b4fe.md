+++json
{
  "schemaVersion":"5", "id":"q-b4b322fffd67b4fe", "revision":1, "paperId":"p-3eac9aa5d6f749a1", "paperOrder":5,
  "number":{"display":"第3讲 3.2","major":{"display":"第3讲","value":"3"},"minor":{"display":"3.2","value":"2"},"parts":[]},
  "classification":{"primaryModuleId":"data_representation","moduleIds":["data_representation"],"tags":["ieee754-special-values"]},
  "type":"fill", "stem":{"format":"markdown","blanks":[
    {"id":"first","marker":"{{blank:first}}","occurrence":0,"width":"medium","label":"0xFF800000 表示的值","input":{"kind":"select","multiple":false,"options":[{"value":"pos-inf","label":"正无穷（+∞）"},{"value":"neg-inf","label":"负无穷（−∞）"},{"value":"nan","label":"NaN（非数）"},{"value":"pos-zero","label":"正零（+0）"},{"value":"neg-zero","label":"负零（−0）"},{"value":"finite","label":"有限非零数"}]}},
    {"id":"second","marker":"{{blank:second}}","occurrence":0,"width":"medium","label":"0x7FC00000 表示的值","input":{"kind":"select","multiple":false,"options":[{"value":"pos-inf","label":"正无穷（+∞）"},{"value":"neg-inf","label":"负无穷（−∞）"},{"value":"nan","label":"NaN（非数）"},{"value":"pos-zero","label":"正零（+0）"},{"value":"neg-zero","label":"负零（−0）"},{"value":"finite","label":"有限非零数"}]}}
  ]},
  "solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"first","method":"selection","correctValues":["neg-inf"]},{"blankId":"second","method":"selection","correctValues":["nan"]}],"reference":{"format":"markdown"},"provenance":{"origin":"official","crossChecked":null,"attribution":"随卷提供的 v2.0 纯答案 PDF，第1页"}},
  "publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},
  "sources":[{"document":"原文/阶段测验/2026-stage1/exam-v2.pdf","provenance":"reflow","editorNote":"第3页，3.2；特殊值配置覆盖全部数值类别的下拉候选。"},{"document":"原文/阶段测验/2026-stage1/answers-v2.pdf","provenance":"reflow","editorNote":"第1页，3.2。"}]
}
+++
%%% stem
### 3.2 IEEE 754 标准（4 分）

以下两个 32 位编码按照 IEEE 754 单精度浮点数格式解释，分别表示什么？

1. `0xFF800000` → {{blank:first}}（2 分）
2. `0x7FC00000` → {{blank:second}}（2 分）
%%% reference
1. 负无穷（$-\infty$）。符号位为 `1`，阶码全为 `1`，小数域全为 `0`。
2. `NaN`（非数）。阶码全为 `1`，小数域不全为 `0`。
