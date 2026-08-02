// 前のレッスンの RouteMap に、駅と駅の間のレール(Rail型、isPlacedで配置状態を管理)を
// 追加してください。レールをクリックすると isPlaced が反転するようにし、
// 更新は関数型更新 (previousRails) => ... を使って書くこと。
//
// 練習用のエディタなので採点はされません。右側で実際にクリックして確かめられます。

interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface Rail {
  id: string;
  fromX: number;
  toX: number;
  y: number;
  isPlaced: boolean;
}

const stations: Station[] = [
  { id: "s1", name: "東京", x: 20, y: 50 },
  { id: "s2", name: "新横浜", x: 100, y: 50 },
  { id: "s3", name: "名古屋", x: 180, y: 50 },
];

const initialRails: Rail[] = [
  { id: "r1", fromX: 20, toX: 100, y: 50, isPlaced: false },
  { id: "r2", fromX: 100, toX: 180, y: 50, isPlaced: false },
];

// ここに useState と、クリックで isPlaced を反転させる処理を書いてみましょう

export default function App() {
  return (
    <div>
      <p>ここで RouteMap を呼び出して、レールをクリックできるようにしてみましょう</p>
      <svg width={220} height={100} style={{ border: "1px solid #ccc" }} />
    </div>
  );
}
