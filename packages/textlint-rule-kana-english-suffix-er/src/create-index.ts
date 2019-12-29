import { fetchDictionary, SudachiSynonyms } from "sudachi-synonyms-dictionary";

export type KATAKANA_MIDASHI = string;
export type ENGLISH_MIDASHI = string;
const KATAKANA_PATTERN = /^[ァ-ヴ][ァ-ヴー・]+$/;

/**
 * Dictionary Design
 *
 * // Index
 * <Midashi>: ItemGroup[]
 * // Check
 * SudachiSynonyms: boolean
 * ItemGroup: boolean
 * // Collection
 * usedItemGroup.forEach
 */
export class ItemGroup {
    constructor(public items: SudachiSynonyms[]) {
    }

    usedItems(
        usedItemSet: Set<SudachiSynonyms>,
        { allowAlphabet, allows }: { allowAlphabet: boolean; allows: string[] }
    ): SudachiSynonyms[] {
        // sort by used
        return Array.from(usedItemSet.values()).filter(item => {
            if (
                allowAlphabet &&
                (item.hyoukiYure === "アルファベット表記" || item.ryakusyou === "略語・略称/アルファベット")
            ) {
                // アルファベット表記
                // blog <-> ブログ
                // 略語・略称/アルファベット
                // OS <-> オペレーションシステム
                return false;
            }
            if (allows.includes(item.midashi)) {
                return false;
            }
            return this.items.includes(item);
        });
    }
}

/**
 * インストールのチェック
 */
const assertInstallationSudachiSynonymsDictionary = () => {
    try {
        require("sudachi-synonyms-dictionary");
    } catch (error) {
        throw new Error(`sudachi-synonyms-dictionaryがインストールされていません。
ルールとは別にsudachi-synonyms-dictionaryをインストールしてください。
      
$ npm install sudachi-synonyms-dictionary
`);
    }
};
export type IndexType = {
    midashiMap: Map<KATAKANA_MIDASHI, ENGLISH_MIDASHI[]>;
};
let _ret: IndexType | null = null;
export const createIndex = async (): Promise<IndexType> => {
    if (_ret) {
        return Promise.resolve(_ret);
    }
    assertInstallationSudachiSynonymsDictionary();
    const midashiMap: Map<KATAKANA_MIDASHI, ENGLISH_MIDASHI[]> = new Map();
    const SynonymsDictionary = await fetchDictionary();
    SynonymsDictionary.forEach(group => {
        group.items.forEach((item) => {
            if (KATAKANA_PATTERN.test(item.midashi)) {
                const targetMidashi = item.midashi;
                // のAlphabet表記を集める
                const vocabularyNumber = item.vocabularyNumber;
                const englishItems = group.items.filter(item => {
                    // 自分以外の同じvocabularyNumberのアルファベットを
                    return item.midashi !== targetMidashi &&
                        item.vocabularyNumber === vocabularyNumber &&
                        (item.ryakusyou === "略語・略称/アルファベット" || item.hyoukiYure === "アルファベット表記");
                });
                // Map<カタカナ, 英語[]>
                midashiMap.set(targetMidashi, englishItems.map(item => item.midashi));
            }
        });
    });
    _ret = {
        midashiMap
    };
    return Promise.resolve(_ret);
};
