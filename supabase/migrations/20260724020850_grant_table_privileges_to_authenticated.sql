-- ============================================================
-- authenticated ロールへのテーブル権限付与
--
-- 現在のSupabase(CLI)のデフォルトでは、publicスキーマの新規テーブルは
-- anon/authenticatedロールに自動公開されない(auto_expose_new_tables対応)。
-- RLSポリシーは権限(GRANT)がある前提の上での絞り込みでしかないため、
-- GRANTがないとRLSポリシーの条件を満たしていても
-- "permission denied for table ..." になる。
-- 各テーブルに定義されているポリシーが許可する操作の範囲でGRANTする。
-- ============================================================

-- teams: select only (作成・更新はjoin_default_team関数経由のためGRANT不要)
grant select on teams to authenticated;

-- team_members: select + insert(自分の行のみ、RLSで絞り込み)
grant select, insert on team_members to authenticated;

-- exercise_progress: 全操作(「exercise_progress: modify own」がfor allのため)
grant select, insert, update, delete on exercise_progress to authenticated;

-- milestones: select + insert
grant select, insert on milestones to authenticated;

-- exercise_notes: select + insert
grant select, insert on exercise_notes to authenticated;
