-- ============================================================
-- 算数ゲーム学習プラットフォーム 初期スキーマ
-- 想定: Supabase (Postgres + Auth + RLS)
-- ============================================================

-- --------------------------------------------------------------
-- teams: 学習チーム単位。今回は1チーム(4人)だが、
--        将来テンプレ化して他チームが使えるように最初から分離しておく
-- --------------------------------------------------------------
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------
-- team_members: どのユーザーがどのチームに所属しているか
--        auth.users は Supabase Auth が自動管理するテーブル
-- --------------------------------------------------------------
create table team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null, -- チーム内で表示する名前(メモ・進捗ボードに出す)
  role text not null default 'member' check (role in ('member', 'admin')),
  joined_at timestamptz not null default now(),
  unique (team_id, user_id)
);

-- --------------------------------------------------------------
-- exercise_progress: 章・演習ごとの進捗ステータス
--        exercise_id は教材コンテンツ側(MDX)のslugと対応させる緩い参照
--        例: "ch1-02-arrow-function", "ch3-04-cake-cut-logic"
-- --------------------------------------------------------------
create table exercise_progress (
  id uuid primary key default gen_random_uuid(),
  team_member_id uuid not null references team_members(id) on delete cascade,
  exercise_id text not null,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'cleared')),
  updated_at timestamptz not null default now(),
  unique (team_member_id, exercise_id)
);

-- --------------------------------------------------------------
-- milestones: 週次の小さいゴール設定(「◯章の演習1〜5を◯週目までに」)
-- --------------------------------------------------------------
create table milestones (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  title text not null,
  description text,
  target_exercise_ids text[] not null default '{}', -- このマイルストーンに含まれる演習idの一覧
  due_date date,
  created_by uuid not null references team_members(id),
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------
-- exercise_notes: 演習単位の簡易掲示板(「ここ詰まった」「こう考えたらいけた」)
-- --------------------------------------------------------------
create table exercise_notes (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  exercise_id text not null,
  team_member_id uuid not null references team_members(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security: 自分のチームのデータしか見えない/触れない
-- ============================================================

alter table teams enable row level security;
alter table team_members enable row level security;
alter table exercise_progress enable row level security;
alter table milestones enable row level security;
alter table exercise_notes enable row level security;

-- 自分が所属しているチームだけ見える
create policy "teams: select own team"
  on teams for select
  using (
    id in (select team_id from team_members where user_id = auth.uid())
  );

-- 同じチームのメンバー一覧は見える(進捗ボードに全員分出すため)
create policy "team_members: select same team"
  on team_members for select
  using (
    team_id in (select team_id from team_members where user_id = auth.uid())
  );

create policy "team_members: insert self"
  on team_members for insert
  with check (user_id = auth.uid());

-- 進捗: 同じチームのメンバーなら閲覧OK、更新は本人のみ
create policy "exercise_progress: select same team"
  on exercise_progress for select
  using (
    team_member_id in (
      select tm.id from team_members tm
      where tm.team_id in (
        select team_id from team_members where user_id = auth.uid()
      )
    )
  );

create policy "exercise_progress: modify own"
  on exercise_progress for all
  using (
    team_member_id in (select id from team_members where user_id = auth.uid())
  )
  with check (
    team_member_id in (select id from team_members where user_id = auth.uid())
  );

-- マイルストーン: 同じチームなら閲覧OK、作成は同じチームのメンバーなら誰でも
create policy "milestones: select same team"
  on milestones for select
  using (
    team_id in (select team_id from team_members where user_id = auth.uid())
  );

create policy "milestones: insert same team"
  on milestones for insert
  with check (
    team_id in (select team_id from team_members where user_id = auth.uid())
  );

-- メモ: 同じチームなら閲覧OK、投稿は本人として、同じチーム内でのみ
create policy "exercise_notes: select same team"
  on exercise_notes for select
  using (
    team_id in (select team_id from team_members where user_id = auth.uid())
  );

create policy "exercise_notes: insert own in same team"
  on exercise_notes for insert
  with check (
    team_member_id in (select id from team_members where user_id = auth.uid())
    and team_id in (select team_id from team_members where user_id = auth.uid())
  );
