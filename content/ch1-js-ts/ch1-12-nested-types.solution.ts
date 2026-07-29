// Playerというinterfaceを定義してください(name: 文字列、items: 文字列の配列)。
// その後、Teamというinterfaceを定義してください(teamName: 文字列、
// members: Player型の配列)。最後に、2人のPlayerを含むTeamオブジェクトを
// 1つ作成し、team という名前でexportしてください(値は自由でOK)。
//
// クリア条件:
// - PlayerとTeam、両方のinterfaceが正しく定義されていること
// - Teamのmembersが Player[] 型になっていること
// - 2人のPlayerを含むTeamオブジェクトが作成されていること

interface Player {
  name: string;
  items: string[];
}

interface Team {
  teamName: string;
  members: Player[];
}

export const team: Team = undefined as unknown as Team; // TODO: 2人のPlayerを含むTeamに置き換えてください
