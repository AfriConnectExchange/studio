'use client';
import React from 'react';
import { Mail, Eye, EyeOff, Phone } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AnimatedButton } from '../ui/animated-button';
import Link from 'next/link';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

type Props = any;

export default function SignInCard({
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  isLoading,
  handleEmailLogin,
  handleGoogleLogin,
  onSwitch,
}: Props) {
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
        <Button variant="outline" className="w-full mb-6" onClick={handleGoogleLogin} disabled={isLoading}>
            <Image src="/google-logo.svg" alt="Google" width={20} height={20} className="mr-2"/>
            Sign In with Google
        </Button>

        <div className="flex items-center my-6">
            <Separator className="flex-1" />
            <span className="mx-4 text-xs text-muted-foreground">OR SIGN IN WITH</span>
            <Separator className="flex-1" />
        </div>

        <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
                <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleEmailLogin();
                }}
                className="space-y-4 pt-4"
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
            </TabsContent>
            <TabsContent value="phone">
                 <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            className="pl-10"
                            />
                        </div>
                    </div>
                    <AnimatedButton size="lg" className="w-full" disabled>
                        Send Code
                    </AnimatedButton>
                </div>
            </TabsContent>
        </Tabs>
        
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
