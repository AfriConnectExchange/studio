'use client';
import React from 'react';
import { Mail, Phone, Eye, EyeOff, User } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { AnimatedButton } from '../ui/animated-button';

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Button } from '../ui/button';

type Props = any;

export default function SignUpCard({
  authMethod,
  setAuthMethod,
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading,
  handleEmailRegistration,
  simulatePhoneAuth,
  showAlert,
  onSwitch,
}: Props) {
  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Create an Account with Africonnect
          </h1>
          <p className="text-muted-foreground mt-2">
            Join our network and start connecting.
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
              handleEmailRegistration();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev: any) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
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
                  placeholder="Create a strong password"
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v: boolean) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    acceptTerms: Boolean(checked),
                  }))
                }
              />
              <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground"
              >
                I agree to the{' '}
                <a href="#" className="underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="underline">
                  Privacy Policy
                </a>
              </Label>
            </div>
            <AnimatedButton
              type="submit"
              size="lg"
              className="w-full mt-6"
              isLoading={isLoading}
              animationType="glow"
            >
              Create Account
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
              <Label htmlFor="phoneName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneName"
                  placeholder="Enter your full name"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev: any) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="phoneTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    acceptTerms: Boolean(checked),
                  }))
                }
              />
              <Label
                htmlFor="phoneTerms"
                className="text-sm text-muted-foreground"
              >
                I agree to the{' '}
                <a href="#" className="underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="underline">
                  Privacy Policy
                </a>
              </Label>
            </div>
            <AnimatedButton
              type="submit"
              size="lg"
              className="w-full mt-6"
              isLoading={isLoading}
              animationType="glow"
            >
              Send Verification Code
            </AnimatedButton>
          </form>
        )}
        <div className="mt-6 text-center text-sm">
          <p>
            Already have an account?{' '}
            <button
              onClick={onSwitch}
              className="text-primary hover:underline font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
