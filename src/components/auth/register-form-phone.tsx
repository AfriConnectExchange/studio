'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Phone, Hash } from 'lucide-react';

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, { message: 'Please enter a valid phone number.' }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits.' }),
});

export function RegisterFormPhone() {
  const [otpSent, setOtpSent] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  function onSendOtp(values: z.infer<typeof phoneSchema>) {
    console.log(values);
    toast({
      title: 'OTP Sent',
      description: 'An OTP has been sent to your phone for verification.',
    });
    setOtpSent(true);
  }

  function onVerifyOtp(values: z.infer<typeof otpSchema>) {
    console.log(values);
    toast({
      title: 'Registration Successful',
      description: 'Redirecting to your dashboard...',
    });
    router.push('/dashboard');
  }

  if (otpSent) {
    return (
      <Form {...otpForm}>
        <form
          onSubmit={otpForm.handleSubmit(onVerifyOtp)}
          className="space-y-6 pt-4"
        >
          <FormField
            control={otpForm.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password (OTP)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="123456" {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Verify OTP & Register
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <Form {...phoneForm}>
      <form
        onSubmit={phoneForm.handleSubmit(onSendOtp)}
        className="space-y-6 pt-4"
      >
        <FormField
          control={phoneForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="+1 234 567 8900" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Send OTP
        </Button>
      </form>
    </Form>
  );
}
