---
name: add-exercise
description: 新しい章・演習(exercise)をこの学習プラットフォームに追加する時の手順。MDXコンテンツファイルの作成、exercise_idの命名規則、進捗ボードへの反映方法をまとめている。「演習を追加して」「新しい章を作って」「exercise_idを決めて」といった依頼があれば必ずこのSkillに従うこと。手動でMDXファイルだけ作ってDB側の対応を忘れるとバグの元になるため、演習追加は必ずこの手順を通す。
---

# 演習(exercise)の追加手順

このプラットフォームでは、教材コンテンツ(MDX)とDB(進捗管理)が `exercise_id` という文字列で緩く紐づいている。DBに外部キー制約はないため、**手順を守らないと静かにズレる**。必ず以下の順番で作業すること。

## 1. exercise_id を決める

命名規則: `ch{章番号}-{2桁連番}-{英語kebab-caseの短い名前}`

- 章番号は 0〜4(0=HTML/CSS, 1=JS+TS基礎, 2=React基礎, 3=実践編, 4=非同期+Next.js)
- 連番は章内での通し番号、2桁ゼロ埋め(01, 02, ...)
- 名前は英語で内容が一目でわかる短いkebab-case

例: `ch2-05-use-effect-cleanup`

決める前に `content/` 配下の既存ファイルを確認し、番号の重複や欠番がないかチェックすること。

## 2. MDXファイルを作成する

`content/ch{章番号}-{章の英語名}/` 配下に `{exercise_id}.mdx` を作成する。

フロントマターに以下を含める:

```yaml
---
exercise_id: "ch2-05-use-effect-cleanup"
title: "useEffectのクリーンアップ関数"
order: 5
---
```

`exercise_id` はファイル名と完全一致させること(ズレていないか作成後に必ず確認)。

## 3. 章の一覧(目次)ファイルを更新する

`content/{章フォルダ}/_index.ts` (章ごとの演習一覧を定義しているファイル)に、新しい演習を配列に追加する。この一覧が進捗ボードの表示順・章の目次に使われる。

型は `src/lib/curriculum/types.ts` の `ExerciseMeta` に従うこと。ここでの `id` フィールドが exercise_id と一致していないと、進捗ボード側で「未登録の演習」として扱われるので要注意。

## 4. 進捗ボード側の対応を確認する

`exercise_progress` テーブル自体にはスキーマ変更は不要(exercise_idはtext型で自由に追加できる)。ただし以下を確認すること:

- `src/lib/curriculum/allExerciseIds.ts` のようなマスターリスト(存在する場合)に新しいidを追加したか
- 章全体の進捗率を計算しているロジックがあれば、そこが新しい演習数を正しくカウントするか

## 5. 動作確認

- MDXが正しくレンダリングされるか(ローカルで該当ページを開く)
- 進捗ボードに新しい演習が「未着手」状態で表示されるか
- 章の合計演習数(進捗率の分母)が正しく更新されているか

## よくあるミス

- MDXのfrontmatterと目次ファイルでexercise_idの綴りが微妙に違う(タイポ)
- 連番を既存の演習と重複させてしまう
- 目次ファイルへの追加を忘れて、コンテンツはあるのに進捗ボードに出てこない

## 6. (任意)自動採点に対応させる場合

演習をSandpackでの自動採点に対応させたい場合、以下2ファイルを`content/{章フォルダ}/`に追加する(ch1-01-arrow-functionで実装済みの前例に従う)。

- `{exercise_id}.solution.ts` — 生徒がSandpack上で編集する雛形コード
- `{exercise_id}.test.ts` — 隠しテストファイル(生徒には見せない、正誤判定用)

### 注意点(ch1-01実装時に判明した仕様)

- **これら2ファイルは、Next.jsプロジェクト自身の型チェック・lint対象から除外すること**。`tsconfig.json`・`eslint.config.mjs`の除外設定を確認し、新しい演習を追加するたびに対象パターンに含まれているか確認する(個別追加が必要な設定になっていないか要注意)
- **`test-ts`テンプレートのテストランナーは、`customSetup.entry`を無視し、常に`/add.test.ts`という固定の仮想パスを実行対象として探す**(ドキュメント化されていない挙動)。実ファイル名は`{exercise_id}.test.ts`のままでよいが、Sandpackに渡す際は`/add.test.ts`という固定パスにマッピングする処理を通すこと。詳細は`src/lib/curriculum/grading.ts`の実装を参照
- **`SandpackTests`の`initMode`は、既定値`"lazy"`のままだとPreview非表示構成で発火しないことがある**。`initMode: "immediate"`を明示すること
- **`onComplete`コールバックはレンダー中に呼ばれるため、直接`setState`するとReactの警告が出る**。`setTimeout`で1ティックずらしてから状態を更新すること(`src/components/SandpackGrader.tsx`に実装例あり)
- テスト合格を検知したら、既存の`updateExerciseStatus`(Server Action)を呼び出し、`status: "cleared"`として自動記録する。手動でのステータス切り替えUIと共存させてよい(自動採点に対応してない演習は、引き続き手動切り替えのままでよい)
