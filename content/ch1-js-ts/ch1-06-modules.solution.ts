// distance(距離、km)を受け取って運賃(円)を計算する calculateFare 関数を
// export で定義してください。中身の計算式は自由でOKです(距離が長いほど
// 運賃が高くなるようにしてください)。
//
// 本来の演習では fareUtils.js / main.js の2ファイルに分けてimport/export
// する構成ですが、この採点環境では1ファイル(solution.ts)で完結する形に
// 単純化しています。「exportした関数を、別ファイル(このテストファイル)
// からimportして呼び出す」という点は、このテストファイル自体が
// import { calculateFare } from "./solution" を行うことで検証しています。
//
// クリア条件:
// - calculateFareがexportされ、他のファイルからimportして呼び出せること
// - distanceが大きいほど運賃(戻り値)も大きくなること
// - 運賃が0より大きい数値であること

export const calculateFare = (distance: number): number => {
  throw new Error("TODO: 実装してください");
};
