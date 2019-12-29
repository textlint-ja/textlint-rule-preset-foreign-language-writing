import TextLintTester from "textlint-tester";

const tester = new TextLintTester();
// rule
import rule from "../src/textlint-rule-kana-english-suffix-ware";
// ruleName, rule, { valid, invalid }
tester.run("textlint-rule-kana-english-suffix-ware", rule, {
    valid: [
        // -ware
        "ソフトウェア(software)",
        "スパイウェア(spyware)",
        "マルウェア(malware)",
        // -wear
        "スポーツウェア(sports wear)",
        "ゴルフウェア(gold wear)",
        "マウンテンウェア(mountain wear)",
        "カジュアルウェア(casual wear)",
        // オプション
        {
            text: "マルウエア",
            options: {
                allows: ["マルウエア"]
            }
        }
    ],
    invalid: [
        {
            text: "ソフトウエアは-wareなので小文字",
            output: "ソフトウェアは-wareなので小文字",
            errors: [
                {
                    index: 0,
                    message: "原語の語尾が-wareの場合はカタカナでは「ウェア」とするのが原則です"
                }
            ]
        },
        {
            text: "ゴルフウエアは-wareなので小文字",
            output: "ゴルフウェアは-wareなので小文字",
            errors: [
                {
                    index: 0,
                    message: "原語の語尾が-ware,-wearの場合はカタカナでは「ウェア」とするのが原則です"
                }
            ]
        }
    ]
});
