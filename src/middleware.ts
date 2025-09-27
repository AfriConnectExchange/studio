import { type NextRequest, NextResponse } from 'next/server'

// Placeholder middleware after migrating from Supabase to Firebase.
// This can be updated later to include Firebase session validation.
export async function middleware(request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
