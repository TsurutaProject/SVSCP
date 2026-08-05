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

### 「クリア条件」は演習ページにも出る

MDXの`### クリア条件`(総合演習の`### クリア条件(Part A)`なども含む)は、
教材ページだけでなく**演習ページ(`/exercises/{exercise_id}`)の先頭にも表示される**
(`extractClearConditions()`)。演習ページには雛形コードのコメントしか出ないため、
そこだけを読んで手を動かせるように、クリア条件は具体的に書くこと。

**クリア条件が名指しするクラス名・変数名は、雛形コードの中身と必ず一致させること。**
教材では`.score-board`なのに雛形が`.scoreboard`、のようなズレがあると、
演習ページだけを見ている生徒が存在しないものを触ろうとして詰まる。

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
- **雛形コメントに「exportを付けること」を必ず書くこと。** 白紙式ではexportの付け忘れが
  起きやすく、しかも「自分で書いたconsole.logは正しく出ているのに判定だけ通らない」という
  非常に分かりにくい詰まり方をする(ファイル内では関数が使えるので出力は出るが、
  テスト側から`import`できないため失敗する)。実際にこれで詰まった事例がある
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
- **テスト失敗時のメッセージは、失敗の種類で出し分ける。** 判別には各エラーの
  `matcherResult`を使う(Jestは`expect()`の失敗にだけこれを付ける)。
  - `matcherResult`あり = ロジック上の不正解。メッセージに
    `Expected: "500円" Received: "500ドル"` のように**期待値がそのまま入る**ので、
    答えが漏れる。汎用メッセージ(「まだテストが通っていません」)だけを見せる
  - `matcherResult`なし = exportの付け忘れや実行時例外などの技術的なエラー。
    そもそもコードが動いていないだけで答えは漏れないので、エラー内容をそのまま見せる。
    あわせてexport付け忘れのヒントも添える(この分岐でだけ出す。アサーション失敗の
    場合はコードが動いている＝exportは正しいので、ヒントを出すと逆に混乱させる)
- 一度実行時テストがPASSした後にサーバー側の型チェックで落ちた場合は、具体的な型エラーメッセージを表示する(こちらは学習上有益なため区別している)
- **テストは`SandpackTests`に`watchMode={false}`を渡し、「採点する」ボタンを押したときだけ実行する。** 既定(true)だとコードを変えるたびに自動で走るため、どの状態で判定されたのかが分かりにくい。ボタンからは`useSandpack()`の`dispatch({ type: "run-all-tests" })`で実行を指示する(テストパネル自体は非表示にしているので、Sandpack内蔵のRunButtonは押せない)
- **`onComplete`コールバックはレンダー中に呼ばれるため、直接`setState`するとReactの警告が出る**。`setTimeout`で1ティックずらしてから状態を更新すること
- テスト合格(型チェックがある演習は型チェックも合格)を検知したら、`submitGradedExercise`(Server Action)を呼び出し、`status: "cleared"`として自動記録する。手動でのステータス切り替えUIと共存させてよい(自動採点に対応してない演習は、引き続き手動切り替えのままでよい)

## 7. 自動採点なしの演習に、練習用エディタだけ付ける場合

正誤判定は要らないが「書いたコードがその場で動くか試せる」ようにしたい演習には、
`src/lib/curriculum/playgrounds.ts` にエントリを追加し、雛形ファイルを1つ置くだけでよい
(`.test.ts` も `.typecheck.ts` も不要)。採点の仕組み(`grading.ts`)とは完全に別物で、
同じ演習が両方に登録されることはない。

種類(`kind`)ごとに、使うSandpackテンプレートと雛形の拡張子が決まっている。

| kind | 用途 | テンプレート | 雛形ファイル | 右側に出るもの |
|---|---|---|---|---|
| `html` | HTML/CSS(ch0) | `static` | `{exercise_id}.solution.html` | 描画結果 |
| `react` | Reactコンポーネント(ch1-13, ch2, ch3) | `react-ts` | `{exercise_id}.solution.tsx` | 描画結果 |
| `ts` | TypeScript(ch4) | `vanilla-ts` | `{exercise_id}.solution.ts` | console.logの出力 |

- **`html`は1ファイルで完結させる。** CSSを書かせる演習でも、`<style>`ブロックを含んだ
  HTMLを1つ置けばよい(雛形を1演習1ファイルに統一するため)
- **`react`の雛形は `export default` したものが描画される。** テンプレートの `/App.tsx` を
  置き換える形で読み込まれるため、名前付きexportだけでは何も表示されない
- **`ts`で`SandpackConsole`を使うときは必ず`standalone`を付けること。** これを付けないと
  コンソールはコードを実行するiframeを持たず、ログが何も出ない(表示は出るので気づきにくい)。
  ただし「常に付ける」ではない — 詳しくは下の「SandpackConsoleのstandalone」を参照
- Next.js固有の演習(ファイル配置やServer Actionなど)は、そのままでは動かせない。
  雛形のコメントでその旨を断ったうえで、ロジック部分だけ試せる形にしている

### 解答例(`{exercise_id}.answer.md`)

自動採点なしの演習は正誤を確かめる手段がないため、**解答例を必ず1つ置く**。
`content/{章フォルダ}/{exercise_id}.answer.md` に置くと、演習ページの練習用エディタの下に
「解答例を見る」という折りたたみ(`<details>`)で表示される(`src/lib/curriculum/answers.ts`)。

- **採点対応の演習には置かないこと。** テストで正誤が分かるうえ、答えを置くと採点の意味がなくなる
- 中身はMarkdown。コードブロックだけでなく、**「なぜそう書くか」の説明を必ず添える**
  (`**ポイント**` として箇条書きにするのが既存の形)
- **プレイグラウンドにそのまま貼れる形で書く。** 雛形が用意している型やデータ定義を前提にしてよい。
  複数のコードブロックに分けて書く場合、それらは1つのファイルなので、`import`が重複しないよう
  先頭のブロックにまとめる
- Next.js固有の演習(ファイル配置・Server Actionなど)は、エディタで動く形と、実際のNext.jsでの
  形の両方を並べて示す
- レビュー演習は教材本文にも`<details>`の解答があるが、演習ページからは見えないので、
  演習ページ側にも要点をまとめた解答例を置く

## 8. 教材本文に埋め込む「一緒にやってみる」エディタ

「説明を読む」ことと「白紙から書く」ことの間には大きな段差があり、そのままだと
「何から書き始めればいいか分からず詰まる」ことがある。そこを埋めるため、MDXの
「説明」と「演習」の間に **「一緒にやってみる」** セクションを置き、その場で書いて
動かせるエディタを埋め込める仕組みを用意している(採点なし)。

使い方は、MDX本文の好きな位置に次の1行を書くだけ。

```mdx
<TryIt />
```

中身は `content/{章フォルダ}/{exercise_id}.tryit.{ts,tsx,html}` から読む
(拡張子で種類を判別する。ts=コンソール表示 / tsx=React描画 / html=HTML描画)。
用意がない演習では `<TryIt />` を書いても何も描画されないので、段階的に増やせる。

- **題材は必ず演習(`.solution.*`)とは別のものにすること。** 同じ題材だと答えがそのまま
  見えてしまい、演習の意味がなくなる(例: 演習が`formatPrice`なら、こちらは`add`にする)
- 「自分の手で入力してみよう」という趣旨のセクションなので、雛形は**空(コメントだけ)**に
  しておき、生徒が写経できる余地を残す
- 実体は練習用エディタ(`SandpackPlayground`)の使い回し。採点・テストは一切走らない
- `.tryit.*` も `tsconfig.json`・`eslint.config.mjs` の除外対象に入れること

## 9. SandpackConsoleのstandalone(付ける/付けないの判断)

`SandpackConsole`は「どのクライアント(iframe)のログを見るか」で挙動が決まる。
**「常にstandaloneを付ける」でも「常に付けない」でもなく、コードを実行する
クライアントが他にあるかどうかで決める。**

| 状況 | standalone | 理由 |
|---|---|---|
| コンソール以外に何も無い(練習用エディタのts版) | **付ける** | 付けないとコードを実行するiframeが1つも無く、ログが出ない |
| 隠しテストやプレビューが既にある(採点用エディタ) | **付けない** | 付けると自前のiframeのログしか見なくなり、テスト実行中のログが拾えない |

実装上は `clientId = standalone ? internalClientId : undefined` となっており、
`clientId`が`undefined`のときだけSandpackのグローバルリスナーとして
**全クライアント**のログを受け取れる(`addListener`の実装を参照)。

採点用エディタで見たいのは「生徒がデバッグのために関数の中へ書いた`console.log`」で、
それが実際に呼ばれるのはテスト実行時。したがって採点側ではstandaloneを付けてはいけない。

- 隠しテストに渡している`hideTestsAndSupressLogs`は、テストパネル内の表示を抑えるだけで、
  クライアントからのconsoleメッセージ送出は止めない(名前から誤解しやすい)
- 未実装のReact演習ではReactの警告が大量に出てコンソールが伸び、下に置いた判定メッセージが
  画面外に押し出される。Sandpackのレイアウト高さは`--sp-layout-height`というCSS変数で
  決まるので、コンソール側だけこれを小さくして高さを抑えること
  (`.sp-console`に直接heightを指定しても、親のレイアウトが高さを持っているため効かない)

### 開発中の動作確認について

- `SandpackTests`は実は`https://{version}-sandpack.codesandbox.io/`という外部(CodeSandbox社ホスティング)のiframeの中でテストを実行している。このため`SandpackGrader.tsx`やコンテンツを編集した際、通常のリロードでは変更が反映されず、ハードリロード(Cmd+Shift+R)が必要になることがある(Fast Refreshとこの外部iframeの組み合わせによる開発時特有の制限で、本番には影響しない)
- **稼働中の`next dev`サーバーと同じプロジェクトディレクトリで`npm run build`(本番ビルド)を実行しないこと**。`.next`ディレクトリを共有しているため、本番ビルドが`.next`を本番用の構造で上書きし、動いている`next dev`が500エラーを返すようになる(実際にこれで開発サーバーを壊した事例あり)。動作確認は`npx tsc --noEmit`・`npm run lint`で十分であり、ブラウザでの実機確認は稼働中の`next dev`にそのまま接続して行うこと
