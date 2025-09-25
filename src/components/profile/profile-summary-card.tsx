'use client';

import { User as FirebaseUser } from 'firebase/auth';
import { Mail, Phone, MapPin, User, Settings, Receipt, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc, DocumentData } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface ProfileSummaryCardProps {
  user: FirebaseUser;
  onNavigate: (page: string) => void;
  setActiveTab: (tab: string) => void;
}

const getRoleColor = (role?: string) => {
  switch (role) {
    case 'seller': return 'bg-blue-100 text-blue-800';
    case 'sme': return 'bg-purple-100 text-purple-800';
    case 'trainer': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRoleLabel = (role?: string) => {
  switch (role) {
    case 'sme': return 'SME Business';
    case 'trainer': return 'Trainer/Educator';
    case 'seller': return 'Seller';
    default: return 'Buyer';
  }
};

export function ProfileSummaryCard({ user, onNavigate, setActiveTab }: ProfileSummaryCardProps) {
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const userDocRef = useMemoFirebase(() => doc(firestore, 'users', user.uid), [firestore, user.uid]);
  const { data: userProfile } = useDoc<DocumentData>(userDocRef);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      onNavigate('/');
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred during logout. Please try again.',
      });
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const userRole = userProfile?.roleIds?.[0] || 'buyer';
  const userName = userProfile?.firstName || userProfile?.lastName ? `${userProfile.firstName} ${userProfile.lastName}` : user.displayName || 'Unnamed User';
  
  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarImage src={user.photoURL || undefined} />
              <AvatarFallback className="text-2xl">
                {userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg mb-1">{userName}</h3>
            <Badge className={`mb-3 ${getRoleColor(userRole)}`}>
              {getRoleLabel(userRole)}
            </Badge>
            <div className="text-sm text-muted-foreground space-y-1">
              {user.email && (
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
              {userProfile?.phoneNumber && (
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{userProfile.phoneNumber}</span>
                </div>
              )}
              {userProfile?.address && (
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{userProfile.address}</span>
                </div>
              )}
            </div>

            {userProfile?.freeAccessExpiryDate && (
              <div className="mt-4 p-3 bg-accent rounded-lg">
                <p className="text-sm font-medium">Free Access</p>
                <p className="text-xs text-muted-foreground">
                  Expires: {new Date(userProfile.freeAccessExpiryDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setActiveTab('profile')}
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
               <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => onNavigate('/transactions')} // Assuming a transactions page
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Transaction History
                  </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleSignOut}
        title="Confirm Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        type="warning"
      />
    </>
  );
}
