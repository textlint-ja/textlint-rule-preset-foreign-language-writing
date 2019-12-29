import { TextlintRuleOptions, TextlintRuleReporter } from "@textlint/types";
import { wrapReportHandler } from "textlint-rule-helper";
import {
    createKatakanaEnglishIndex,
    KatakanEnglishIndexType
} from "@textlint-ja/textlint-rule-preset-foreign-language-writing-helper";
import { TxtNodeType } from "@textlint/ast-node-types";

const matchAll = require("string.prototype.matchall");
// ・を含む場合はそれぞれ単語として見る
const KATAKANA = /[ァ-ヴ][ァ-ヴー]*/g;
export type Options = {
    /**
     * 許可する単語を指定できます
     */
    allows?: string[];
    /**
     * 慣用的に例外とされる単語も不許可にするかどうか
     * ビルトインでいくつかの例外が定義されています
     * デフォルト: false
     */
    disableBuiltinAllows?: boolean;
    /**
     * 無視したいTxtNodeのTypesを指定します
     * See https://textlint.github.io/docs/txtnode.html#type
     * Default: ["Link", "BlockQuote", "Emphasis", "Strong", "Code", "Comment", "Html"]
     */
    ignoreNodeTypes?: TxtNodeType[];
};
/**
 * 慣用的に例外とされる単語
 */
const BUILTIN_ALLOW_WORDS: string[] = [
    "ホルマリン",
    "メガホン",
    "テレホン",
    "イヤホン",
    "インターホン",
    "マイクロホン",
    "スピーカーホン",
    "ヘッドホン",
    // フォームと区別できない
    "ホーム",
    // 同じカタカナで示すものが違うときに、表記揺れがある単語なので限定しない
    // ソフトウェアについてはプラットフォームが使われる
    "プラットホーム"
];

export const DEFAULT_OPTIONS = {
    allows: [],
    disableBuiltinAllows: false,
    ignoreNodeTypes: ["Link", "BlockQuote", "Emphasis", "Strong", "Code", "Comment", "Html"]
};
export const report: TextlintRuleReporter<TextlintRuleOptions<Options>> = (context, options = {}) => {
    const { Syntax, getSource, RuleError, fixer } = context;
    const indexPromise: Promise<KatakanEnglishIndexType> = createKatakanaEnglishIndex();
    const allows = options.allows || DEFAULT_OPTIONS.allows;
    const ignoreNodeTypes = options.ignoreNodeTypes || DEFAULT_OPTIONS.ignoreNodeTypes;
    const disableBuiltinAllows =
        options.disableBuiltinAllows !== undefined
            ? options.disableBuiltinAllows
            : DEFAULT_OPTIONS.disableBuiltinAllows;
    return wrapReportHandler(
        context,
        {
            ignoreNodeTypes: ignoreNodeTypes
        },
        report => {
            return {
                async [Syntax.Str](node) {
                    const { midashiMap } = await indexPromise;
                    const text = getSource(node);
                    const katakanaItems = matchAll(text, KATAKANA);
                    for (const katakanaItem of katakanaItems) {
                        // カタカナの原語を取得する
                        const matchKatakana = katakanaItem[0];
                        if (!matchKatakana) {
                            continue;
                        }
                        const foWord = matchKatakana.includes("ホ") ? matchKatakana.replace("ホ", "フォ") : "";
                        const englishItems = (midashiMap.get(matchKatakana) || []).concat(midashiMap.get(foWord) || []);
                        if (!englishItems) {
                            continue;
                        }
                        // # 判定
                        // 英単語が -fo-, -pho-
                        const matchEnglishWords = englishItems.filter(item => {
                            return item.includes("fo") || item.endsWith("pho");
                        });
                        if (matchEnglishWords.length === 0) {
                            continue;
                        }
                        // 元のカタカナが「フォ」になっているならOK
                        if (matchKatakana.includes("フォ")) {
                            continue;
                        }
                        // 例外は除外する
                        if (allows.includes(matchKatakana)) {
                            continue;
                        }
                        // ビルトイン例外を除外する if disableBuiltinAllows:false
                        if (!disableBuiltinAllows) {
                            if (BUILTIN_ALLOW_WORDS.includes(matchKatakana)) {
                                continue;
                            }
                        }
                        const index = katakanaItem.index;
                        if (index === undefined) {
                            continue;
                        }
                        // 単語中に"ホ"が複数ある場合に位置を特定できない問題があるので、1つの場合のみをfixにする
                        const hoCount = matchKatakana.split("ホ").length - 1;
                        // 2つ以上ある場合は修正はしない
                        if (hoCount >= 2) {
                            return report(
                                node,
                                new RuleError(
                                    "原語が「fo」または「pho」の場合はカタカナでは「フォ」とするのが原則です",
                                    {
                                        index: index
                                    }
                                )
                            );
                        } else {
                            const startIndex = matchKatakana.indexOf("ホ");
                            report(
                                node,
                                new RuleError(
                                    "原語が「fo」または「pho」の場合はカタカナでは「フォ」とするのが原則です",
                                    {
                                        index: index,
                                        fix: fixer.replaceTextRange([startIndex, startIndex + 1], "フォ")
                                    }
                                )
                            );
                        }
                    }
                }
            };
        }
    );
};
export default {
    linter: report,
    fixer: report
};
