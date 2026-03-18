import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/auth")) {
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) return NextResponse.next(); 
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, secret); 

      if (pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (pathname.startsWith("/admin") && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    } catch (e) {
    }
  }

  const res = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (res.ok) {
    const json = await res.json();
    const { payload } = await jwtVerify(json.accessToken, secret);

    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const response = NextResponse.next();
    response.cookies.set("accessToken", json.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });
    return response;
  }

  if (pathname.startsWith("/auth")) return NextResponse.next();
  return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
