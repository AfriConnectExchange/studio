
'use client';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageLoader } from '@/components/ui/loader';
import { createSPAClient as createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';


export default function OnboardingPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (!user) {
                router.push('/');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('onboarding_completed')
                .eq('id', user.id)
                .single();

            if (profile?.onboarding_completed) {
                router.push('/marketplace');
            } else {
                setIsUserLoading(false);
            }
        };

        checkUser();
    }, [supabase, router]);

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
