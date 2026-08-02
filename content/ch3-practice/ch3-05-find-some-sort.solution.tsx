// trains を受け取る、以下3つの関数を作ってください。
//   findTrainByName(trains, name)   — .find() で指定した名前の電車を探す
//   hasAnyDelayedTrain(trains)      — .some() で1本でも遅延があるか判定する
//   sortBySpeedDescending(trains)   — 速度が速い順に並べた新しい配列を返す
//                                     (元の配列は変更しないこと。コピーしてから .sort() する)
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

// ここに3つの関数を書いてみましょう

export default function App() {
  return (
    <div>
      <p>ここで3つの関数を呼び出して、結果を表示してみましょう</p>
    </div>
  );
}
