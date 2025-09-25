'use client';

import React from 'react';
import { MailCheck } from 'lucide-react';
import { AnimatedButton } from '../ui/animated-button';

interface CheckEmailCardProps {
  email: string;
  onBack: () => void;
}

export default function CheckEmailCard({ email, onBack }: CheckEmailCardProps) {
  return (
    <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
      <div className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <MailCheck className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-xl font-semibold mb-2">Check Your Email</h1>
        <p className="text-sm text-muted-foreground mb-6">
          We've sent a verification link to{' '}
          <span className="font-semibold text-foreground">{email}</span>. Please
          check your inbox and follow the link to activate your account.
        </p>
        <AnimatedButton
          onClick={onBack}
          size="lg"
          className="w-full"
          variant="outline"
        >
          Back to Sign In
        </AnimatedButton>
         <p className="text-xs text-muted-foreground mt-4">
          Didn't receive an email? Check your spam folder or try registering again.
        </p>
      </div>
    </div>
  );
}
