```css
.button-group {
  border: 1px solid #999;

  display: flex;
  gap: 8px;
  padding: 16px;
}
```

**ポイント**

- **`gap` は `display: flex`(または `grid`)とセットで効きます**。`display: flex` を書かないまま `gap` だけ指定しても、何も起きません。
- **`gap` は「子要素どうしの隙間」**。両端(外枠との間)には効きません。そこを空けたいときは、この演習のように親側の `padding` を使います。
- **`padding` は枠線の内側の余白、`margin` は外側の余白**。ここで `margin` を使うと、外枠ごと動いてしまい、外枠とボタンの間は空きません。
- 昔は `margin-right: 8px` を子に付けて「最後の1つだけ打ち消す」という書き方をしていましたが、`gap` があると隙間の指定を1か所にまとめられます。
