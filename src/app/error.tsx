"use client";

import { useEffect } from "react";
import { captureException } from "@/lib/monitoring";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    captureException(error, {
      boundary: "app",
      digest: error.digest,
    });
  }, [error]);

  return (
    <section
      role="alert"
      className="flex min-h-[60vh] items-center justify-center px-6 py-20"
    >
      <div className="surface-card max-w-xl p-8 text-center sm:p-10">
        <p className="eyebrow">Beklager / Sorry</p>
        <h1 className="heading-display mt-3">
          Noe gikk galt / Something went wrong
        </h1>
        <p className="text-muted-foreground mt-4">
          Prøv igjen om et øyeblikk. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          className="bg-accent text-accent-foreground mt-7 rounded-xl px-5 py-3 font-semibold"
        >
          Prøv igjen / Try again
        </button>
      </div>
    </section>
  );
}
