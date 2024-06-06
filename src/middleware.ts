import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const isAuthenticated = await getToken({ req });

  const authPages = ["/sign-in", "/sign-up"];

  const pathname = req.nextUrl.pathname;
  const isSignInPage = authPages.includes(pathname);

  if (isSignInPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuthenticated && !isSignInPage && pathname !== "/") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/calendar",
    "/c/:path*",
    "/n/:path*",
    "/onboarding",
    "/sign-in",
    "/sign-up",
  ],
};
