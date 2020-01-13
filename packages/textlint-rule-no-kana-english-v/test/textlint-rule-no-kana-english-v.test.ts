import TextLintTester from "textlint-tester";

const tester = new TextLintTester();
// rule
import rule from "../src/textlint-rule-no-kana-english-v";
// ruleName, rule, { valid, invalid }
tester.run("textlint-rule-no-kana-english-v", rule, {
    valid: [
        // -v-
        "アベレージ(average)",
        "イベント(event)",
        "オーバーコート(overcoat)",
        "キャラバン(caravan)",
        "サービス(service)",
        "サーベイ(survey)",
        "ネガティブ(negative)",
        "バイオリン(violin)",
        "バージョン(version)",
        "バニラ(vanilla)",
        "バリエーション(variation)",
        "バルブ(valve)",
        "ビデオ(video)",
        "ベテラン(veteran)",
        "ボーカル(vocal)",
        "ボランティア(volunteer)",
        "ボリューム(volume)",
        "ユニバーサル(universal)",
        "リバイバル(revival)",
        "レビュー(review)",
        "レベル(level)",
        // オプション
        {
            text: "ヴィンテージ",
            options: {
                allows: ["ヴィンテージ"]
            }
        }
    ],
    invalid: [
        {
            text: "イヴェントは-v-なので「ベ」を使う",
            output: "イベントは-v-なので「ベ」を使う",
            errors: [
                {
                    index: 1,
                    message: `原語が「v」の場合はカタカナに「ヴ」を使わないのが原則です。

「バ」「ビ」「ブ」「ベ」「ボ」のどれかを利用してください`
                }
            ]
        },
        {
            text: "レヴューは-v-なので「ビュ」を使う",
            output: "レビューは-v-なので「ビュ」を使う",
            errors: [
                {
                    index: 1,
                    message: `原語が「v」の場合はカタカナに「ヴ」を使わないのが原則です。

「バ」「ビ」「ブ」「ベ」「ボ」のどれかを利用してください`
                }
            ]
        }
    ]
});
