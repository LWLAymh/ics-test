+++json
{
  "schemaVersion": "5",
  "id": "q-ccb48327a3d8aa1c",
  "revision": 2,
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
        "method": "self"
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

    如果 CPU 执行取到一条虚拟地址为 `0x0395`，经地址翻译后，该虚拟地址对应的物理地址是{{blank:legacy-gap-0}}。
%%% reference
答案页给出的答案为 `0x5d5`。

原卷题面数据推导结果为 `0x295`：VPN=`0x03` 落在组 3，匹配的 TLB 项 `Valid=0`，故 TLB 未命中；查页表得 VPN `03` → PPN `02`，物理地址为 `0x02×2⁸+0x95=0x295`。答案页与题面数据矛盾，无法确定哪一处有误。
