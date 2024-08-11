# @textlint-ja/textlint-rule-preset-foreign-language-writing [![Actions Status](https://github.com/textlint-ja/textlint-rule-preset-foreign-language-writing/workflows/test/badge.svg)](https://github.com/textlint-ja/textlint-rule-preset-foreign-language-writing/actions?query=workflow%3A"test")

外来語のカタカナ表記などについて扱うtextlintルールプリセットです。

カタカナ表記については正解がないため、表記ゆれの統一のためにOpinionatedなルールが含まれます。

## ルール一覧

### [@textlint-ja/textlint-rule-kana-english-fo-pho](packages/textlint-rule-kana-english-fo-pho)

> 原語が「fo」または「pho」の場合は、カタカナでは「フォ」とするのを原則とするtextlintルール

### [@textlint-ja/textlint-rule-kana-english-suffix-er](packages/textlint-rule-kana-english-suffix-er)

> 原語の語尾の-er,-or,-arをカタカナでは長音記号「ー」で表わすの原則とするtextlintルール

### [@textlint-ja/textlint-rule-kana-english-suffix-re](packages/textlint-rule-kana-english-suffix-re)

> 原語の語尾が-reの場合は長音記号「ー」を付けない、原語の語尾が-ture,-sureの場合は原則として長音記号「ー」を付けるtextlintルール

### [@textlint-ja/textlint-rule-kana-english-suffix-ware](packages/textlint-rule-kana-english-suffix-ware)

> 原語の語尾が-ware, -wearの場合は、原則として「ウェア」とするtextlintルール。

### [@textlint-ja/textlint-rule-kana-english-suffix-y](packages/textlint-rule-kana-english-suffix-y)

> 原語の語尾が-yの場合は、カタカナを長音記号「ー」で表わすのを原則とするtextlintルール

### [@textlint-ja/textlint-rule-no-kana-english-v](packages/textlint-rule-no-kana-english-v)

> 原語が「v」の場合はカタカナに「ヴ」を使わないのが原則とするtextlintルール

## References

- [文化庁 | 国語施策・日本語教育 | 国語施策情報 | 内閣告示・内閣訓令 | 外来語の表記](https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/gairai/index.html)
- [JIS Z 8301:2011 規格票の様式及び作成方法](https://kikakurui.com/z8/Z8301-2011-01.html)
- [記者ハンドブック　第１３版](https://www.kyodo.co.jp/books/isbn/978-4-7641-0687-1/)
- [テクニカルコミュニケーター協会　> 標準規格](https://www.jtca.org/standardization/) 
  - [外来語（カタカナ）表記ガイドライン](https://www.jtca.org/standardization/katakana_guide_3_20171222.pdf)

## Changelog

See [Releases page](https://github.com/textlint-ja/textlint-rule-preset-foreign-language-writing/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-ja/textlint-rule-preset-foreign-language-writing/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
