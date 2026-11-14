+++json
{
  "schemaVersion": "5",
  "id": "q-47db387d05efd1be",
  "revision": 3,
  "paperId": "p-7016510094998ec2",
  "paperOrder": 5,
  "number": {
    "display": "第一题 5",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "5",
      "value": "5"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "compilation_linking",
    "moduleIds": [
      "compilation_linking"
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
      "legacyId": "q-47db387d05efd1be",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 48,
        "end": 48
      },
      "curated": "_curated/期末/2022期末-无答案/48.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "延迟绑定依赖的两个数据结构 PLT/GOT"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "legacy-gap-0",
        "marker": "{{blank:legacy-gap-0}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-1",
        "marker": "{{blank:legacy-gap-1}}",
        "occurrence": 0,
        "width": "medium"
      }
    ]
  },
  "solution": {
    "state": "available",
    "grading": "blanks",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null,
      "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
    },
    "blankAnswers": [
      {
        "blankId": "legacy-gap-0",
        "method": "exact", "acceptedAnswers":["GOT","全局偏移量表","全局偏移表","global offset table"], "normalize":{"caseSensitive":false,"trimWhitespace":true}
      },
      {
        "blankId": "legacy-gap-1",
        "method": "exact", "acceptedAnswers":["PLT","过程链接表","procedure linkage table"], "normalize":{"caseSensitive":false,"trimWhitespace":true}
      }
    ]
  }
}
+++
%%% stem
5. 在教材介绍的 Linux ELF 延迟绑定机制中，需要两个数据结构交互：保存目标地址的表{{blank:legacy-gap-0}}，以及包含跳转指令的代码表{{blank:legacy-gap-1}}。（可填英文缩写或中文名称。）
%%% reference
答案：GOT；PLT
