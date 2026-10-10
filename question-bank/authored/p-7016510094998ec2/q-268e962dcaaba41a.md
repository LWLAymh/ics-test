+++json
{
  "schemaVersion": "5",
  "id": "q-268e962dcaaba41a",
  "revision": 3,
  "paperId": "p-7016510094998ec2",
  "paperOrder": 3,
  "number": {
    "display": "第一题 3",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "3",
      "value": "3"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "machine_prog",
    "moduleIds": [
      "machine_prog"
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
      "legacyId": "q-268e962dcaaba41a",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 44,
        "end": 44
      },
      "curated": "_curated/期末/2022期末-无答案/44.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "x86-64/Linux 传参前两个寄存器"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "legacy-gap-0",
        "marker": "{{blank:legacy-gap-0}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-1",
        "marker": "{{blank:legacy-gap-1}}",
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
        "blankId": "legacy-gap-0",
        "method": "exact",
        "acceptedAnswers": ["rdi", "%rdi"],
        "normalize": {"caseSensitive": false, "trimWhitespace": true}
      },
      {
        "blankId": "legacy-gap-1",
        "method": "exact",
        "acceptedAnswers": ["rsi", "%rsi"],
        "normalize": {"caseSensitive": false, "trimWhitespace": true}
      }
    ]
  }
}
+++
%%% stem
3. 在 x86-64/Linux 的约定中，函数传递参数的前两个分别放在{{blank:legacy-gap-0}}和{{blank:legacy-gap-1}}寄存器。
%%% reference
答案：rdi；rsi
