
create or replace function is_admin()
returns boolean AS $$
select exists(
    select 1
    from user_profile
    where id = auth.uid() and role = 'ADMIN'
)
$$ language sql security definer stable;

-- add row level security policies for admin
create policy "admins can update/insert/delete any profile" on user_profile
  for all using (is_admin());
