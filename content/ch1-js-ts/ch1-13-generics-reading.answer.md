答えは **`ToppingKind | null`** です。

```tsx
const [selectedTopping, setSelectedTopping] = useState<ToppingKind | null>(null);
```

**なぜ `ToppingKind` だけではだめか**

この状態に入りうる値は2種類あります。

1. 選択中のトッピング(`"いちご"` など = `ToppingKind`)
2. まだ何も選んでいない状態(`null`)

`useState<ToppingKind>(null)` と書くと、`null` は `ToppingKind` のどれでもないので、**初期値の時点で型エラー**になります。「入りうる値をすべて `|` でつなぐ」のがunion typeなので、`ToppingKind | null` が正解です。

**ポイント**

- **`<>` に書くのは「この状態に入りうる値の型」**。今の値の型ではなく、これから入る可能性のあるものすべてを考えます。
- **初期値が `null` や `[]` のときは `<>` の明示がほぼ必須**。`useState(null)` とだけ書くと、TypeScriptは「`null` しか入らない型」と推論してしまい、あとから `setSelectedTopping("いちご")` がエラーになります。
- 逆に `useState(0)` のように**初期値だけで型が決まる場合は `<>` を省略できます**。省略できるかどうかは「初期値だけ見て、入りうる値が分かるか」で判断できます。
- 読み出す側では `selectedTopping ?? "まだ選んでいません"` のように、`null` の場合を必ず扱うことになります。型が `null` の可能性を持っている以上、TypeScriptがその考慮を促してくれる、というのがunion typeの効きどころです。
