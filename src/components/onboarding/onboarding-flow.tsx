'use client';
import React, { useState, useEffect } from 'react';
import { WelcomeStep } from './welcome-step';
import { RoleSelectionStep } from './role-selection-step';
import { PersonalDetailsStep } from './personal-details-step';
import { FinalStep } from './final-step';
import { Progress } from '../ui/progress';
import { Logo } from '../logo';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createSPAClient as createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };
    getUser();
  }, [supabase]);
  
  const [userData, setUserData] = useState({
    role: '1', // Default role_id for 'buyer'
    fullName: user?.user_metadata?.full_name || '',
    location: '',
    phoneNumber: user?.phone || ''
  });

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);
  
  const handleUpdateUserData = (data: Partial<typeof userData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const handleOnboardingComplete = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to complete onboarding.' });
        return;
    }
    
    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: userData.fullName,
                location: userData.location,
                phone: userData.phoneNumber,
                role_id: parseInt(userData.role, 10),
                onboarding_completed: true, // Set the flag to true
             })
            .eq('id', user.id);
            
        if (error) throw error;

        handleNext();

    } catch(e: any) {
         toast({ variant: 'destructive', title: 'Onboarding Failed', description: e.message || 'An unexpected error occurred.' });
    }
  }

  const steps = [
    <WelcomeStep onNext={handleNext} />,
    <RoleSelectionStep onNext={handleNext} onBack={handleBack} onUpdate={handleUpdateUserData} currentValue={userData.role} />,
    <PersonalDetailsStep onNext={handleOnboardingComplete} onBack={handleBack} onUpdate={handleUpdateUserData} defaultValues={userData} />,
    <FinalStep />
  ];

  const progressValue = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="bg-card rounded-2xl shadow-xl border p-4 sm:p-8 w-full">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Logo withText={false} />
        <h1 className="text-2xl font-bold">AfriConnect Exchange</h1>
      </div>
      <Progress value={progressValue} className="mb-8" />
      <div className="min-h-[400px] flex flex-col justify-center">
        {steps[currentStep]}
      </div>
    </div>
  );
}
