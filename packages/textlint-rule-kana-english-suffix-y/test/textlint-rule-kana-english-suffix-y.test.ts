import TextLintTester from "textlint-tester";

const tester = new TextLintTester();
// rule
import rule from "../src/textlint-rule-kana-english-suffix-y";
// ruleName, rule, { valid, invalid }
tester.run("textlint-rule-kana-english-suffix-y", rule, {
    valid: [
        // -y
        "アクセサリーはOK",
        "エネルギーはOK",
        "アイデンティティーはOK",
        "メロディーはOK",
        "パーティーはOK",
        "メモリーはOK",
        // 一般的に長音記号を使わない単語は例外とする
        "サンクチュアリは例外",
        "アムネスティは例外",
        // オプション
        {
            text: "メモリ",
            options: {
                allows: ["メモリ"]
            }
        }
    ],
    invalid: [
        {
            text: "メモリは-yなので長音",
            output: "メモリーは-yなので長音",
            errors: [
                {
                    index: 0,
                    message: "原語の語尾が-yの場合はカタカナでは長音記号「ー」で表わすのが原則です"
                }
            ]
        },
        {
            text: "パーティは-yなので長音",
            output: "パーティーは-yなので長音",
            errors: [
                {
                    index: 0,
                    message: "原語の語尾が-yの場合はカタカナでは長音記号「ー」で表わすのが原則です"
                }
            ]
        }

    ]
});
