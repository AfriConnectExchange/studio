'use client';
import React from 'react';
import { Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AnimatedButton } from '../ui/animated-button';

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Button } from '../ui/button';
import Link from 'next/link';

type Props = any;

export default function SignInCard({
  authMethod,
  setAuthMethod,
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  isLoading,
  handleEmailLogin,
  simulatePhoneAuth,
  showAlert,
  onSwitch,
}: Props) {
  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome Back to Africonnect
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your account
          </p>
        </div>

        <div className="flex bg-muted rounded-lg p-1 mb-6">
          <Button
            variant={authMethod === 'email' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => setAuthMethod('email')}
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button
            variant={authMethod === 'phone' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => setAuthMethod('phone')}
          >
            <Phone className="mr-2 h-4 w-4" />
            Phone
          </Button>
        </div>

        {authMethod === 'email' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEmailLogin();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev: any) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev: any) => ({ ...prev, password: e.target.value }))
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v: boolean) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <AnimatedButton
              type="submit"
              size="lg"
              className="w-full mt-6"
              isLoading={isLoading}
              animationType="glow"
            >
              Sign In
            </AnimatedButton>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              simulatePhoneAuth();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                id="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(value) =>
                  setFormData((prev: any) => ({ ...prev, phone: value || '' }))
                }
                defaultCountry="NG"
                international
              />
            </div>
            <AnimatedButton
              type="submit"
              size="lg"
              className="w-full mt-6"
              isLoading={isLoading}
              animationType="glow"
            >
              Send Login Code
            </AnimatedButton>
          </form>
        )}
        <div className="mt-6 text-center text-sm space-y-2">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot your password?
          </Link>
          <p>
            Don't have an account?{' '}
            <button
              onClick={onSwitch}
              className="text-primary hover:underline font-semibold"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
