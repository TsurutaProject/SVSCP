// この演習は「エラーメッセージを読んで、原因と調べるべき場所を説明する」内容です。
// ここでは教材と同じエラーを実際に起こして、メッセージを自分の目で確かめられます。
//
// 練習用のエディタなので採点はされません。console.log の結果が右側に表示されます。

function formatName(name: string | null) {
  // 教材のエラー: TypeError: Cannot read properties of null (reading 'toUpperCase')
  return name.toUpperCase();
}

try {
  console.log(formatName("norimaki"));
  console.log(formatName(null));
} catch (error) {
  console.log("捕まえたエラー:", String(error));
}

// TODO: なぜこのエラーが起きるのか、どこを直せばよいかを考えて、
// formatName を安全な形に書き換えてみましょう。
