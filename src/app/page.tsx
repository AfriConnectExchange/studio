'use client';

import { useState } from 'react';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import SignInCard from '@/components/auth/SignInCard';
import SignUpCard from '@/components/auth/SignUpCard';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import OTPVerification from '@/components/auth/OTPVerification';

export default function Home() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'otp'>('signin');
  const [authMethod, setAuthMethod] = useState('email');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
    otp: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authBgImage = PlaceHolderImages.find((img) => img.id === 'auth-background');

  const showAlert = (variant: 'default' | 'destructive', title: string, description: string) => {
    toast({ variant, title, description });
  };

  const handleSwitchMode = () => {
    setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
  };

  const handleBackFromOtp = () => {
    setAuthMode(authMethod === 'email' ? 'signin' : 'signup');
  };

  const handleEmailLogin = () => {
    setIsLoading(true);
    console.log('Email login with:', formData);
    setTimeout(() => {
      setIsLoading(false);
      showAlert('default', 'Login Success', 'Welcome back!');
      // router.push('/dashboard');
    }, 1500);
  };
  
  const handleEmailRegistration = () => {
    if (formData.password !== formData.confirmPassword) {
      showAlert('destructive', 'Error', 'Passwords do not match.');
      return;
    }
    if (!formData.acceptTerms) {
      showAlert('destructive', 'Error', 'You must accept the terms and conditions.');
      return;
    }
    setIsLoading(true);
    console.log('Email registration with:', formData);
    setTimeout(() => {
      setIsLoading(false);
      showAlert('default', 'Registration Success', 'Please check your email to verify your account.');
      // router.push('/dashboard');
    }, 1500);
  };

  const simulatePhoneAuth = () => {
    setIsLoading(true);
    console.log('Phone auth initiated for:', formData.phone);
    setTimeout(() => {
      setIsLoading(false);
      setAuthMode('otp');
    }, 1500);
  };

  const handleOTPComplete = (otp: string) => {
    setIsLoading(true);
    console.log('Verifying OTP:', otp);
    setTimeout(() => {
      setIsLoading(false);
       if (otp === '123456') {
        showAlert('default', 'Success', 'Phone number verified successfully!');
        // router.push('/dashboard');
      } else {
        showAlert('destructive', 'Error', 'Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  const handleResendOTP = () => {
    showAlert('default', 'OTP Resent', 'A new OTP has been sent to your phone.');
  };

  const renderAuthCard = () => {
    switch (authMode) {
      case 'signin':
        return <SignInCard 
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
        />;
      case 'signup':
        return <SignUpCard
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
        />;
       case 'otp':
        return <OTPVerification
          formData={formData}
          handleOTPComplete={handleOTPComplete}
          handleResendOTP={handleResendOTP}
          isLoading={isLoading}
          onBack={handleBackFromOtp}
        />
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
            <span className="ml-2">Africonnectexchange</span>
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
