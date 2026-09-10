// 総合演習:電車の運行管理パネル(完成)
// 教材のステップ1〜7を、この1ファイルの中で順番に実装してみてください。
//   1. utilsを用意する      5. 名前で検索できるようにする
//   2. 路線図を描く          6. 速度順に並び替えるボタンを足す
//   3. レールをクリックで配置 7. 遅延の警告を出す
//   4. 電車の一覧を表示する
//
// 1ステップ書くごとに「実行する」を押して、動くことを確かめてから次に進むのがおすすめです。
// 教材の各ステップにあるレッスンへのリンクは、新しいタブで開きます
// (ここに書いたコードは消えません)。
//
// 本来は utils / components に分けるところですが、この練習用エディタは1ファイル構成なので、
// 「関数を上にまとめ、コンポーネントを下に置く」形で試せます。
//
// 練習用のエディタなので採点はされません。

interface Train {
  id: string;
  name: string;
  speed: number;
  delayMinutes: number;
}

interface Rail {
  id: string;
  type: "fast" | "normal";
  // 3-1の Rail に、線を引くための始点・終点を足したもの
  fromX: number;
  toX: number;
  y: number;
  isPlaced: boolean;
}

interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
}

const initialTrains: Train[] = [
  { id: "t1", name: "のぞみ1号", speed: 300, delayMinutes: 0 },
  { id: "t2", name: "ひかり5号", speed: 250, delayMinutes: 3 },
  { id: "t3", name: "こだま2号", speed: 130, delayMinutes: 0 },
];

const stations: Station[] = [
  { id: "s1", name: "東京", x: 20, y: 50 },
  { id: "s2", name: "新横浜", x: 100, y: 50 },
  { id: "s3", name: "名古屋", x: 180, y: 50 },
];

const initialRails: Rail[] = [
  { id: "r1", type: "fast", fromX: 20, toX: 100, y: 50, isPlaced: false },
  { id: "r2", type: "normal", fromX: 100, toX: 180, y: 50, isPlaced: false },
];

// ステップ1:ここに計算だけをする関数(utils)を書いてみましょう

// ステップ2以降:ここから下にコンポーネントを書いてみましょう

export default function App() {
  return (
    <div>
      <h1>電車の運行管理パネル</h1>
      <p>ここに路線図と電車一覧を組み立ててみましょう</p>
    </div>
  );
}
