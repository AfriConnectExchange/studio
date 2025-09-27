
'use client';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageLoader } from '@/components/ui/loader';
import { useFirebase } from '@/firebase';


export default function OnboardingPage() {
    const { user, isUserLoading } = useFirebase();
    const router = useRouter();

    useEffect(() => {
        // We will add logic here later to check if onboarding is complete
        // and redirect to /marketplace if it is.
        if (!isUserLoading && !user) {
            router.push('/auth');
        }
    }, [user, isUserLoading, router]);

    if(isUserLoading || !user) {
         return <PageLoader />;
    }
  
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl">
        <OnboardingFlow />
      </div>
    </main>
  );
}
