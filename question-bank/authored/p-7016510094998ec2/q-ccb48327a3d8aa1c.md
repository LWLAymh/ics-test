+++json
{
  "schemaVersion": "5",
  "id": "q-ccb48327a3d8aa1c",
  "revision": 3,
  "paperId": "p-7016510094998ec2",
  "paperOrder": 10,
  "number": {
    "display": "第一题 10",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "10",
      "value": "10"
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
      "legacyId": "q-ccb48327a3d8aa1c",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 76,
        "end": 111
      },
      "curated": "_curated/期末/2022期末-无答案/76.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "组相联 TLB 与一级页表完成地址翻译（含两张表）"
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
        "method": "exact", "acceptedAnswers":["0x295","295"], "normalize":{"caseSensitive":false,"trimWhitespace":true}
      }
    ]
  }
}
+++
%%% stem
10. 假设一个小型系统：内存按字节寻址，内存访问按 1 个字节完成：虚拟地址空间为 2²⁴，物理内存空间为 2²²，页面大小为 2⁸。TLB 是 4 路组相联，有 16 个条目。页表是一级页表。

    TLB 内如下表所示：

    | Set | Tag | PPN | `Valid` | Tag | PPN | `Valid` | Tag | PPN | `Valid` | Tag | PPN | `Valid` |
    | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
    | 0 | 03 | — | 0 | 09 | 0D | 1 | 00 | — | 0 | 07 | 02 | 1 |
    | 1 | 03 | 2D | 1 | 02 | — | 0 | 04 | — | 0 | 0A | — | 0 |
    | 2 | 02 | — | 0 | 08 | — | 0 | 06 | — | 0 | 03 | — | 0 |
    | 3 | 07 | — | 0 | 03 | 0D | 0 | 0A | 34 | 1 | 02 | — | 0 |

    页表的前 16 项如下表所示：

    | VPN | PPN | `Valid` |
    | --- | --- | --- |
    | 00 | 28 | 1 |
    | 01 | — | 0 |
    | 02 | 33 | 1 |
    | 03 | 02 | 1 |
    | 04 | — | 0 |
    | 05 | 16 | 1 |
    | 06 | — | 0 |
    | 07 | — | 0 |

    | VPN | PPN | `Valid` |
    | --- | --- | --- |
    | 08 | 13 | 1 |
    | 09 | 17 | 1 |
    | 0A | 09 | 1 |
    | 0B | — | 0 |
    | 0C | — | 0 |
    | 0D | 2D | 1 |
    | 0E | 17 | 1 |
    | 0F | 0D | 1 |

    表中地址、Tag、VPN、PPN均以十六进制表示。若CPU访问虚拟地址 `0x0395`，按以上TLB与页表翻译后，物理地址是{{blank:legacy-gap-0}}（填十六进制）。

> 原卷勘误：本题按给出的表格数据判分，原答案页 `0x5d5` 与这些条件矛盾，不能据它反推另一个未给出的页表项。
%%% reference
答案：`0x295`，按当前明确的表格数据判分。

页面大小为256字节，故VPO占8位。`VA=0x0395` 拆为 `VPN=0x03`、`VPO=0x95`。TLB有16项、4路，因此4组、组索引2位；`VPN=0x03` 对应组3、Tag=`0x00`。组3没有有效的Tag=`00`项，因此TLB未命中（Tag=`03`的无效项也不能匹配这个VPN）。查页表VPN=`03`，有效位为1、PPN=`02`；拼接原偏移得 `PA=0x02 * 256 + 0x95 = 0x295`。

原答案页写为 `0x5d5`，其偏移 `0xd5` 甚至不等于本题的页内偏移 `0x95`，不可能来自这个VA的正常分页翻译。题面已说明保留表格并勘误答案，不虚构其他初值。
