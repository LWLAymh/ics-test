+++json
{
  "schemaVersion": "5",
  "id": "q-55a24e2f2c5a7bcc",
  "revision": 2,
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
答案：A。结构体填充由成员对齐要求和末尾对齐共同决定，不能仅按 `sizeof` 大小保证最优。例如在 `short` 大小/对齐均为 2 的通常布局中，`{ char a; short b; char c[3]; }` 按成员大小 1、2、3 升序排列却占 8 字节；改为 `{ short b; char c[3]; char a; }` 只占 6 字节。

单成员结构体已反驳 B 的“一定不会最大”。union 大小由最大成员大小和对齐共同决定，与成员顺序无关，任何顺序都同时达到最小/最大，C、D 也不成立。原解析最后一句把“按大小排序必然最小”写成结论，与 A 矛盾，已更正。
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
