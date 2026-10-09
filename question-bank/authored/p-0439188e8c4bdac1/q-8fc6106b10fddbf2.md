+++json
{
  "schemaVersion": "5",
  "id": "q-8fc6106b10fddbf2",
  "revision": 1,
  "paperId": "p-0439188e8c4bdac1",
  "paperOrder": 10,
  "number": {
    "display": "第11讲 10",
    "major": {
      "display": "第11讲",
      "value": null
    },
    "minor": {
      "display": "10",
      "value": "10"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "processor_arch",
    "moduleIds": [
      "processor_arch"
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
      "legacyId": "q-8fc6106b10fddbf2",
      "document": "原文/阶段测验/2025第2次阶段测验-带答案.md",
      "lines": {
        "start": 151,
        "end": 158
      },
      "curated": "_curated/阶段测验/2025第2次阶段测验-带答案/151.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "写 Load-use 与 ret 组合的 Y86-64 代码"
    }
  ],
  "type": "short-answer",
  "stem": {
    "format": "markdown"
  },
  "solution": {
    "state": "available",
    "grading": "self",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null,
      "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
    }
  }
}
+++
%%% stem
10.（2分）写出一段存在Load-use相关和`ret`组合的Y86-64汇编代码（要求代码简
洁明了）。
%%% reference
答：代码示例如下（2分）：
```asm
mrmovq 0(%rdx),%rsp
ret
```
注意：代码不用一模一样，关键点是前一条指令读内存到`rsp`寄存器，后一条指令是`ret`
