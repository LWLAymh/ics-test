+++json
{
  "schemaVersion": "5",
  "id": "q-ff95e8e3bfa043a2",
  "revision": 1,
  "paperId": "p-bc69f9ea3beff7ee",
  "paperOrder": 22,
  "number": {
    "display": "第三题",
    "major": {
      "display": "第三题",
      "value": "3"
    },
    "minor": null,
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
      "legacyId": "q-ff95e8e3bfa043a2",
      "document": "原文/期末/2016期末-带答案.md",
      "lines": {
        "start": 415,
        "end": 437
      },
      "curated": "_curated/期末/2016期末-带答案/415.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "组合逻辑单元插入寄存器与吞吐率"
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
第三题（12分）
如图所示，每个模块表示一个单独的组合逻辑单元，每个单元的延迟以及数据依赖
关系已在图中标出。通过在两个单元间添加寄存器的方式，可以对该数据通路进行
流水化改造。假设每个寄存器的延迟为10ps。

![图](assets/期末/2016期末-带答案/p11-block-diagram.png)

1）如果改造为一个二级流水线，为获得最大的吞吐率，该寄存器应在哪里插入？
请计算该流水线的吞吐率，并说明计算过程。结果可以是分数形式也可以是小数形
式。

2）如果改造为一个三级流水线，为获得最大的吞吐率，寄存器应在哪里插入？请
计算该流水线的吞吐率，并说明计算过程。结果可以是分数形式也可以是小数形式。
%%% reference
1）插入在BC间以及EF（4分，不完整酌情扣1~2分）
`1000/(80+20+10) = 1000/110= 9.09 GIPS`（正确结果1分，单位1分）。
2）插入在AE、FD、BC、CD、DE和FG间（4分，不完整酌情扣1~2分）
`1000/(80+10) = 1000/90 = 11.11 GIPS`（正确结果1分，单位1分）。
