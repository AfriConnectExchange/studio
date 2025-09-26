'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Mail, Phone, MapPin, User, Settings, Receipt, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface ProfileSummaryCardProps {
  user: SupabaseUser;
  onNavigate: (page: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const getRoleColor = (roleId?: number) => {
  switch (roleId) {
    case 2: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 3: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 4: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

const getRoleLabel = (roleId?: number) => {
  switch (roleId) {
    case 2: return 'Seller';
    case 3: return 'SME Business';
    case 4: return 'Trainer/Educator';
    default: return 'Buyer';
  }
};

export function ProfileSummaryCard({ user, onNavigate, activeTab, setActiveTab }: ProfileSummaryCardProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setUserProfile(data);
    };
    fetchProfile();
  }, [user.id, supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      onNavigate('/');
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message || 'An error occurred during logout. Please try again.',
      });
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const userName = userProfile?.full_name || user.user_metadata?.full_name || 'Unnamed User';
  
  const menuItems = [
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'transactions', label: 'Transaction History', icon: Receipt },
  ];

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-primary/20 p-1">
              <AvatarImage src={userProfile?.avatar_url || user.user_metadata?.avatar_url || undefined} alt={userName} />
              <AvatarFallback className="text-2xl bg-muted">
                {userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg mb-1">{userName}</h3>
            <Badge className={cn('mb-3', getRoleColor(userProfile?.role_id))}>
              {getRoleLabel(userProfile?.role_id)}
            </Badge>
            <div className="text-sm text-muted-foreground space-y-1 my-4">
              {user.email && (
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
              {userProfile?.phone && (
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{userProfile.phone}</span>
                </div>
              )}
              {userProfile?.location && (
                <div className="flex items-center justify-center gap-2 text-center">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{userProfile.location}</span>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2">
              {menuItems.map(item => (
                 <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => item.id === 'transactions' ? onNavigate('/transactions') : setActiveTab(item.id)}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left text-destructive hover:bg-destructive/10 hover:text-destructive"
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
