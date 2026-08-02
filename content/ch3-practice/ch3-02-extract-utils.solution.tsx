// countDelayedTrains(trains) と getAverageSpeed(trains) を、コンポーネントから
// 切り出す形で実装してください。本来は utils/trainUtils.ts という別ファイルに分けますが、
// この練習用エディタは1ファイル構成なので、ファイル上部にまとめて書く形で試せます。
//
// 練習用のエディタなので採点はされません。

interface Train {
  name: string;
  speed: number;
  delayMinutes: number;
}

const trains: Train[] = [
  { name: "のぞみ1号", speed: 300, delayMinutes: 0 },
  { name: "ひかり5号", speed: 250, delayMinutes: 3 },
  { name: "こだま2号", speed: 130, delayMinutes: 0 },
  { name: "はやぶさ7号", speed: 320, delayMinutes: 8 },
];

// ここに countDelayedTrains と getAverageSpeed を書いてみましょう

export default function App() {
  return (
    <div>
      <p>遅延している本数: ここに countDelayedTrains(trains) の結果を表示</p>
      <p>平均速度: ここに getAverageSpeed(trains) の結果を表示</p>
    </div>
  );
}
