+++json
{
  "schemaVersion": "5",
  "id": "q-6cf7fdea35ca7215",
  "revision": 1,
  "paperId": "p-febcfbeee0f364b2",
  "paperOrder": 23,
  "number": {
    "display": "第8讲 23",
    "major": {
      "display": "第8讲",
      "value": null
    },
    "minor": {
      "display": "23",
      "value": "23"
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
      "legacyId": "q-6cf7fdea35ca7215",
      "document": "原文/阶段测验/2025第1次阶段测验-带答案.md",
      "lines": {
        "start": 392,
        "end": 404
      },
      "curated": "_curated/阶段测验/2025第1次阶段测验-带答案/392.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "union 与大端字节序下的输出结果"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "q23-word-0",
        "marker": "{{blank:q23-word-0}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q23-word-1",
        "marker": "{{blank:q23-word-1}}",
        "occurrence": 0,
        "width": "medium"
      }
    ]
  },
  "solution": {
    "state": "available",
    "grading": "blanks",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "unknown",
      "crossChecked": null,
      "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
    },
    "blankAnswers": [
      {
        "blankId": "q23-word-0",
        "method": "exact",
        "acceptedAnswers": [
          "0xC0C1C2C3",
          "C0C1C2C3"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "q23-word-1",
        "method": "exact",
        "acceptedAnswers": [
          "0xC4C5C6C7",
          "C4C5C6C7"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      }
    ]
  }
}
+++
%%% stem
23. 考虑下面的 C 语言代码：

```c
union {
    unsigned char c[8];
    unsigned int i[2];
} dw;

int j;
for (j = 0; j < 8; j++)
    dw.c[j] = 0xC0 + j;

printf("Ints 0-1 == [0x%x,0x%x]\n", dw.i[0], dw.i[1]);
```

如果在大端模式的计算机（如 Sun）上运行，输出结果是：

`Ints 0-1 == [ {{blank:q23-word-0}} ,` {{blank:q23-word-1}} `]`
%%% reference
答案：`0xC0C1C2C3`；`0xC4C5C6C7`
