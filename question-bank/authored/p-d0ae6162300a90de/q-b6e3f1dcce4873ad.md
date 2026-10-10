+++json
{
  "schemaVersion": "5",
  "id": "q-b6e3f1dcce4873ad",
  "revision": 2,
  "paperId": "p-d0ae6162300a90de",
  "paperOrder": 1,
  "number": {
    "display": "选择题 1",
    "major": {
      "display": "选择题",
      "value": null
    },
    "minor": {
      "display": "1",
      "value": "1"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "data_representation",
    "moduleIds": [
      "data_representation"
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
      "legacyId": "q-b6e3f1dcce4873ad",
      "document": "原文/期中/2013期中-带答案.md",
      "lines": {
        "start": 9,
        "end": 22
      },
      "curated": "_curated/期中/2013期中-带答案/9.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "大小端字节序：x86 小端 / Sun 大端"
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
      "origin": "unknown",
      "crossChecked": null,
      "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
    },
    "correctOptionIds": [
      "A"
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
1、变量x的值为`0x01234567`，地址&x为`0x100`；则该变量的值在x86和Sun机器内存中的存储排列顺序正确的是
%%% reference
答案：A
考察大端、小端；同时Sun是大端、x86是小端
%%% option: A
x86：67 45 23 01；Sun：01 23 45 67
%%% option: B
x86：76 54 32 10；Sun：01 23 45 67
%%% option: C
x86：01 23 45 67；Sun：67 45 23 01
%%% option: D
x86：01 23 45 67；Sun：01 23 45 67
