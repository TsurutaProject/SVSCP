// 実行時の値だけでなく、宣言した型そのものが正しいかを検証する。
import { team } from "./solution";

const _teamName: string = team.teamName;
const _members: { name: string; items: string[] }[] = team.members;
