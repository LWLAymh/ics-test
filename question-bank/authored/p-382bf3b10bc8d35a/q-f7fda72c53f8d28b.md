+++json
{
  "schemaVersion": "5",
  "id": "q-f7fda72c53f8d28b",
  "revision": 1,
  "paperId": "p-382bf3b10bc8d35a",
  "paperOrder": 3,
  "number": {
    "display": "第一题 3",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "3",
      "value": "3"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "machine_prog",
    "moduleIds": [
      "machine_prog"
    ],
    "tags": []
  },
  "publication": {
    "state": "published",
    "basis": "legacy-migration",
    "reviewer": null,
    "reviewedAt": null,
    "issues": []
  },
  "sources": [
    {
      "legacyId": "q-f7fda72c53f8d28b",
      "document": "原文/期末/2017期末-无答案.md",
      "lines": {
        "start": 59,
        "end": 63
      },
      "curated": "_curated/期末/2017期末-无答案/59.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "指令长度、test 与 cmp 等价、跳转表"
    }
  ],
  "type": "single-choice",
  "stem": {
    "format": "markdown"
  },
  "solution": {
    "state": "available",
    "grading": "choice",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "ai-derived",
      "crossChecked": false,
      "attribution": "deepseek v4.1 flash · 大肥鱼小姐",
      "note": "Explicitly registered in docs/AI_DERIVED_ANSWERS.md; not inferred from answer text."
    },
    "correctOptionIds": [
      "B"
    ]
  },
  "options": [
    {
      "id": "A",
      "content": {
        "format": "markdown"
      }
    },
    {
      "id": "B",
      "content": {
        "format": "markdown"
      }
    },
    {
      "id": "C",
      "content": {
        "format": "markdown"
      }
    },
    {
      "id": "D",
      "content": {
        "format": "markdown"
      }
    }
  ]
}
+++
%%% stem
3.  下面说法正确的是：
%%% reference
答案：B
解析：`test %rax,%rax` 只把 `rax` 与自身相与，其 `ZF/SF/PF` 与 `cmp $0,%rax` 完全一致，`CF` 与 `OF` 也同为 0，二者在条件转移上等价；A 错（指令长度可变），C 错（`switch` 只有分支密集时才生成跳转表）。
注：若按「标志位完全相同」的严格口径（`TEST` 的 `AF` 未定义），本题也可选 D「以上都不对」，此处取课程教材中「`TEST` 与 `CMP $0` 等价」的表述。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
不同指令的机器码长度是相同的
%%% option: B
`test %rax, %rax`恒等于`cmp $0, %rax`
%%% option: C
`switch`编译后总是会产生跳转表
%%% option: D
以上都不对
