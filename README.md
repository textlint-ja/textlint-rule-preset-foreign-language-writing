# @textlint-ja/textlint-rule-preset-foreign-language-writing [![Actions Status](https://github.com/textlint-ja/textlint-rule-preset-foreign-language-writing/workflows/test/badge.svg)](https://github.com/textlint-ja/textlint-rule-preset-foreign-language-writing/actions?query=workflow%3A"test")

外来語の書き方を扱うtextlintルールプリセット。

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @textlint-ja/textlint-rule-preset-foreign-language-writing

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "@textlint-ja/preset-foreign-language-writing": true
    }
}
```

Via CLI

```
textlint --rule @textlint-ja/preset-foreign-language-writing README.md
```

## References

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
