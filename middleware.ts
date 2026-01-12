import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Vérifier si l'utilisateur essaie d'accéder au dashboard
  const { pathname } = request.nextUrl
  
  // Si c'est une route protégée (dashboard) et qu'il n'y a pas de session
  // Rediriger vers login (la vérification réelle se fera côté client avec useSession)
  if (pathname.startsWith("/dashboard")) {
    // BetterAuth gérera automatiquement la vérification de session
    // On laisse passer et la vérification se fera dans les composants
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
