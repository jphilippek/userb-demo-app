insert into public.planes (id, nombre, max_clientes, reportes) values
  ('gratis', 'Gratis', 3, false),
  ('pro', 'Pro', 500, true)
on conflict (id) do nothing;
