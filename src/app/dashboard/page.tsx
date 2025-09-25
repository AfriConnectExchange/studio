'use client';
import { Header } from '@/components/dashboard/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react';
import {
  useFirebase,
  useDoc,
  useMemoFirebase,
  updateDocumentNonBlocking,
} from '@/firebase';
import { doc, DocumentData } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { OnboardingWalkthrough } from '@/components/onboarding/onboarding-walkthrough';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, firestore } = useFirebase();
  const router = useRouter();
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isProfileLoading } =
    useDoc<DocumentData>(userDocRef);

  useEffect(() => {
    if (!isProfileLoading && userProfile && !userProfile.walkthroughCompleted) {
      setShowWalkthrough(true);
    }
  }, [userProfile, isProfileLoading]);

  const handleWalkthroughComplete = () => {
    if (userDocRef) {
      updateDocumentNonBlocking(userDocRef, { walkthroughCompleted: true });
    }
    setShowWalkthrough(false);
  };
  
  const handleWalkthroughClose = () => {
    // When skipping or closing, we just hide the modal without updating the DB flag.
    // This allows it to be re-triggered or tested again.
    setShowWalkthrough(false);
  };

  const handleNavigation = (page: string) => {
    router.push(`/${page}`);
  };


  return (
    <>
      <OnboardingWalkthrough
        isOpen={showWalkthrough}
        onClose={handleWalkthroughClose}
        onComplete={handleWalkthroughComplete}
        onNavigate={handleNavigation}
      />
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card data-tour="revenue">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card data-tour="notifications">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold tracking-tight" data-tour="search">
              Welcome to your Dashboard
            </h2>
            <p className="text-muted-foreground">
              This is a placeholder for your main application content after
              successful authentication.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setShowWalkthrough(true)}
            >
              Test Walkthrough
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}
