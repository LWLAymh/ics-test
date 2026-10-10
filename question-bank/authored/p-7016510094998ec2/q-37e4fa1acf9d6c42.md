+++json
{
  "schemaVersion": "5",
  "id": "q-37e4fa1acf9d6c42",
  "revision": 2,
  "paperId": "p-7016510094998ec2",
  "paperOrder": 9,
  "number": {
    "display": "第一题 9",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "9",
      "value": "9"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "virtual_memory_and_malloc",
    "moduleIds": [
      "virtual_memory_and_malloc"
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
      "legacyId": "q-37e4fa1acf9d6c42",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 72,
        "end": 72
      },
      "curated": "_curated/期末/2022期末-无答案/72.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "虚拟地址交 MMU 翻译并引入 TLB 加速"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "legacy-gap-0",
        "marker": "______①______",
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
        "method": "self"
      },
      {
        "blankId": "legacy-gap-1",
        "method": "self"
      }
    ]
  }
}
+++
%%% stem
9. 在支持虚拟地址空间的系统中，CPU 取到虚拟地址后，发给______①______，由①将虚拟地址转换为物理地址。为了加快地址翻译速度，需要在①中引入②{{blank:legacy-gap-1}}。
%%% reference
答案：MMU；TLB
