// レビュー演習:3つのコード例には、それぞれ問題が1つずつ潜んでいます。
// 何が問題かを考えて、修正したコードに書き換えてください。
// 教材の「解答を見る」と照らし合わせながら確かめられます。
//
// 練習用のエディタなので採点はされません。
import { useState } from "react";

interface Train {
  name: string;
  speed: number;
}

interface Rail {
  id: string;
  isPlaced: boolean;
}

// --- コード例1: 元の配列を壊していないか? ---
function sortBySpeedDescending(trains: Train[]): Train[] {
  return trains.sort((a, b) => b.speed - a.speed);
}

// --- コード例2: 見つからなかった場合はどうなる? ---
function getTrainSpeed(trains: Train[], name: string): number {
  const train = trains.find((t) => t.name === name);
  return train.speed;
}

// --- コード例3: 同じ更新を連続で呼ぶと期待通りになる? ---
export default function App() {
  const [rails, setRails] = useState<Rail[]>([{ id: "r1", isPlaced: false }]);

  const toggleRail = (railId: string) => {
    setRails(
      rails.map((rail) => (rail.id === railId ? { ...rail, isPlaced: !rail.isPlaced } : rail)),
    );
  };

  const handleRapidClicks = () => {
    toggleRail("r1");
    toggleRail("r1"); // 連続で呼び出す
  };

  return (
    <div>
      <p>r1 の状態: {rails[0].isPlaced ? "配置済み" : "未配置"}</p>
      <button onClick={handleRapidClicks}>連続切り替え</button>
    </div>
  );
}
