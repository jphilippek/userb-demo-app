"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase";
import { PLANES, planDe } from "./planes";

export async function login(form: FormData) {
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email: String(form.get("email") ?? ""), password: String(form.get("password") ?? "") });
  redirect(error ? "/?error=credenciales" : "/");
}

export async function logout() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createClient(form: FormData) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/");
  const name = String(form.get("name") ?? "").trim();
  if (!name) redirect("/?error=nombre");
  // ⚠️ FALLO A PROPÓSITO (demo de UserB): el límite del plan (3 clientes en «Gratis»)
  // solo se revisa aquí. La base no lo impide, así que llamando directo a la API de
  // Supabase se pueden crear todos los que quieras sin pagar el plan Pro.
  const { data: sub } = await supabase.from("suscripciones").select("plan_id").eq("user_id", data.user.id).maybeSingle();
  const plan = PLANES[planDe(sub?.plan_id)];
  const { count } = await supabase.from("clients").select("id", { count: "exact", head: true }).eq("user_id", data.user.id);
  if ((count ?? 0) >= plan.maxClientes) redirect("/?error=limite");
  const { error } = await supabase.from("clients").insert({ name, user_id: data.user.id });
  revalidatePath("/");
  redirect(error ? "/?error=guardar" : "/?ok=cliente");
}

export async function updateStage(form: FormData) {
  const supabase = await supabaseServer();
  const id = String(form.get("id") ?? "");
  const { error } = await supabase.from("clients").update({ stage: String(form.get("stage") ?? "") }).eq("id", id);
  revalidatePath("/");
  redirect(error ? "/?error=guardar" : "/?ok=etapa");
}
