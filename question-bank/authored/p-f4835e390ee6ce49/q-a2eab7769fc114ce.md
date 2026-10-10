+++json
{
  "schemaVersion":"5","id":"q-a2eab7769fc114ce","revision":1,"paperId":"p-f4835e390ee6ce49","paperOrder":17,"number":{"display":"2.17","major":{"display":"第 2 章","value":"2"},"minor":{"display":"2.17","value":"17"},"parts":[]},
  "classification":{"primaryModuleId":"data_representation","moduleIds":["data_representation"],"tags":["csapp","practice","chapter-2"]},"type":"fill","stem":{"format":"markdown","blanks":[
    {"id":"r0b","marker":"{{blank:r0b}}","occurrence":0,"width":"short","label":"0x0 二进制"},{"id":"r0u","marker":"{{blank:r0u}}","occurrence":0,"width":"long","label":"0x0 的无符号展开式"},{"id":"r0t","marker":"{{blank:r0t}}","occurrence":0,"width":"long","label":"0x0 的补码展开式"},
    {"id":"r5b","marker":"{{blank:r5b}}","occurrence":0,"width":"short","label":"0x5 二进制"},{"id":"r5u","marker":"{{blank:r5u}}","occurrence":0,"width":"long","label":"0x5 的无符号展开式"},{"id":"r5t","marker":"{{blank:r5t}}","occurrence":0,"width":"long","label":"0x5 的补码展开式"},
    {"id":"r8b","marker":"{{blank:r8b}}","occurrence":0,"width":"short","label":"0x8 二进制"},{"id":"r8u","marker":"{{blank:r8u}}","occurrence":0,"width":"long","label":"0x8 的无符号展开式"},{"id":"r8t","marker":"{{blank:r8t}}","occurrence":0,"width":"long","label":"0x8 的补码展开式"},
    {"id":"rdb","marker":"{{blank:rdb}}","occurrence":0,"width":"short","label":"0xD 二进制"},{"id":"rdu","marker":"{{blank:rdu}}","occurrence":0,"width":"long","label":"0xD 的无符号展开式"},{"id":"rdt","marker":"{{blank:rdt}}","occurrence":0,"width":"long","label":"0xD 的补码展开式"},
    {"id":"rfb","marker":"{{blank:rfb}}","occurrence":0,"width":"short","label":"0xF 二进制"},{"id":"rfu","marker":"{{blank:rfu}}","occurrence":0,"width":"long","label":"0xF 的无符号展开式"},{"id":"rft","marker":"{{blank:rft}}","occurrence":0,"width":"long","label":"0xF 的补码展开式"}
  ]},
  "solution":{"state":"available","grading":"blanks","blankAnswers":[
    {"blankId":"r0b","method":"exact","acceptedAnswers":["[0000]","0000"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"r0u","method":"exact","acceptedAnswers":["0","0 = 0"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"r0t","method":"exact","acceptedAnswers":["0","0 = 0"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
    {"blankId":"r5b","method":"exact","acceptedAnswers":["[0101]","0101"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"r5u","method":"exact","acceptedAnswers":["2^2 + 2^0 = 5","2^2+2^0=5"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"r5t","method":"exact","acceptedAnswers":["2^2 + 2^0 = 5","2^2+2^0=5"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
    {"blankId":"r8b","method":"exact","acceptedAnswers":["[1000]","1000"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"r8u","method":"exact","acceptedAnswers":["2^3 = 8","2^3=8"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"r8t","method":"exact","acceptedAnswers":["-2^3 = -8","-2^3=-8"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
    {"blankId":"rdb","method":"exact","acceptedAnswers":["[1101]","1101"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"rdu","method":"exact","acceptedAnswers":["2^3 + 2^2 + 2^0 = 13","2^3+2^2+2^0=13"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"rdt","method":"exact","acceptedAnswers":["-2^3 + 2^2 + 2^0 = -3","-2^3+2^2+2^0=-3"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},
    {"blankId":"rfb","method":"exact","acceptedAnswers":["[1111]","1111"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"rfu","method":"exact","acceptedAnswers":["2^3 + 2^2 + 2^1 + 2^0 = 15","2^3+2^2+2^1+2^0=15"],"normalize":{"trimWhitespace":true,"caseSensitive":true}},{"blankId":"rft","method":"exact","acceptedAnswers":["-2^3 + 2^2 + 2^1 + 2^0 = -1","-2^3+2^2+2^1+2^0=-1"],"normalize":{"trimWhitespace":true,"caseSensitive":true}}
  ],"reference":{"format":"markdown"},"provenance":{"origin":"unknown","crossChecked":null,"note":"答案据来源仓库的练习题答案录入，未另行交叉复核。"}},
  "publication":{"state":"published","basis":"source-import","reviewer":null,"reviewedAt":null,"issues":[]},"sources":[{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第02章-信息的表示和处理/2.2/2.2.3-twos-complement-encodings.md#L38","provenance":"verbatim"},{"document":"https://github.com/SunnyMaria/csapp-zh-markdown/blob/7fe0d4f79d65ba63cc3c8723c24d2d2e99b84c66/第02章-信息的表示和处理/练习题答案.md#L224","provenance":"reflow"}]
}
+++
%%% stem
练习题 2.17 假设字长 `w = 4`。为每个给定十六进制数字，填写其二进制位模式，以及无符号解释 `B2U₄` 和补码解释 `B2T₄` 的求和展开式。展开式写出所有非零位权并给出数值。原题示例行 `0xE` 已提供：

| x（十六进制） | x（二进制） | B2U₄(x) | B2T₄(x) |
|---|---|---|---|
| `0xE` | `[1110]` | `2^3 + 2^2 + 2^1 = 14` | `-2^3 + 2^2 + 2^1 = -2` |
| `0x0` | {{blank:r0b}} | {{blank:r0u}} | {{blank:r0t}} |
| `0x5` | {{blank:r5b}} | {{blank:r5u}} | {{blank:r5t}} |
| `0x8` | {{blank:r8b}} | {{blank:r8u}} | {{blank:r8t}} |
| `0xD` | {{blank:rdb}} | {{blank:rdu}} | {{blank:rdt}} |
| `0xF` | {{blank:rfb}} | {{blank:rfu}} | {{blank:rft}} |
%%% reference
| x（十六进制） | x（二进制） | B2U₄(x) | B2T₄(x) |
|---|---|---|---|
| `0xE` | `[1110]` | `2^3 + 2^2 + 2^1 = 14` | `-2^3 + 2^2 + 2^1 = -2` |
| `0x0` | `[0000]` | `0` | `0` |
| `0x5` | `[0101]` | `2^2 + 2^0 = 5` | `2^2 + 2^0 = 5` |
| `0x8` | `[1000]` | `2^3 = 8` | `-2^3 = -8` |
| `0xD` | `[1101]` | `2^3 + 2^2 + 2^0 = 13` | `-2^3 + 2^2 + 2^0 = -3` |
| `0xF` | `[1111]` | `2^3 + 2^2 + 2^1 + 2^0 = 15` | `-2^3 + 2^2 + 2^1 + 2^0 = -1` |
