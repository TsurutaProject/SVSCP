// WeatherTypeが"sunny"|"cloudy"|"rainy"の3つのリテラルだけのunion型になっているか
// (string型などに広がっていないか)を検証する。
import { getWeatherMessage } from "./solution";
import type { WeatherType } from "./solution";

const _sunny: WeatherType = "sunny";
const _cloudy: WeatherType = "cloudy";
const _rainy: WeatherType = "rainy";

// @ts-expect-error - WeatherTypeに含まれない文字列は代入できないはず
const _invalid: WeatherType = "snowy";

const _message: string = getWeatherMessage("sunny");
