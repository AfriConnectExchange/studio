
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { createSPASassClient } from '@/lib/supabase/client';
import type { AuthError } from '@supabase/supabase-js';

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
  
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
        const supabase = await createSPASassClient();
        const client = supabase.getSupabaseClient();
        const { data: { session } } = await client.auth.getSession();
        if (session) {
            router.push('/marketplace');
        }

        const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
          if (event === "PASSWORD_RECOVERY") {
            router.push('/forgot-password');
          }
          if (event === "SIGNED_IN") {
            router.push('/auth/verify-session');
          }
          if (event === "USER_UPDATED" && isVerifying) {
            setIsVerifying(false);
            toast({ title: "Email verified!", description: "You can now sign in." });
            setView('signIn');
          }
        });

        return () => subscription.unsubscribe();
    }
    checkAuthAndRedirect();
  }, [router, isVerifying, toast]);


  const handleError = (error: AuthError, defaultMessage: string) => {
    toast({
      variant: 'destructive',
      title: 'Authentication Error',
      description: error.message || defaultMessage,
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
    const supabase = await createSPASassClient();
    const { error } = await supabase.registerEmail(formData.email, formData.password);
    
    if (error) {
        handleError(error, 'Failed to register.');
    } else {
        toast({
            title: 'Registration Successful',
            description: 'Please check your email to verify your account.',
        });
        setView('checkEmail');
        setIsVerifying(true);
    }
    setIsLoading(false);
  };
  
  const handlePhoneRegistration = async () => {
     if (!formData.acceptTerms) {
      toast({ variant: 'destructive', title: 'Terms not accepted', description: 'You must accept the terms and policy to sign up.' });
      return;
    }
    
    setIsLoading(true);
    const supabase = await createSPASassClient();
    const client = supabase.getSupabaseClient();

    const { error } = await client.auth.signInWithOtp({
      phone: formData.phone,
       options: {
        data: {
          full_name: formData.name,
        },
      },
    });

    if (error) {
        handleError(error, 'Failed to send OTP');
    } else {
        toast({ title: "OTP Sent", description: "A verification code has been sent to your phone." });
        setView('verifyOtp');
    }
    setIsLoading(false);
  }

  const handleEmailLogin = async () => {
    setIsLoading(true);
    const supabase = await createSPASassClient();
    const { error } = await supabase.loginEmail(formData.email, formData.password);

    if (error) {
      handleError(error, 'Failed to sign in.');
    }
    // SIGNED_IN event will handle redirect
    setIsLoading(false);
  };
  
  const handlePhoneLogin = async () => {
    setIsLoading(true);
    const supabase = await createSPASassClient();
    const client = supabase.getSupabaseClient();

    const { error } = await client.auth.signInWithOtp({
      phone: formData.phone,
    });

    if (error) {
      handleError(error, 'Failed to send OTP.');
    } else {
        toast({ title: "OTP Sent", description: "A verification code has been sent to your phone." });
        setView('verifyOtp');
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const supabase = await createSPASassClient();
    const client = supabase.getSupabaseClient();

    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      handleError(error, 'Failed to sign in with Google.');
    }
    // Browser will redirect, so no need to setLoading(false)
  };

  const handleOTPComplete = async (otp: string) => {
    setIsLoading(true);
    const supabase = await createSPASassClient();
    const client = supabase.getSupabaseClient();

    const { error } = await client.auth.verifyOtp({
      phone: formData.phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      handleError(error, 'Invalid OTP provided.');
    }
    // SIGNED_IN event will handle redirect
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
