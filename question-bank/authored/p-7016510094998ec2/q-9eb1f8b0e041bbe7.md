+++json
{
  "schemaVersion": "5",
  "id": "q-9eb1f8b0e041bbe7",
  "revision": 2,
  "paperId": "p-7016510094998ec2",
  "paperOrder": 20,
  "number": {
    "display": "第六题",
    "major": {
      "display": "第六题",
      "value": "6"
    },
    "minor": null,
    "parts": []
  },
  "classification": {
    "primaryModuleId": "network",
    "moduleIds": [
      "network"
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
      "legacyId": "q-35b31dd6c25ebe73",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 516,
        "end": 567
      },
      "curated": "_curated/期末/2022期末-无答案/516.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "Open_listenfd 中 hints.ai_socktype 取值（含服务器代码）"
    },
    {
      "legacyId": "q-9839dd0d198535d7",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 569,
        "end": 569
      },
      "curated": "_curated/期末/2022期末-无答案/569.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "Getnameinfo 用途：由 IP 地址查主机名"
    },
    {
      "legacyId": "q-8ef75472241f3c98",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 571,
        "end": 609
      },
      "curated": "_curated/期末/2022期末-无答案/571.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "由 log.out 客户端端口推断命令行缺失参数（含客户端代码）"
    },
    {
      "legacyId": "q-d1c53aa2285305a2",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 611,
        "end": 611
      },
      "curated": "_curated/期末/2022期末-无答案/611.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "GOAL 增大后客户端报错的原因"
    },
    {
      "legacyId": "q-9173da3272ca94be",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 615,
        "end": 615
      },
      "curated": "_curated/期末/2022期末-无答案/615.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "在客户端补一行代码以支持更大的 GOAL"
    },
    {
      "legacyId": "q-2caa71db00b101fa",
      "document": "原文/期末/2022期末-无答案.md",
      "lines": {
        "start": 617,
        "end": 621
      },
      "curated": "_curated/期末/2022期末-无答案/617.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "两客户端并发连服务器时结果分析"
    }
  ],
  "type": "composite",
  "stem": {
    "format": "markdown"
  },
  "parts": [
    {
      "id": "q-35b31dd6c25ebe73",
      "number": {
        "display": "第六题 1",
        "major": {
          "display": "第六题",
          "value": "6"
        },
        "minor": {
          "display": "1",
          "value": "1"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "network"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "legacy-gap-0",
            "marker": "______",
            "occurrence": 0,
            "width": "medium",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "SOCK_STREAM",
                  "label": "SOCK_STREAM"
                },
                {
                  "value": "SOCK_DGRAM",
                  "label": "SOCK_DGRAM"
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
            "method": "selection",
            "correctValues": [
              "SOCK_STREAM"
            ]
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-35b31dd6c25ebe73",
          "document": "原文/期末/2022期末-无答案.md",
          "lines": {
            "start": 516,
            "end": 567
          },
          "curated": "_curated/期末/2022期末-无答案/516.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "Open_listenfd 中 hints.ai_socktype 取值（含服务器代码）"
        }
      ],
      "issues": []
    },
    {
      "id": "q-9839dd0d198535d7",
      "number": {
        "display": "第六题 2",
        "major": {
          "display": "第六题",
          "value": "6"
        },
        "minor": {
          "display": "2",
          "value": "2"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "network"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "legacy-gap-0",
            "marker": "______",
            "occurrence": 0,
            "width": "medium",
            "input": {
              "kind": "select",
              "multiple": false,
              "options": [
                {
                  "value": "name-to-ip",
                  "label": "主机名对应的 IP 地址"
                },
                {
                  "value": "ip-to-name",
                  "label": "IP 地址对应的主机名"
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
            "method": "selection",
            "correctValues": [
              "ip-to-name"
            ]
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-9839dd0d198535d7",
          "document": "原文/期末/2022期末-无答案.md",
          "lines": {
            "start": 569,
            "end": 569
          },
          "curated": "_curated/期末/2022期末-无答案/569.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "Getnameinfo 用途：由 IP 地址查主机名"
        }
      ],
      "issues": []
    },
    {
      "id": "q-8ef75472241f3c98",
      "number": {
        "display": "第六题 3",
        "major": {
          "display": "第六题",
          "value": "6"
        },
        "minor": {
          "display": "3",
          "value": "3"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "network"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "legacy-gap-0",
            "marker": "______",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "legacy-gap-1",
            "marker": "______",
            "occurrence": 1,
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
          },
          {
            "blankId": "legacy-gap-1",
            "method": "self"
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-8ef75472241f3c98",
          "document": "原文/期末/2022期末-无答案.md",
          "lines": {
            "start": 571,
            "end": 609
          },
          "curated": "_curated/期末/2022期末-无答案/571.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "由 log.out 客户端端口推断命令行缺失参数（含客户端代码）"
        }
      ],
      "issues": []
    },
    {
      "id": "q-d1c53aa2285305a2",
      "number": {
        "display": "第六题 4",
        "major": {
          "display": "第六题",
          "value": "6"
        },
        "minor": {
          "display": "4",
          "value": "4"
        },
        "parts": []
      },
      "type": "short-answer",
      "moduleIds": [
        "network"
      ],
      "stem": {
        "format": "markdown"
      },
      "solution": {
        "state": "available",
        "grading": "self",
        "reference": {
          "format": "markdown"
        },
        "provenance": {
          "origin": "unknown",
          "crossChecked": null,
          "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."
        }
      },
      "sources": [
        {
          "legacyId": "q-d1c53aa2285305a2",
          "document": "原文/期末/2022期末-无答案.md",
          "lines": {
            "start": 611,
            "end": 611
          },
          "curated": "_curated/期末/2022期末-无答案/611.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "GOAL 增大后客户端报错的原因"
        }
      ],
      "issues": []
    },
    {
      "id": "q-9173da3272ca94be",
      "number": {
        "display": "第六题 5",
        "major": {
          "display": "第六题",
          "value": "6"
        },
        "minor": {
          "display": "5",
          "value": "5"
        },
        "parts": []
      },
      "type": "fill",
      "moduleIds": [
        "network"
      ],
      "stem": {
        "format": "markdown",
        "blanks": [
          {
            "id": "legacy-gap-0",
            "marker": "______",
            "occurrence": 0,
            "width": "medium"
          },
          {
            "id": "legacy-gap-1",
            "marker": "______",
            "occurrence": 1,
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
          },
          {
            "blankId": "legacy-gap-1",
            "method": "self"
          }
        ]
      },
      "sources": [
        {
          "legacyId": "q-9173da3272ca94be",
          "document": "原文/期末/2022期末-无答案.md",
          "lines": {
            "start": 615,
            "end": 615
          },
          "curated": "_curated/期末/2022期末-无答案/615.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "在客户端补一行代码以支持更大的 GOAL"
        }
      ],
      "issues": []
    },
    {
      "id": "q-2caa71db00b101fa",
      "number": {
        "display": "第六题 6",
        "major": {
          "display": "第六题",
          "value": "6"
        },
        "minor": {
          "display": "6",
          "value": "6"
        },
        "parts": []
      },
      "type": "single-choice",
      "moduleIds": [
        "network"
      ],
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
          "A"
        ]
      },
      "sources": [
        {
          "legacyId": "q-2caa71db00b101fa",
          "document": "原文/期末/2022期末-无答案.md",
          "lines": {
            "start": 617,
            "end": 621
          },
          "curated": "_curated/期末/2022期末-无答案/617.md",
          "aliases": [],
          "provenance": "rewritten",
          "editorNote": "两客户端并发连服务器时结果分析"
        }
      ],
      "issues": [],
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
        }
      ]
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

%%% reference

%%% part-stem: q-35b31dd6c25ebe73
学完《网络编程》一章，小明迫不及待地想搭建自己的游戏服务器。他根据课本上代码写出的《网络乒乓》服务器代码如下。他在 Class Machine 上运行代码，TCP 等协议都采用默认设置。请你根据代码回答问题。

```c
 1  #include "csapp.h"
 2  #include "stdlib.h"
 3  #include "stdio.h"
 4  #define GOAL 100
 5
 6  int main(int argc, char **argv)
 7  {
 8      int listenfd, connfd;
 9      socklen_t clientlen;
10      struct sockaddr_storage clientaddr;
11      char client_hostname[MAXLINE], client_port[MAXLINE], buf[MAXLINE];
12      if (argc != 2) {
13          fprintf(stderr, "usage: %s <port>\n", argv[0]);
14          exit(0);
15      }
16      listenfd = Open_listenfd(argv[1]); // Open listen socket
17      int ball_cnt = 0;
18      while (1){
19          clientlen = sizeof(struct sockaddr_storage);
20          connfd = Accept(listenfd, (SA *)&clientaddr, &clientlen); // Accept connection
21          Getnameinfo((SA *)&clientaddr, clientlen, client_hostname, MAXLINE,
22                      client_port, MAXLINE, 0);
23          printf("Connected to (%s, %s)\n", client_hostname, client_port);
24
25          rio_t rio;
26          Rio_readinitb(&rio, connfd);
27          Rio_readlineb(&rio, buf, MAXLINE);
28          int recv_num = atoi(buf);
29          if (recv_num == ball_cnt){
30              if (ball_cnt == GOAL){
31                  sprintf(buf, "You win!\n");
32                  Rio_writen(connfd, buf, strlen(buf));
33                  ball_cnt = 0;
34              }
35              else {
36                  sprintf(buf, "%d\n", ball_cnt+1);
37                  Rio_writen(connfd, buf, strlen(buf));
38                  ball_cnt += 2;
39              }
40          }
41          Close(connfd); // Close the connection
42      }
43      exit(0);
44  }
```


1. 函数 `Open_listenfd` 要建立的是可靠的TCP连接。因此，里面有一行代码设置了 hints.ai_socktype = ______；（SOCK_STREAM / SOCK_DGRAM）。（1分）
%%% part-reference: q-35b31dd6c25ebe73
答案：SOCK_STREAM
%%% part-stem: q-9839dd0d198535d7
2. 函数 Getnameinfo 的用途是查询输入的______（主机名对应的IP地址 / IP地址对应的主机名）。（1分）
%%% part-reference: q-9839dd0d198535d7
答案：IP地址对应的主机名
%%% part-stem: q-8ef75472241f3c98
3. 小明的朋友们对他的游戏都不感兴趣，小明只好自己写了一个客户端来玩自己的游戏。他的客户端代码如下：

```c
 1  #include "csapp.h"
 2  #define GOAL 100
 3
 4  int main(int argc, char **argv){
 5      int clientfd;
 6      char *host, *port, buf[MAXLINE];
 7      rio_t rio;
 8
 9      if (argc != 3){
10          fprintf(stderr, "usage: %s <host> <port>\n", argv[0]);
11          exit(0);
12      }
13      host = argv[1];
14      port = argv[2];
15
16      for (int ball_cnt=0; ball_cnt<=GOAL; ball_cnt+=2){
17          clientfd = Open_clientfd(host, port);
18          Rio_readinitb(&rio, clientfd);
19          sprintf(buf, "%d\n", ball_cnt);
20          Rio_writen(clientfd, buf, strlen(buf));
21          Rio_readlineb(&rio, buf, MAXLINE);
22          Fputs(buf, stdout);
23      }
24      exit(0);
25  }
```

他在同一台主机上运行服务器和客户端。他的操作流程是：

```text
cd pingpong
nohup ./server 50000 > log.out &
./client ______ ______
```

程序正常运行完毕，"You win！"出现在了他的屏幕上。小明查看 log.out，里面的第一行是 Connected to (localhost, 33580)。请填入小明操作流程中缺失的两处信息。（2分）
%%% part-reference: q-8ef75472241f3c98
答案：localhost 50000
%%% part-stem: q-d1c53aa2285305a2
4. 小明认为设置 #define GOAL 100 难度太低了，于是将服务器与客户端中的代码都改成了 #define GOAL 100000。他像之前一样运行服务器与客户端，结果发现客户端开始报错，并且始终没有输出"You win"。请你解释为什么修改成 100000 会让程序不能正常运行。（2分）
%%% part-reference: q-d1c53aa2285305a2
答案：每次循环都打开了一个新的 clientfd 而没有关闭，导致文件数量过多，耗尽系统资源
%%% part-stem: q-9173da3272ca94be
5. 请在客户端中添加一行代码，使得 #define GOAL 100000 时也能正常运行。你添加的位置是现在的第______行之后，添加的代码内容是______。（2分）
%%% part-reference: q-9173da3272ca94be
答案：第 22 行之后；Close(clientfd);
%%% part-stem: q-2caa71db00b101fa
6. 小红和小方听说了小明的高难度游戏，非常感兴趣。在小明合理配置服务器使得服务器能被访问到后，小红和小方同时在各自的电脑上运行客户端程序，与小明的服务器互动。假设小红、小方的电脑配置相同，网络延迟大小相同，并且整个过程中没有发生过重传。请推测，一段时间后，小红和小方：（ ）（2分）
%%% part-reference: q-2caa71db00b101fa
答案：A
（小明的服务器在迭代处理两个客户端时，ball_cnt 只会在某一次与其中一个客户端连接时等于 GOAL，之后便会设为 0，而另一个客户端已经超过 0，因此只会发送一次"You win!"。）
%%% part-option: q-2caa71db00b101fa A
有且只有一个人的屏幕上会出现"You win!"。
%%% part-option: q-2caa71db00b101fa B
两个人的屏幕上都不会出现"You win!"。
%%% part-option: q-2caa71db00b101fa C
两个人的屏幕上都会出现"You win!"。
