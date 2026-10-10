+++json
{
  "schemaVersion": "5",
  "id": "q-c686bf5ca67f4ed8",
  "revision": 3,
  "paperId": "p-ae9ab20d09974cf3",
  "paperOrder": 23,
  "number": {
    "display": "第五题 Part B",
    "major": {
      "display": "第五题",
      "value": "5"
    },
    "minor": {
      "display": "Part",
      "value": null
    },
    "parts": [
      "B"
    ]
  },
  "classification": {
    "primaryModuleId": "concurrent_programming",
    "moduleIds": [
      "concurrent_programming"
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
      "legacyId": "q-c686bf5ca67f4ed8",
      "document": "原文/期末/2024期末-带答案.md",
      "lines": {
        "start": 1040,
        "end": 1198
      },
      "curated": "_curated/期末/2024期末-带答案/1040.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "线程/信号共享变量、竞态与信号安全"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "legacy-gap-0",
        "marker": "_______",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "legacy-gap-1",
        "marker": "_______",
        "occurrence": 1,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "yes",
              "label": "会"
            },
            {
              "value": "no",
              "label": "不会"
            }
          ]
        }
      },
      {
        "id": "legacy-gap-2",
        "marker": "_______",
        "occurrence": 2,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "yes",
              "label": "是"
            },
            {
              "value": "no",
              "label": "不是"
            }
          ]
        }
      },
      {
        "id": "legacy-gap-3",
        "marker": "_______",
        "occurrence": 3,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "yes",
              "label": "是"
            },
            {
              "value": "no",
              "label": "不是"
            }
          ]
        }
      },
      {
        "id": "legacy-gap-4",
        "marker": "_______",
        "occurrence": 4,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "yes",
              "label": "可能"
            },
            {
              "value": "no",
              "label": "不会"
            }
          ]
        }
      },
      {
        "id": "legacy-gap-5",
        "marker": "_______",
        "occurrence": 5,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "A",
              "label": "A · 进程调度"
            },
            {
              "value": "B",
              "label": "B · 线程调度"
            },
            {
              "value": "C",
              "label": "C · 下发信号"
            },
            {
              "value": "D",
              "label": "D · 处理系统调用"
            }
          ]
        }
      },
      {
        "id": "legacy-gap-6",
        "marker": "_______",
        "occurrence": 6,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "A",
              "label": "A · 进程调度"
            },
            {
              "value": "B",
              "label": "B · 线程调度"
            },
            {
              "value": "C",
              "label": "C · 下发信号"
            },
            {
              "value": "D",
              "label": "D · 处理系统调用"
            }
          ]
        }
      },
      {
        "id": "legacy-gap-7",
        "marker": "_______",
        "occurrence": 7,
        "width": "medium",
        "input": {
          "kind": "select",
          "multiple": false,
          "options": [
            {
              "value": "A",
              "label": "A · 进程调度"
            },
            {
              "value": "B",
              "label": "B · 线程调度"
            },
            {
              "value": "C",
              "label": "C · 下发信号"
            },
            {
              "value": "D",
              "label": "D · 处理系统调用"
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
        "blankId": "legacy-gap-0",
        "method": "exact",
        "acceptedAnswers": ["2"],
        "normalize": {"trimWhitespace": true, "caseSensitive": true}
      },
      {
        "blankId": "legacy-gap-1",
        "method": "selection",
        "correctValues": [
          "no"
        ]
      },
      {
        "blankId": "legacy-gap-2",
        "method": "selection",
        "correctValues": [
          "no"
        ]
      },
      {
        "blankId": "legacy-gap-3",
        "method": "selection",
        "correctValues": [
          "yes"
        ]
      },
      {
        "blankId": "legacy-gap-4",
        "method": "selection",
        "correctValues": [
          "no"
        ]
      },
      {
        "blankId": "legacy-gap-5",
        "method": "selection",
        "correctValues": [
          "D"
        ]
      },
      {
        "blankId": "legacy-gap-6",
        "method": "selection",
        "correctValues": [
          "A"
        ]
      },
      {
        "blankId": "legacy-gap-7",
        "method": "selection",
        "correctValues": [
          "C"
        ]
      }
    ]
  }
}
+++
%%% stem
### Part B（8分）

完全人格，首在体育。小北同学近日遇到了考入某体育强校的李华同学，但二者就谁是体育世一大产生了争执，因此决定通过拔河比赛一决胜负。为了确保公平性，小北和李华各自找来了自己的学长作为裁判进行比赛计分。作为计算机专业的同学，你希望编写一个运行在 Linux 内核上的 C 程序模拟这个场景，以分析小北是否遥遥领先。

为了模拟上述场景，我们用进程表示选手团和裁判团，每个进程中又用两个线程去模拟两位选手和两位裁判。每个“选手”线程通过信号将自己视角下的比赛情况发给对应的“裁判”线程，“裁判”线程将比赛结果记录在文件里以便最后登记分数。
补充说明：

- 在 POSIX 语义下，多线程进程接收信号时会随机指定一个线程接收。
  - 但在 Linux 系统下，通过在主线程中 BLOCK 某信号、在对等线程中 UNBLOCK 该信号，可以强制指定该对等线程接收该信号。
  - 本题利用这种方法，使线程 `judger1` 和 `judger2` 分别处理进程收到的 `SIGUSR1` 和 `SIGUSR2` 信号。
- `volatile` 修饰关键词要求编译器对指定变量的每次读写都必须使用内存中的值。
- `register` 修饰关键词要求编译器必须将指定变量分配在寄存器上。
- 题目在 Ubuntu 24.04.1 上使用 gcc 13.3.0（Ubuntu 13.3.0-6ubuntu2~24.04）编译，命令为 `gcc input.c csapp.c -o input`。题目环境的内核版本为 5.15.167.4。解决本题无需课程内容以外的知识；提供这些信息仅为避免臆想不必要的情况。


```c
// input.c
#include "csapp.h"
void signal_handler(int signo) {
    if (signo == SIGUSR1) printf("A\n");
    if (signo == SIGUSR2) printf("B\r");
}
void *judger(void *num) {
    ...
    //在省略的代码中使用pthread_sigmask分别取消对SIGUSR1和SIGUSR2信号的阻塞
    //(int)num为1则取消 SIGUSR1的阻塞，(int)num为2则取消SIGUSR2的阻塞
    for (;;);
}
int judger_pid = 0;
void *player(void *arg) {
    int num = (int)(uint64_t)arg;
    volatile static int flag = 0;
    register int val = 0;
    for (int i = 1; i <= 10; i++) {
        val = flag; // *2
        if (num == 1) {
            if (val <= 0) ++val;
            flag = val;
            printf("Player %d: %d %c\n", num, val, "_A"[val > 0]);
            if (val > 0) kill(judger_pid, SIGUSR1);
        } else {
            if (val >= 0) --val;
            flag = val;
            printf("Player %d: %d %c\n", num, val, "_B"[val < 0]);
            if (val < 0) kill(judger_pid, SIGUSR2);
        }
    }
}
int main() {
    ...
    // 在省略的代码中使用pthread_sigmask阻塞SIGUSR1和SIGUSR2信号
    // 并设置SIGUSR1和SIGUSR2的信号处理函数为signal_handler
    pid_t player_pid;
    if (player_pid = fork()) { // *1
        freopen("game.out", "wb", stdout); //题目保证硬盘空间足够
        setvbuf(stdout, NULL, _IOLBF, 1024);
        // 裁判团
        pthread_t judger1, judger2;
        pthread_create(&judger1, NULL, judger, (void *)1);
        pthread_create(&judger2, NULL, judger, (void *)2);
        waitpid(player_pid, NULL, 0);
        sleep(1); // 题目保证此时所有pending信号均处理完成
        _exit(0);
    } else {
        sleep(1); // 题目保证此时信号处理程序已按要求生效
        // 玩家团
        judger_pid = getppid();
        pthread_t player1, player2;
        pthread_create(&player1, NULL, player, (void *)1);
        pthread_create(&player2, NULL, player, (void *)2);
        pthread_join(player1, NULL);
        pthread_join(player2, NULL);
        return 0;
    }
}
```
#### 1）

在 `player` 函数中，使用了_______个共享变量？（同一个变量多次出现算 1 个）（1分）

#### 2）

信号处理程序里使用了不安全的 `printf` 函数。老师在课堂上讲过著名的“灵魂出窍”死锁案例，而题目的程序同时在 `main` 函数和信号处理程序中使用 `printf`。

题目中的程序_______（会/不会）出现死锁？原因包括：

- `printf` _______（是/不是）异步信号安全的；
- `printf` _______（是/不是）线程安全的；
- 在题目的程序中，`signal_handler` 中的 `printf` _______（可能/不会）被打断。

（本小问共 4 分）

#### 3）

下面是上面代码某次运行时的输出结果。

`stdout`：

```text
Player 1: 1 A
Player 1: 1 A
Player 1: 1 A
Player 1: 1 A
Player 1: 1 A
Player 1: 1 A
Player 1: 1 A
Player 1: 1 A
Player 2: 0 _
Player 2: 0 _
Player 2: -1 B
Player 1: 1 A
Player 1: 0 _
Player 2: -1 B
Player 2: -1 B
Player 2: -1 B
Player 2: -1 B
Player 2: -1 B
Player 2: -1 B
```

`game.out`：

```text
A
A
A
A
B
A
```

① 下列哪一项不是导致本题程序多次运行结果不同的原因？_______（1分）

| 选项 | 描述 |
| --- | --- |
| A | 操作系统调度进程具有不确定性 |
| B | 操作系统调度线程具有不确定性 |
| C | 操作系统下发信号的时机具有不确定性 |
| D | 操作系统处理系统调用具有不确定性 |

② 下列哪一选项会导致上面的运行结果中，`game.out` 的 A 比 `stdout` 的少？_______（1分）

除此之外，还有哪一选项会导致上面的运行结果中，`game.out` 的 B 比 `stdout` 的少？_______（1分）

| 选项 | 描述 |
| --- | --- |
| A | 多个到达的信号可能只被处理一次 |
| B | 后面的字符可能在缓冲区内覆盖前面的字符 |
| C | 缓冲区内的字符没有刷新到文件，程序就退出了 |
| D | 多次相同的 `kill` 可能只有一次进入内核 |
| E | 父进程中的两个线程产生 race condition |
| F | 子进程中的两个线程产生 race condition |
| G | 由于磁盘太慢等原因，产生写不足 |
%%% reference
1）2 个：`flag`、`judger_pid`。
2）不会；不是（异步信号安全）；是（线程安全）；不会（在该程序中，信号处理函数里的 `printf` 不会被打断）。
3）① D；② A；③ C。
