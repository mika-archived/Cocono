# About Stack

Cocono は、 `stacks` プロパティに含まれた各 Stack の処理結果が `true` となった場合、リクエストをリレーします。
Stack は必ず `true` もしくは `false` を返却し、一度 `false` が返却された場合、それ以降の Stack は実行されません。


## Parameters

各 Stack は、以下のプロパティを持ちます。

| Name     | Type     | Description      |
| -------- | -------- | ---------------- |
| `type`   | `string` | Stack ID         |
| `ops`    | `string` | Stack Operation  |
| `params` | `Array`  | Stack Parameters |

`ops` プロパティおよび `params` プロパティの値は、 `type` プロパティに指定した Stack の種類によって異なります。
`params` は文字列、ブール値、数値の他に、他のプロパティへの参照を持つことが出来ます。

他のプロパティへの参照を行う場合は、

```javascript
{ "ref": "path.to.property" }
```

とすることで、 `path.to.property` の値を参照することが可能です。


## Example

```javascript
{
  "stacks": [
    {
      "type": "filter",
      "ops": ">=",
      "params": [
        1,
        2
      ]
    }
  ]
}
```