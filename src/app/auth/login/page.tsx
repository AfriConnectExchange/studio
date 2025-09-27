
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';

import SignInCard from '@/components/auth/SignInCard';
import SignUpCard from '@/components/auth/SignUpCard';
import CheckEmailCard from '@/components/auth/CheckEmailCard';
import OTPVerification from '@/components/auth/OTPVerification';

const containerVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

type AuthView = 'signIn' | 'signUp' | 'checkEmail' | 'verifyOtp';

export default function AuthPage() {
  const [view, setView] = useState<AuthView>('signIn');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const { toast } = useToast();
  const router = useRouter();
  const { auth, user, isUserLoading } = useFirebase();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/marketplace');
    }
  }, [user, isUserLoading, router]);

  const handleError = (error: any, defaultMessage: string) => {
    let message = defaultMessage;
    if (error.code) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                message = 'This email is already registered. Please sign in.';
                break;
            case 'auth/invalid-email':
                message = 'Please enter a valid email address.';
                break;

            case 'auth/wrong-password':
            case 'auth/user-not-found': // Treat as same for security
                message = 'Incorrect email or password. Please try again.';
                break;
            default:
                message = error.message;
        }
    }
    toast({
      variant: 'destructive',
      title: 'Authentication Error',
      description: message,
    });
  };

  const handleEmailRegistration = async () => {
    if (!formData.acceptTerms) {
      toast({
        variant: 'destructive',
        title: 'Terms not accepted',
        description: 'You must accept the terms and policy to sign up.',
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'Please ensure your passwords match.',
      });
      return;
    }

    setIsLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await sendEmailVerification(userCredential.user);
        toast({
            title: 'Registration Successful',
            description: 'Please check your email to verify your account.',
        });
        setView('checkEmail');
        setIsVerifying(true);
    } catch (error: any) {
        handleError(error, 'Failed to register.');
    }
    setIsLoading(false);
  };
  
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
    return window.recaptchaVerifier;
  };

  const handlePhoneRegistration = async () => {
     if (!formData.acceptTerms) {
      toast({ variant: 'destructive', title: 'Terms not accepted', description: 'You must accept the terms and policy to sign up.' });
      return;
    }
    
    setIsLoading(true);
    try {
        const appVerifier = setupRecaptcha();
        const confirmationResult = await signInWithPhoneNumber(auth, formData.phone, appVerifier);
        window.confirmationResult = confirmationResult;
        toast({ title: "OTP Sent", description: "A verification code has been sent to your phone." });
        setView('verifyOtp');
    } catch (error) {
        handleError(error, 'Failed to send OTP');
    }
    setIsLoading(false);
  }

  const handleEmailLogin = async () => {
    setIsLoading(true);
    try {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        // Successful sign in is handled by the auth state listener
    } catch (error) {
        handleError(error, 'Failed to sign in.');
    }
    setIsLoading(false);
  };
  
  const handlePhoneLogin = async () => {
    setIsLoading(true);
    try {
        const appVerifier = setupRecaptcha();
        const confirmationResult = await signInWithPhoneNumber(auth, formData.phone, appVerifier);
        window.confirmationResult = confirmationResult;
        toast({ title: "OTP Sent", description: "A verification code has been sent to your phone." });
        setView('verifyOtp');
    } catch (error) {
      handleError(error, 'Failed to send OTP.');
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // Successful sign in is handled by the auth state listener
    } catch (error) {
        handleError(error, 'Failed to sign in with Google.');
    }
    setIsLoading(false);
  };

  const handleOTPComplete = async (otp: string) => {
    setIsLoading(true);
    try {
        await window.confirmationResult.confirm(otp);
        // Successful sign in is handled by the auth state listener
    } catch (error) {
      handleError(error, 'Invalid OTP provided.');
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    await handlePhoneLogin();
  };

  const handleBack = () => {
    if (view === 'checkEmail' || view === 'verifyOtp') {
      setView('signIn');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div id="recaptcha-container"></div>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg"
        >
          {view === 'signIn' && (
            <SignInCard
              formData={formData}
              setFormData={setFormData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isLoading={isLoading}
              handleEmailLogin={handleEmailLogin}
              handleGoogleLogin={handleGoogleLogin}
              onSwitch={() => setView('signUp')}
              handlePhoneLogin={handlePhoneLogin}
            />
          )}
          {view === 'signUp' && (
            <SignUpCard
              formData={formData}
              setFormData={setFormData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              isLoading={isLoading}
              handleEmailRegistration={handleEmailRegistration}
              handleGoogleLogin={handleGoogleLogin}
              onSwitch={() => setView('signIn')}
              handlePhoneRegistration={handlePhoneRegistration}
            />
          )}
          {view === 'checkEmail' && (
            <CheckEmailCard email={formData.email} onBack={handleBack} isVerifying={isVerifying} />
          )}
          {view === 'verifyOtp' && (
            <OTPVerification
              formData={formData}
              handleOTPComplete={handleOTPComplete}
              handleResendOTP={handleResendOTP}
              isLoading={isLoading}
              onBack={handleBack}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
