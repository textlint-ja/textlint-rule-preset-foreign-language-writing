# @textlint-ja/textlint-rule-kana-english-suffix-re

- 原語の語尾が-reの場合は、原則として長音記号「ー」を付けないのが原則です
- 原語の語尾が-ture,-sureの場合は、原則として長音記号「ー」を付けるのが原則です

**OK**:

```
ファームウェア(firmware)
フリーウェア(freeware)
グループウェア(groupware)
ハードウェア(hardware)
ピュア(pure)
リタイア(retire)
スコア(score)
サファイア(sapphire)
シビア(severe)
シェア(share)
ソフトウェア(software)
... -ture, -sure
アドベンチャー(adventure)
アーキテクチャー(architecture)
カルチャー(culture)
ディスクロージャー(disclosure)
フィーチャー(feature)
ファニチャー(furniture)
ジェスチャー(gesture)
インフラストラクチャー(infrastructure)
レクチャー(lecture)
レジャー(leisure)
マニュファクチャー(manufacture)
ネイチャー(nature)
ピクチャー(picture)
プレッシャー(pressure)
シグネチャー(signature)
ストラクチャー(structure)
テクスチャー(texture)
ミニチュアは例外
```

**NG**:

```
フリーウェアー(freeware)
スクエアー(square)
ストアー(store)
カルチャ(culture)
プレッシャ(pressure)
```

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @textlint-ja/textlint-rule-kana-english-suffix-re

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "@textlint-ja/kana-english-suffix-re": true
    }
}
```

Via CLI

```
textlint --rule @textlint-ja/kana-english-suffix-re README.md
```

## Options

```ts
{
    /**
     * 許可する単語を指定できます
     */
    allows?: string[];
    /**
     * 慣用的に例外として扱われる単語も不許可にするかどうか
     * デフォルト: false
     */
    disableBuiltinAllows: boolean;
}
```

Example:

```json
{
    "rules": {
        "@textlint-ja/kana-english-suffix-re": {
            "allows": ["フリーウェア"],
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
