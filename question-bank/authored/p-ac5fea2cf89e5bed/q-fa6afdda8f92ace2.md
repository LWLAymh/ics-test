+++json
{
  "schemaVersion": "5",
  "id": "q-fa6afdda8f92ace2",
  "revision": 1,
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
          "2^49"
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
          "2^65"
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

（1）一个服务器拥有两个独立的固定 IP 地址，那么它在 Web 应用端口 80 上最多可以监听 {{blank:listen-port80}} 个独立的 socket 连接。（2分）

（2）该服务器在所有 Web 应用端口上最多可以监听 {{blank:listen-all-ports}} 个独立的 socket 连接。（2分）

（3）服务器的固定 IP 地址为 `128.2.194.242`。请填写两种客户端请求对应的目标服务器 socket 标识符。（2分）

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
