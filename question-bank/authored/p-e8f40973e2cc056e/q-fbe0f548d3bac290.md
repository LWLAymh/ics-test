+++json
{
  "schemaVersion": "5",
  "id": "q-fbe0f548d3bac290",
  "revision": 1,
  "paperId": "p-e8f40973e2cc056e",
  "paperOrder": 14,
  "number": {
    "display": "二 14",
    "major": {
      "display": "二",
      "value": null
    },
    "minor": {
      "display": "14",
      "value": "14"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "compilation_linking",
    "moduleIds": [
      "compilation_linking"
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
      "legacyId": "q-fbe0f548d3bac290",
      "document": "原文/期末/2025期末-无答案.md",
      "lines": {
        "start": 207,
        "end": 218
      },
      "curated": "_curated/期末/2025期末-无答案/207.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "全局符号强/弱定义与重复定义"
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
      "A",
      "C",
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
    },
    {
      "id": "E",
      "content": {
        "format": "markdown"
      }
    }
  ]
}
+++
%%% stem
二 不定项选择题（下）（36分）

14.三个C程序文件，下面仅观察其中的全局符号`g`：

```c
// a.c
int g = 1;
```

```c
// b.c
int g;
```

```c
// main.c
extern int g;
int main() {
    return g;
}
```

关于链接行为，下列说法哪些正确？
%%% reference
答案：ACD
解析：`int g=1` 是强定义；int g; 是“弱/共同（`common`）”风格，强胜弱，因此 A 对、B 错。两个强定义会报错（D 对）。链接器通常不做类型一致性检查，E 错（但运行行为会出问题）。

校对说明：上述答案依赖课程采用 `common` 符号的链接规则（例如 GCC 使用 `-fcommon`）。题面没有给出该编译选项；使用 GCC 默认的 `-fno-common` 时，多个翻译单元中的暂定定义可能导致链接失败，故此处保留答案册答案并标记环境假设。
%%% option: A
链接成功，`main` 中引用的 `g` 解析到 `a.c` 的定义
%%% option: B
链接失败，因为 `g` 在 `a.c` 与 `b.c` 中被“重复定义”
%%% option: C
若把 `a.c` 改为 `int g;`，与 `b.c` 一样，则链接仍可成功，最终只分配一个 `g`
%%% option: D
若把 `b.c` 改为 `int g = 2;`，则链接失败
%%% option: E
若把 `a.c` 中 `g` 定义改成 `double g = 1.0;`，`main.c`中声明 `extern int g;` 并
使用，链接器会报“类型不匹配”错误
