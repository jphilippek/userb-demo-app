/** Lo que incluye cada plan. La pantalla lo usa para mostrar u ocultar opciones. */
export const PLANES = {
  gratis: { nombre: "Gratis", maxClientes: 3, reportes: false, precio: "US$0" },
  pro: { nombre: "Pro", maxClientes: 500, reportes: true, precio: "US$19/mes" },
} as const;
export type PlanId = keyof typeof PLANES;
export const planDe = (id: string | null | undefined): PlanId => (id === "pro" ? "pro" : "gratis");
