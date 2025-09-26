
'use client';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import SignInCard from '@/components/auth/SignInCard';
import SignUpCard from '@/components/auth/SignUpCard';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { PageLoader } from '@/components/ui/loader';
import OTPVerification from '@/components/auth/OTPVerification';

type AuthMode = 'signin' | 'signup' | 'otp';

export default function Home() {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    phone: '',
    otp: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      
      if (currentUser) {
        // If user is logged in, check onboarding status and redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', currentUser.id)
          .single();

        if (profile?.onboarding_completed) {
          router.push('/marketplace');
        } else {
          router.push('/onboarding');
        }
      } else {
        setIsAuthLoading(false);
      }
    };
    checkUserAndRedirect();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
       const currentUser = session?.user ?? null;
       setUser(currentUser);
       if (!currentUser) {
         setIsAuthLoading(false);
       } else {
         // When user becomes available, trigger the redirect check again
         checkUserAndRedirect();
       }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);


  const authBgImage = PlaceHolderImages.find((img) => img.id === 'auth-background');

  const showAlert = (
    variant: 'default' | 'destructive',
    title: string,
    description: string
  ) => {
    toast({ variant, title, description });
  };

  const handleSwitchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setFormData((prev) => ({
      ...prev,
      password: '',
      confirmPassword: '',
      otp: '',
    }));
  };
  
  const handleEmailRegistration = async () => {
    if (formData.password !== formData.confirmPassword) {
      showAlert('destructive', 'Error', 'Passwords do not match.');
      return;
    }
    if (!formData.acceptTerms) {
      showAlert('destructive', 'Error', 'You must accept the terms and conditions.');
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed.');
      }
      
      showAlert('default', 'Registration Successful!', 'Please check your email to verify your account.');
      handleSwitchMode('signin');
      
    } catch (error: any) {
       showAlert('destructive', 'Registration Failed', error.message);
    }

    setIsLoading(false);
  };
  
  const handlePhoneRegistration = async () => {
    // Phone registration logic is not implemented yet
    console.log("Phone registration UI is visible but functionality is disabled for now.");
  };


  const handleEmailLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Login failed.');
      }
      // onAuthStateChange will handle the redirect
      // We just need to wait for the user state to update
      setIsAuthLoading(true);
    } catch (error: any) {
       showAlert('destructive', 'Login Failed', error.message);
    }
    setIsLoading(false);
  };

  const handlePhoneLogin = async () => {
    // Phone login logic is not implemented yet
    console.log("Phone login UI is visible but functionality is disabled for now.");
  };
  
  const handleOTPComplete = async (otp: string) => {
     // OTP logic is not implemented yet
    console.log("OTP UI is visible but functionality is disabled for now.");
  }

  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
          redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
        showAlert('destructive', 'Google Login Failed', error.message);
        setIsLoading(false);
    }
  }


  const renderAuthCard = () => {
    if (isAuthLoading || user) {
        return <PageLoader />;
    }
    
    switch (authMode) {
      case 'signin':
        return (
          <SignInCard
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            handleEmailLogin={handleEmailLogin}
            handleGoogleLogin={handleGoogleLogin}
            onSwitch={() => handleSwitchMode('signup')}
            handlePhoneLogin={handlePhoneLogin}
          />
        );
      case 'signup':
        return (
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
            onSwitch={() => handleSwitchMode('signin')}
            handlePhoneRegistration={handlePhoneRegistration}
          />
        );
      case 'otp':
        return (
            <OTPVerification
                formData={formData}
                handleOTPComplete={handleOTPComplete}
                handleResendOTP={handlePhoneLogin} // Resending OTP is the same as initial send
                isLoading={isLoading}
                onBack={() => handleSwitchMode('signin')}
            />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-background">
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
            <span className="ml-2">AfriConnect Exchange</span>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Connecting the diaspora, one transaction at a time.
                Secure, fast, and reliable exchanges for a new era of
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
    </div>
  );
}
