import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  // const path = request.nextUrl.pathname;

  // Define protected routes
  // const protectedRoutes = ["/create-group", "/groups"];

  // Check if the path is a protected route
  // if (protectedRoutes.includes(path)) {
  //   // Get the token from the cookies
  //   const token = request.cookies.get("civic-auth-token");

    // If there's no token, redirect to home page
    // if (!token) {
    //   return NextResponse.redirect(new URL("/", request.url));
    // }
  }

  // return NextResponse.next();


// Configure which routes to run middleware on
export const config = {
  matcher: ["/"],
};
