```css
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.icon {
  display: inline-block;
  font-size: 40px;

  animation: bounce 500ms ease-in-out;
}
```

**ポイント**

- **`@keyframes` は「動きの定義」だけ**で、単独では何も起きません。`animation` プロパティで要素に結び付けて、はじめて動きます。
- **`%` は時間の割合**。500msのアニメーションなら、`50%` は開始から250ms時点、という意味です。
- **`translateY` はマイナスが上方向**。画面のY座標は下向きが正なので、上に動かしたいときは `-10px` になります。
- **`0%` と `100%` を同じ値にすると、元の位置に戻って終わります**。これを省くと、終わった瞬間に元の位置へ瞬間移動して見えます。
- **`ease-in-out` は「ゆっくり始まってゆっくり終わる」**という速度の付け方。`linear`(等速)に変えると、機械的な動きになるのが分かります。
- 一度しか動かないので見逃しやすいですが、`animation` の最後に `infinite` を足すと繰り返します。
