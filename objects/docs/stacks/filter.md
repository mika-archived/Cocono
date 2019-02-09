# Filter Stack

filter stack は、与えられたパラメータを元に、 `true` もしくは `false` を返却します。


## Parameters

| Name     | Type                   | Description |
| -------- | ---------------------- | ----------- |
| `type`   | `filter`               |             |
| `ops`    | `"==" \| "!=" \| "~="` | Operator    |
| `params` | `Array`                | Parameters  |


### `ops` property

#### `==` operator

`params[0]` と `params[1]` が一致するかどうかを評価します。


#### `!=` operator

`params[0]` と `params[1]` が一致しないどうかを評価します。


#### `~=` operator

`params[0]` に対して、正規表現 `params[1]` が成功するかどうかを評価します。


## Example

`_cocono.content.title` に「歌ってみた」が含まれていれば `true` になります。

```javascript
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
```