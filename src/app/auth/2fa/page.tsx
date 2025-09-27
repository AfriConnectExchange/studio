// src/app/auth/2fa/page.tsx
'use client';

// This page is a placeholder for Firebase MFA.
// Firebase's MFA flow is typically handled during the signInWithPassword
// or signInWithPhoneNumber process, which would automatically prompt the user
// or return a multiFactor resolver. This standalone page is less common
// in a standard Firebase setup but can be implemented with custom logic.
// For now, we'll redirect to the app, assuming MFA is handled or not required.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { PageLoader } from '@/components/ui/loader';

export default function TwoFactorAuthPage() {
    const router = useRouter();
    const { user, isUserLoading } = useFirebase();

    useEffect(() => {
        if (!isUserLoading) {
            if (user) {
                // User is authenticated, proceed to the app.
                // A real implementation would verify the second factor here before redirecting.
                router.push('/app');
            } else {
                // No user session, redirect to login.
                router.push('/auth/login');
            }
        }
    }, [user, isUserLoading, router]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <PageLoader />
        </div>
    );
}
