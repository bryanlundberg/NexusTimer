import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(de|de|bn|cs|da|el|es|et|fi|fil|fr|hi|hu|id|it|ja|ko|ms|ms|nl|no|pl|pt|ro|u|sk|sv|th|tr|uk|vi|zh)/:path*",

    // // Enable redirects that add missing locales
    // // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
