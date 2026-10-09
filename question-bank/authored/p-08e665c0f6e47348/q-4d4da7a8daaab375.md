+++json
{
  "schemaVersion": "5",
  "id": "q-4d4da7a8daaab375",
  "revision": 1,
  "paperId": "p-08e665c0f6e47348",
  "paperOrder": 20,
  "number": {
    "display": "第一题 20",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "20",
      "value": "20"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "concurrent_programming",
    "moduleIds": [
      "concurrent_programming"
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
      "legacyId": "q-4d4da7a8daaab375",
      "document": "原文/期末/2015期末-20160104-带答案.md",
      "lines": {
        "start": 317,
        "end": 344
      },
      "curated": "_curated/期末/2015期末-20160104-带答案/317.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "信号量 PV 序列的死锁判定"
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
      "D"
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
20. 有四个信号量，初值分别为：`a=1`，`b=1`，`c=1`，`d=1`。
线程①  线程②  线程③
```
P(a);  P(d);  P(d);
P(d);  P(a);  P(c);
P(c);  P(c);  P(b);
P(b);  P(b);  P(a);
V(c);  V(d);  V(c);
V(b);  P(d);  V(b);
V(d);  V(a);  V(a);
V(a);  V(b);  V(d);
V(c);
V(d);
```
下列哪两个线程并发执行时，一定不会发生死锁？
%%% reference
答案：D
（本题考查对死锁概念的理解，本题的情况是任意两个线程并发执行，都会产生死
锁）
%%% option: A
①, ②
%%% option: B
①, ③
%%% option: C
②, ③
%%% option: D
以上选项均不正确
