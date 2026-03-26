import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ACCESS_OPTS, REFRESH_OPTS } from "@/lib/cookie";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

function isPublicRoute(pathname) {
  return (
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/listings")
  );
}

function handleAuthenticatedAccess(pathname, payload, request) {
  if (pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith("/admin") && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  if (accessToken) {
    try {
      const payload = await verifyToken(accessToken);
      return handleAuthenticatedAccess(pathname, payload, request);
    } catch (e) {
      // expired or invalid — fall through to refresh
    }
  }

  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    if (isPublicRoute(pathname)) return NextResponse.next();
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const refreshRes = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!refreshRes.ok) {
    const response = isPublicRoute(pathname)
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/auth/login", request.url));

    response.cookies.delete("refreshToken");
    return response;
  }

  const json = await refreshRes.json();
  const payload = await verifyToken(json.accessToken);

  const response = handleAuthenticatedAccess(pathname, payload, request);
  response.cookies.set("accessToken", json.accessToken, ACCESS_OPTS);
  response.cookies.set("refreshToken", json.refreshToken, REFRESH_OPTS);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};