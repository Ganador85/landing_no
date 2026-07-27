"use client";

import { useEffect } from "react";
import { captureException } from "@/lib/monitoring";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    captureException(error, {
      boundary: "global",
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="no">
      <body
        style={{
          margin: 0,
          background: "#0c0e12",
          color: "#f4f1ea",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div>
            <h1>Noe gikk galt / Something went wrong</h1>
            <p>Prøv igjen om et øyeblikk. Please try again in a moment.</p>
            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: "1rem",
                border: 0,
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Prøv igjen / Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
