+++json
{
  "schemaVersion":"5", "id":"q-597ae48bbeb3fdc8", "revision":1, "paperId":"p-3eac9aa5d6f749a1", "paperOrder":22,
  "number":{"display":"第7讲 7.2","major":{"display":"第7讲","value":"7"},"minor":{"display":"7.2","value":"2"},"parts":[]},
  "classification":{"primaryModuleId":"machine_prog","moduleIds":["machine_prog"],"tags":["struct-alignment","array","pointer"]},
  "type":"fill", "stem":{"format":"markdown","blanks":[
    {"id":"offset","marker":"{{blank:offset}}","occurrence":0,"width":"short","label":"成员 v 的偏移量"},
    {"id":"size","marker":"{{blank:size}}","occurrence":0,"width":"short","label":"sizeof(Rec)"},
    {"id":"address","marker":"{{blank:address}}","occurrence":0,"width":"medium","label":"a[2].v[1] 的地址"},
    {"id":"result","marker":"{{blank:result}}","occurrence":0,"width":"short","label":"result 的值"}
  ]},
  "solution":{"state":"available","grading":"blanks","blankAnswers":[
    {"blankId":"offset","method":"exact","acceptedAnswers":["4"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
    {"blankId":"size","method":"exact","acceptedAnswers":["24"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
    {"blankId":"address","method":"exact","acceptedAnswers":["0x1038","1038"],"normalize":{"trimWhitespace":true,"caseSensitive":false}},
    {"blankId":"result","method":"exact","acceptedAnswers":["36"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}
  ],"reference":{"format":"markdown"},"provenance":{"origin":"official","crossChecked":null,"attribution":"随卷提供的 v2.0 纯答案 PDF，第5页"}},
  "publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},
  "sources":[{"document":"原文/阶段测验/2026-stage1/exam-v2.pdf","provenance":"reflow","editorNote":"第10页，7.2；默认平台前提补在单题中，供随机练习独立阅读。"},{"document":"原文/阶段测验/2026-stage1/answers-v2.pdf","provenance":"reflow","editorNote":"第5页，7.2。"}]
}
+++
%%% stem
### 7.2 结构体（8 分）

考虑以下 C 语言代码，采用原卷默认的 x86-64 Linux 环境（`char`、`int`、`long` 分别占 1、4、8 字节）：

```c
typedef struct {
    char tag;
    int v[3];
    long sum;
} Rec;

Rec a[3] = {
    {'A', {1, 2, 3}, 10},
    {'B', {4, 5, 6}, 20},
    {'C', {7, 8, 9}, 30}
};

Rec *p = &a[1];
int *q = p->v;
long result = p[1].sum + q[2];
```

假设结构体采用课件讲授的默认对齐规则，没有使用任何特殊的内存打包设置。数组 `a` 的起始地址为 `0x1000`。

1. `Rec` 中成员 `v` 相对于结构体起始地址的偏移量为：{{blank:offset}} 字节。（2 分）
2. `sizeof(Rec)` 的值为：{{blank:size}} 字节。（2 分）
3. `&a[2].v[1]` 的地址为（十六进制，可省略 `0x`）：{{blank:address}}（2 分）
4. 变量 `result` 最终的值为（十进制）：{{blank:result}}（2 分）
%%% reference
各空依次为 `4`、`24`、`0x1038`、`36`。

结构体布局为：

| 内容 | 字节偏移 | 大小 |
| --- | --- | --- |
| `tag` | `0` | `1` |
| 填充 | `1–3` | `3` |
| `v[0]` | `4` | `4` |
| `v[1]` | `8` | `4` |
| `v[2]` | `12` | `4` |
| `sum` | `16` | `8` |

总大小为 `24` 字节，满足 8 字节对齐。`&a[2].v[1] = 0x1000 + 2*24 + 4 + 1*4 = 0x1038`。

`p` 指向 `a[1]`，故 `p[1].sum = a[2].sum = 30`；`q` 指向 `a[1].v`，故 `q[2] = 6`，最终 `result = 36`。
