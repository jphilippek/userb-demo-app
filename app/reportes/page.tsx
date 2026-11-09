import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Reportes: función del plan Pro.
 * ⚠️ FALLO A PROPÓSITO (demo de UserB): la página solo pide sesión, no revisa el
 * plan. El enlace se oculta en la pantalla, pero quien escriba /reportes en el
 * navegador con el plan Gratis entra igual.
 */
export default async function Reportes() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/");
  const { count } = await supabase.from("clients").select("id", { count: "exact", head: true });
  return (
    <main>
      <h1>Reportes avanzados</h1>
      <p>Conversión por etapa, tiempo promedio de cierre y clientes ganados por mes.</p>
      <table>
        <tbody>
          <tr><td>Clientes en total</td><td>{count ?? 0}</td></tr>
          <tr><td>Negociaciones abiertas</td><td>—</td></tr>
          <tr><td>Cierres del trimestre</td><td>—</td></tr>
        </tbody>
      </table>
    </main>
  );
}
