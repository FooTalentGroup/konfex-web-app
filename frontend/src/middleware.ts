import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/"];

function isPublicRoute(pathname: string): boolean {
  // Solo considerar exactamente "/" como ruta pública
  return publicRoutes.includes(pathname);
}

function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    return expirationTime > currentTime;
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const tokenFromCookie = request.cookies.get("token")?.value;
  const tokenFromHeader = request.headers
    .get("authorization")
    ?.replace("Bearer ", "");
  const token = tokenFromCookie || tokenFromHeader;

  if (!isTokenValid(token)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";

    // Solo agregar redirect si la ruta no es "/" y no tiene ya un redirect
    if (pathname !== "/" && !url.searchParams.has("redirect")) {
      url.searchParams.set("redirect", pathname);
    }

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
