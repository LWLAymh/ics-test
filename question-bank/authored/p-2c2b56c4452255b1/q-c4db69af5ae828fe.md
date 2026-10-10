+++json
{
  "schemaVersion": "5",
  "id": "q-c4db69af5ae828fe",
  "revision": 2,
  "paperId": "p-2c2b56c4452255b1",
  "paperOrder": 21,
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
    "primaryModuleId": "memory_hierarchy",
    "moduleIds": [
      "memory_hierarchy"
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
      "legacyId": "q-c4db69af5ae828fe",
      "document": "原文/期末/2021期末-无答案.md",
      "lines": {
        "start": 303,
        "end": 341
      },
      "curated": "_curated/期末/2021期末-无答案/303.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "FIFO 替换与用驱逐法测量 L1 d-cache 相联度"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "q2-fifo-misses",
        "marker": "{{blank:q2-fifo-misses}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "lt",
              "label": "<"
            },
            {
              "value": "eq",
              "label": "="
            },
            {
              "value": "gt",
              "label": ">"
            }
          ]
        }
      },
      {
        "id": "q2-cold-misses",
        "marker": "{{blank:q2-cold-misses}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "cold",
              "label": "冷／强制性"
            },
            {
              "value": "conflict",
              "label": "冲突"
            },
            {
              "value": "capacity",
              "label": "容量"
            }
          ]
        }
      },
      {
        "id": "q2-cache-level",
        "marker": "{{blank:q2-cache-level}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "L1",
              "label": "L1"
            },
            {
              "value": "L2",
              "label": "L2"
            },
            {
              "value": "L3",
              "label": "L3"
            }
          ]
        }
      },
      {
        "id": "q2-stride-order",
        "marker": "{{blank:q2-stride-order}}",
        "occurrence": 0,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "lt",
              "label": "<"
            },
            {
              "value": "eq",
              "label": "="
            },
            {
              "value": "gt",
              "label": ">"
            }
          ]
        }
      },
      {
        "id": "q2-capacity",
        "marker": "{{blank:q2-capacity}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "q2-associativity",
        "marker": "{{blank:q2-associativity}}",
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
        "blankId": "q2-fifo-misses",
        "method": "selection",
        "correctValues": [
          "lt"
        ]
      },
      {
        "blankId": "q2-cold-misses",
        "method": "selection",
        "correctValues": [
          "cold"
        ]
      },
      {
        "blankId": "q2-cache-level",
        "method": "selection",
        "correctValues": [
          "L3"
        ]
      },
      {
        "blankId": "q2-stride-order",
        "method": "selection",
        "correctValues": [
          "gt"
        ]
      },
      {
        "blankId": "q2-capacity",
        "method": "self"
      },
      {
        "blankId": "q2-associativity",
        "method": "self"
      }
    ]
  }
}
+++
%%% stem
第二题. 请结合教材第六章“存储器层次结构”的有关知识回答问题(10分)
1. (2 分)高速缓存(cache)的先进先出替换策略(FIFO)指的是在发生缓存不
命中时,最先进入高速缓存的行(cache line)将最先被替换出.考虑两种
遵循先进先出替换策略且块大小(block size)相同的全相联高速缓存 C1
和C2.其中C1是3路全相联的,C2是4路全相联的.假设初始情况下C1,C2
所有行的有效位都为0。让它们分别连续访问标记(tag)为0, 1, 2, 3, 0, 1, 4, 0, 1, 2, 3, 4 的行之后，C1 发生的缓存不命中次数 {{blank:q2-fifo-misses}} C2 发生的缓存不命中次数（填“>”“=”或“<”）。
2. 已知某单核处理器有 L1,L2,L3 三级高速缓存且遵循先进先出替换策略,你
希望通过触发行驱逐(cache line eviction)的方法测量该处理器的L1
数据缓存(L1 d-cache)的相联度,实验前已知 L1 d-cache 的容量在
16KiB到64KiB之间(含16KiB和64KiB)且字节数为2的幂,且已知高速
缓存块的字节数小于1KiB.你的实验步骤如下：
Step #1: 开辟一块足够大(如8MiB)的内存空间.
Step #2: 逐步调整访问的步长S(S依次取1KiB, 2KiB, 4KiB, …,
32KiB,64KiB)和访问的元素数量N(N依次取1, 2, 3, …, 127, 128).
对于给定的S和N,连续两次从所开辟内存的起始位置开始,以S为步长顺序
访问N个内存地址.记录第二次访问时平均一个内存地址的访问时间T.
Step #3: 多次实验取平均值以减小误差.作图并分析实验结果.
这里是给定S和N后访问内存的一个例子：当`S=64KiB,N=6`时,先按顺序
访问一遍所开辟内存空间的第0B, 64KiB, 128KiB, 192KiB, 256KiB,
320KiB 处的一个字节的值.清空寄存器,接着计时并第二遍按顺序访问所
开辟内存空间的第0B, 64KiB, 128KiB, 192KiB, 256KiB, 320KiB
处的一个字节的值.访问完成后立即停止计时,并记录`T = (`结束计时的时
刻 - 开始计时的时刻) ÷ 6.0.
(a)  (2分)Step #2中,给定S和N后第一遍访问N个内存地址的过程
被称为暖身(warm up),这是为了避免 {{blank:q2-cold-misses}} 不命中带来的影响
(填“冷/强制性”“冲突”或“容量”).
(b)  (4 分)假设访问内存的过程都在高速缓
存中顺次进行,且不考虑预取(prefetch)机制
的影响.你选取了步长为S1, S2时的部分实验结
果如图所示(此图为示意图).你注意到访存速度
越快,则访问单个元素的时间越短.因此从图中
可以看出 T3 最接近 {{blank:q2-cache-level}}（填“L1”“L2”或“L3”）级缓存的访存时间，S1 {{blank:q2-stride-order}} S2（填“>”“=”或“<”）。
![步长为 S1、S2 时的平均访问时间示意曲线](assets/期末/2021期末-无答案/p9-cache-latency.png)

(c) (2分)在(b)的条件下, 进一步推理可知该处理器的L1 d-cache的
容量(capacity)为 {{blank:q2-capacity}}（用代数式表示，S1、S2、N0为已知量，下同。注意计算容量时不考虑有效位和标记位），相联度为 {{blank:q2-associativity}}。
%%% reference
答案：
(1) ＜
(2) 冷/强制性
(3) L3
(4) ＞
(5) 2·N0·S2
(6) N0
