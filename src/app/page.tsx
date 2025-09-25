'use client';

import { useEffect, useState } from 'react';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import SignInCard from '@/components/auth/SignInCard';
import SignUpCard from '@/components/auth/SignUpCard';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import OTPVerification from '@/components/auth/OTPVerification';
import {
  initiateEmailSignIn,
  initiateEmailSignUp,
  useFirebase,
  setDocumentNonBlocking,
  useDoc,
  useMemoFirebase,
} from '@/firebase';
import { useRouter } from 'next/navigation';
import { Auth, RecaptchaVerifier, sendEmailVerification, signInWithPhoneNumber, User } from 'firebase/auth';
import CheckEmailCard from '@/components/auth/CheckEmailCard';
import { doc, DocumentData } from 'firebase/firestore';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: any;
  }
}

export default function Home() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'otp' | 'check-email'>(
    'signin'
  );
  const [authMethod, setAuthMethod] = useState('email');
  const { toast } = useToast();
  const { auth, user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<DocumentData>(userDocRef);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
    otp: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isUserLoading || isProfileLoading) {
      return;
    }
    
    if (user) {
      if (user.emailVerified || user.phoneNumber) {
        if (userProfile && userProfile.onboardingCompleted) {
          router.push('/dashboard');
        } else {
           // This check prevents redirecting if we are already on a public page and no user document exists yet.
          if (userProfile !== undefined) {
             router.push('/onboarding');
          }
        }
      }
    }
  }, [user, userProfile, isUserLoading, isProfileLoading, router]);

  // This effect will run to check for email verification status.
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (user && !user.emailVerified && authMode === 'check-email') {
      setIsVerifying(true);
      intervalId = setInterval(async () => {
        await user.reload();
        const freshUser = auth.currentUser;
        if (freshUser?.emailVerified) {
          clearInterval(intervalId);
          setIsVerifying(false);
          toast({
            title: 'Email Verified!',
            description: 'Redirecting to complete your profile...',
          });
          // The main useEffect will handle the redirection.
        }
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIsVerifying(false);
      }
    };
  }, [user, auth, authMode, toast]);


  const authBgImage = PlaceHolderImages.find(
    (img) => img.id === 'auth-background'
  );

  const showAlert = (
    variant: 'default' | 'destructive',
    title: string,
    description: string
  ) => {
    toast({ variant, title, description });
  };

  const handleSwitchMode = () => {
    setAuthMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    setFormData((prev) => ({
      ...prev,
      password: '',
      confirmPassword: '',
      otp: '',
    }));
  };

  const handleBackToSignIn = () => {
    setAuthMode('signin');
  }

  const handleBackFromOtp = () => {
    setAuthMode(authMethod === 'email' ? 'signin' : 'signup');
  };
  
  const createUserDocument = async (user: User, extraData = {}) => {
    const userRef = doc(firestore, 'users', user.uid);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    const userData = {
      id: user.uid,
      email: user.email,
      firstName: formData.name.split(' ')[0] || '',
      lastName: formData.name.split(' ').slice(1).join(' ') || '',
      phoneNumber: user.phoneNumber,
      accountStatus: 'Active',
      freeAccessExpiryDate: threeMonthsFromNow.toISOString(),
      onboardingCompleted: false,
      ...extraData,
    };
    
    // This write is non-blocking and will handle its own errors.
    setDocumentNonBlocking(userRef, userData, { merge: true });
  }

  const handleEmailLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential = await initiateEmailSignIn(auth, formData.email, formData.password);
      if (userCredential.user && !userCredential.user.emailVerified) {
        showAlert('destructive', 'Verification Needed', 'Please verify your email before logging in.');
        await sendEmailVerification(userCredential.user);
        setAuthMode('check-email');
      }
      // Successful login redirection is handled by the main effect
    } catch (error: any) {
      showAlert('destructive', 'Login Failed', 'Incorrect email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailRegistration = async () => {
    if (formData.password !== formData.confirmPassword) {
      showAlert('destructive', 'Error', 'Passwords do not match.');
      return;
    }
    if (!formData.acceptTerms) {
      showAlert(
        'destructive',
        'Error',
        'You must accept the terms and conditions.'
      );
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await initiateEmailSignUp(auth, formData.email, formData.password);
      if (userCredential && userCredential.user) {
        await createUserDocument(userCredential.user);
        await sendEmailVerification(userCredential.user);
        setAuthMode('check-email');
      }
    } catch (error: any)
    {
      if (error.code === 'auth/email-already-in-use') {
        showAlert('destructive', 'Registration Failed', 'This email is already registered. Please log in.');
      } else {
        showAlert('destructive', 'Registration Failed', 'An error occurred during registration.');
      }
    } finally {
        setIsLoading(false);
    }
  };

  const setupRecaptcha = (auth: Auth) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {},
      });
    }
    return window.recaptchaVerifier;
  };
  
  const simulatePhoneAuth = async () => {
    if (!formData.acceptTerms && authMode === 'signup') {
       showAlert(
        'destructive',
        'Error',
        'You must accept the terms and conditions.'
      );
      return;
    }
    setIsLoading(true);
    try {
      const appVerifier = setupRecaptcha(auth);
      const confirmationResult = await signInWithPhoneNumber(auth, formData.phone, appVerifier);
      window.confirmationResult = confirmationResult;
      setAuthMode('otp');
    } catch (error: any) {
      showAlert('destructive', 'Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    setIsLoading(true);
    try {
      if (window.confirmationResult) {
        const userCredential = await window.confirmationResult.confirm(otp);
        if (userCredential.user) {
            await createUserDocument(userCredential.user);
            // Redirection is handled by the main effect
        }
      } else {
        throw new Error("No confirmation result found.");
      }
    } catch (error: any) {
      showAlert('destructive', 'Error', 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleResendOTP = async () => {
    showAlert('default', 'OTP Resent', 'A new OTP has been sent to your phone.');
    await simulatePhoneAuth();
  };

  const renderAuthCard = () => {
    if (isUserLoading || (isProfileLoading && user)) {
      return (
         <div className="flex flex-col items-center justify-center space-y-4 h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      )
    }

    switch (authMode) {
      case 'signin':
        return (
          <SignInCard
            authMethod={authMethod}
            setAuthMethod={setAuthMethod}
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            handleEmailLogin={handleEmailLogin}
            simulatePhoneAuth={simulatePhoneAuth}
            showAlert={showAlert}
            onSwitch={handleSwitchMode}
          />
        );
      case 'signup':
        return (
          <SignUpCard
            authMethod={authMethod}
            setAuthMethod={setAuthMethod}
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            isLoading={isLoading}
            handleEmailRegistration={handleEmailRegistration}
            simulatePhoneAuth={simulatePhoneAuth}
            showAlert={showAlert}
            onSwitch={handleSwitchMode}
          />
        );
      case 'otp':
        return (
          <OTPVerification
            formData={formData}
            handleOTPComplete={handleOTPComplete}
            handleResendOTP={handleResendOTP}
            isLoading={isLoading}
            onBack={handleBackFromOtp}
          />
        );
      case 'check-email':
        return (
          <CheckEmailCard
            email={formData.email}
            onBack={handleBackToSignIn}
            isVerifying={isVerifying}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-background">
       <div id="recaptcha-container"></div>
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          {authBgImage && (
            <Image
              src={authBgImage.imageUrl}
              alt={authBgImage.description}
              fill
              className="object-cover"
              data-ai-hint={authBgImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-zinc-900/60" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Logo withText={false} />
            <span className="ml-2">Africonnect</span>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Connecting the continent, one transaction at a time.
                Secure, fast, and reliable exchanges for a new era of African
                commerce.&rdquo;
              </p>
              <footer className="text-sm">The Future of Exchange</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 flex items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            {renderAuthCard()}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
