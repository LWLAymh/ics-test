+++json
{
  "schemaVersion": "5",
  "id": "q-808ef382fdee45fc",
  "revision": 3,
  "paperId": "p-12950876262955d9",
  "paperOrder": 14,
  "number": {
    "display": "第一题 14",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "14",
      "value": "14"
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
      "legacyId": "q-808ef382fdee45fc",
      "document": "原文/期中/2022期中-带答案.md",
      "lines": {
        "start": 220,
        "end": 229
      },
      "curated": "_curated/期中/2022期中-带答案/220.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "SEQ新增条件传送立即数指令（行218附图归属存疑）"
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
14.如果在SEQ中添加一条新的指令ircmovq，其作用是根据当前处理器的条件
码来判断是否需要将一个立即数传送到寄存器内。补充本题编码方案：为它分配独立的 `icode`，指令编码含1字节指令码、1字节寄存器字段和8字节立即数。则下列叙述错误的是：
%%% reference
答案：**C**。按本题已明确的“独立 `icode`”编码方案，A为真；编码长 `1+1+8=10` 字节，B为真；沿用立即数传送的数据通路可令 `valE = valC`，D也为真。不仅要设置执行阶段的数据通路，还要让取指逻辑识别新 `icode` 和指令长度、译码得到目的寄存器，并根据条件决定是否写回，所以C为假。

**共用 `irmovq` 的 `icode` 是另一种可行的设计。** 标准 `irmovq` 的 `icode=3`、`ifun=0`，后接 `F:rB` 和8字节立即数。可以保留 `ifun=0` 表示无条件传送，把未使用的 `ifun=1…6` 分配给6种条件传送。例如，使用 `0x31` 作为首字节表示条件“小于等于”，随后仍是寄存器字段和立即数，长度仍为10字节；用当前条件码决定 `dstE` 是 `rB` 还是 `RNONE`。这种设计不需要新 `icode`，但仍需扩展 `ifun` 识别和条件写回逻辑，不能仅改执行阶段。

因此，“新增指令一定要新增 `icode`”不是普遍结论；A只在当前题面指定的实现方案下成立。若去掉这一方案限定，采用上述共用编码时A也不成立，原卷将C作为唯一错误项便有歧义。原卷解析称“可以和 `rrmovq` 共用”，却未说明2字节寄存器传送与10字节立即数传送如何区分；上面的 `irmovq` 方案给出了完整的替代例子。本次保留当前题面和选项，只补充这一区别。
%%% option: A
需要增加一个新的icode标识符
%%% option: B
该指令的长度为10字节
%%% option: C
只需要修改SEQ处理器的执行阶段的硬件逻辑
%%% option: D
在执行阶段valE信号的值会被赋值为valC的值
