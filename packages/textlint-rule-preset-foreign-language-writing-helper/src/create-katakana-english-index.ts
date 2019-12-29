import { fetchDictionary } from "sudachi-synonyms-dictionary";

export type KATAKANA_MIDASHI = string;
export type ENGLISH_MIDASHI = string;
const KATAKANA_PATTERN = /^[ァ-ヴ][ァ-ヴー・]+$/;
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
export type KatakanEnglishIndexType = {
    midashiMap: Map<KATAKANA_MIDASHI, ENGLISH_MIDASHI[]>;
};
let _ret: KatakanEnglishIndexType | null = null;
/**
 * Map<カタカナ, 英単語[]> のIndexを作って返す
 */
export const createKatakanaEnglishIndex = async (): Promise<KatakanEnglishIndexType> => {
    if (_ret) {
        return Promise.resolve(_ret);
    }
    assertInstallationSudachiSynonymsDictionary();
    const midashiMap: Map<KATAKANA_MIDASHI, ENGLISH_MIDASHI[]> = new Map();
    const SynonymsDictionary = await fetchDictionary();
    SynonymsDictionary.forEach(group => {
        group.items.forEach(item => {
            if (KATAKANA_PATTERN.test(item.midashi)) {
                const targetMidashi = item.midashi;
                // のAlphabet表記を集める
                const vocabularyNumber = item.vocabularyNumber;
                const englishItems = group.items.filter(item => {
                    // 自分以外の同じvocabularyNumberのアルファベットを集める
                    return (
                        item.midashi !== targetMidashi &&
                        item.vocabularyNumber === vocabularyNumber &&
                        (item.ryakusyou === "略語・略称/アルファベット" || item.hyoukiYure === "アルファベット表記")
                    );
                });
                // Map<カタカナ, 英語[]>
                midashiMap.set(
                    targetMidashi,
                    englishItems.map(item => item.midashi)
                );
            }
        });
    });
    _ret = {
        midashiMap
    };
    return Promise.resolve(_ret);
};
