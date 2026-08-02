// stations を受け取り、<svg> の中に各駅を <circle> で、隣り合う駅同士を <line> で
// 結んで表示する RouteMap コンポーネントを作ってください。
// 駅の一覧表示には .map() と key を使うこと。
//
// 練習用のエディタなので採点はされません。右側で図が確認できます。

interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
}

const stations: Station[] = [
  { id: "s1", name: "東京", x: 20, y: 50 },
  { id: "s2", name: "新横浜", x: 100, y: 50 },
  { id: "s3", name: "名古屋", x: 180, y: 50 },
];

// ここに RouteMap を書いてみましょう

export default function App() {
  return (
    <div>
      <p>ここで RouteMap を呼び出してみましょう</p>
      <svg width={220} height={100} style={{ border: "1px solid #ccc" }} />
    </div>
  );
}
