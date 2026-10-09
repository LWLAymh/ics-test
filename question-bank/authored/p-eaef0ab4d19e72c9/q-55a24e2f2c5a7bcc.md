+++json
{
  "schemaVersion": "5",
  "id": "q-55a24e2f2c5a7bcc",
  "revision": 1,
  "paperId": "p-eaef0ab4d19e72c9",
  "paperOrder": 6,
  "number": {
    "display": "第一题 6",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "6",
      "value": "6"
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
      "legacyId": "q-55a24e2f2c5a7bcc",
      "document": "原文/期中/2018期中-带答案.md",
      "lines": {
        "start": 109,
        "end": 121
      },
      "curated": "_curated/期中/2018期中-带答案/109.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "struct/union 成员排列与内存占用"
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
6.  下列关于C语言中的结构体`(struct)`以及联合(union)的说法中，正确的是：
%%% reference
答案：A。联合以及只含一个基本数据类型成员的结构体的内存占用与其成员排列
方式无关，即任意排列方式都可使得内存占用最小（最大），故b、c、d错误。对
于`struct`，应当将成员按照其存储单元所占内存大小从小到大（或从大到小）的顺
序进行排列才能使内存占用最小，故a正确。
%%% option: A
对于任意`struct`，将其成员按照其实际占用内存大小从小到大的顺序进行排列
不一定会使之内存占用最小
%%% option: B
对于任意`struct`，将其成员按照其实际占用内存大小从小到大的顺序进行排列
一定不会使之内存占用最大
%%% option: C
对于任意 `union`，将其成员按照其实际占用内存大小从小到大的顺序进行排列
不一定会使之内存占用最小
%%% option: D
对于任意 `union`，将其成员按照其实际占用内存大小从小到大的顺序进行排列
一定不会使之内存占用最大
