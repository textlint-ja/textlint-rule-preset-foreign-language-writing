import { TextlintRuleOptions, TextlintRuleReporter } from "@textlint/types";
import { wrapReportHandler } from "textlint-rule-helper";
import { TxtNodeType } from "@textlint/ast-node-types";

const matchAll = require("string.prototype.matchall");

// 【表音本則】 「ゐ（ヰ）」「ゑ（ヱ）」「を（ヲ）」を用いる語は、ア行の音で表す。
// https://ja.wikipedia.org/wiki/%E7%8F%BE%E4%BB%A3%E4%BB%AE%E5%90%8D%E9%81%A3%E3%81%84
// https://www.aozora.gr.jp/metadata_collection/phonetic_notation.html
const WORD_ITEM_LIST: {
    before: string;
    after: string | string[];
    exception?: (text: string, index: number) => boolean;
}[] = [
    // 旧仮名遣のひらがな
    {
        before: "ゐ",
        after: "い"
    },
    {
        before: "ゑ",
        after: "え"
    },
    // 旧仮名遣のカタカナ
    {
        before: "ヰ",
        after: ["イ", "ウィ"]
    },
    {
        before: "ヱ",
        after: ["エ", "ウェ"]
    },
    {
        before: "ヲ",
        after: "オ"
    },
    // 複合
    {
        before: "ワ゛",
        after: "ヴァ"
    },
    {
        before: "ヰ゛",
        after: "ヴィ"
    },
    {
        before: "ヱ゛",
        after: "ヴェ"
    },
    {
        before: "ヲ゛",
        after: "ヴォ"
    },
    // 【表音本則】「ぢ・づ」を含む語は「じ・ず」で表す。
    // 【準則】いわゆる連濁・複合語、語意識の働く語彙に関しては、歴史的仮名遣における「ぢ・づ」を許容する。
    // https://ja.wikipedia.org/wiki/%E7%8F%BE%E4%BB%A3%E4%BB%AE%E5%90%8D%E9%81%A3%E3%81%84
    // 例外の規定
    // https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/gendaikana/honbun_dai2.html
    // ただし(2)　二語の連合によって生じた「ぢ」「づ」については曖昧さが残るため扱わない
    {
        before: "ぢ",
        after: "じ",
        exception: (text: string, index: number) => {
            if (text[index - 1] === undefined) {
                return false;
            }
            const beforeChar = text[index - 1];
            // ちぢみ（縮）　ちぢむ　ちぢれる　ちぢこまる などは例外
            return (
                beforeChar === "ち" &&
                text.slice(index - 4, index) !== "いちぢく" &&
                text.slice(index - 6, index) !== "いちぢるしい"
            );
        }
    },
    {
        before: "ヂ",
        after: "ジ",
        exception: (text: string, index: number) => {
            if (text[index - 1] === undefined) {
                return false;
            }
            const beforeChar = text[index - 1];
            // ちぢみ（縮）　ちぢむ　ちぢれる　ちぢこまる などは例外
            // 「いちじく」「いちじるしい」はこれに当たらない
            return (
                beforeChar === "チ" &&
                text.slice(index - 4, index) !== "イチヂク" &&
                text.slice(index - 6, index) !== "イチヂルシイ"
            );
        }
    },
    {
        before: "づ",
        after: "ず",
        exception: (text: string, index: number) => {
            if (text[index - 1] === undefined) {
                return false;
            }
            const beforeChar = text[index - 1];
            // つづみ（鼓）　つづら　つづく（続）　つづめる（約△）　つづる（綴＊）は例外
            return beforeChar === "つ";
        }
    },
    {
        before: "ヅ",
        after: "ズ",
        exception: (text: string, index: number) => {
            if (text[index - 1] === undefined) {
                return false;
            }
            const beforeChar = text[index - 1];
            // つづみ（鼓）　つづら　つづく（続）　つづめる（約△）　つづる（綴＊）は例外
            return beforeChar === "ツ";
        }
    }
];

const matchindPattern = new RegExp(WORD_ITEM_LIST.map(item => item.before).join("|"), "g");
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
export const DEFAULT_OPTIONS = {
    allows: [],
    disableBuiltinAllows: false,
    ignoreNodeTypes: ["Link", "BlockQuote", "Emphasis", "Strong", "Code", "Comment", "Html"]
};
export const report: TextlintRuleReporter<TextlintRuleOptions<Options>> = (context, options = {}) => {
    const { Syntax, getSource, RuleError, fixer } = context;
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
                    const text = getSource(node);
                    const katakanaItems = matchAll(text, matchindPattern);
                    for (const katakanaItem of katakanaItems) {
                        // カタカナの原語を取得する
                        const matchKatakana = katakanaItem[0];
                        if (!matchKatakana) {
                            continue;
                        }
                        // ユーザー定義の例外は除外する
                        if (allows.includes(matchKatakana)) {
                            continue;
                        }

                        const index = katakanaItem.index;
                        const matchItem = WORD_ITEM_LIST.find(item => {
                            return item.before === matchKatakana;
                        });
                        if (!matchItem) {
                            return;
                        }
                        // ビルトイン例外を除外する if disableBuiltinAllows:false
                        if (!disableBuiltinAllows && matchItem.exception) {
                            const isException = matchItem.exception(text, index);
                            if (isException) {
                                return;
                            }
                        }
                        const matchAfter = matchItem.after;
                        const message = Array.isArray(matchAfter)
                            ? `歴史的仮名遣いである「${matchKatakana}」を利用しないのが原則です。

「${matchKatakana}」を「${matchAfter.join("」または「")}」に変更してください`
                            : `歴史的仮名遣いである「${matchKatakana}」を利用しないのが原則です。

「${matchKatakana}」を「${matchAfter}」に変更してください`;

                        const fix =
                            matchItem && !Array.isArray(matchAfter)
                                ? fixer.replaceTextRange(
                                      [katakanaItem.index, katakanaItem.index + matchKatakana.length],
                                      matchAfter
                                  )
                                : undefined;
                        report(
                            node,
                            new RuleError(message, {
                                index,
                                fix: fix
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
