**コード例1:バッジがカードの右上に来ない**

`.badge` に `position: absolute` はあるのに、親の `.card` に `position` が無いのが原因です。`absolute` は「いちばん近い、`position` が `static` 以外の親」を基準にするため、基準がカードよりずっと上の階層まで飛んでいってしまいます。

```css
.card {
  position: relative;   /* これを足す */
  padding: 16px;
  border: 1px solid #ccc;
}
```

---

**コード例2:`z-index` が効かない**

`z-index` は、**`position` が `static` 以外の要素にしか効きません**。`.tooltip` は `position` が未指定(既定の `static`)なので、`z-index: 100` は完全に無視され、重なり順はHTMLの記述順のままになります。

```css
.tooltip {
  position: relative;   /* これを足すと z-index が効くようになる */
  z-index: 100;
  background: black;
  color: white;
}
```

---

**コード例3:`margin` と `gap` の使い分け**

エラーにはなりませんが、`margin: 12px` はボタンの**外周すべて**に付くので、ボタン同士の間だけでなく、`.button-row` の内側の左右にも余白ができてしまいます。「間隔だけ空けたい」なら `gap` が適切です。

```css
.button-row {
  display: flex;
  gap: 12px;
}

.button {
  /* margin は不要 */
}
```

---

**ポイント**

この3つに共通するのは、**CSSはエラーを出さずに静かに意図と違う結果になる**という点です。JS/TSならコンパイラが教えてくれる種類の間違いも、CSSでは「なぜか効かない」という形でしか現れません。書いたら画面を見て、思った通りになっているかを必ず目で確かめる習慣が効いてきます。
