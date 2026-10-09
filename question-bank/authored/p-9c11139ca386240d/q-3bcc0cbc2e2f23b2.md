+++json
{
  "schemaVersion": "5",
  "id": "q-3bcc0cbc2e2f23b2",
  "revision": 1,
  "paperId": "p-9c11139ca386240d",
  "paperOrder": 29,
  "number": {
    "display": "Lab 任务 29",
    "major": {
      "display": "Lab 任务",
      "value": null
    },
    "minor": {
      "display": "29",
      "value": "29"
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
      "legacyId": "q-3bcc0cbc2e2f23b2",
      "document": "原文/Lab测验/2025Lab测验-无答案.md",
      "lines": {
        "start": 659,
        "end": 664
      },
      "curated": "_curated/Lab测验/2025Lab测验-无答案/659.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "评分 c=cpe+2*ac 下代码与架构的优化权衡"
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
      "origin": "ai-derived",
      "crossChecked": false,
      "attribution": "deepseek v4.1 flash · 大肥鱼小姐",
      "note": "Explicitly registered in docs/AI_DERIVED_ANSWERS.md; not inferred from answer text."
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
29. （2分）在ArchLab Part C中，我们需要同时优化代码`ncopy.ys`和架构`ncopy.rs`，
评分标准基于`c=cpe+2*ac`。关于这一部分的优化策略，下列说法中正确的一项是？
%%% reference
答案：D

解析：评分 `c = cpe + 2*ac` 中 `ac` 的权重是 `cpe` 的两倍，而且 `cpe` 与架构设计直接相关（停顿、转发都由 HCL 决定），所以 A、B 都错；`cpe` 与 `ac` 也不互相独立——例如把流水线切得更细能缩短每级关键路径（降 `ac`），却会带来更多冒险与气泡（升 `cpe`），故 C 错、D 对。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
应该优先优化cpe，因为ac的权重不大，且cpe不依赖于架构的设计
%%% option: B
应该优先优化ac，因为这样可以提高时钟频率，降低执行与调试的时间
%%% option: C
cpe和ac相互独立，优化cpe不会影响ac，优化ac也不会影响cpe
%%% option: D
在`ncopy.rs`中添加更多的流水线阶段可以降低ac，但可能使cpe增加
