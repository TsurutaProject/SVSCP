-- ============================================================
-- 初期チームの作成 + 新規ユーザーの参加用RPC
-- ============================================================

-- 今は1チーム固定運用。teams自体は複数チーム対応を見据えた設計のままにし、
-- 「今どのチームに参加させるか」の決め打ちはこの1箇所(join_default_team関数)に閉じ込める。
insert into teams (name)
select '算数ゲーム開発チーム'
where not exists (select 1 from teams);

-- --------------------------------------------------------------
-- join_default_team: ログイン済みユーザーが自分のteam_membersを作成する。
--
-- teamsのRLS(「自分が所属しているチームだけ見える」)により、
-- どのチームにも属していない新規ユーザーはteamsをSELECTできず、
-- 参加先チームを自力で見つけられない(ニワトリ卵問題)。
-- SECURITY DEFINERでRLSを迂回しつつ、insertするuser_idは
-- 呼び出し元のauth.uid()に固定することで、他人のteam_membersを
-- 作成できないようにしている。
-- --------------------------------------------------------------
create or replace function public.join_default_team(p_display_name text)
returns team_members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team_id uuid;
  v_member team_members;
begin
  select id into v_team_id from teams order by created_at asc limit 1;

  if v_team_id is null then
    raise exception 'no team available to join';
  end if;

  insert into team_members (team_id, user_id, display_name)
  values (v_team_id, auth.uid(), p_display_name)
  returning * into v_member;

  return v_member;
end;
$$;

revoke all on function public.join_default_team(text) from public;
grant execute on function public.join_default_team(text) to authenticated;
