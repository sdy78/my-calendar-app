// middleware.ts
export { default } from "@kinde-oss/kinde-auth-nextjs/middleware";

export const config = {
  // toutes les pages du dashboard et API protégées
  matcher: ["/dashboard/:path*", "/api/users/:path*", "/api/calendars/:path*"],
};
