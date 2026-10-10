+++json
{
  "schemaVersion": "5",
  "id": "q-8a75ddae2da2bd06",
  "revision": 3,
  "paperId": "p-089627b27e9b5e79",
  "paperOrder": 14,
  "number": {
    "display": "第一题 14",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "14",
      "value": "14"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "virtual_memory_and_malloc",
    "moduleIds": [
      "virtual_memory_and_malloc"
    ],
    "tags": []
  },
  "publication": {
    "state": "review",
    "basis": "legacy-migration",
    "reviewer": null,
    "reviewedAt": null,
    "issues": [
      "selection-multiplicity-unresolved"
    ]
  },
  "sources": [
    {
      "legacyId": "q-8a75ddae2da2bd06",
      "document": "原文/期末/2014期末-带答案.md",
      "lines": {
        "start": 211,
        "end": 229
      },
      "curated": "_curated/期末/2014期末-带答案/211.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "malloc 堆分配与栈数组的区别"
    }
  ],
  "type": "unclassified-choice",
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
      "C"
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
14. 有程序段如下：


```
int foo( ) {
  char str1[20], *str2;
  str2 = (char*)malloc(20*sizeof(char));
  free(str2);
}
```
下列说法中正确的是
%%% reference
答案：C
考察`malloc`函数是显式地分配和释放堆存储器。
%%% option: A
`str1`和`str2`指向的内存都是分配在栈空间内的
%%% option: B
`str1`和`str2`指向的内存都是分配在堆空间内的
%%% option: C
`str1`指向的内存是分配在栈空间内的，`str2`指向的内存是分配在堆空间内的
%%% option: D
`str1`指向的内存是分配在堆空间内的，`str2`指向的内存是分配在栈空间内的
