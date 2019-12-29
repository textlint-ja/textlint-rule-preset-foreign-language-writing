# @textlint-ja/textlint-rule-kana-english-fo-pho

原語が「fo」または「pho」の場合は、カタカナでは「フォ」とするのを原則とするtextlintルール。

**OK**:

```
インフォ(info)
インフォメーション(information)
フォーム(form)
フォント(font)
ハイホン(hyphon)
フォロー(follow)
アイフォン(iPhone)
フォト(photo)
フォトグラファー(photology)
フォビア(phobia)
プラットホーム(platform)は例外で、プラットフォームでもいい
ホーム(homu)は例外、フォームと区別できない
テレホン(telephone)は例外
イヤホン(earphone)は例外
メガホン(megaphon)は例外
```

**NG**:

```
インホメーションは-fo-なのでフォを使う
パホーマンスは-fo-なのでフォを使う
```

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @textlint-ja/textlint-rule-kana-english-fo-pho

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "@textlint-ja/kana-english-fo-pho": true
    }
}
```

Via CLI

```
textlint --rule @textlint-ja/kana-english-fo-pho README.md
```

## Options

```ts
{
    /**
     * 許可する単語を指定できます
     */
    allows?: string[];
    /**
     * 慣用的に例外とされる単語も不許可にするかどうか
     * デフォルト: false
     */
    disableBuiltinAllows: boolean;
}
```

Example:

```json
{
    "rules": {
        "@textlint-ja/kana-english-fo-pho": {
            "allows": ["イヤフォン"],
            "disableDefaultAllows": true
        }
    }
}
```

## References

- [テクニカルコミュニケーター協会　> 標準規格](https://www.jtca.org/standardization/) 
- [「スマートホン」か「スマートフォン」か｜NHK放送文化研究所](https://www.nhk.or.jp/bunken/research/kotoba/20161001_1.html)

## Changelog

See [Releases page](https://github.com/textlint-ja/textlint-rule-preset-foreign-language-writing/releases).

## Running tests

Install devDependencies and Run `npm test`:

    yarn install && yarn test

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
