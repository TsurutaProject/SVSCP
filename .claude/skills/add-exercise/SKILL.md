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

演習をSandpackでの自動採点に対応させたい場合、以下のファイルを`content/{章フォルダ}/`に追加し、`src/lib/curriculum/grading.ts`の`GRADED_EXERCISES`にエントリを追加する(ch1-01〜ch1-16で実装済みの前例に従う)。

- `{exercise_id}.solution.ts` — 生徒がSandpack上で編集する雛形コード(白紙式。後述)
- `{exercise_id}.test.ts` — 隠しテストファイル(生徒には見せない、実行時の値を検証する)
- `{exercise_id}.typecheck.ts` — (型定義そのものが問われる演習のみ)サーバー側TypeScriptコンパイラによる型チェック用ファイル。存在しない演習は`loadTypeCheckSource()`が`null`を返し、実行時テストのみで採点される

### `.solution.ts`は「白紙式」にする

穴埋め式(あらかじめ関数シグネチャや`throw new Error("TODO")`を書いておく形)は、実行時テストが`typeof`での値の比較しかできない都合上、型定義そのものの正誤を検証できないという問題があった。そのため以下の方針で統一している。

- **関数名・型名(interface名・type名)は、テストファイルが`import`する名前と完全一致させ、固定する**。それ以外(関数のシグネチャ、引数・戻り値の型、実装の中身)はすべて生徒が書く
- 雛形は「何を実装すべきか」を1〜数行のコメントで示すだけにする(コード・型注釈は一切書かない)。例(`ch1-09-interface.solution.ts`):
  ```ts
  // name(文字列)、line(文字列)、isTerminal(真偽値)を持つ Station interfaceと、
  // それに沿ったオブジェクト station を実装してください。
  ```
- 総合演習(ch1-15など)のように必要なexport名が多い場合は、Part分けの見出しコメント+各項目の要点だけを箇条書きにする(コードそのものは書かない)
- **例外: 「与えられたコードのバグを見つけて直す」形式のレビュー演習(ch1-16)には適用しない**。この形式はバグ入りコードそのものが演習の要なので、白紙化すると演習が成立しなくなる。従来通りバグ入りコード+TODOコメントのままにする

### `.typecheck.ts`はどの演習に追加するか

**interfaceやunion typeなど、型定義そのものの正しさが問われる演習にだけ**追加する(例: ch1-07基本の型注釈、ch1-09interface、ch1-10union type、ch1-11optional、ch1-12ネストした型、ch1-14ユーティリティ型、ch1-15capstoneのPart B)。単純な関数の実装(引数・戻り値の実行時の値だけが問われる演習、例:ch1-02〜06, 08)には不要。

`.typecheck.ts`の書き方(`checkTypes()`が`{exercise_id}.solution.ts`と一緒にTSコンパイラへ渡す):

- **exportされた値**に対し、代入ベースの型アサーションで検証するのが基本形(interface名自体をexportしていなくても、構造的に検証できる)。
  ```ts
  import { station } from "./solution";
  const _name: string = station.name;
  const _isTerminal: boolean = station.isTerminal;
  ```
- **union type・リテラル型が`string`などに広げられていないか**(例: `type WeatherType = "sunny" | "cloudy" | "rainy"`が`string`になっていないか)は、代入ベースの検証だけでは検出できない(広い型は狭いリテラルを常に受け入れてしまうため)。正しい値を代入して型が通ることに加え、**含まれないはずの値を代入し、`@ts-expect-error`でそれがコンパイルエラーになることを検証する**こと。
  ```ts
  import type { WeatherType } from "./solution";
  const _sunny: WeatherType = "sunny"; // 正しい値は通る
  // @ts-expect-error - WeatherTypeに含まれない文字列は代入できないはず
  const _invalid: WeatherType = "snowy";
  ```
  型が正しく狭ければ`"snowy"`の代入がエラーになり`@ts-expect-error`が正しく機能する。型が`string`などに広げられていると`"snowy"`の代入はエラーにならず、`@ts-expect-error`が「未使用」エラーとして検出される。
  - **`@ts-expect-error`は直後の1行にしか効かない**。複数行のオブジェクトリテラルの途中にあるプロパティを狙う場合は、そのプロパティの行の直前に置くこと(オブジェクトリテラル全体の宣言行の上に置いても、実際のエラーはプロパティの行に出るため効かない)

### Reactコンポーネントの演習(2章以降)

`grading.ts`の登録時に`react: true`を付けると、拡張子が`.tsx`になり、Sandpackに`react`/`react-dom`の依存が渡される。用意するファイルは以下。

- `{exercise_id}.solution.tsx` — 白紙式の雛形(方針は上と同じ)
- `{exercise_id}.test.tsx` — 隠しテスト
- `{exercise_id}.preview.tsx` — プレビュー用エントリ(任意だが、Reactの演習では原則用意する)

**テストは`react-dom/server`の`renderToStaticMarkup`で「描画結果のHTML文字列」を検証すること。**

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { SelfIntroduction } from "./solution";

test("pタグを返している", () => {
  expect(renderToStaticMarkup(<SelfIntroduction />)).toContain("<p>");
});
```

- **Sandpackのテストランナーでは`react-dom`本体(DOM版)が使えない。** importするとテストがエラーも出さずハングする。React Testing Library・素の`ReactDOM.render`・`createRoot`・`environment`を`create-react-app`に差し替える方法まで一通り試したが、すべて同じ症状だった(React 17/18問わず)。使えるのは`react-dom/server`のみ
- そのため**クリック操作や状態変化を伴う演習は自動採点にできない**(CLAUDE.mdの「今後の拡張候補」参照)。対応できるのは「描画結果を見れば判定できる」演習だけ
- **`key`やイベントハンドラは描画後のHTMLに現れない。** これらを検証したい場合は、コンポーネントを直接呼び出して、返ってきたReact要素ツリーを辿って調べる(`element.key`、`element.props.onClick`を見る)。実例は`ch2-07-list-rendering-key.test.tsx`・`ch2-11-review-practice.test.tsx`を参照。ただしフックを使うコンポーネントは直接呼ぶと落ちるので、その場合は使えない
- **`test-ts`テンプレートに最初から入っている`/add.test.ts`を必ず上書きすること。** 放置するとテンプレート付属のテスト(add関数のテスト)まで実行され、PASS件数に混入する。`.test.tsx`を使う場合は`/add.test.ts`を`export {};`で潰す

### プレビュー(`{exercise_id}.preview.tsx`)

生徒が書いたコンポーネントの見た目を、エディタの隣でリアルタイムに確認できるようにするためのエントリ。描画するコンポーネント名や渡すpropsは演習ごとに違うため、共通のエントリでは書けず、演習ごとに用意する。

```tsx
import { createRoot } from "react-dom/client";
import { SelfIntroduction } from "./solution";

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(<SelfIntroduction />);
}
```

- **プレビューは通常のブラウザ描画なので`react-dom`を使ってよい**(使えないのはテストランナーの中だけ)
- propsを取る演習では、代表的な値を何パターンか並べて描画すると、条件分岐やリスト表示が意図通りか目で確認できる(`ch2-06`の実例を参照)
- このファイルが存在する場合だけ`SandpackPreview`が表示され、バンドラーのエントリが`/index.tsx`に切り替わる。HTML側(`#root`を持つ`/index.html`)は`SandpackGrader`が自動で用意する
- 未実装の状態ではプレビューに「Element type is invalid」等の英語のエラーが出る。これは想定内(実装が進むと消える)

### Sandpackまわりの注意点(実装時に判明した仕様)

- **これらのファイルは、Next.jsプロジェクト自身の型チェック・lint対象から除外すること**。`tsconfig.json`・`eslint.config.mjs`の除外設定(`content/**/*.solution.{ts,tsx}`・`.test.{ts,tsx}`・`.typecheck.{ts,tsx}`・`.preview.tsx`)に新しいパターンが含まれているか確認する
- **`test-ts`テンプレートのテストランナーは、`customSetup.entry`を無視し、常に`/add.test.ts`という固定の仮想パスを実行対象として探す**(ドキュメント化されていない挙動)。実ファイル名は`{exercise_id}.test.ts`のままでよいが、Sandpackに渡す際は`/add.test.ts`という固定パスにマッピングする処理を通すこと。詳細は`src/lib/curriculum/grading.ts`の実装を参照
- **`SandpackTests`の`initMode`は、既定値`"lazy"`のままだとPreview非表示構成で発火しないことがある**。`initMode: "immediate"`を明示すること
- **生徒が今編集中のコードは`useSandpack()`の`sandpack.files[...].code`ではなく`useActiveCode()`で取得すること**。前者はキーストロークのたびには更新されず、古い(初期テンプレートの)内容を保持し続けることがあり、サーバーに送信すると常に「exportが存在しないファイル」というエラーになる
- **`SandpackTests`の`onComplete`は、渡すコールバックを再レンダーのたびに差し替えても、内部で古い参照(古いクロージャ)を呼び続けることがある**。そのため送信ガード(二重送信防止)を`status`のようなpropsやクロージャ経由の値で行うと機能しないことがある。`useRef`で状態を持ち、古いクロージャから呼ばれても正しく参照できるようにすること(`src/components/SandpackGrader.tsx`の`submittedRef`を参照)
- **生のJest出力(テストコードの中身・スタックトレース・PASS/FAIL件数のサマリー行)は演習の答えが透けて見えるため、画面には出さないこと**。`SandpackTests`の`hideTestsAndSupressLogs`propは個別テストの詳細しか隠せず、ヘッダーやサマリー行は隠せないため、`<div style={{ display: "none" }}>`で丸ごと囲んで完全に非表示にし、代わりに自前の簡易メッセージを表示する
- テスト失敗時(未着手・実装途中いずれも)は「まだテストが通っていません。実装を見直してみましょう。」という汎用メッセージのみ表示し、一度実行時テストがPASSした後にサーバー側の型チェックで落ちた場合だけ、具体的な型エラーメッセージを表示する(こちらは学習上有益なため区別している)
- **`onComplete`コールバックはレンダー中に呼ばれるため、直接`setState`するとReactの警告が出る**。`setTimeout`で1ティックずらしてから状態を更新すること
- テスト合格(型チェックがある演習は型チェックも合格)を検知したら、`submitGradedExercise`(Server Action)を呼び出し、`status: "cleared"`として自動記録する。手動でのステータス切り替えUIと共存させてよい(自動採点に対応してない演習は、引き続き手動切り替えのままでよい)

### 開発中の動作確認について

- `SandpackTests`は実は`https://{version}-sandpack.codesandbox.io/`という外部(CodeSandbox社ホスティング)のiframeの中でテストを実行している。このため`SandpackGrader.tsx`やコンテンツを編集した際、通常のリロードでは変更が反映されず、ハードリロード(Cmd+Shift+R)が必要になることがある(Fast Refreshとこの外部iframeの組み合わせによる開発時特有の制限で、本番には影響しない)
- **稼働中の`next dev`サーバーと同じプロジェクトディレクトリで`npm run build`(本番ビルド)を実行しないこと**。`.next`ディレクトリを共有しているため、本番ビルドが`.next`を本番用の構造で上書きし、動いている`next dev`が500エラーを返すようになる(実際にこれで開発サーバーを壊した事例あり)。動作確認は`npx tsc --noEmit`・`npm run lint`で十分であり、ブラウザでの実機確認は稼働中の`next dev`にそのまま接続して行うこと
