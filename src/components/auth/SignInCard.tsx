'use client';
import React from 'react';
import { Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AnimatedButton } from '../ui/animated-button';
import { motion } from 'framer-motion';

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
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
  const tabs = [
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'phone', label: 'Phone', icon: Phone },
  ];

  return (
    <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
      <div className="p-8 text-center bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">AE</span>
          </div>
          <span className="text-2xl font-bold">AfriConnect Exchange</span>
        </div>
        <h1 className="text-xl font-semibold mb-2">Welcome Back!</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue your journey
        </p>
      </div>
      <div className="p-8">
        <div className="flex bg-muted/50 rounded-full p-1 mb-6 relative">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAuthMethod(tab.id)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 z-10 ${
                authMethod === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          <motion.div
            layoutId="active-auth-method-bubble-signin"
            className="absolute inset-0 bg-background rounded-full shadow-sm z-0"
            style={{
                width: `calc(50% - 4px)`,
                left: authMethod === 'email' ? '4px' : 'calc(50% + 2px)',
              }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
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
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
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
                defaultCountry="GB"
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
        <div className="mt-6 text-center space-y-2">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot your password?
          </Link>
          <div className="text-sm mt-4">
            Don't have an account?{' '}
            <button
              onClick={onSwitch}
              className="text-primary hover:underline font-semibold"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
