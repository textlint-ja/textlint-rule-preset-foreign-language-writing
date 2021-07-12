import TextLintTester from "textlint-tester";

const tester = new TextLintTester();
// rule
import rule from "../src/textlint-rule-no-old-kana";
// ruleName, rule, { valid, invalid }
tester.run("textlint-rule-no-old-kana", rule, {
    valid: [
        // exception
        "例外的にチヂミはOKです",
        "イチヂク",
        "イチヂルシイ"
    ],
    invalid: [
        {
            text: "ゑもじ",
            output: "えもじ",
            errors: [
                {
                    index: 0,
                    message: `歴史的仮名遣いである「ゑ」を利用しないのが原則です。

「ゑ」を「え」に変更してください`
                }
            ]
        },
        {
            text: "ヰタ・セクスアリス",
            errors: [
                {
                    index: 0,
                    message: `歴史的仮名遣いである「ヰ」を利用しないのが原則です。

「ヰ」を「イ」または「ウィ」に変更してください`
                }
            ]
        }
    ]
});
