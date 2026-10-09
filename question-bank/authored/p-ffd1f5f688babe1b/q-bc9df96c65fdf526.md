+++json
{
  "schemaVersion": "5",
  "id": "q-bc9df96c65fdf526",
  "revision": 1,
  "paperId": "p-ffd1f5f688babe1b",
  "paperOrder": 1,
  "number": {
    "display": "第一题 1",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "1",
      "value": "1"
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
      "legacyId": "q-bc9df96c65fdf526",
      "document": "原文/期中/2021期中-带答案.md",
      "lines": {
        "start": 49,
        "end": 70
      },
      "curated": "_curated/期中/2021期中-带答案/49.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "union 中 char 数组与指针、大小端解释"
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
1. 考虑如下代码在x86-64处理器上的运行情况：
```
union U{
char x[12];
char *p;
}u;
int main() {
strcpy(u.x, "I love ICS!");
printf("%p\n", u.p);
return 0;
}
```
提示：
1) "I love ICS!"对应的字节序列是49 20 6c 6f 76 65 20 49 43 53
21
2) %p用于输出一个指针的值
程序运行的输出是:
%%% reference
答案：D
D
%%% option: A
`0x49206c6f76652049435321`
%%% option: B
`0x215343492065766f6c2049`
%%% option: C
`0x49206c6f76652049`
%%% option: D
`0x492065766f6c2049`
