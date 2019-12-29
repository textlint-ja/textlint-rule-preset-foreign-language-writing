import { createKatakanaEnglishIndex } from "../src/create-katakana-english-index";
import assert from "assert";
describe("create-katakana-english-index", () => {
    it("should should Map<カタカナ, 英単語[]>", async () => {
        const { midashiMap } = await createKatakanaEnglishIndex();
        const englishItems = midashiMap.get("エディタ");
        assert.deepStrictEqual(englishItems, ["editor"]);
    });
});
