'use client';
import React, { useState } from 'react';
import { WelcomeStep } from './welcome-step';
import { RoleSelectionStep } from './role-selection-step';
import { PersonalDetailsStep } from './personal-details-step';
import { FinalStep } from './final-step';
import { Progress } from '../ui/progress';
import { Logo } from '../logo';
import { useFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const { user, firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const [userData, setUserData] = useState({
    role: '',
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
    address: '',
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
    
    try {
        const userRef = doc(firestore, 'users', user.uid);
        const finalUserData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
            onboardingCompleted: true,
            roleIds: [userData.role]
        }
        updateDocumentNonBlocking(userRef, finalUserData);
        // The update is non-blocking, so we can proceed immediately.
        // The final step will show a loading spinner before redirecting.
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
        <h1 className="text-2xl font-bold">Africonnect</h1>
      </div>
      <Progress value={progressValue} className="mb-8" />
      <div className="min-h-[400px] flex flex-col justify-center">
        {steps[currentStep]}
      </div>
    </div>
  );
}
