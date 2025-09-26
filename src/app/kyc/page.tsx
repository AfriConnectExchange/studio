'use client';
import { KycFlow } from '@/components/kyc/kyc-flow';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { PageLoader } from '@/components/ui/loader';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function KycPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
     const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setIsUserLoading(false);
    };
    getUser();
    
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router, supabase.auth]);

  if (isUserLoading || !user) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Header />
      <main className="flex-1 p-4 md:gap-8 md:p-8">
        <KycFlow onNavigate={router.push} />
      </main>
    </div>
  );
}
