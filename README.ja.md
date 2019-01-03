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
  "username":"YouTube Notifier",
  "avatar_url":"https://yt3.ggpht.com/a-/AAuE7mAjfhfYI_skOYS-upkXN5yM315sZ5WVsNlWSA=s288-mo-c-c0xffffffff-rj-k-no",
  "content":"**{{AuthorName}}** uploaded **{{Title}}** at {{CreatedAt}}: {{Url}}",
  "_cocono": {}
}
```

対象のサーバーには、 `_cocono` を除外した次の内容を POST します。

```json
{
  "username":"YouTube Notifier",
  "avatar_url":"https://yt3.ggpht.com/a-/AAuE7mAjfhfYI_skOYS-upkXN5yM315sZ5WVsNlWSA=s288-mo-c-c0xffffffff-rj-k-no",
  "content":"**{{AuthorName}}** uploaded **{{Title}}** at {{CreatedAt}}: {{Url}}"
}
```


## Property

`_cocono` は、次の構造を読み取ります。  
次のリクエストは、[ここあMusic](https://www.youtube.com/channel/UCCebk1_w5oiMUTRxdNJq0sA)チャンネルにアップロードされた動画の中から、歌ってみた動画のみを通知する例です。  

```json
{
  "relay_to": "https://discordapp.com/api/webhooks/.../...",
  "content": {
    "title": "{{Title}}"
  },
  "stacks": [
    {
      "type": "filter",
      "ops": "~=",
      "params": [
        "{{Title}}",
        "^【.*】.*歌ってみた【.*】$"
      ]
    }
  ]
}
```

Cocono は、 `stacks` の処理結果が全て `true` となった場合のみ、 `relay_to` へ通知を行います。  
上記の場合、[この投稿](https://www.youtube.com/watch?v=yOYEKiiFJCw)は通知されますが、[この投稿](https://www.youtube.com/watch?v=dLCAuYaHBsU)は通知されません。

