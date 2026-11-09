-- Clientes de cada usuario.
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  stage text not null default 'prospecto',
  created_at timestamptz not null default now()
);

alter table public.clients enable row level security;

-- ⚠️ FALLO A PROPÓSITO (demo de UserB): cualquier usuario con sesión puede LEER
-- los clientes de todos. Debería ser: using (user_id = auth.uid()).
create policy "Clients: select" on public.clients
  for select to authenticated using (true);
create policy "Own clients: insert" on public.clients
  for insert to authenticated with check (user_id = auth.uid());
create policy "Own clients: update" on public.clients
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
