+++json
{
  "schemaVersion": "5",
  "id": "q-ec5b52c3bee5d20e",
  "revision": 1,
  "paperId": "p-662d741f28b2bed0",
  "paperOrder": 19,
  "number": {
    "display": "第一题 19",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "19",
      "value": "19"
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
      "legacyId": "q-ec5b52c3bee5d20e",
      "document": "原文/期中/2016期中-带答案.md",
      "lines": {
        "start": 194,
        "end": 196
      },
      "curated": "_curated/期中/2016期中-带答案/194.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "直接映射 cache 每组行数"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "lines-per-set",
        "marker": "{{blank:lines-per-set}}",
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
        "blankId": "lines-per-set",
        "method": "exact",
        "acceptedAnswers": [
          "1"
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
19. 如果直接映射高速缓存大小是4KB，并且块（block）大小为32字节，那么
它每组（set）有 {{blank:lines-per-set}} 行（line）。
%%% reference
答案：1。这是直接映射高速缓存的基本特征，和容量无关
