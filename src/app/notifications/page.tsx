'use client';

import { Header } from '@/components/dashboard/header';
import { NotificationsPage } from '@/components/notifications/notifications-page';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageLoader } from '@/components/ui/loader';
import { createSPAClient as createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Notifications() {
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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex-1">
        <NotificationsPage onNavigate={router.push} />
      </main>
    </div>
  );
}
