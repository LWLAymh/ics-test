+++json
{
  "schemaVersion": "5",
  "id": "q-bb3ab91f13deeb5d",
  "revision": 1,
  "paperId": "p-382bf3b10bc8d35a",
  "paperOrder": 15,
  "number": {
    "display": "第一题 15",
    "major": {
      "display": "第一题",
      "value": "1"
    },
    "minor": {
      "display": "15",
      "value": "15"
    },
    "parts": []
  },
  "classification": {
    "primaryModuleId": "ecf_and_system_io",
    "moduleIds": [
      "ecf_and_system_io"
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
      "legacyId": "q-bb3ab91f13deeb5d",
      "document": "原文/期末/2017期末-无答案.md",
      "lines": {
        "start": 169,
        "end": 189
      },
      "curated": "_curated/期末/2017期末-无答案/169.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "dup/dup2/O_APPEND 组合后的文件内容"
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
      "A"
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
15. 以下程序执行完成后，`ICS.txt`文件中的内容是：
```
int main(int argc, char** argv) {
    int fd1 = open("ICS.txt", O_CREAT | O_RDWR,
                   S_IRUSR | S_IWUSR);
    write(fd1, "ics ", 4);
    int fd2 = fd1;
    int fd3 = dup(fd2);
    int fd4 = open("ICS.txt", O_APPEND | O_RDWR);
    write(fd2, "segmentation fault ", 19);
    write(fd4, "tao", 3);
    int fd5 = fd4;
    dup2(fd3, fd5);
    write(fd4, "lab", 3);
    close(fd1);
    return 0;
}
```
%%% reference
答案：A
解析：`fd1` 写入 "ics " 后偏移为 4；`fd2=fd1`、`fd3=dup(fd2)` 共享同一打开文件表项，`fd4` 以 `O_APPEND` 打开（每次写前定位到文件末尾）。`fd2` 写 "segmentation fault " 追加到 4；`fd4` 写 "tao" 追加到末尾；`dup2(fd3, fd5)` 让 `fd4` 也指向 fd1/fd3 的打开文件表项，此后 `write(fd4,"lab")` 写在偏移 23 处，覆盖掉 "tao"，最终文件为 "ics segmentation fault lab"。

> ⚠️ 原卷及配套材料均无官方答案；本题由 AI 推导（deepseek v4.1 flash · 大肥鱼小姐），未与官方答案核对。
%%% option: A
ics segmentation fault tao
%%% option: B
ics segmentation fault lab
%%% option: C
ics taomentation fault lab
%%% option: D
tao segmentation fault lab
