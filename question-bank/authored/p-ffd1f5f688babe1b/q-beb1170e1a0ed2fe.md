+++json
{
  "schemaVersion": "5",
  "id": "q-beb1170e1a0ed2fe",
  "revision": 1,
  "paperId": "p-ffd1f5f688babe1b",
  "paperOrder": 16,
  "number": {
    "display": "第二题 1",
    "major": {
      "display": "第二题",
      "value": "2"
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
      "legacyId": "q-beb1170e1a0ed2fe",
      "document": "原文/期中/2021期中-带答案.md",
      "lines": {
        "start": 335,
        "end": 341
      },
      "curated": "_curated/期中/2021期中-带答案/335.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "short 的小端存放、补码与绝对值"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "hex-value",
        "marker": "{{blank:hex-value}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "sign",
        "marker": "{{blank:sign}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "absolute-value",
        "marker": "{{blank:absolute-value}}",
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
        "blankId": "hex-value",
        "method": "self"
      },
      {
        "blankId": "sign",
        "method": "self"
      },
      {
        "blankId": "absolute-value",
        "method": "self"
      }
    ]
  }
}
+++
%%% stem
第二题：请结合教材第二章“信息的表示和处理”的相关知识回答下列问题（10 分）。

1. 假设某 x86-64 机器在地址 `0x100` 和 `0x101` 处存储的数据用二进制表示分别为 `[1010 1100]₂` 和 `[1111 1011]₂`。又假设 `x` 是一个 `short` 类型的变量，其地址为 `0x100`。则 `x` 的十六进制补码表示为 `0x{{blank:hex-value}}`，这是一个 {{blank:sign}}（填“正”或“负”）数，其绝对值为 {{blank:absolute-value}}（用十进制数字表示）。
%%% reference
(1) `fbac`；(2) 负；(3) `1108`。
