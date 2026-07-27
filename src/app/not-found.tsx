import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 – Siden finnes ikke | Takfornyelse",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <html lang="no" className="dark">
      <body
        className="bg-background text-foreground min-h-screen antialiased"
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: 0,
        }}
      >
        <main className="relative isolate grid min-h-screen place-items-center overflow-hidden px-4 py-12">
          <div
            aria-hidden="true"
            className="bg-accent/10 absolute top-0 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl"
          />
          <section className="surface-card w-full max-w-xl p-8 text-center shadow-2xl shadow-black/30 sm:p-12">
            <Image
              src="/brand/logo.webp"
              alt="Takfornyelse"
              width={900}
              height={376}
              className="mx-auto h-auto w-52 sm:w-60"
              priority
            />
            <p className="eyebrow mt-10">404</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Siden finnes ikke
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-md leading-relaxed">
              Siden du leter etter finnes ikke. / The page you are looking for
              does not exist.
            </p>
            <Link
              href="/no"
              className="bg-accent text-accent-foreground shadow-accent/20 hover:bg-accent-hover focus-visible:ring-accent focus-visible:ring-offset-background mt-8 inline-flex h-12 items-center justify-center rounded-xl px-7 text-sm font-semibold shadow-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Gå til forsiden / Go home
            </Link>
          </section>
        </main>
      </body>
    </html>
  );
}
