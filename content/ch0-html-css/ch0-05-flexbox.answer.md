`<style>` の中を、次のように書き足します。

```css
.toolbar {
  border: 1px solid #999;
  padding: 12px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 600px) {
  .toolbar {
    flex-direction: column;
  }
}
```

**ポイント**

- **`display: flex` は「親」に指定する**。並べたい子(`<span>` と `<button>`)ではなく、それらを囲む `.toolbar` 側に書きます。
- **両端に寄せるのは `justify-content: space-between`**。「余った幅を要素の"間"に配る」という意味なので、子が2つなら左右の端に張り付きます。
- `align-items: center` は縦位置のそろえ。文字とボタンで高さが違うので、入れておくと見た目が落ち着きます(クリア条件には含まれないので、無くても構いません)。
- **`@media (max-width: 600px)` の中は、変えたい指定だけ書けば十分**。`display: flex` を書き直す必要はありません。上の指定がそのまま効いたまま、`flex-direction` だけが上書きされます。
- `flex-direction: column` にすると主軸が縦になるため、`justify-content` は縦方向のそろえに意味が変わります。横並びのときと同じ見え方にはならない点は、プレビューの幅を狭めて確かめてみてください。
