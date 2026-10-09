+++json
{
  "schemaVersion": "5",
  "id": "q-9f5a4f0e6e0d21ba",
  "revision": 1,
  "paperId": "p-0439188e8c4bdac1",
  "paperOrder": 15,
  "number": {
    "display": "第12讲 15",
    "major": {
      "display": "第12讲",
      "value": null
    },
    "minor": {
      "display": "15",
      "value": "15"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "memory_hierarchy",
    "moduleIds": [
      "memory_hierarchy"
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
      "legacyId": "q-9f5a4f0e6e0d21ba",
      "document": "原文/阶段测验/2025第2次阶段测验-带答案.md",
      "lines": {
        "start": 184,
        "end": 197
      },
      "curated": "_curated/阶段测验/2025第2次阶段测验-带答案/184.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "数组求和代码中的时间/空间局部性分析"
    }
  ],
  "type": "short-answer",
  "stem": {
    "format": "markdown"
  },
  "solution": {
    "state": "available",
    "grading": "self",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null,
      "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
    }
  }
}
+++
%%% stem
15.（4分）下面这段代码哪些地方体现了局部性原理？分别体现了什么类型的局部性。
```c
int sum_array_rows(int a[M][N])
{
    int i, j, sum = 0;
    for (i = 0; i < M; i++)
        for (j = 0; j < N; j++)
            sum += a[i][j];
    return sum;
}
```
%%% reference
答：共四种情况：指令、数据；空间、时间局部性。各1分:1）顺序执行的指令序列，
体现空间局部性；2）循环内部指令会反复执行，体现时间局部性；3）`sum`等变量反复被
读写，体现时间局部性；4）数组`a`中的数据按地址依次被读取，体现空间局部性。
