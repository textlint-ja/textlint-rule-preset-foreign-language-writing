# @textlint-ja/textlint-rule-no-kana-english-v

原語が「v」の場合はカタカナに「ヴ」を使わないのが原則とするtextlintルールです。

「ヴ[子音]」の代わりに「バ」「ビ」「ブ」「ベ」「ボ」のどれかを利用してください。

**OK**:

```
アベレージ(average)
イベント(event)
バニラ(vanilla)
ボランティア(volunteer)
```

**NG**:

```
イヴェントは-v-なので「ベ」を使う
```

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @textlint-ja/textlint-rule-no-kana-english-v

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "@textlint-ja/no-kana-english-v": true
    }
}
```

Via CLI

```
textlint --rule @textlint-ja/no-kana-english-v README.md
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
        "@textlint-ja/no-kana-english-v": {
            "allows": ["ヴィデオ"],
            "disableDefaultAllows": true
        }
    }
}
```

## References

- [国名表記「ヴ」消える　変更法案、衆院で可決　　:日本経済新聞](https://www.nikkei.com/article/DGXMZO42662930Z10C19A3PP8000/)

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
