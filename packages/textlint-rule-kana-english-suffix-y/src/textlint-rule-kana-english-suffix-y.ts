import { TextlintRuleOptions, TextlintRuleReporter } from "@textlint/types";
import { wrapReportHandler } from "textlint-rule-helper";
import {
    createKatakanaEnglishIndex,
    KatakanEnglishIndexType
} from "@textlint-ja/textlint-rule-preset-foreign-language-writing-helper";

const matchAll = require("string.prototype.matchall");
// ・を含む場合はそれぞれ単語として見る
const KATAKANA = /[ァ-ヴ][ァ-ヴー]*/g;
export type Options = {
    /**
     * 許可する単語を指定できます
     */
    allows?: string[];
    /**
     * 慣用的に長音が省略される単語も不許可にするかどうか
     * ビルトインでいつくかの例外が定義されています
     * デフォルト: false
     */
    disableBuiltinAllows?: boolean;
};
/**
 * 慣用的に長音が省略される単語
 */
const BUILTIN_ALLOW_WORDS = ["サンクチュアリ", "アムネスティ"];

export const DEFAULT_OPTIONS = {
    allows: [],
    disableBuiltinAllows: false
};
export const report: TextlintRuleReporter<TextlintRuleOptions<Options>> = (context, options = {}) => {
    const { Syntax, getSource, RuleError, fixer } = context;
    const indexPromise: Promise<KatakanEnglishIndexType> = createKatakanaEnglishIndex();
    const allows = options.allows || DEFAULT_OPTIONS.allows;
    const disableBuiltinAllows =
        options.disableBuiltinAllows !== undefined
            ? options.disableBuiltinAllows
            : DEFAULT_OPTIONS.disableBuiltinAllows;
    return wrapReportHandler(
        context,
        {
            ignoreNodeTypes: ["Link", "BlockQuote", "Emphasis", "Strong", "Code", "Comment", "Html"]
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
                        const englishItems = midashiMap.get(matchKatakana);
                        if (!englishItems) {
                            continue;
                        }
                        // # 判定
                        // 英単語が -y
                        const isSuffixYEnglish = englishItems.some(item => {
                            return item.endsWith("y");
                        });
                        if (!isSuffixYEnglish) {
                            continue;
                        }
                        // 元のカタカナがー(長音)で終わっていない
                        if (matchKatakana.endsWith("ー")) {
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
                        const endIndex = index + matchKatakana.length - 1;
                        report(
                            node,
                            new RuleError("原語の語尾が-yの場合はカタカナでは長音記号「ー」で表わすのが原則です", {
                                index: index,
                                fix: fixer.insertTextAfterRange([endIndex, endIndex + 1], "ー")
                            })
                        );
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
