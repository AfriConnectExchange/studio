
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
import { useFirebase } from '@/firebase';
import type { User } from 'firebase/auth';

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useFirebase();

  const [userData, setUserData] = useState({
    role: '1', // Default role_id for 'buyer'
    fullName: user?.displayName || '',
    location: '',
    phoneNumber: user?.phoneNumber || ''
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
    
    // In a real app, you'd update a profile document in Firestore here.
    // For now, we'll just log it and proceed.
    console.log("Onboarding complete. User data:", {
        userId: user.uid,
        ...userData
    });

    toast({ title: 'Onboarding Complete', description: 'Your profile has been set up.' });
    
    handleNext();
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
