Bingo -仮名-
====

ビンゴ的な何か（後でちゃんと書く）

## Description

ビンゴのUI/形式を使って、なんか新しいことがやれるアプリ（後でちゃんと書く）

## Environment

以下の手順で開発環境を構築できる

### Requirement

以下がインストールされていることを前提とします

- nodejs v10
- npm
- firebase-cli (npm module)

### Procedure

```
$ git clone git@github.com:hiromitsusasaki/bingo_web.git
$ cd bingo_web
$ cd functions
$ npm intall
```

### Operation

####  開発時

SPAとしてローカルで起動

`bingo_web/functions/`
```
$ cd functions
$ NODE_ENV=development node nuxt-server.js
```
#### デプロイ前の動作確認

SSRとしてローカルで起動

`bingo_web/`
```
firebase serve --only functions:nuxtServer,hosting
```

#### デプロイ

`bongo_web/`
```
firebase deploy --only functions:nuxtServer,hosting
```

後でStaginｇとProdutionに環境を分ける