---
name: supabase-migration
description: SupabaseのDBスキーマを変更する際の手順とルール。テーブル追加・カラム変更・RLSポリシー変更など、DB構造に関わる依頼があれば必ずこのSkillに従う。Supabase管理画面から直接テーブルを操作することを禁止し、必ずマイグレーションファイルとして残すためのルールをまとめている。「テーブルを追加して」「カラムを足して」「RLSを直して」といった依頼で使うこと。
---

# Supabaseマイグレーションの手順

このプロジェクトでは、DBスキーマの変更は必ずマイグレーションファイルとして `supabase/migrations/` に残す。管理画面(Supabase Studio)から直接テーブルをいじる変更は禁止。理由: 4人チームで同じDBを共有しているため、誰かが手動で変更すると他の人のローカル環境・型定義とズレる。

## 手順

### 1. 既存スキーマを確認する

`supabase/migrations/` 配下のファイルを日付順に読み、現在のテーブル構造・RLSポリシーを把握する。特に `teams`, `team_members`, `exercise_progress`, `milestones`, `exercise_notes` の5テーブルの関係性は前提知識として必須(README または最初のマイグレーションファイルにコメントで説明がある想定)。

### 2. マイグレーションファイルを作成する

```bash
supabase migration new <変更内容がわかる英語名>
# 例: supabase migration new add_exercise_notes_reactions
```

ファイル名は自動でタイムスタンプが付与される。中身は素のSQL。

### 3. 変更を書く

- テーブル追加・カラム追加: `create table` / `alter table ... add column`
- **RLSポリシーは必ずセットで書く**。新しいテーブルを追加する場合、`enable row level security` と最低限の select/insert ポリシーを同じマイグレーションファイル内に含めること。ポリシーなしでテーブルだけ追加すると、デフォルトで全アクセス拒否になりアプリが動かなくなる
- 既存テーブルのポリシーを変更する場合は `drop policy` してから `create policy` し直す(同名ポリシーの重複作成はエラーになる)

### 4. ローカルで検証する

```bash
supabase db reset  # ローカルDBをマイグレーション全適用でリセット
```

エラーが出ないこと、既存のシードデータ(あれば)が壊れないことを確認する。

### 5. 型定義を再生成する

```bash
supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

CLAUDE.mdのルールにある通り、手書きのDB型と重複させないため、変更後は必ずこのコマンドで型を更新し、コンパイルエラーが出ないか確認する。

### 6. 本番への適用

Vercelへのデプロイ前に、本番のSupabaseプロジェクトに対してマイグレーションを適用する:

```bash
supabase link --project-ref <本番プロジェクトref>
supabase db push
```

**本番DBへの適用は必ずチームに一声かけてから実行する**(他のメンバーが同時に別の変更をしていないか確認するため)。

## チェックリスト(マイグレーション作成のたびに確認)

- [ ] 新しいテーブルにRLSを有効化したか
- [ ] select/insert(必要ならupdate/delete)のポリシーを書いたか
- [ ] `exercise_id` を含むテーブルの場合、text型で自由入力にしているか(MDXのslugとの緩い参照を維持するため、外部キー制約はつけない)
- [ ] `supabase db reset` でエラーが出ないか確認したか
- [ ] 型定義を再生成したか
