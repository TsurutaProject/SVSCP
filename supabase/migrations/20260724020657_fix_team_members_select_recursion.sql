-- ============================================================
-- team_members の select ポリシーが自己参照(team_membersをsubqueryで
-- 参照)しており、"infinite recursion detected in policy" になるバグの修正。
--
-- team_members以外のテーブル(teams, exercise_progress, milestones,
-- exercise_notes)のポリシーもteam_membersをsubqueryで参照しているため、
-- ここを直せば連鎖的に解消する。
-- ============================================================

-- 現在のユーザーが所属するteam_idの一覧を返す。
-- SECURITY DEFINERでteam_members自身のRLSを経由せずに評価することで、
-- team_membersのselectポリシーがteam_membersを再帰的に参照する問題を回避する。
create or replace function public.current_team_ids()
returns setof uuid
language sql
security definer
stable
set search_path = public
as $$
  select team_id from team_members where user_id = auth.uid();
$$;

revoke all on function public.current_team_ids() from public;
grant execute on function public.current_team_ids() to authenticated;

drop policy "team_members: select same team" on team_members;

create policy "team_members: select same team"
  on team_members for select
  using (
    team_id in (select public.current_team_ids())
  );
