# プロジェクト概要

算数ゲーム開発チーム(4人)向けの、TypeScript/React/Next.js学習プラットフォーム。
教材(読み物+演習)を進めながら、進捗・週次ゴール・詰まりポイントのメモをチームで共有する。

将来的に他チーム/知人にもテンプレとして展開できる設計にしてある(詳細は below の「設計上の前提」)。

## 技術構成

- Next.js (App Router) + TypeScript
- Supabase (Postgres + Auth + RLS)
- Vercel デプロイ
- 教材コンテンツは MDX ファイルとして `content/` 配下に置く(DBには入れない)

## 設計上の前提(コード外との整合性ルール)

これが一番大事なので必ず守ること。破ると教材とDBの対応がズレて進捗が正しく表示されなくなる。

1. **`exercise_id` は教材コンテンツのslugと完全一致させる**
   - 例: `content/ch1/02-arrow-function.mdx` → `exercise_id = "ch1-02-arrow-function"`
   - 命名規則: `ch{章番号}-{2桁の連番}-{英語kebab-caseの短い名前}`
   - 新しい演習を追加する時は `.claude/skills/add-exercise/SKILL.md` の手順に従うこと
2. **`teams` テーブルは複数チーム対応を見据えた設計**。今は1チームしか使わないが、決め打ちのコードを書かない(「チームは常に1つ」という前提のコードを書くと将来の拡張で壊れる)
3. **DBスキーマの変更は必ずマイグレーションファイルとして残す**。Supabase管理画面から直接テーブルをいじらない。手順は `.claude/skills/supabase-migration/SKILL.md` を参照
4. **章・演習の文章そのものはDBに保存しない**。動きのあるデータ(進捗ステータス、メモ、マイルストーン)だけがDB対象

## ディレクトリ構成(予定)

```
.
├── content/           # 教材本文(MDX)。章ごとにフォルダ分け
│   ├── ch0-html-css/
│   ├── ch1-js-ts/
│   ├── ch2-react/
│   ├── ch3-practice/
│   └── ch4-nextjs/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/
│   └── lib/
│       └── supabase/  # クライアント初期化、型定義
├── supabase/
│   └── migrations/    # マイグレーションファイル(必須)
└── .claude/
    └── skills/
```

## コーディング規約

- コンポーネントは1ファイル1コンポーネント、`PascalCase.tsx`
- Supabaseへのクエリは `src/lib/supabase/queries/` に集約し、コンポーネント内で直接クエリを書かない
- 型は極力Supabaseの型生成(`supabase gen types`)を使い、手書きのDB型を重複させない

## やらないこと

- 認証は Supabase Auth の標準機能で十分。自前のパスワードハッシュ化などは実装しない
- チーム作成・招待UIは今回のスコープ外(テーブル設計だけ将来対応、機能は作らない)

## 今後の拡張候補(優先度低)

- 2章の残り6問(ch2-03, 04, 05, 08, 09, 10:イベントハンドリング、useState、useRef、useEffect、イベントの型、総合演習)、3〜4章、ch0への自動採点の展開
  - これらはコンポーネントのクリック操作や状態変化の検証が必要なため、react-dom/server(renderToStaticMarkup)による「静的な描画結果の比較」だけでは対応できない
  - Sandpackのテスト環境でreact-dom(DOM版)やReact Testing Libraryを使うと、テストがエラーも出さずハングする制約を確認済み(React 17/18問わず、create-react-appテンプレートに差し替えても再現)
  - 対応する場合、Web Worker + jsdomのような独自の実行基盤への切り替えが必要になる可能性が高い(工数大)
- 今回の教材制作(ch0〜4章、53演習+1章自動採点フル対応+2章一部自動採点)は、これで夏休み分の区切りとする
