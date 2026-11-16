+++json
{
  "schemaVersion": "5",
  "id": "q-dfa03ba70b524f0c",
  "revision": 1,
  "paperId": "p-9c26b17e83af42d0",
  "paperOrder": 8,
  "number": {
    "display": "第10讲 10.4",
    "major": {
      "display": "第10讲",
      "value": "10"
    },
    "minor": {
      "display": "10.4",
      "value": "4"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "processor_arch",
    "moduleIds": [
      "processor_arch"
    ],
    "tags": [
      "seq",
      "iaddq",
      "control"
    ]
  },
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "part-dfa03ba70b524f0c-signals",
      "number": {
        "display": "（1）",
        "major": null,
        "minor": null,
        "parts": [
          "1"
        ]
      },
      "type": "fill",
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "a",
            "marker": "{{blank:a}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "valA",
                  "label": "valA"
                },
                {
                  "value": "valB",
                  "label": "valB"
                },
                {
                  "value": "valC",
                  "label": "valC"
                },
                {
                  "value": "0",
                  "label": "0"
                }
              ]
            }
          },
          {
            "id": "b",
            "marker": "{{blank:b}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "valA",
                  "label": "valA"
                },
                {
                  "value": "valB",
                  "label": "valB"
                },
                {
                  "value": "valC",
                  "label": "valC"
                },
                {
                  "value": "0",
                  "label": "0"
                }
              ]
            }
          },
          {
            "id": "dst",
            "marker": "{{blank:dst}}",
            "occurrence": 0,
            "width": "short",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "rA",
                  "label": "rA"
                },
                {
                  "value": "rB",
                  "label": "rB"
                },
                {
                  "value": "RRSP",
                  "label": "RRSP"
                },
                {
                  "value": "RNONE",
                  "label": "RNONE"
                }
              ]
            }
          }
        ]
      },
      "solution": {
        "state": "available",
        "grading": "blanks",
        "blankAnswers": [
          {
            "blankId": "a",
            "method": "selection",
            "correctValues": [
              "valC"
            ]
          },
          {
            "blankId": "b",
            "method": "selection",
            "correctValues": [
              "valB"
            ]
          },
          {
            "blankId": "dst",
            "method": "selection",
            "correctValues": [
              "rB"
            ]
          }
        ],
        "reference": {
          "format": "markdown"
        },
        "provenance": {
          "origin": "official",
          "crossChecked": null
        }
      },
      "moduleIds": [
        "processor_arch"
      ],
      "sources": [
        {
          "document": "原文/阶段测验/2026-stage2/exam.pdf",
          "provenance": "reflow",
          "editorNote": "第4–5页，10.4；跨页填空与多选保持一整题，控制图单独裁切。"
        },
        {
          "document": "原文/阶段测验/2026-stage2/answers.pdf",
          "provenance": "reflow",
          "editorNote": "第2页，10.4。"
        }
      ],
      "issues": []
    },
    {
      "id": "part-dfa03ba70b524f0c-control",
      "number": {
        "display": "（2）",
        "major": null,
        "minor": null,
        "parts": [
          "2"
        ]
      },
      "type": "multiple-choice",
      "stem": {
        "format": "markdown"
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
      ],
      "solution": {
        "state": "available",
        "grading": "choice",
        "correctOptionIds": [
          "A",
          "B",
          "D"
        ],
        "reference": {
          "format": "markdown"
        },
        "provenance": {
          "origin": "official",
          "crossChecked": null
        }
      },
      "moduleIds": [
        "processor_arch"
      ],
      "sources": [
        {
          "document": "原文/阶段测验/2026-stage2/exam.pdf",
          "provenance": "reflow",
          "editorNote": "第4–5页，10.4；跨页填空与多选保持一整题，控制图单独裁切。"
        },
        {
          "document": "原文/阶段测验/2026-stage2/answers.pdf",
          "provenance": "reflow",
          "editorNote": "第2页，10.4。"
        }
      ],
      "issues": []
    }
  ],
  "solution": {
    "state": "available",
    "grading": "parts",
    "reference": {
      "format": "markdown"
    },
    "provenance": {
      "origin": "official",
      "crossChecked": null
    }
  },
  "publication": {
    "state": "published",
    "basis": "source-import",
    "reviewer": null,
    "reviewedAt": null,
    "issues": []
  },
  "sources": [
    {
      "document": "原文/阶段测验/2026-stage2/exam.pdf",
      "provenance": "reflow",
      "editorNote": "第4–5页，10.4；跨页填空与多选保持一整题，控制图单独裁切。"
    },
    {
      "document": "原文/阶段测验/2026-stage2/answers.pdf",
      "provenance": "reflow",
      "editorNote": "第2页，10.4。"
    }
  ]
}
+++
%%% stem
### 10.4（6 分）

拟在课程中的原始 Y86-64 SEQ 处理器上增加指令 `iaddq V, rB`。

- 功能：把 64 位立即数 `V` 与寄存器 `rB` 中的值相加，将结果写回 `rB`，并按 `OPq` 的规则更新条件码。
- 编码为 `C0 | F:rB | 8 字节 V`，共 10 字节，控制常量记为 `IIADDQ`。

计划只扩展控制逻辑，不改动现有数据通路；固定采用 `valE = valB + valC`：立即数送 ALU 的 A 端，寄存器值经 B 读端口送 ALU 的 B 端，结果经 E 写端口写回。

附：控制逻辑的部分相关信息。

![SEQ 取指阶段的部分控制通路](assets/2026-stage2/seq-control.png)
%%% reference
本题两个小问共用上述指令定义；信号取值和控制项分别见小问解析。网站综合题按小问核对后归一化计分，不模拟纸卷多选少选的部分分。
%%% part-stem: part-dfa03ba70b524f0c-signals
从下拉候选项中填写该指令对应的信号值（每空 1 分，共 3 分）。`aluA`、`aluB` 的候选为 `valA`、`valB`、`valC`、`0`；`dstE` 的候选为 `rA`、`rB`、`RRSP`、`RNONE`。

| 信号 | 回答 |
| --- | --- |
| `aluA` | {{blank:a}} |
| `aluB` | {{blank:b}} |
| `dstE` | {{blank:dst}} |
%%% part-reference: part-dfa03ba70b524f0c-signals
依次为 `valC`、`valB`、`rB`。题面已固定 ALU 两端及寄存器端口的通路，不能交换 A、B 端信号。
%%% part-stem: part-dfa03ba70b524f0c-control
为了正确执行该指令，下列控制逻辑的修改哪些必需？（不定项选择，3 分）

原卷全对 3 分，少选且无错选 1 分，错选或不选 0 分；网站须集合完全一致才算本小问正确。
%%% part-option: part-dfa03ba70b524f0c-control A
`need_regids` 的成立条件中加入 `IIADDQ`。
%%% part-option: part-dfa03ba70b524f0c-control B
`need_valC` 的成立条件中加入 `IIADDQ`。
%%% part-option: part-dfa03ba70b524f0c-control C
执行 `IIADDQ` 时，使数据存储器（Data Memory）写使能信号为 `1`。
%%% part-option: part-dfa03ba70b524f0c-control D
设置条件码信号（`set_cc`）的成立条件中加入 `IIADDQ`。
%%% part-reference: part-dfa03ba70b524f0c-control
正确选项：A、B、D。指令需要寄存器字节和立即数字段，要更新寄存器和条件码，但不读写数据内存。
