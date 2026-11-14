+++json
{
  "schemaVersion": "5",
  "id": "q-4d4da7a8daaab375",
  "revision": 2,
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
各线程按以下各列从上到下执行，空单元格表示该线程没有对应步骤。

| 步骤 | 线程① | 线程② | 线程③ |
| --- | --- | --- | --- |
| 1 | `P(a)` | `P(d)` | `P(d)` |
| 2 | `P(d)` | `P(a)` | `P(c)` |
| 3 | `P(c)` | `P(c)` | `P(b)` |
| 4 | `P(b)` | `P(b)` | `P(a)` |
| 5 | `V(c)` | `V(d)` | `V(c)` |
| 6 | `V(b)` | `P(d)` | `V(b)` |
| 7 | `V(d)` | `V(a)` | `V(a)` |
| 8 | `V(a)` | `V(b)` | `V(d)` |
| 9 | — | `V(c)` | — |
| 10 | — | `V(d)` | — |
下列哪两个线程并发执行时，一定不会发生死锁？
%%% reference
答案：D
任意一对都存在导致死锁的交错，并不是每次调度都必然死锁。①/② 或 ①/③ 可各持有 a、d 并等待对方；②先持有 a/c/b 后释放 d，③拿到 d 后等待 c，而②重新 P(d)，也能形成循环等待。因此没有一对“一定不会死锁”。
%%% option: A
①, ②
%%% option: B
①, ③
%%% option: C
②, ③
%%% option: D
以上选项均不正确
