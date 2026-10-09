+++json
{
  "schemaVersion": "5",
  "id": "q-fb4adbdb7bf4b42e",
  "revision": 1,
  "paperId": "p-08e665c0f6e47348",
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
      "legacyId": "q-fb4adbdb7bf4b42e",
      "document": "原文/期末/2015期末-20160104-带答案.md",
      "lines": {
        "start": 83,
        "end": 96
      },
      "curated": "_curated/期末/2015期末-20160104-带答案/83.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "字符串常量被放入哪个 ELF 节"
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
5.  在`foo.c`文件中包含如下代码：
```
int foo(void) {
  int error = printf("You ran into a problem!\n");
  return error;
}
```
经过编译和链接之后，字符串"You ran into a problem!\n"会出现在哪个
段中？
%%% reference
答案：C。
%%% option: A
.bss
%%% option: B
.data
%%% option: C
.rodata
%%% option: D
.text
