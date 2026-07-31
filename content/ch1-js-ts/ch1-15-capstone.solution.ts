// 総合演習:電車の運行管理 & ケーキの注文管理
// Part A・Part Bのすべての関数・型を実装してください。

// ============================================================
// Part A:電車の運行管理ミニ関数群(JS)
// ============================================================
// Train型({ name, speed, delayMinutes })を定義した上で、以下を実装してください。
// 1. getDelayedTrains: 遅延してる(delayMinutesが0より大きい)電車だけを抽出する(.filter()を使うこと)
// 2. formatDelayReport: 1つの電車から "◯◯:3分遅延" または "◯◯:定刻" という文字列を返す
//    (分割代入・テンプレートリテラル・三項演算子を組み合わせて書くこと)
// 3. updateDelay: 電車オブジェクトと新しい遅延分数を受け取り、delayMinutesだけを更新した
//    新しいオブジェクトを返す(元のオブジェクトは変更しないこと。スプレッド構文を使うこと)
// 4. getDelaySummary: 遅延してる電車だけについて、formatDelayReportと同じ形式の
//    文字列の配列を返す(.filter()と.map()を組み合わせて書くこと)
// 5. getFirstTrainName: 電車の配列を受け取り先頭の電車の名前を返す。trainsがundefinedや
//    空配列の場合でもエラーにならず"該当なし"を返すこと(?.と??を使うこと)

// ============================================================
// Part B:ケーキの注文管理(TypeScript)
// ============================================================
// 1. Order interface(customerName: 文字列、cakeKind: "shortcake"|"chocolate"、
//    toppings: 文字列配列でオプション、isCompleted: 真偽値)を定義してexportしてください。
// 2. completeOrder: 注文を受け取り、isCompletedをtrueにした新しいオブジェクトを返す
//    (元のオブジェクトは変更しないこと。スプレッド構文を使うこと)
// 3. getPendingOrders: 注文の配列を受け取り、isCompletedがfalseの注文だけを抽出する
// 4. formatOrderSummary: 注文を受け取り、"のりまきさん:ショートケーキ(トッピング:いちご、生クリーム)"
//    (トッピングなしの場合は"のりまきさん:ショートケーキ")という文字列を返す
//    (cakeKindが"shortcake"なら"ショートケーキ"、"chocolate"なら"チョコケーキ"と表示すること)
// 5. トッピングの種類("strawberry" | "cream" | "banana")ごとの在庫数(number)を表す
//    ToppingStock型をRecordを使って定義し、そのサンプル値sampleToppingStockをexportすること
//    (値は自由でOK)
