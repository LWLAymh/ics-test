+++json
{
  "schemaVersion": "5",
  "id": "q-7aabada2327c4f09",
  "revision": 1,
  "paperId": "p-ea869cda0eb89689",
  "paperOrder": 1,
  "number": {
    "display": "Problem A 1",
    "major": {
      "display": "Problem A",
      "value": "A"
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
      "legacyId": "q-7aabada2327c4f09",
      "document": "原文/期中/2012期中-带答案.md",
      "lines": {
        "start": 13,
        "end": 17
      },
      "curated": "_curated/期中/2012期中-带答案/13.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "整数除法截断与算术右移 -31/8 vs -31>>3"
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
1. Let `int x = -31/8` and `int y = -31 >> 3`. What are the values of `x` and `y`?
%%% reference
**答案：C**
%%% option: A
`x = -3, y = -3`
%%% option: B
`x = -4, y = -4`
%%% option: C
`x = -3, y = -4`
%%% option: D
`x = -4, y = -3`
