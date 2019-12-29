import TextLintTester from "textlint-tester";

const tester = new TextLintTester();
// rule
import rule from "../src/textlint-rule-kana-english-suffix-fo";
// ruleName, rule, { valid, invalid }
tester.run("textlint-rule-kana-english-suffix-fo", rule, {
    valid: [
        // -fo-
        "インフォ(info)",
        "インフォメーション(information)",
        "フォーム(form)",
        "フォロー(follow)",
        "フォワード(forward)",
        "フォーク ダンス(folk dance)",
        "フォルダー(folder)",
        "ユニフォーム(uniform)",
        // -pho-
        "アイフォン(iPhone)は例外",
        // 例外
        "プラットホーム(platform)は例外で、プラットフォームでもいい",
        "テレホン(telephone)は例外",
        "イヤホン(earphone)は例外",
        "メガホン(megaphon)は例外",
        // オプション
        {
            text: "インホーメーション",
            options: {
                allows: ["インホーメーション"]
            }
        }
    ],
    invalid: [
        {
            text: "インホメーションは-fo-なのでフォを使う",
            output: "インフォメーションは-fo-なのでフォを使う",
            errors: [
                {
                    index: 0,
                    message: "原語が「fo」または「pho」の場合はカタカナでは「フォ」とするのが原則です"
                }
            ]
        }
    ]
});
