+++json
{
  "schemaVersion": "5",
  "id": "q-bcf23ec71ae6c080",
  "revision": 5,
  "paperId": "p-ffd1f5f688babe1b",
  "paperOrder": 21,
  "number": {
    "display": "第四题",
    "major": {
      "display": "第四题",
      "value": "4"
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
      "legacyId": "q-b99c43e33a7b2e51",
      "document": "原文/期中/2021期中-带答案.md",
      "lines": {
        "start": 542,
        "end": 559
      },
      "curated": "_curated/期中/2021期中-带答案/542.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "间接跳转指令 jxx *rB 的 SEQ 阶段补全"
    },
    {
      "legacyId": "q-d5102c7a07230210",
      "document": "原文/期中/2021期中-带答案.md",
      "lines": {
        "start": 565,
        "end": 588
      },
      "curated": "_curated/期中/2021期中-带答案/565.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "PIPE 预测下一条 PC 的旁路与 HCL 修改"
    },
    {
      "legacyId": "q-a0690be315dc71d3",
      "document": "原文/期中/2021期中-带答案.md",
      "lines": {
        "start": 593,
        "end": 597
      },
      "curated": "_curated/期中/2021期中-带答案/593.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "预测错误触发条件与流水线控制逻辑"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-b99c43e33a7b2e51",
      "number": {
        "display": "第四题 1",
        "major": {
          "display": "第四题",
          "value": "4"
        },
        "minor": {
          "display": "1",
          "value": "1"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "processor_arch"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {"id":"q1-cond","marker":"{{blank:q1-cond}}","occurrence":0,"width":"long"},
          {
            "id": "q1-decode",
            "marker": "{{blank:q1-decode}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q1-execute",
            "marker": "{{blank:q1-execute}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q1-memory",
            "marker": "{{blank:q1-memory}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q1-writeback",
            "marker": "{{blank:q1-writeback}}",
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
            "blankId": "q1-decode",
            "method":"exact","acceptedAnswers":["R[rB]"],"normalize":{"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
          },
          {
            "blankId": "q1-execute",
            "method":"exact","acceptedAnswers":["valB+0","0+valB","valB"],"normalize":{"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
          },
          {
            "blankId": "q1-memory",
            "method":"exact","acceptedAnswers":["none","/","无"],"normalize":{"caseSensitive":false,"trimWhitespace":true}
          },
          {
            "blankId": "q1-writeback",
            "method":"exact","acceptedAnswers":["none","/","无"],"normalize":{"caseSensitive":false,"trimWhitespace":true}
          },
          {"blankId":"q1-cond","method":"exact","acceptedAnswers":["Cond(CC,ifun)"],"normalize":{"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}}
        ]
      },
      "sources": [
        {
          "legacyId": "q-b99c43e33a7b2e51",
          "document": "原文/期中/2021期中-带答案.md",
          "lines": {
            "start": 542,
            "end": 559
          },
          "curated": "_curated/期中/2021期中-带答案/542.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "间接跳转指令 jxx *rB 的 SEQ 阶段补全"
        }
      ],
      "issues": []
    },
    {
      "id": "q-d5102c7a07230210",
      "number": {
        "display": "第四题 2",
        "major": {
          "display": "第四题",
          "value": "4"
        },
        "minor": {
          "display": "2",
          "value": "2"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "processor_arch"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "q2-bubble",
            "marker": "{{blank:q2-bubble}}",
            "occurrence": 0,
            "width": "medium",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "yes",
                  "label": "需要"
                },
                {
                  "value": "no",
                  "label": "不需要"
                }
              ]
            }
          },
          {
            "id": "q2-hcl-condition",
            "marker": "{{blank:q2-hcl-condition}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q2-hcl-value",
            "marker": "{{blank:q2-hcl-value}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q2-hcl-position",
            "marker": "{{blank:q2-hcl-position}}",
            "occurrence": 0,
            "width": "medium",
            "input": {
              "kind": "select",
              "multiple": true,
              "options": [
                {
                  "value": "1",
                  "label": "①"
                },
                {
                  "value": "2",
                  "label": "②"
                },
                {
                  "value": "3",
                  "label": "③"
                },
                {
                  "value": "4",
                  "label": "④"
                }
              ]
            }
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
            "blankId": "q2-bubble",
            "method": "selection",
            "correctValues": [
              "no"
            ]
          },
          {
            "blankId": "q2-hcl-condition",
            "method":"exact","acceptedAnswers":["D_icode==IJREGXX"],"normalize":{"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
          },
          {
            "blankId": "q2-hcl-value",
            "method":"exact","acceptedAnswers":["d_valB"],"normalize":{"caseSensitive":true,"trimWhitespace":true}
          },
          {
            "blankId": "q2-hcl-position",
            "method": "selection",
            "correctValues": [
              "1",
              "2",
              "3"
            ]
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-d5102c7a07230210",
          "document": "原文/期中/2021期中-带答案.md",
          "lines": {
            "start": 565,
            "end": 588
          },
          "curated": "_curated/期中/2021期中-带答案/565.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "PIPE 预测下一条 PC 的旁路与 HCL 修改"
        }
      ],
      "issues": []
    },
    {
      "id": "q-a0690be315dc71d3",
      "number": {
        "display": "第四题 3",
        "major": {
          "display": "第四题",
          "value": "4"
        },
        "minor": {
          "display": "3",
          "value": "3"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "processor_arch"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "q3-condition-a",
            "marker": "{{blank:q3-condition-a}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-condition-b",
            "marker": "{{blank:q3-condition-b}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-f",
            "marker": "{{blank:q3-f}}",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "q3-d",
            "marker": "{{blank:q3-d}}",
            "occurrence": 0,
            "width": "medium",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "normal",
                  "label": "normal · 正常"
                },
                {
                  "value": "stall",
                  "label": "stall · 暂停"
                },
                {
                  "value": "bubble",
                  "label": "bubble · 气泡"
                }
              ]
            }
          },
          {
            "id": "q3-e",
            "marker": "{{blank:q3-e}}",
            "occurrence": 0,
            "width": "medium",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "normal",
                  "label": "normal · 正常"
                },
                {
                  "value": "stall",
                  "label": "stall · 暂停"
                },
                {
                  "value": "bubble",
                  "label": "bubble · 气泡"
                }
              ]
            }
          },
          {
            "id": "q3-m",
            "marker": "{{blank:q3-m}}",
            "occurrence": 0,
            "width": "medium",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "normal",
                  "label": "normal · 正常"
                },
                {
                  "value": "stall",
                  "label": "stall · 暂停"
                },
                {
                  "value": "bubble",
                  "label": "bubble · 气泡"
                }
              ]
            }
          },
          {
            "id": "q3-w",
            "marker": "{{blank:q3-w}}",
            "occurrence": 0,
            "width": "medium",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "normal",
                  "label": "normal · 正常"
                },
                {
                  "value": "stall",
                  "label": "stall · 暂停"
                },
                {
                  "value": "bubble",
                  "label": "bubble · 气泡"
                }
              ]
            }
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
            "blankId": "q3-condition-a",
            "method":"exact","acceptedAnswers":["E_icode"],"normalize":{"caseSensitive":true,"trimWhitespace":true}
          },
          {
            "blankId": "q3-condition-b",
            "method":"exact","acceptedAnswers":["!e_Cnd"],"normalize":{"caseSensitive":true,"trimWhitespace":true,"syntax":"c-tokens"}
          },
          {
            "blankId": "q3-f",
            "method":"exact","acceptedAnswers":["normal","stall","正常","暂停"],"normalize":{"caseSensitive":false,"trimWhitespace":true}
          },
          {
            "blankId": "q3-d",
            "method":"selection","correctValues":["bubble"]
          },
          {
            "blankId": "q3-e",
            "method":"selection","correctValues":["bubble"]
          },
          {
            "blankId": "q3-m",
            "method":"selection","correctValues":["normal"]
          },
          {
            "blankId": "q3-w",
            "method":"selection","correctValues":["normal"]
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-a0690be315dc71d3",
          "document": "原文/期中/2021期中-带答案.md",
          "lines": {
            "start": 593,
            "end": 597
          },
          "curated": "_curated/期中/2021期中-带答案/593.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "预测错误触发条件与流水线控制逻辑"
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
      "origin": "unknown",
      "crossChecked": null
    }
  }
}
+++
%%% stem
第四题（15分）

维护说明：原卷第4小问的示例程序只算出跳转表项的地址，没有读取表项中保存的跳转目标，直接跳入数据区，原周期键不能据此成立。本练习只保留第1—3问，第4问与原答案已完整存档，不纳入在线判分。

请分析Y86-64 ISA中加入的一族间接跳转指令：jxx *rB，其格式如下：
C  Fn  F  rB
该指令的功能是跳转到寄存器 `R[rB]` 所存放的地址。类似于直接跳转指令，间
接跳转指令也包括无条件跳转和条件跳转，通过不同的功能码Fn来指示。为了
和直接跳转区别，`icode`为IJREGXX。时钟周期适当进行延长，在不修改原有
的硬件线路和信号设置的前提下，只增加和新指令有关的逻辑，回答以下问题。
%%% reference

%%% part-stem: q-b99c43e33a7b2e51
1. 在教材中的SEQ处理器上实现该指令，请补全下表中每个阶段的操作。需要
说明的信号可能有：icode, ifun, rA, rB, valA, valB, valC, valE,
valP, Cnd, R[], M[], PC, CC

| 阶段 | `jxx *rB` 操作 |
| --- | --- |
| `Fetch` | `icode : ifun ← M1[PC]`；`rA : rB ← M1[PC+1]`；`valP ← PC+2` |
| `Decode` | `valB ←` {{blank:q1-decode}} |
| `Execute` | `valE ←` {{blank:q1-execute}}；`Cnd ←` {{blank:q1-cond}} |
| `Memory` | {{blank:q1-memory}} |
| Write Back | {{blank:q1-writeback}} |
| Update PC | `PC ← Cnd ? valE : valP` |
%%% part-reference: q-b99c43e33a7b2e51
答案：
1.
```
Stage  jxx *rB
Fetch  icode : ifun ← M1[PC]
rA : rB <- M1[PC+1]
valP <- PC+2
Decode  valB <- R[rB]
Execute  valE <- valB + 0
Cnd = Cond(CC, ifun)
Memory  /
Write Back  /
Update PC  PC <- Cnd ? valE: valP
```
%%% part-stem: q-d5102c7a07230210
2. 考虑在教材中的Pipeline处理器上实现该指令，采用总是选择分支（预测
下一条指令时使用跳转地址`R[rB]`）的预测策略。
由于`R[rB]`需要到译码阶段才能得到，需要增加一条从Fwd B输出信号`d_valB`
到Select PC的旁路通路，增加线路如图所示。增加旁路后，为了预测jxx
*rB的下一条PC，{{blank:q2-bubble}}（填“需要”或“不需要”）在该指令和下一条指令间插入气
泡。

![增加 d_valB 到 Select PC 旁路通路后的流水线结构](assets/期中/2021期中-带答案/p17-bypass-path.png)

Select PC 的 HCL 如下，注释①—④标出候选插入位置：

```hcl
word f_pc = [
    # ①
    (M_icode == IJXX || M_icode == IJREGXX) && !M_cnd : M_valA;
    # ②
    W_icode == IRET : W_valM;
    # ③
    1 : F_predPC;
    # ④
];
```
为了预测下一条PC，需在 Select PC 中增加下面一行：

```hcl
{{blank:q2-hcl-condition}} : {{blank:q2-hcl-value}};
```

增加的位置可以是 {{blank:q2-hcl-position}} （写出所有可能的位置，错填不得
分，漏填可得部分分）
%%% part-reference: q-d5102c7a07230210
答案：
2. 不需要。间接跳转在decode阶段时SelectPC正好利用最新转发的valB
的值作为预测地址访问指令内存。
1 2 3 处都可以插入。插入的内容见下。④是无效的插入位置。注意，原来的
M_XXX条件和W_XXX条件互斥，所以其顺序任意，但它们都不会和新加入的条
件冲突。例如mispredict发生时，Decode阶段的指令已经被清空，所以最终
不会导致多个条件成立。
```
word f_pc = [
// D_icode == IJREGXX: d_valB;
(M_icode == IJXX || M_icode == IJREGXX) && !M_cnd : M_valA;
// D_icode == IJREGXX: d_valB;
W_icode == IRET : W_valM;
D_icode == IJREGXX: d_valB;
1 : F_predPC;
④
]
```
%%% part-stem: q-a0690be315dc71d3
3. 在 E 阶段判断该指令是否预测错误，补全触发条件和控制逻辑。标识符区分大小写。
触发条件：
{{blank:q3-condition-a}} == IJREGXX && {{blank:q3-condition-b}}
控制逻辑：（如果有多种可能请任写一种）

| F | D | E | M | W |
| --- | --- | --- | --- | --- |
| {{blank:q3-f}} | {{blank:q3-d}} | {{blank:q3-e}} | {{blank:q3-m}} | {{blank:q3-w}} |
%%% part-reference: q-a0690be315dc71d3
答案：
3. `E_icode == IJREGXX && !e_Cnd`
```
F  D  E  M  W
normal/stall bubble  bubble  normal  normal
```
分析方法同IJXX。注意，触发条件是在E阶段，因为E阶段结束、M阶段开始
时就要控制流水线寄存器。
