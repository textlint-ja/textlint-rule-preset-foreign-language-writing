import TextLintTester from "textlint-tester";

const tester = new TextLintTester();
// rule
import rule from "../src/textlint-rule-kana-english-suffix-er";
// ruleName, rule, { valid, invalid }
tester.run("textlint-rule-kana-english-suffix-er", rule, {
    valid: [
        "エディターはOK",
        "エントリーはOK",
        "サーバーはOK",
        "マネージャーはOK",
        "メーカーはOK",
        "モーターはOK",
        "プロジェクターはOK",
        "リボルバーはOK",
        "レーダーはOK",
        "モジュラーはOK",
        "カレンダーはOK",
        // 一般的に長音記号を使わない単語は例外とする
        "エンジニアは例外",
        "ギアは例外",
        "ジュニアは例外",
        // オプション
        {
            text: "エディタ",
            options: {
                allows: ["エディタ"]
            }
        }
    ],
    invalid: [
        {
            text: "エディタは-erなので長音",
            output: "エディターは-erなので長音",
            errors: [
                {
                    index: 0,
                    message: "原語の語尾が-er,-or,-ar場合はカタカナでは長音記号「ー」で表わすのが原則です"
                }
            ]
        },
        {
            text: "サーバは-erなので長音",
            output: "サーバーは-erなので長音",
            errors: [
                {
                    index: 0,
                    message: "原語の語尾が-er,-or,-ar場合はカタカナでは長音記号「ー」で表わすのが原則です"
                }
            ]
        },
        {
            text: "ユーザは-erなので長音",
            output: "ユーザーは-erなので長音",
            errors: [
                {
                    index: 0,
                    message: "原語の語尾が-er,-or,-ar場合はカタカナでは長音記号「ー」で表わすのが原則です"
                }
            ]
        },
        {
            text: "フィルタは-erなので長音",
            output: "フィルターは-erなので長音",
            errors: [
                {
                    index: 0,
                    message: "原語の語尾が-er,-or,-ar場合はカタカナでは長音記号「ー」で表わすのが原則です"
                }
            ]
        },
        {
            text: "ローカル・サーバは-erなので長音",
            output: "ローカル・サーバーは-erなので長音",
            errors: [
                {
                    index: 5,
                    message: "原語の語尾が-er,-or,-ar場合はカタカナでは長音記号「ー」で表わすのが原則です"
                }
            ]
        },
        {
            text: "ネットでコンピュータを買う",
            output: "ネットでコンピューターを買う",
            errors: [
                {
                    index: 4,
                    message: "原語の語尾が-er,-or,-ar場合はカタカナでは長音記号「ー」で表わすのが原則です"
                }
            ]
        }
    ]
});
