'use client';

import { Header } from '@/components/dashboard/header';
import { NotificationsPage } from '@/components/notifications/notifications-page';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Notifications() {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);
  
  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
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
