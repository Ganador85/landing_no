import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="no" className="dark" suppressHydrationWarning>
      <body className={`${manrope.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
