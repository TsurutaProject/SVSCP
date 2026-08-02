// 総合演習:電車の運行管理パネル(完成)
// 教材の「要件」1〜3を、この1ファイルの中で組み合わせて実装してみてください。
//   1. utilsの用意(3-2の復習)
//   2. SVG路線図(3-3, 3-4の復習)
//   3. 電車一覧と操作パネル
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

const initialTrains: Train[] = [
  { id: "t1", name: "のぞみ1号", speed: 300, delayMinutes: 0 },
  { id: "t2", name: "ひかり5号", speed: 250, delayMinutes: 3 },
  { id: "t3", name: "こだま2号", speed: 130, delayMinutes: 0 },
];

// ここに書いてみましょう

export default function App() {
  return (
    <div>
      <h1>電車の運行管理パネル</h1>
      <p>ここに路線図と電車一覧を組み立ててみましょう</p>
    </div>
  );
}
