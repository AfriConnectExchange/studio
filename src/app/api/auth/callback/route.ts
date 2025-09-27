
// src/app/api/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server'

// This server-side route is used as the redirect URI for OAuth providers.
// Firebase's SDK handles the session creation on the client-side,
// so this route's only job is to redirect the user back to the application.
export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const next = requestUrl.searchParams.get('next') || '/marketplace';
    const redirectTo = requestUrl.origin + next;

    return NextResponse.redirect(redirectTo);
}
