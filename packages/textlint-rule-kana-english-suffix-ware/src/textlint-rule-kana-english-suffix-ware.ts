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
     * ビルトインでいつくかの例外が定義されています
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
const BUILTIN_ALLOW_WORDS: string[] = [];

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
                        const englishItems = midashiMap.get(matchKatakana);
                        if (!englishItems) {
                            continue;
                        }
                        // # 判定
                        // 英単語が -warek -ware
                        const isMatchSuffix = englishItems.some(item => {
                            return item.endsWith("ware") || item.endsWith("wear");
                        });
                        if (!isMatchSuffix) {
                            continue;
                        }
                        // 元のカタカナが「ウェア」になっている
                        if (matchKatakana.endsWith("ウェア")) {
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
                        const startIndex = matchKatakana.indexOf("ウエア");
                        const endIndex = index + matchKatakana.length;
                        report(
                            node,
                            new RuleError("原語の語尾が-ware,-wearの場合はカタカナでは「ウェア」とするのが原則です", {
                                index: index,
                                fix: fixer.replaceTextRange([startIndex, endIndex], "ウェア")
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
