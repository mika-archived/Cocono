# Cocono

Cocono は、フィルター処理などを行うことが出来る WebHook リレー API です。  
例えば、次のように使えます。

```
+-------+     +--------+     +---------+
| IFTTT +---->+ Cocono +---->+ Discord |
+-------+     +--------+     +---------+
```


## Request

Cocono は、基本的にはリクエストボディ内の `_cocono` プロパティ以外を全てリレーします。  
例えば、以下のリクエストの場合、

```json
{
  "username":"{{AuthorName}}",
  "avatar_url":"https://yt3.ggpht.com/a-/AAuE7mAjfhfYI_skOYS-upkXN5yM315sZ5WVsNlWSA=s288-mo-c-c0xffffffff-rj-k-no",
  "content": "**{{AuthorName}}** が **{{Title}}** をアップロードしました: {{Url}}",
  "_cocono": {
    "relay_to": "https://discordapp.com/api/webhooks/530254600469610496/M43cENQbAktFtVkuLLeGk1cyKq-G5n37qR9LC7Wxg_o3xgI6GPxMDEyl7X45iAtjhAjy",
    "content": {
      "title": "【寂しい】命に嫌われている。 歌ってみた【初音ミク/カンザキイオリ】"
    },
    "stacks": [
      {
        "type": "filter",
        "ops": "~=",
        "params": [
          {
            "ref": "_cocono.content.title"
          },
          "歌ってみた"
        ]
      }
    ]
  }
}
```

対象のサーバーには、 `_cocono` を除外した次の内容を POST します。

```json
{
  "username":"{{AuthorName}}",
  "avatar_url":"https://yt3.ggpht.com/a-/AAuE7mAjfhfYI_skOYS-upkXN5yM315sZ5WVsNlWSA=s288-mo-c-c0xffffffff-rj-k-no",
  "content": "**{{AuthorName}}** が **{{Title}}** をアップロードしました: {{Url}}"
}
```


## Property

`_cocono` は、次の構造を読み取ります。  
次のリクエストは、[ここあMusic](https://www.youtube.com/channel/UCCebk1_w5oiMUTRxdNJq0sA)チャンネルにアップロードされた動画の中から、歌ってみた動画のみを通知する例です。  

```json
{
  "username": "{{AuthorName}}",
  "avatar_url": "https://yt3.ggpht.com/a-/AAuE7mAjfhfYI_skOYS-upkXN5yM315sZ5WVsNlWSA=s288-mo-c-c0xffffffff-rj-k-no",
  "content": "**{{AuthorName}}** が **{{Title}}** をアップロードしました: {{Url}}",
  "_cocono": {
    "relay_to": "https://discordapp.com/api/webhooks/530254600469610496/M43cENQbAktFtVkuLLeGk1cyKq-G5n37qR9LC7Wxg_o3xgI6GPxMDEyl7X45iAtjhAjy",
    "content": {
      "title": "{{Title}}"
    },
    "stacks": [
      {
        "type": "filter",
        "ops": "~=",
        "params": [
          {
            "ref": "_cocono.content.title"
          },
          "歌ってみた"
        ]
      }
    ]
  }
}
```

Cocono は、 `stacks` の処理結果が全て `true` となった場合のみ、 `relay_to` へ通知を行います。  
上記の場合、[この投稿](https://www.youtube.com/watch?v=yOYEKiiFJCw)は通知されますが、[この投稿](https://www.youtube.com/watch?v=dLCAuYaHBsU)は通知されません。


### `root`

ルートプロパティとして、 `relay_to` および `stacks` のみを必須として持ちます。  
また、`stacks` からアクセスするための変数格納場所として、自由なプロパティを持たせることも可能です。


| Path       | Type      | Description          |
| ---------- | --------- | -------------------- |
| `relay_to` | `string`  | リレー先 WebHook URL |
| `stacks`   | `Stack[]` | 処理の流れ           |



### `stacks`

`params` プロパティでは、 `{ref: ""}` の形式で JSON の内容へアクセスすることが出来ます。  
例えば、 `username` を元に処理を行いたい場合は `{ref: "username"}` とすることで、 ``{{AuthorName}}`` が取得できます。

| Path           | Type                 | Description |
| -------------- | -------------------- | ----------- |
| `type`         | `"filter"`           | 処理タイプ  |
| `ops`          | `"==" | "!=" | "~="` | 処理内容    |
| `params`       | `string | object`    | パラメータ  |
| `params[].ref` | `string`             | JSON Path   |


## Example

実際に使用している設定です。

```
URL         : https://cocono.mochizuki.moe
Method      : POST
Content-Type: application/json
Body        :
{
  "username": "{{AuthorName}}",
  "avatar_url": "https://yt3.ggpht.com/a-/AAuE7mAjfhfYI_skOYS-upkXN5yM315sZ5WVsNlWSA=s288-mo-c-c0xffffffff-rj-k-no",
  "content": "**{{AuthorName}}** が **{{Title}}** をアップロードしました: {{Url}}",
  "_cocono": {
    "relay_to": "https://discordapp.com/api/webhooks/XXXXXXXXXX/XXXXXXXXXX",
    "content": {
      "title": "{{Title}}"
    },
    "stacks": [
      {
        "type": "filter",
        "ops": "~=",
        "params": [
          {
            "ref": "_cocono.content.title"
          },
          "歌ってみた"
        ]
      }
    ]
  }
}
```