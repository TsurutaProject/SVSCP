// Stationというinterfaceを定義してください。name(文字列)、line(文字列、路線名)、
// isTerminal(真偽値、終着駅かどうか)の3つのプロパティを持つ形にしてください。
// その後、そのinterfaceに沿ったStationオブジェクトを1つ作成し、
// station という名前でexportしてください(値は自由でOK)。
//
// クリア条件:
// - Station interfaceがname: string, line: string, isTerminal: booleanの3プロパティを持つこと
// - そのinterfaceに沿ったオブジェクトが1つ作成されていること

interface Station {
  name: string;
  line: string;
  isTerminal: boolean;
}

export const station: Station = undefined as unknown as Station; // TODO: Station型のオブジェクトに置き換えてください
