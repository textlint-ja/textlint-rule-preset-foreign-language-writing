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
     * 慣用的に例外として扱われる単語も不許可にするかどうか
     * ビルトインでいつくかの例外が定義されています
     * デフォルト: false
     */
    disableBuiltinAllows?: boolean;
};
/**
 * 慣用的に長音が省略される単語
 */
const BUILTIN_ALLOW_WORDS = ["ミニチュア"];

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
                        const matchKatakana: string | undefined = katakanaItem[0];
                        if (!matchKatakana) {
                            continue;
                        }
                        // 辞書には ー が含まれてない場合があるので両方試す
                        const suffixPyhonWord = matchKatakana.endsWith("ー") ? "" : matchKatakana + "ー";
                        const nonSuffixPyhonWord = matchKatakana.endsWith("ー")
                            ? matchKatakana.slice(0, matchKatakana.length - 1)
                            : "undefined";
                        const englishItems = (midashiMap.get(matchKatakana) || [])
                            .concat(midashiMap.get(suffixPyhonWord) || [])
                            .concat(midashiMap.get(nonSuffixPyhonWord) || []);
                        if (!englishItems) {
                            continue;
                        }
                        // # 判定
                        const isReEnglish = englishItems.some(item => {
                            return item.endsWith("re");
                        });
                        if (!isReEnglish) {
                            continue;
                        }
                        // 末尾が -ture, -sure の場合は長音記号「ー」を付ける
                        const shouldHyphon = englishItems.some(item => {
                            return item.endsWith("ture") || item.endsWith("sure");
                        });
                        if (shouldHyphon) {
                            // # ただし、末尾が -ture, -sure の場合は長音記号「ー」を付ける
                            // 元のカタカナがー(長音)で終わっていないならOK
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
                                new RuleError(
                                    "原語の語尾が-ture,-sureの場合は、原則として長音記号「ー」を付けるのが原則です",
                                    {
                                        index: index,
                                        fix: fixer.insertTextAfterRange([endIndex, endIndex + 1], "ー")
                                    }
                                )
                            );
                        } else {
                            // # 英単語がの末尾が -re の場合は長音記号を付けない
                            // 元のカタカナがー(長音)で終わって終わってるならOK
                            if (!matchKatakana.endsWith("ー")) {
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
                                new RuleError(
                                    "原語の語尾が-reの場合は、原則として長音記号「ー」を付けないのが原則です",
                                    {
                                        index: index,
                                        fix: fixer.removeRange([endIndex, endIndex + 1])
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
