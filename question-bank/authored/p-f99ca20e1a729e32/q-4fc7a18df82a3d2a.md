+++json
{
  "schemaVersion": "5",
  "id": "q-4fc7a18df82a3d2a",
  "revision": 2,
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
  "type": "multiple-choice",
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
      "A", "B", "C"
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

下列哪些执行轨迹前缀已足以保证：只要可运行线程继续推进，最终将进入死锁？（多选）这里不要求前缀末尾所有线程已经阻塞；尚可执行有限个V操作，也可能无法避免后续循环等待。P/V编号代表尝试该操作，不能取得信号量的P使该线程阻塞。
%%% reference
答案：**ABC**（修正原单选B及既有错误解释）。B与C虽操作顺序不同，前缀结束状态完全相同：线程1持a并在②等b；线程2持b/c，接下来可⑪释放c、⑫释放b；线程3持d并在⑯等a。释放b只能让线程1继续取得b，随后在③等d；线程3必须先取得a才会⑰释放d，于是线程1/3形成a↔d环。线程2随后⑬也等a，不能解环。

A已做⑪，状态仅少了线程2持c；同样在线程2⑫释放b后进入上述a↔d环。因此“暂时还能V”不是排除A/C的理由。D中线程1已经取得a/b/d/c四个信号量，可依次执行⑤⑥⑦⑧释放d/a/b/c并完成，之后线程2/3能继续，不构成保证死锁的前缀。

原题“已经出现死锁”没有区分当前阻塞状态与不可避免的后续死锁，原B与C亦不可能在同一末状态下具有不同结论。现明确问保证后续死锁的前缀并按多选ABC核对。
%%% option: A
⑨①⑩②⑪⑮
%%% option: B
①⑨⑩②⑮⑯
%%% option: C
⑮①⑨⑩⑯②
%%% option: D
①②③④⑨⑮
