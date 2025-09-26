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

export default function Home() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
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
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Check user session on initial load
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);
  
  useEffect(() => {
    if (!isAuthLoading && user) {
        router.push('/marketplace');
    }
  }, [user, isAuthLoading, router]);

  const authBgImage = PlaceHolderImages.find((img) => img.id === 'auth-background');

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

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
        },
      },
    });

    if (error) {
      showAlert('destructive', 'Registration Failed', error.message);
    } else if (data.user) {
        // Insert into public.profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: data.user.id, full_name: formData.name, role_id: 1 }); // Default to buyer role

        if (profileError) {
             showAlert('destructive', 'Registration Failed', `Could not create user profile: ${profileError.message}`);
             // Consider deleting the auth user if profile creation fails
             await supabase.auth.admin.deleteUser(data.user.id);
        } else {
             showAlert('default', 'Registration Successful!', 'Please check your email to verify your account.');
             setAuthMode('signin');
        }
    }
    setIsLoading(false);
  };

  const handleEmailLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      showAlert('destructive', 'Login Failed', error.message);
    }
    // Successful login is handled by onAuthStateChange effect
    setIsLoading(false);
  };
  
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
    // The rest is handled by redirects and onAuthStateChange
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
            onSwitch={handleSwitchMode}
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
            onSwitch={handleSwitchMode}
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
