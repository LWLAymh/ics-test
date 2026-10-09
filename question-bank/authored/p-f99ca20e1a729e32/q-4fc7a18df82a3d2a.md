+++json
{
  "schemaVersion": "5",
  "id": "q-4fc7a18df82a3d2a",
  "revision": 1,
  "paperId": "p-f99ca20e1a729e32",
  "paperOrder": 25,
  "number": {
    "display": "第一题 25",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "25",
      "value": "25"
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
      "legacyId": "q-4fc7a18df82a3d2a",
      "document": "原文/期末/2020期末-无答案.md",
      "lines": {
        "start": 241,
        "end": 261
      },
      "curated": "_curated/期末/2020期末-无答案/241.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "信号量执行轨迹中的死锁"
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
25.  有四个信号量，初值分别为：`a=1,  b=1,  c=1,  d=1`

| 线程1 | 线程2 | 线程3 |
| --- | --- | --- |
| ① P(a); | ⑨ P(c); | ⑮ P(d); |
| ② P(b); | ⑩ P(b); | ⑯ P(a); |
| ③ P(d); | ⑪ V(c); | ⑰ V(d); |
| ④ P(c); | ⑫ V(b); | ⑱ P(b); |
| ⑤ V(d); | ⑬ P(a); | ⑲ V(a); |
| ⑥ V(a); | ⑭ V(a); | ⑳ V(b); |
| ⑦ V(b); |  |  |
| ⑧ V(c); |  |  |

上面的程序执行时，下列哪一个执行轨迹执行后已经出现死锁?
%%% reference
答案：B（来源：2019、2020期末-答案解析）
解析：轨迹 ①⑨⑩② 后，线程 1 持有 a 并等待 b，线程 2 持有 b 并等待 a，形成循环等待；⑮⑯ 后线程 3 也在等待 a，但不属于这个环。A、C 的给定轨迹结束时线程 2 仍可继续运行，D 中线程 1 仍可继续释放资源，因此只有 B 已出现死锁。
存疑说明：原 Markdown 附记称 A、B、C 都会死锁；逐步核对给定轨迹后，A、C 尚未形成循环等待，该附记与题面轨迹不符，故移除。
%%% option: A
⑨①⑩②⑪⑮
%%% option: B
①⑨⑩②⑮⑯
%%% option: C
⑮①⑨⑩⑯②
%%% option: D
①②③④⑨⑮
