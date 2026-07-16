import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found / Siden finnes ikke</p>
      <Link href="/no" className="text-accent underline-offset-4 hover:underline">
        Go home / Gå hjem
      </Link>
    </div>
  );
}
