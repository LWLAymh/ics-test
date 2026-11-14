+++json
{
  "schemaVersion": "5",
  "id": "q-4abbafc77a0cfbf6",
  "revision": 2,
  "paperId": "p-ae9ab20d09974cf3",
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
      "legacyId": "q-4abbafc77a0cfbf6",
      "document": "原文/期末/2024期末-带答案.md",
      "lines": {
        "start": 299,
        "end": 323
      },
      "curated": "_curated/期末/2024期末-带答案/299.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "COW、mmap/munmap 与交换空间"
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
10. 按教材的内存管理模型讨论：匿名页的承诺存储由物理内存和交换区支持；`fork` 所述页面限于可写私有映射；`execve` 指成功调用；`munmap` 后该地址未被重新映射。下列说法错误的是：
%%% reference
答案： D
A. 在 Linux 中，`fork()`系统调用会创建一个子进程。为了实现高效的进程复
制，内核使用写时复制（COW）技术，在`fork()`后，父进程和子进程共享相同的
物理页面，直到其中一个进程尝试写入这些页面时，才会为该进程分配独立的物理
页面。为了确保写时复制机制的正确性，这些页面会被标记为只读，只有在写操作
发生时才会进行复制。
`B.execve()`函数加载一个新的程序并替换当前进程的映像，包括程序计数器（PC）
和其他执行上下文。程序计数器会被设置为新程序的起始地址。
`C. munmap()`函数用于解除内存映射区域的映射，删除该区域后，再尝试访问该
内存区域会导致访问非法内存，从而引发段错误（Segmentation Fault）。
D. 在题面限定的承诺存储模型中，交换空间影响能够承诺的匿名页面总量，因此“无关”错误。实际 Linux 还受 overcommit 策略、资源限制与映射类型影响；不能把所有虚拟地址映射的总大小机械等同于物理内存加 swap。
%%% option: A
fork函数被当前进程调用后，内核将父子进程的页面标记为只读，以支持写
时复制（COW）机制。
%%% option: B
execve函数被调用后，程序计数器会被重新设置。
%%% option: C
对munmap函数删除的区域再引用会导致段错误。
%%% option: D
交换空间的大小与当前运行的进程能够分配的虚拟页面总数无关。
