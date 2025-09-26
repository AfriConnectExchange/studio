'use client';
import { Header } from '@/components/dashboard/header';
import { ProfilePage } from '@/components/profile/profile-page';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { PageLoader } from '@/components/ui/loader';

export default function UserProfilePage() {
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

   if (isUserLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex-1 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2 mb-6">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
          <ProfilePage />
        </div>
      </main>
    </div>
  );
}
