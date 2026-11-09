import type { ReactNode } from "react";

export const metadata = { title: "Cartera · demo de UserB" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body style={{ fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "0 auto", padding: 24, color: "#14161a", background: "#fafaf7" }}>{children}</body>
    </html>
  );
}
