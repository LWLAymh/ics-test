+++json
{
  "schemaVersion": "5",
  "id": "q-19c4d964d98fc677",
  "revision": 4,
  "paperId": "p-f99ca20e1a729e32",
  "paperOrder": 26,
  "number": {
    "display": "第二题",
    "major": {
      "display": "第二题",
      "value": "2"
    },
    "minor": null,
    "parts": []
  },
  "classification": {
    "primaryModuleId": "processor_arch",
    "moduleIds": [
      "processor_arch",
      "memory_hierarchy"
    ],
    "tags": []
  },
  "publication": {
    "state": "review",
    "basis": "legacy-migration",
    "reviewer": null,
    "reviewedAt": null,
    "issues": [
      "retired-invalid-question",
      "source-answer-disputed",
      "已核对原始 2020期末-无答案.pdf 第8页，原卷确实印作 xorq $8,%rcx，而参考按不改变 %rcx 的比较/测试计算8次循环。按异或写回语义，%rcx 前8轮为9、2、11、4、13、6、15、24，并未变为0，不能据此采用60/96周期及47/5命中的原答案。整题备份保留，待课程方确认指令语义或勘误后恢复发布。"
    ]
  },
  "sources": [
    {
      "legacyId": "q-83dd71fdca4ab2d3",
      "document": "原文/期末/2020期末-无答案.md",
      "lines": {
        "start": 267,
        "end": 273
      },
      "curated": "_curated/期末/2020期末-无答案/267.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "五级流水线时钟周期与寄存器开销"
    },
    {
      "legacyId": "q-216b79eb6ccbcf5b",
      "document": "原文/期末/2020期末-无答案.md",
      "lines": {
        "start": 274,
        "end": 284
      },
      "curated": "_curated/期末/2020期末-无答案/274.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "Y86-64 代码在前递与分支预测下的周期数"
    },
    {
      "legacyId": "q-6e8b718edb015123",
      "document": "原文/期末/2020期末-无答案.md",
      "lines": {
        "start": 285,
        "end": 294
      },
      "curated": "_curated/期末/2020期末-无答案/285.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "I-cache/D-cache 命中次数与总周期数"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-83dd71fdca4ab2d3",
      "number": {
        "display": "第二题 1)",
        "major": {
          "display": "第二题",
          "value": "2"
        },
        "minor": {
          "display": "1)",
          "value": null
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
            "id": "legacy-gap-0",
            "marker": "{{blank:legacy-gap-0}}",
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
            "acceptedAnswers": ["10"],
            "normalize": {"caseSensitive":false,"trimWhitespace":true}
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-83dd71fdca4ab2d3",
          "document": "原文/期末/2020期末-无答案.md",
          "lines": {
            "start": 267,
            "end": 273
          },
          "curated": "_curated/期末/2020期末-无答案/267.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "五级流水线时钟周期与寄存器开销"
        }
      ],
      "issues": []
    },
    {
      "id": "q-216b79eb6ccbcf5b",
      "number": {
        "display": "第二题 2)",
        "major": {
          "display": "第二题",
          "value": "2"
        },
        "minor": {
          "display": "2)",
          "value": null
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
            "id": "legacy-gap-0",
            "marker": "{{blank:legacy-gap-0}}",
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
            "acceptedAnswers": ["60"],
            "normalize": {"caseSensitive":false,"trimWhitespace":true}
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-216b79eb6ccbcf5b",
          "document": "原文/期末/2020期末-无答案.md",
          "lines": {
            "start": 274,
            "end": 284
          },
          "curated": "_curated/期末/2020期末-无答案/274.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "Y86-64 代码在前递与分支预测下的周期数"
        }
      ],
      "issues": []
    },
    {
      "id": "q-6e8b718edb015123",
      "number": {
        "display": "第二题 3)",
        "major": {
          "display": "第二题",
          "value": "2"
        },
        "minor": {
          "display": "3)",
          "value": null
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "memory_hierarchy"
      ],
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
          },
          {
            "id": "legacy-gap-2",
            "marker": "{{blank:legacy-gap-2}}",
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
            "acceptedAnswers": ["47"],
            "normalize": {"caseSensitive":false,"trimWhitespace":true}
          },
          {
            "blankId": "legacy-gap-1",
            "method": "exact",
            "acceptedAnswers": ["5"],
            "normalize": {"caseSensitive":false,"trimWhitespace":true}
          },
          {
            "blankId": "legacy-gap-2",
            "method": "exact",
            "acceptedAnswers": ["96"],
            "normalize": {"caseSensitive":false,"trimWhitespace":true}
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-6e8b718edb015123",
          "document": "原文/期末/2020期末-无答案.md",
          "lines": {
            "start": 285,
            "end": 294
          },
          "curated": "_curated/期末/2020期末-无答案/285.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "I-cache/D-cache 命中次数与总周期数"
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

共用五级标量流水线F/D/E/M/W；后两问执行下列教学扩展指令序列：

```asm
0x000  t:  mrmovq (%rdi), %rbx
0x002      addq   %rbx, %rax
0x004      addq   $8, %rdi
0x006      addq   $1, %rcx
0x008      xorq   $8, %rcx
0x00a      jne    t
```

| 寄存器 | 初值 |
| --- | --- |
| `%rdi` | `0x8008` |
| `%rax` | 0 |
| `%rbx` | 0 |
| `%rcx` | 0 |

> 原卷采用每条2字节、含立即数ALU操作的教学表示，并非标准Y86-64二进制编码。本题显式将其视为ISA扩展：每条占2字节，mrmovq读8字节，立即数ALU指令的阶段时序同addq/xorq。分支在E阶段确定，预测始终跳转，有教材前递与1周期load-use暂停。从第一条指令开始F到最后一次jne完成W计总周期，忽略循环后的程序。最后分支预测失败会清除其后的错路指令，但不会反过来延迟该jne本身的W阶段，不另外等待后继有效指令。

%%% reference

%%% part-stem: q-83dd71fdca4ab2d3
有一个五级流水线处理器，和课程中的 PIPE 处理器类似，包含取指（F）、译码（D）、执行（E）、访存（M）、写回（W）五级。

1）在理想设计情况下，流水线每一级的电路处理时间如下表所示，每两级流水线阶段之间插入的寄存器耗时为 1 ns。

| 阶段 | F | D | E | M | W |
| --- | --- | --- | --- | --- | --- |
| 处理时间（ns） | 8 | 5 | 9 | 8 | 4 |

请问流水线运行的时钟周期，最快为 {{blank:legacy-gap-0}} ns。
%%% part-reference: q-83dd71fdca4ab2d3
答案：10 ns（来源：2019、2020期末-答案解析）
解析：最慢的一级是 `E=9ns`，加上流水线寄存器 1ns，时钟周期为 10ns。
%%% part-stem: q-216b79eb6ccbcf5b
2）执行公共题面的教学扩展指令和初始寄存器值，暂不考虑缓存缺失。

流水线支持课上讲的数据前递（data forwarding），分支预测设计为“始终跳转”（predicted
as taken），请问执行上述代码，需要 {{blank:legacy-gap-0}} 个时钟周期？
%%% part-reference: q-216b79eb6ccbcf5b
答案仍为 **60** 周期。8轮共48条动态指令、8次load-use各暂停1周期，最后指令从F到W再需4周期：`48+8+4=60`。

末轮mrmovq在F50、D51、E52、M53、W54；addq因load-use延至D53、E54；末jne在F56、D57、E58、M59、W60。E58发现不跳转，清除后面的错路指令；这些气泡在jne身后，不延迟其自身W60。若要等循环后的某条指令完成，才需另外考虑恢复及该指令的周期。原参考数值保留，重写“分支惩罚包含在trailing”这种容易重复相加的解释。
%%% part-stem: q-6e8b718edb015123
3）现需要考虑实际执行时，存储层次对于流水线执行时间的影响：

- 该处理器包含一个 L1 指令缓存（I-cache）和一个 L1 数据缓存（D-cache）。
- I-cache 是一个直接映射（direct-mapped，`E=1`）缓存，总容量 32 KB，每个缓存块的大小是 32 Byte，代码执行前 I-cache 全部为空。
- D-cache 也是一个直接映射（direct-mapped，`E=1`）缓存，总容量 32 KB，每个缓存块的大小是 32 Byte，代码执行前 D-cache 全部为空。
- 取指（F）阶段，如果指令在 I-cache 中，则需要 1 个周期，否则需要 10 个周期。
- 访存（M）阶段，如果数据在 D-cache 中，则需要 1 个周期，否则需要 10 个周期。

明确缓存模型：阻塞式缓存，缺失相对命中多出的9周期冻结整条流水线，各次缺失代价不重叠；其余时序沿用公共约定。I-cache命中次数只统计最终完成的48条指令各自一次有效取指，不把暂停重复请求或错路指令计入；所有错路取指也位于已缓存的同一指令块，不产生新增缺失。D-cache统计8次有效加载。

请问执行上述代码 I-cache 缓存命中 {{blank:legacy-gap-0}} 次、D-cache 缓存命中 {{blank:legacy-gap-1}} 次？

在存储层次的影响下，执行完代码需要 {{blank:legacy-gap-2}} 个时钟周期？
%%% part-reference: q-6e8b718edb015123
答案：I-cache命中 **47** 次，D-cache命中 **5** 次，共 **96** 周期。

全部指令地址0x000至0x00b位于同一个32字节块，48次有效取指1次冷缺失、47次命中。8次加载地址为8008、8010、8018、8020、8028、8030、8038、8040（十六进制），各8字节不跨32字节块，覆盖8000/8020/8040三个数据块，3次缺失、5次命中。按明确的阻塞不重叠模型，4次冷缺失各额外9周期，`60+4*9=96`。末分支清除错路与其M/W排空重叠，不重复增加恢复气泡。原数值键全部保留，补齐计数边界与缓存模型。
