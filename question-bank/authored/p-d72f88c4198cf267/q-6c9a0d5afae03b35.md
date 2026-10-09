+++json
{
  "schemaVersion": "5",
  "id": "q-6c9a0d5afae03b35",
  "revision": 1,
  "paperId": "p-d72f88c4198cf267",
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
      "legacyId": "q-6c9a0d5afae03b35",
      "document": "原文/期中/2020期中-带答案.md",
      "lines": {
        "start": 90,
        "end": 105
      },
      "curated": "_curated/期中/2020期中-带答案/90.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "结构体成员偏移与 movl/leaq 选择"
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
5. 假设结构体类型 `student_info` 的声明如下：

```c
struct student_info {
        char id[8];
        char name[16];
        unsigned zip;
        char address[50];
        char phone[20];
}x;
```

若 `x` 的首地址在 `%rdx` 中，则 `unsigned xzip = x.zip;` 所对应的汇编指令为：
%%% reference
B
%%% option: A
`movl 0x24(%rdx), %eax`
%%% option: B
`movl 0x18(%rdx), %eax`
%%% option: C
`leaq 0x24(%rdx), %rax`
%%% option: D
`leaq 0x18(%rdx), %rax`
