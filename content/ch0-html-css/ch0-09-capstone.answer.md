`<style>` の中を、次のように書き足します。ch0で学んだ5つの内容が、そのまま5つのブロックに対応しています。

```css
/* 1. CSS変数(0-2) */
:root {
  --card-bg: rgba(255, 255, 255, 0.88);
  --card-border: rgba(112, 83, 70, 0.14);
  --accent-color: #ef6c00;
}

/* 2. 全体のレイアウト(0-5) */
.score-board {
  display: flex;
  gap: 10px;
}

/* 3. カードの見た目(0-3, 0-4) */
.score-card {
  padding: 10px 12px;
  min-width: 96px;
  border: 2px solid var(--card-border);
  border-radius: 8px;
  background: var(--card-bg);
  box-shadow: 0 12px 24px rgba(80, 48, 32, 0.08);

  /* 4. バッジの基準になる(0-7) */
  position: relative;
}

/* 4. バッジをカードの右下に重ねる(0-7) */
.combo-badge {
  position: absolute;
  right: 9px;
  bottom: 9px;

  background: var(--accent-color);
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;

  /* 5. 弾む動き(0-8) */
  animation: combo-pop 500ms ease-in-out;
}

/* 5. アニメーションの定義(0-8) */
@keyframes combo-pop {
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
```

**ポイント**

- **`position: relative` は `.score-board` ではなく `.score-card` に付けます**。バッジを重ねたいのは「ボード全体の右下」ではなく「カードごとの右下」だからです。基準にしたい親がどれかを考えて決めます。
- **CSS変数は使う側が `var()` で読むだけ**。`.score-card` の `background: var(--card-bg)` のように、値を直接書かずに変数名で参照しておくと、あとから配色をまとめて変えられます。
- **`min-width` は「これより狭くならない」**という下限。カードごとに文字数が違っても、幅が揃って見えます。
- **バッジは `position: absolute` で通常の並びから抜けている**ので、HTML上は `<p>スコア</p>` より前に書いてありますが、テキストの位置は押し出されません。
- アニメーションはページを開いた瞬間に1回だけ動きます。見逃したときは、プレビューの再読み込みか、`animation` の最後に `infinite` を足して確かめてください。
