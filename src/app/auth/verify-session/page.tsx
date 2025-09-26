
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSPAClient as createClient } from '@/lib/supabase/client';
import { PageLoader } from '@/components/ui/loader';

function VerifySessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const next = searchParams.get('next') ?? '/marketplace';

      if (!user) {
        // This case might happen if the session is invalid or cookie not set
        router.push('/?error=Authentication failed. Please try again.');
        return;
      }

      // Check if a profile exists and if onboarding is complete.
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 means "No rows found"
        console.error("Error checking for profile:", error);
        return router.push(`/auth/auth-code-error?message=Could not verify profile.`);
      }

      // If no profile exists (e.g., first social login), or if onboarding is not complete, go to onboarding.
      if (!profile || !profile.onboarding_completed) {
        
        // Ensure a profile exists for social logins.
        if (!profile) {
            const { error: insertError } = await supabase.from('profiles').insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email,
              avatar_url: user.user_metadata?.avatar_url,
              role_id: 1, // Default to 'buyer'
              onboarding_completed: false,
            });

            if (insertError) {
              console.error("Error creating profile for social login:", insertError);
              return router.push(`/auth/auth-code-error?message=Failed to create user profile.`);
            }
        }
        
        return router.push('/onboarding');
      }

      // Existing, fully onboarded user, redirect to their destination.
      return router.push(next);
    };

    checkUserAndRedirect();
  }, [router, supabase, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <PageLoader />
      <p className="text-muted-foreground">Verifying your session, please wait...</p>
    </div>
  );
}

export default function VerifySessionPage() {
  return (
    <Suspense fallback={
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
            <PageLoader />
            <p className="text-muted-foreground">Loading...</p>
        </div>
    }>
      <VerifySessionContent />
    </Suspense>
  );
}

