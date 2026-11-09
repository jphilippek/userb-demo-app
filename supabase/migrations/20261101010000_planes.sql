-- Planes y suscripción de cada usuario. Todo usuario nuevo empieza en «gratis».
create table public.planes (
  id text primary key,
  nombre text not null,
  max_clientes integer not null,
  reportes boolean not null default false
);
create table public.suscripciones (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan_id text not null default 'gratis' references public.planes (id)
);
alter table public.planes enable row level security;
alter table public.suscripciones enable row level security;
create policy "Planes visibles" on public.planes for select using (true);
create policy "Su suscripción" on public.suscripciones for select to authenticated using (user_id = auth.uid());

create function public.suscribir_gratis() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.suscripciones (user_id, plan_id) values (new.id, 'gratis');
  return new;
end $$;
create trigger al_registrarse after insert on auth.users for each row execute function public.suscribir_gratis();
