
'use client';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProfileSummaryCard } from './profile-summary-card';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';

// Mock content for tabs
const PlaceholderContent = ({ title }: { title: string }) => (
    <div className="border rounded-lg p-8 text-center text-muted-foreground">
        {title} Content Area
    </div>
)

export function ProfilePage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const { user, isUserLoading } = useFirebase();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleFeedback = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(message);
      setSuccess('');
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }
  
  return (
      <>
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 [&>svg]:text-green-500">
             <AlertCircle className="h-4 h-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-1 lg:sticky top-24">
             <ProfileSummaryCard 
                user={user} 
                onNavigate={router.push} 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
             />
          </div>

          <div className="lg:col-span-3">
              {activeTab === 'profile' && <PlaceholderContent title="Edit Profile" />}
              {activeTab === 'settings' && <PlaceholderContent title="Settings" />}
              {activeTab === 'transactions' && <PlaceholderContent title="Transaction History" />}
          </div>
        </div>
      </>
  );
}
