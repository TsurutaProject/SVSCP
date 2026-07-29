// WeatherTypeというunion type("sunny" | "cloudy" | "rainy")を定義してください。
// その後、WeatherTypeを引数に取り、天気に応じたメッセージを返す
// getWeatherMessage関数を実装してください。
//
// クリア条件:
// - WeatherTypeが3つの文字列リテラルのunion typeとして定義されていること
// - 3種類すべてに対応するメッセージを返す関数が書かれていること
// - getWeatherMessage("sunny")が"晴れです、傘は不要です"を返すこと

export type WeatherType = "sunny" | "cloudy" | "rainy";

export const getWeatherMessage = (weather: WeatherType): string => {
  throw new Error("TODO: 実装してください");
};
