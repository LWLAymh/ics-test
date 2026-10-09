+++json
{
  "schemaVersion": "5",
  "id": "q-c7abd17adc9749bd",
  "revision": 1,
  "paperId": "p-0fe6817c7f881573",
  "paperOrder": 11,
  "number": {
    "display": "第一题 11",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "11",
      "value": "11"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "processor_arch",
    "moduleIds": [
      "processor_arch"
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
      "legacyId": "q-c7abd17adc9749bd",
      "document": "原文/期中/2024期中-带答案.md",
      "lines": {
        "start": 225,
        "end": 243
      },
      "curated": "_curated/期中/2024期中-带答案/225.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "SEQ中mem_addr/mem_data的HCL补全"
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
11.在Y86-64的SEQ实现中，对`mem_addr`和`mem_data`的HCL补全正确的
是：
```
word mem_addr = [
icode in {IRMMOVQ, IPUSHQ, ICALL, IMRMOVQ} :    ①   ；
icode in {IPOPQ, IRET} :    ②   ；
];
word mem_data = [
icode in {IRMMOVQ, IPUSHQ} :    ③   ；
icode == ICALL :    ④   ；
];
```
%%% reference
答案：D。
%%% option: A
①valA    ②valE    ③valE    ④valC
%%% option: B
①valE    ②valA    ③valE    ④valC
%%% option: C
①valA    ②valE    ③valA    ④valP
%%% option: D
①valE    ②valA    ③valA    ④valP
