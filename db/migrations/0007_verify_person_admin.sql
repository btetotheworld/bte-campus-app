-- 0007_verify_person_admin.sql
-- Journey P9. Admin override uses the same verify_person write as P8.
-- docs/RBAC.md sections 2 and 11.

create or replace function verify_person_by_admin(p_person_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not (is_active() and has_permission('people', 'update')) then
    raise exception 'not authorized to verify a person';
  end if;

  perform verify_person(p_person_id);
end;
$$;

revoke all on function verify_person_by_admin(uuid) from public;
grant execute on function verify_person_by_admin(uuid) to authenticated;
