+++json
{
  "schemaVersion": "5",
  "id": "q-17ad9fe8fcec6820",
  "revision": 1,
  "paperId": "p-0fe6817c7f881573",
  "paperOrder": 2,
  "number": {
    "display": "第一题 2",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "2",
      "value": "2"
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
      "legacyId": "q-17ad9fe8fcec6820",
      "document": "原文/期中/2024期中-带答案.md",
      "lines": {
        "start": 56,
        "end": 68
      },
      "curated": "_curated/期中/2024期中-带答案/56.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "字符数组指针读取、字节序与ASCII码"
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
2.在 x86-64 机器上运行如下代码，输出是：
```
char A[12] = "19260817";
char B[12] = "20241104";
void *x = (void *)&A;
void *y = 2 + (void *)&B;
unsigned short P = *(unsigned short *)x;
unsigned short Q = *(unsigned short *)y;
printf("0x%04x", (unsigned short)(P - Q));
```
提示：‘0’,‘1’, ...,‘9’的ASCII码分别是 `0x30, 0x31, ..., 0x39`。
%%% reference
答案：B。
%%% option: A
`0xff05`
%%% option: B
`0x04ff`
%%% option: C
`0x0822`
%%% option: D
`0x0800`
