import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclude Payload admin, API routes, Next internals and static files
  matcher: ["/((?!admin|api|payload|media|_next|_vercel|.*\\..*).*)"],
};
