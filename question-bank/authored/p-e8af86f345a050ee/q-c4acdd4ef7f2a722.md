+++json
{
  "schemaVersion":"5","id":"q-c4acdd4ef7f2a722","revision":1,"paperId":"p-e8af86f345a050ee","paperOrder":5,
  "number":{"display":"7.5","major":{"display":"第 7 章","value":"7"},"minor":{"display":"7.5","value":"5"},"parts":[]},
  "classification":{"primaryModuleId":"compilation_linking","moduleIds":["compilation_linking"],"tags":["csapp","practice","chapter-7"]},
  "type":"fill","stem":{"format":"markdown","blanks":[{"id":"relocation-value","marker":"{{blank:relocation-value}}","occurrence":0,"width":"short"}]},
  "solution":{"state":"available","grading":"blanks","blankAnswers":[{"blankId":"relocation-value","method":"exact","acceptedAnswers":["0xa"],"normalize":{"trimWhitespace":true,"caseSensitive":false}}],"reference":{"format":"markdown"},"provenance":{"origin":"unknown","crossChecked":false,"note":"答案据来源仓库《练习题答案.md》；未独立交叉复核。"}},
  "publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},
  "sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第07章-链接/chapter.md#L920-L941","provenance":"rewritten"},{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第07章-链接/练习题答案.md#L70-L103","provenance":"reflow"}]
}
+++
%%% stem
练习题 7.5：`m.o` 中对 `swap` 的调用是：

```asm
e8 00 00 00 00    callq e <main+0xe>
```

重定位项为 `r.offset = 0xa`、`r.symbol = swap`、`r.type = R_X86_64_PC32`、`r.addend = -4`。链接器将 `.text` 放在 `0x4004d0`，将 `swap` 放在 `0x4004e8`。指令中重定位引用值为多少？（十六进制）{{blank:relocation-value}}
%%% reference
引用运行时地址为 `0x4004d0 + 0xa = 0x4004da`。重定位值为 `0x4004e8 - 4 - 0x4004da = 0xa`。
