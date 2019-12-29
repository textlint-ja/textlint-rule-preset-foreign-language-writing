# @textlint-ja/textlint-rule-kana-english-suffix-y

原語の語尾が-yの場合は、カタカナを長音記号「ー」で表わすのを原則とするtextlintルール。

**OK**:

```
アクセサリーはOK
エネルギーはOK
アイデンティティーはOK
メロディーはOK
パーティーはOK
メモリーはOK
サンクチュアリは例外
アムネスティは例外
```

**NG**:

```
メモリは-yなので長音
パーティは-yなので長音
```

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @textlint-ja/textlint-rule-kana-english-suffix-y

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "@textlint-ja/kana-english-suffix-y": true
    }
}
```

Via CLI

```
textlint --rule @textlint-ja/kana-english-suffix-y README.md
```

## Options

```ts
{
    /**
     * 許可する単語を指定できます
     */
    allows?: string[];
    /**
     * 慣用的に長音が省略される単語も不許可にするかどうか
     * デフォルト: false
     */
    disableBuiltinAllows: boolean;
}
```

Example:

```json
{
    "rules": {
        "@textlint-ja/kana-english-suffix-y": {
            "allows": ["エディタ"],
            "disableDefaultAllows": true
        }
    }
}
```

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
