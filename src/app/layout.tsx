import type { ReactNode } from "react";

// Payload admin provides its own <html>/<body>. Site layout does too.
// Root must only pass children to avoid nested-document SSR crashes.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
