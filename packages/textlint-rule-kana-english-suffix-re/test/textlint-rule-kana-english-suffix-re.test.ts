import TextLintTester from "textlint-tester";

const tester = new TextLintTester();
// rule
import rule from "../src/textlint-rule-kana-english-suffix-re";
// ruleName, rule, { valid, invalid }
tester.run("textlint-rule-kana-english-suffix-re", rule, {
    valid: [
        // -reは「ー」を付けない
        "ラビア(gravure)",
        "ケア(care)",
        "コア(core)",
        "フィギュア(figure)",
        "ファームウェア(firmware)",
        "フリーウェア(freeware)",
        "グループウェア(groupware)",
        "ハードウェア(hardware)",
        "ピュア(pure)",
        "リタイア(retire)",
        "スコア(score)",
        "サファイア(sapphire)",
        "シビア(severe)",
        "シェア(share)",
        "ソフトウェア(software)",
        "スペア(spare)",
        "スクエア(square)",
        "ストア(store)",
        "タイヤ(tire)",
        "ワイヤ(wire)",
        // ただし、-ture, -sureは「ー」を付ける
        "アドベンチャー(adventure)",
        "アーキテクチャー(architecture)",
        "カルチャー(culture)",
        "ディスクロージャー(disclosure)",
        "フィーチャー(feature)",
        "ファニチャー(furniture)",
        "ジェスチャー(gesture)",
        "インフラストラクチャー(infrastructure)",
        "レクチャー(lecture)",
        "レジャー(leisure)",
        "マニュファクチャー(manufacture)",
        "ネイチャー(nature)",
        "ピクチャー(picture)",
        "プレッシャー(pressure)",
        "シグネチャー(signature)",
        "ストラクチャー(structure)",
        "テクスチャー(texture)",
        // 一般的に長音記号を使わない単語は例外とする
        "エンジニアは例外",
        "ウェアは例外",
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
        // -re は「ー」を付けない
        {
            text: "フリーウェアー",
            output: "フリーウェア",
            errors: [
                {
                    index: 0,
                    message: "原語の語尾が-reの場合は、原則として長音記号「ー」を付けないのが原則です"
                }
            ]
        },
        {
            text: "スクエアー",
            output: "スクエア",
            errors: [
                {
                    index: 0,
                    message: "原語の語尾が-reの場合は、原則として長音記号「ー」を付けないのが原則です"
                }
            ]
        },
        {
            text: "ストアー",
            output: "ストア",
            errors: [
                {
                    index: 0,
                    message: "原語の語尾が-reの場合は、原則として長音記号「ー」を付けないのが原則です"
                }
            ]
        },
        // -ture,-sureは「ー」をつける
        {
            text: "カルチャ",
            output: "カルチャー",
            errors: [
                {
                    index: 0,
                    message: "原語の語尾が-ture,-sureの場合は、原則として長音記号「ー」を付けるのが原則です"
                }
            ]
        }
    ]
});
