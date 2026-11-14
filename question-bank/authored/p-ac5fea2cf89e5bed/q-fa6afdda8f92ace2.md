+++json
{
  "schemaVersion": "5",
  "id": "q-fa6afdda8f92ace2",
  "revision": 2,
  "paperId": "p-ac5fea2cf89e5bed",
  "paperOrder": 26,
  "number": {
    "display": "第七题",
    "major": {
      "display": "第七题",
      "value": "7"
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
      "legacyId": "q-fa6afdda8f92ace2",
      "document": "原文/期末/2013期末-带答案.md",
      "lines": {
        "start": 637,
        "end": 693
      },
      "curated": "_curated/期末/2013期末-带答案/637.md",
      "aliases": [],
      "provenance": "rewritten",
      "editorNote": "socket 连接数上限与 listenfd/connfd 填空"
    }
  ],
  "type": "fill",
  "stem": {
    "format": "markdown",
    "blanks": [
      {
        "id": "listen-port80",
        "marker": "{{blank:listen-port80}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "listen-all-ports",
        "marker": "{{blank:listen-all-ports}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "web-socket",
        "marker": "{{blank:web-socket}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "echo-socket",
        "marker": "{{blank:echo-socket}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "accept-result",
        "marker": "{{blank:accept-result}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "accept-listen",
        "marker": "{{blank:accept-listen}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "echo-fd",
        "marker": "{{blank:echo-fd}}",
        "occurrence": 0,
        "width": "medium"
      },
      {
        "id": "close-fd",
        "marker": "{{blank:close-fd}}",
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
        "blankId": "listen-port80",
        "method": "exact",
        "acceptedAnswers": [
          "2*2^48",
          "2^49", "562949953421312", "2 * 2^48", "2 ^ 49"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "listen-all-ports",
        "method": "exact",
        "acceptedAnswers": [
          "2*2^64",
          "2^65", "36893488147419103232", "2 * 2^64", "2 ^ 65"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "web-socket",
        "method": "exact",
        "acceptedAnswers": [
          "128.2.194.242:80"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "echo-socket",
        "method": "exact",
        "acceptedAnswers": [
          "128.2.194.242:7"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "accept-result",
        "method": "exact",
        "acceptedAnswers": [
          "connfd"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "accept-listen",
        "method": "exact",
        "acceptedAnswers": [
          "listenfd"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "echo-fd",
        "method": "exact",
        "acceptedAnswers": [
          "connfd"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      },
      {
        "blankId": "close-fd",
        "method": "exact",
        "acceptedAnswers": [
          "connfd"
        ],
        "normalize": {
          "caseSensitive": false,
          "trimWhitespace": true
        }
      }
    ]
  }
}
+++
%%% stem
第七题（10分）

前两问只计算理论上的不同TCP连接四元组组合数：IPv4地址字段32位，端口字段16位，所有位模式都参与计数；忽略保留地址/端口、实际客户端是否存在及系统资源限制。它不是监听套接字个数，也不是机器实际能同时服务的连接容量。幂可写 `2^k`，也可填完整十进制整数。

（1）服务器拥有两个固定本地IP地址，本地端口固定为80，远端IP和远端端口任意。不同连接四元组共有 {{blank:listen-port80}} 种。（2分）

（2）在相同模型下，再允许本地端口取任意16位模式，不同连接四元组共有 {{blank:listen-all-ports}} 种。（2分）

（3）服务器固定IP为 `128.2.194.242`，请填写对应目标端点的 `IP:port`（不是文件描述符）。（2分）

| 客户端请求 | 服务器端口 | 目标 socket 标识符 |
| --- | ---: | --- |
| Web client | 80 | {{blank:web-socket}} |
| Echo client | 7 | {{blank:echo-socket}} |

（4）在 Echo server 范例中，`server` 端通过 `accept` 接受 client 的连接请求。请在下面的空格中填写 `listenfd` 或 `connfd`。（4分，每空1分）

```c
int main(int argc, char **argv) {
    int listenfd, connfd, port, clientlen;
    struct sockaddr_in clientaddr;
    struct hostent *hp;
    char *haddrp;
    unsigned short client_port;
    /* ... */
    while (1) {
        clientlen = sizeof(clientaddr);
        {{blank:accept-result}} = Accept({{blank:accept-listen}},
            (SA *)&clientaddr, &clientlen);
        hp = Gethostbyaddr((const char *)&clientaddr.sin_addr.s_addr,
            sizeof(clientaddr.sin_addr.s_addr), AF_INET);
        haddrp = inet_ntoa(clientaddr.sin_addr);
        client_port = ntohs(clientaddr.sin_port);
        printf("server connected to %s (%s), port %u\n",
            hp->h_name, haddrp, client_port);
        echo({{blank:echo-fd}});
        Close({{blank:close-fd}});
    }
}
```
%%% reference
答案：

1. $2\times 2^{48}$
2. $2\times 2^{64}$
3. `128.2.194.242:80`；`128.2.194.242:7`
4. `connfd`、`listenfd`、`connfd`、`connfd`

`Accept` 在监听描述符 `listenfd` 上接收连接，并返回已连接描述符 `connfd`；后续数据传输与关闭操作都使用 `connfd`。

前两问分别有2种本地IP、$2^{32}$ 种远端IP、$2^{16}$ 种远端端口，再在第2问乘上 $2^{16}$ 种本地端口，得到 $2^{49}$ 与 $2^{65}$。原题“可以监听多少连接”的措辞容易与仅绑定本地端点的监听套接字混淆，题面已明确为抽象四元组计数。
