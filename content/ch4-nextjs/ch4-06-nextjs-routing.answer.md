**答え:`src/app/profile/page.tsx`**

```ts
const routes: Record<string, string> = {
  "/": "src/app/page.tsx",
  "/login": "src/app/login/page.tsx",
  "/exercises/[exerciseId]": "src/app/exercises/[exerciseId]/page.tsx",
  "/profile": "src/app/profile/page.tsx",
};
```

実際のファイルの中身はこうなります。

```tsx
export default function ProfilePageTest() {
  return <h1>プロフィールページ(テスト)</h1>;
}
```

**ポイント**

- **App Routerでは「フォルダ構成がそのままURL」**になります。ルーティングの設定ファイルを書く必要はなく、`src/app/profile/` というフォルダを作れば `/profile` になります。
- **ページになるのは `page.tsx` という名前のファイルだけ**です。同じフォルダに `profile.tsx` や `index.tsx` を置いてもページにはなりません。`layout.tsx` や `route.ts` など、他の名前にはそれぞれ別の役割が決まっています。
- **`export default` が必須**です。名前付きexportだけだと、Next.jsがページの本体を見つけられません。関数名(`ProfilePageTest`)自体は何でも構いません。
- **`[exerciseId]` のような角かっこは動的セグメント**で、URLの一部を値として受け取る書き方です。`/exercises/ch1-01` のようなURLがすべてこの1ファイルで処理されます。
