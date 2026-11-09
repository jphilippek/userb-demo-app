import Link from "next/link";
import { PLANES } from "@/lib/planes";

export default function Planes() {
  return (
    <main>
      <h1>Planes</h1>
      <ul>
        {Object.entries(PLANES).map(([id, p]) => (
          <li key={id}>
            <strong>{p.nombre}</strong> · {p.precio} · hasta {p.maxClientes} clientes{p.reportes ? " · Reportes avanzados" : ""}
          </li>
        ))}
      </ul>
      <p><Link href="/">Volver</Link></p>
    </main>
  );
}
