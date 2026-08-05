// 情緒フィードバック(情緒FB)の試作コード —— 現在は使われていない。
//
// ============================================================================
// 【重要】このファイルはどこからも import されていない。意図的にそうしている。
//
// 採点結果(論理FB)とは別に、生成AI(Gemini)で学習意欲を支える短い声かけを
// 出す機能を試作したが、実際に触って評価した結果 **見送り** となった。
// 理由: 既存の技術的ヒント(exportの付け忘れの案内など)と役割が重複していて、
//       情緒FB独自の価値が薄いと判断したため。
//
// 消さずに残しているのは、将来もし再検討する場合に、ここで作り込んだ
// 「プロンプト設計」と「答えを漏らさないための対策」がそのまま使えるため。
// 経緯は CLAUDE.md の「今後の拡張候補」にも記録してある。
//
// 復活させる場合に必要な配線(試作時に実際に動かした構成):
//   1. src/app/actions.ts に Server Action を足し、loadLesson() で取った
//      MDXから extractTaskText() で課題文を作ってこのモジュールに渡す
//   2. src/components/SandpackGrader.tsx から、採点結果とは別枠でそのActionを呼ぶ
//      (FAIL時は3回連続で失敗してから呼ぶ、PASSで連続失敗回数をリセット)
//   3. .env.local と Vercel に GEMINI_API_KEY を設定する
//      (サーバー専用。NEXT_PUBLIC_ は絶対に付けないこと)
// ============================================================================
//
// 答えを漏らさないための設計(ここが一番の資産):
// - 期待値と実際の値の差分をAIに渡さない。テストのアサーション失敗メッセージには
//   期待値がそのまま入っているため。既存の matcherResult による判別と同じ思想。
// - テスト名も渡さない。テスト名には「500を渡すと"500円"を返す」のように
//   期待値そのものが入っているものがあり、AIが引用すると答えが漏れる。
//   渡すのは件数だけ(buildTestSummary を参照)。
// - 課題文からは「一緒にやってみる」セクションを必ず除外する(手本コードが載っているため)。
// - FAIL時のヒントは「見るべき観点」を示すだけにとどめ、正解は生徒に気づかせる。
//
// APIキーが無い/APIが失敗した場合は null を返す。採点そのものは情緒FBに
// 依存させないための設計で、生成できなくても学習の進行は止まらない。

const MODEL = "gemini-3.5-flash-lite";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// 生成が遅いと採点結果の表示までもたつくため、待ちすぎない
const TIMEOUT_MS = 8000;

const TONE_GUIDE = `# トーン
過度な表現(「素晴らしい!」「天才!」など)は避けてください。
落ち着いた調子で、「何を、どうできたか」に具体的に触れてください。`;

const PASS_EXAMPLES = `例:
- 「アロー関数、正しく書けていますね。テンプレートリテラルの使い方も適切です。」
- 「テストが通りました。exportの付け忘れもなく、綺麗な実装です。」
- 「一発でクリアできましたね。次の演習に進めそうです。」`;

const FAIL_EXAMPLES = `例:
- 「まだ通っていませんが、ここまでの実装の方向性は悪くないと思います。」
- 「エラーが出るのは、実装を進めている証拠でもあります。落ち着いて見直してみましょう。」
- 「一度で正解する必要はありません。少しずつ近づいています。」`;

// ---------------------------------------------------------------------------
// 課題文の抽出
// ---------------------------------------------------------------------------
//
// 方針:
// 1. 「一緒にやってみる」セクションは必ず落とす。ここには手本のコードが
//    載っていて、AIがそれを引用すると答えに近い出力になりかねない。
// 2. 「説明」「演習」セクションがあればそれだけを使う(コラムやプロトタイプ例で
//    プロンプトが無駄に長くなるのを避けるため)。
// 3. 総合演習やレビュー演習のようにその見出しを持たない教材では、
//    1で落とした残りの本文全体を使う。
//
// 試作時に、採点対象20演習すべてでこの抽出が成立することを確認済み。

const MAX_TASK_TEXT_LENGTH = 4000;
const SAMPLE_CODE_SECTION = "一緒にやってみる";

type Section = { title: string; body: string };

function splitSections(body: string): Section[] {
  const headings = [...body.matchAll(/^## (.+)$/gm)];
  if (headings.length === 0) return [{ title: "", body }];

  return headings.map((heading, i) => {
    const start = heading.index ?? 0;
    const end = i + 1 < headings.length ? (headings[i + 1].index ?? body.length) : body.length;
    return { title: heading[1].trim(), body: body.slice(start, end).trim() };
  });
}

/** MDX全文(frontmatter込み)から、プロンプトに渡す課題文を組み立てる */
export function extractTaskText(source: string): string {
  const body = source.replace(/^---\n[\s\S]*?\n---\n/, "");

  // 手本コードのセクションは、答えが漏れるので常に除外する
  const sections = splitSections(body).filter((s) => s.title !== SAMPLE_CODE_SECTION);

  const explained = sections.filter((s) => s.title === "説明" || s.title === "演習");
  const chosen = explained.length > 0 ? explained : sections;

  const text = chosen
    .map((s) => s.body)
    .join("\n\n")
    .trim();

  return text.length > MAX_TASK_TEXT_LENGTH ? text.slice(0, MAX_TASK_TEXT_LENGTH) : text;
}

/**
 * テスト結果の要約を作る。試作時は SandpackGrader 側の onComplete で
 * テストの件数を数えて呼んでいた。
 *
 * ここでテスト名を渡してはいけない(このモジュールの冒頭コメント参照)。
 * technicalErrors は matcherResult を持たないエラーだけを渡すこと。
 * それらは生徒の画面にもそのまま出している内容なので、AIに渡しても問題ない。
 */
export function buildTestSummary(
  passCount: number,
  failCount: number,
  technicalErrors: string[],
): string {
  const lines = [
    `テスト${passCount + failCount}件のうち、${passCount}件が成功、${failCount}件が失敗しています。`,
  ];

  if (technicalErrors.length > 0) {
    lines.push(`実行時に次のエラーが出ています: ${technicalErrors.join(" / ")}`);
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// プロンプト生成とAPI呼び出し
// ---------------------------------------------------------------------------

export type EmotionalFeedbackInput = {
  kind: "pass" | "fail";
  /** 演習の課題文(extractTaskText の戻り値) */
  taskText: string;
  /** 生徒が実際に書いたコード */
  code: string;
  /**
   * テストの実行結果の要約(buildTestSummary の戻り値)。
   * 期待値と実際の値の差分は決して含めないこと。
   */
  testSummary: string;
  /**
   * 実行前に落ちる技術的なエラー(exportの付け忘れ・構文エラーなど)が出ているか。
   * trueのときはAIに原因を推測させない(具体的な案内は画面の別枠で出しているため)。
   */
  hasTechnicalError?: boolean;
};

function buildPrompt({
  kind,
  taskText,
  code,
  testSummary,
  hasTechnicalError = false,
}: EmotionalFeedbackInput): string {
  const situation =
    kind === "pass"
      ? "生徒が書いたコードで、テストがすべて通りました。"
      : "生徒が書いたコードで、テストがまだ通っていません(何度か続けて失敗しています)。";

  // 技術的なエラー(exportの付け忘れ・構文エラーなど)が出ているときは、
  // 具体的な原因と直し方を画面の別枠ですでに案内している。
  // ここでAIに原因を推測させると、実際とは違う見当違いの指摘
  // (「設定ファイルを確認してみましょう」など)をして生徒を迷わせる。
  // 試作時に実際にこれが起きたため、原因の推測を明示的に禁じている。
  const technicalNote = hasTechnicalError
    ? `\nなお、このエラーの具体的な原因と対処は、画面の別の場所で生徒に案内済みです。
あなたはエラーの原因を推測しないでください。原因に触れず、励ましだけにとどめてください。`
    : `\n励ましに加えて、ヒントを一言添えてください。ただしヒントは
「境界値を確認してみましょう」のように**見るべき観点を示すだけ**にとどめ、
生徒自身が気づける余地を残してください。
課題文やクリア条件を言い換えて手順を指示する(「〜を取り除いて〜にしてください」など)のは
答えを教えるのと同じです。やめてください。`;

  const instruction =
    kind === "pass"
      ? `${TONE_GUIDE}\n${PASS_EXAMPLES}`
      : `${TONE_GUIDE}\n${FAIL_EXAMPLES}\n${technicalNote}`;

  return `あなたはプログラミングを学び始めた人を支える講師です。
以下の状況に対して、日本語で2文以内の短いメッセージを書いてください。

# 状況
${situation}

# 演習の課題
${taskText}

# 生徒が書いたコード
\`\`\`
${code}
\`\`\`

# テストの実行結果
${testSummary}

${instruction}

# 絶対に守ること
- 正解のコードや、期待される具体的な値を書かないでください。
- 「〜を〜に変えれば通ります」のような、答えそのものを教える書き方をしないでください。
- 前置きや見出しを付けず、メッセージ本文だけを出力してください。

メッセージ:`;
}

export async function generateEmotionalFeedback(
  input: EmotionalFeedbackInput,
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(input) }] }],
        generationConfig: {
          temperature: 0.7,
          // 2文以内に収める想定。長文になっても表示が崩れないよう上限を設ける
          maxOutputTokens: 200,
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      // レート制限・障害など。採点は止めたくないので握りつぶす。
      // なおレート制限時のメッセージは "prepayment credits are depleted"
      // (課金クレジット切れ)という紛らわしい文言で返ってくるが、
      // 実際には時間を空ければ通る断続的な429だった。
      console.error(
        `[emotionalFeedback] Gemini API error: ${response.status} ${await response.text()}`,
      );
      return null;
    }

    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return message ? message : null;
  } catch (error) {
    console.error("[emotionalFeedback] Gemini API request failed:", error);
    return null;
  }
}
