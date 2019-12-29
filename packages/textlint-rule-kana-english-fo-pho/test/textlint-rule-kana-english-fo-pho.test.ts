import TextLintTester from "textlint-tester";

const tester = new TextLintTester();
// rule
import rule from "../src/textlint-rule-kana-english-fo-pho";
// ruleName, rule, { valid, invalid }
tester.run("textlint-rule-kana-english-fo-pho", rule, {
    valid: [
        // -fo-
        "インフォ(info)",
        "インフォメーション(information)",
        "フォーム(form)",
        "フォント(font)",
        "ハイホン(hyphon)",
        "フォロー(follow)",
        "フォロワー(follower)",
        "フォワード(forward)",
        "フォーク ダンス(folk dance)",
        "フォルダー(folder)",
        "ユニフォーム(uniform)",
        // -pho-
        "アイフォン(iPhone)",
        "フォト(photo)",
        "フォトグラファー(photology)",
        "フォビア(phobia)",
        // 例外
        "プラットホーム(platform)は例外で、プラットフォームでもいい",
        "ホーム(homu)は例外、フォームと区別できない",
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
        },
        {
            text: "パホーマンスは-fo-なのでフォを使う",
            output: "パフォーマンスは-fo-なのでフォを使う",
            errors: [
                {
                    index: 0,
                    message: "原語が「fo」または「pho」の場合はカタカナでは「フォ」とするのが原則です"
                }
            ]
        }
    ]
});
