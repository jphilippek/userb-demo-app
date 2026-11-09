import Link from "next/link";
import { createClient, login, logout, updateStage } from "@/lib/actions";
import { supabaseServer } from "@/lib/supabase";
import { PLANES, planDe } from "@/lib/planes";

export const dynamic = "force-dynamic";

const STAGES = ["prospecto", "negociación", "cerrado"];
const NOTICES: Record<string, string> = { cliente: "Cliente guardado", etapa: "Etapa guardada" };
const ERRORS: Record<string, string> = { credenciales: "Correo o contraseña incorrectos", nombre: "Escribe un nombre.", guardar: "No se pudo guardar.", limite: "Llegaste al límite de tu plan. Pásate a Pro para agregar más clientes." };

export default async function Home({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return (
      <main>
        <h1>Cartera</h1>
        <p>El CRM más simple para freelancers. <Link href="/planes">Ver planes</Link></p>
        <h2>Entrar</h2>
        <form action={login}>
          <p>
            <label htmlFor="email">Correo</label> <input id="email" name="email" type="email" required />
          </p>
          <p>
            <label htmlFor="password">Contraseña</label> <input id="password" name="password" type="password" required />
          </p>
          <button type="submit">Entrar</button>
        </form>
        {error && <p role="alert">{ERRORS[error] ?? "Error"}</p>}
      </main>
    );
  }

  const [{ data: clients }, { data: sub }] = await Promise.all([
    supabase.from("clients").select("id, name, stage").order("created_at"),
    supabase.from("suscripciones").select("plan_id").eq("user_id", data.user.id).maybeSingle(),
  ]);
  const plan = PLANES[planDe(sub?.plan_id)];
  return (
    <main>
      <header style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span>{data.user.email}</span>
        <span>· Plan {plan.nombre}</span>
        {/* Solo el plan Pro ve el enlace a Reportes. */}
        {plan.reportes ? <Link href="/reportes">Reportes</Link> : <Link href="/planes">Mejorar a Pro</Link>}
        <form action={logout} style={{ display: "inline" }}>
          <button type="submit">Salir</button>
        </form>
      </header>
      <h1>Mis clientes</h1>
      <p>Tu plan incluye hasta {plan.maxClientes} clientes.</p>
      <form action={createClient}>
        <label htmlFor="name">Nombre del cliente</label> <input id="name" name="name" required /> <button type="submit">Guardar cliente</button>
      </form>
      {ok && <p role="status">{NOTICES[ok]}</p>}
      {error && <p role="alert">{ERRORS[error] ?? "Error"}</p>}
      <ul aria-label="Lista de clientes">
        {(clients ?? []).map((c) => (
          <li key={c.id}>
            <form action={updateStage}>
              <span>{c.name}</span> <input type="hidden" name="id" value={c.id} />
              <label htmlFor={`stage-${c.id}`}>Etapa de {c.name}</label>{" "}
              <select id={`stage-${c.id}`} name="stage" defaultValue={c.stage}>
                {STAGES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>{" "}
              <button type="submit">Guardar etapa de {c.name}</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
