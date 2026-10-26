create table if not exists public.customer_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  business_name text check (business_name is null or char_length(business_name) <= 200),
  business_type text check (business_type is null or char_length(business_type) <= 120),
  contact text not null check (char_length(contact) between 1 and 254),
  solution text not null check (char_length(solution) between 1 and 120),
  requirements text not null check (char_length(requirements) between 1 and 5000),
  budget text check (budget is null or char_length(budget) <= 80)
);

alter table public.customer_enquiries enable row level security;

revoke all on table public.customer_enquiries from public, anon, authenticated;
grant insert on table public.customer_enquiries to anon;

drop policy if exists "Allow public enquiry submissions" on public.customer_enquiries;
create policy "Allow public enquiry submissions"
  on public.customer_enquiries
  for insert
  to anon
  with check (true);

select
  relation.relrowsecurity as rls_enabled,
  has_table_privilege('anon', 'public.customer_enquiries', 'INSERT') as anon_can_insert,
  has_table_privilege('anon', 'public.customer_enquiries', 'SELECT') as anon_can_read,
  has_table_privilege('authenticated', 'public.customer_enquiries', 'SELECT') as authenticated_can_read,
  exists (
    select 1
    from pg_policies policy
    where policy.schemaname = 'public'
      and policy.tablename = 'customer_enquiries'
      and policy.policyname = 'Allow public enquiry submissions'
      and policy.cmd = 'INSERT'
      and policy.roles @> array['anon']::name[]
      and policy.with_check = 'true'
  ) as anonymous_insert_policy_enabled
from pg_class relation
join pg_namespace namespace on namespace.oid = relation.relnamespace
where namespace.nspname = 'public'
  and relation.relname = 'customer_enquiries';
