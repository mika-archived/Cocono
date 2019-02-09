# Hosting

Cocono は AWS アカウントがあれば、誰でも自身でホストすることが可能です。


## Requirements

* AWS CLI
* Node.js 8.12.x ~ 
* Yarn 1.12.x ~ 

AWS CLI でのアカウント設定は済んでいるものとします。


## Deployment

初めに、 `mika-f/Cocono` リポジトリをクローンします。

```bash
$ git clone https://github.com/mika-f/Cocono.git
$ cd ./Cocono
```

次に、アプリケーション本体、ドキュメントと CloudFormation テンプレートを生成します。

```bash
$ yarn install
$ yarn run build:app
$ yarn run build:docs
$ yarn run build:cdk
```

最後に、デプロイを行います。

```bash
$ yarn run cdk deploy
```

これによって、自身のアカウントで Cocono をホストすることが可能です。  
コンソールに出力された `https://..../v1/` が、 Cocono の URL です。