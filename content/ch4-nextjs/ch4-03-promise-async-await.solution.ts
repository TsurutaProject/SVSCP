// getUserProfile(userId: string) という async 関数を作ってみてください。
// 中で fetchUser(userId) を await し、取得したユーザー情報の name だけを返します。
//
// 練習用のエディタなので採点はされません。
// console.log の結果が右側に表示されます。

const fetchUser = (userId: string) =>
  new Promise<{ id: string; name: string }>((resolve) =>
    setTimeout(() => resolve({ id: userId, name: "のりまき" }), 1000),
  );

// ここに getUserProfile を書いてみましょう

// 動かして確認する
fetchUser("u1").then((user) => console.log("fetchUserの結果:", user));
