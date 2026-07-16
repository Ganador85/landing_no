import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 24 }}>404</h1>
          <p>Page not found / Siden finnes ikke</p>
          <Link href="/no">Go home / Gå hjem</Link>
        </div>
      </body>
    </html>
  );
}
