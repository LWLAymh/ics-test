+++json
{
  "schemaVersion": "5",
  "id": "q-c115d0ee9fcb53f6",
  "revision": 1,
  "paperId": "p-89e8b793519e36c6",
  "paperOrder": 3,
  "number": {
    "display": "选择题 3",
    "major": {
      "display": "选择题",
      "value": null
    },
    "minor": {
      "display": "3",
      "value": "3"
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
      "legacyId": "q-c115d0ee9fcb53f6",
      "document": "原文/期中/2015期中-带答案.md",
      "lines": {
        "start": 65,
        "end": 78
      },
      "curated": "_curated/期中/2015期中-带答案/65.md",
      "aliases": [
        "原文/期末/2015期末-20151109-带答案.md"
      ],
      "provenance": "rewritten",
      "editorNote": "C90 类型转换顺序与 INT_MIN"
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
3.  在32位平台上，按C90标准以下语句中，结果为假的是
%%% reference
答案：b。因为2147483648超出了有符号数的表示范围，C90的C语言会将其
识别为`unsigned`。注意在32位机器上`long`和`int`都是32位。

参考信息（原卷红字）：
C90的转换顺序：int -> long -> unsigned -> unsigned long
$2^{31}=2147483648$
%%% option: A
`return INT_MIN < INT_MAX;`
%%% option: B
`return -2147483648 < 2147483647;`
%%% option: C
`int a = -2147483648; return a < 2147483647;`
%%% option: D
`return -2147483647-1 < 2147483647;`
