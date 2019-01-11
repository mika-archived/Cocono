# Cocono

様々な処理を挟み込むことが出来る Webhook リレー API


## What is Cocono

Cocono は、`_cocono` プロパティが含まれる Webhook リクエストに対し、指定された処理を行った後、再度リクエストを投げるリレー API です。  
`_cocono` プロパティを除いた全てのプロパティをリレーします。


## Quick Start

まずは、リレーを行いたい Webhook リクエストを用意します。

```javascript
{
  "username":"{{AuthorName}}",
  "avatar_url":"https://yt3.ggpht.com/a-/AAuE7mAjfhfYI_skOYS-upkXN5yM315sZ5WVsNlWSA=s288-mo-c-c0xffffffff-rj-k-no",
  "content": "**{{AuthorName}}** が **{{Title}}** をアップロードしました: {{Url}}",
}
```

上記リクエストに対し、次のような `_cocono` プロパティを追加します。  

```javascript {highlight:['5-20']}
{
  "username":"{{AuthorName}}",
  "avatar_url":"https://yt3.ggpht.com/a-/AAuE7mAjfhfYI_skOYS-upkXN5yM315sZ5WVsNlWSA=s288-mo-c-c0xffffffff-rj-k-no",
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
          { "ref": "_cocono.content.title" },
          "歌ってみた"
        ]
      }
    ]
  }
}
```

上記 JSON を Cocono へ POST することで処理が行われ、全ての処理が成功した場合のみ `relay_to` へとリクエストを送信します。  
試したい場合は、 https://cocono.mochizuki.moe へリクエストを投げることが出来ます。