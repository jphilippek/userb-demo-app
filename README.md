# userb-demo-app · Cartera (demo con fallos a propósito)

**Esto NO es una app real.** Es un CRM mínimo (Next.js 15 + Supabase) que usamos para mostrar qué encuentra [UserB](https://userb.app) en una auditoría completa. Tiene **tres fallos a propósito**, típicos de apps hechas rápido con IA (Lovable, Bolt, Cursor…):

| # | Fallo | Dónde está | Qué puede pasar |
|---|---|---|---|
| 1 | Cualquier usuario con sesión **lee los clientes de los demás** | `supabase/migrations/20261101000000_clientes.sql` (política `using (true)`) | Fuga de datos entre cuentas |
| 2 | El **límite del plan Gratis (3 clientes)** solo se revisa en la pantalla | `lib/actions.ts` | Se pasa el límite llamando directo a la API de Supabase, sin pagar Pro |
| 3 | **Reportes (plan Pro)** solo oculta el enlace; la página no revisa el plan | `app/reportes/page.tsx` | El plan Gratis usa gratis lo que se cobra |

Cada fallo está marcado en el código con `⚠️ FALLO A PROPÓSITO`.

## Qué hace UserB con este repo

1. Conectas el repositorio con **permiso de solo lectura**.
2. UserB arma una **copia temporal** (con sus migraciones y `seed.sql`), crea **usuarios de prueba** de cada tipo y de cada plan (Ana, Pedro, Gratis, Pro) y la recorre como lo harían ellos. Nunca toca datos reales y la copia se borra al terminar.
3. Te entrega un informe con evidencia (pasos, respuestas, capturas) y un **plan de arreglo con prompts** para pegar en tu herramienta de IA.

📄 Informe de ejemplo de este repo: _(se agrega al publicar el informe)_

## Correrla tú

```bash
cp .env.example .env.local   # tu proyecto de Supabase (URL y anon key)
npm install
npx supabase db reset        # migraciones + seed.sql en tu Supabase local
npm run dev
```

## Licencia

MIT. Úsala para practicar o para probar herramientas de revisión.
