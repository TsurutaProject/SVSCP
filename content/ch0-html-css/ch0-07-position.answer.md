```css
.card {
  width: 240px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ccc;

  position: relative;
}

.badge {
  background: #ef6c00;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;

  position: absolute;
  top: 8px;
  right: 8px;
}
```

**ポイント**

- **`position: absolute` の基準になるのは「いちばん近い、`position` が `static` 以外の親」**です。親に何も指定しないと、基準がページ全体まで飛んでいってしまい、カードの外に表示されます。
- **親の `position: relative` は「基準になるよ」という宣言だけ**で、それ自体は見た目を1ミリも変えません。`top` などを付けない限り、その要素は動きません。
- **`top` / `right` は「基準の上端・右端からの距離」**。右上に置きたいので `top` と `right` を組み合わせます。
- **`absolute` にした要素は、通常の並びから抜けます**。バッジは `<p>` より前に書いてありますが、浮いているので後ろのテキストの位置には影響しません。
- 親の `position: relative` を消すとどうなるか、実際に試してみると仕組みが掴めます。
