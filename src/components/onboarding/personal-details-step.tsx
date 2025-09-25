'use client';
import { useForm, Controller } from 'react-hook-form';
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
import { AnimatedButton } from '../ui/animated-button';
import { Textarea } from '../ui/textarea';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters.'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters.'),
  address: z.string().min(10, 'Please enter a full address.').optional().or(z.literal('')),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
});

type PersonalDetailsFormValues = z.infer<typeof formSchema>;

interface PersonalDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<PersonalDetailsFormValues>) => void;
  defaultValues: Partial<PersonalDetailsFormValues>;
}

export function PersonalDetailsStep({ onNext, onBack, onUpdate, defaultValues }: PersonalDetailsStepProps) {
  const form = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: defaultValues.firstName || '',
      lastName: defaultValues.lastName || '',
      address: defaultValues.address || '',
      phoneNumber: defaultValues.phoneNumber || '',
    },
  });

  const onSubmit = (values: PersonalDetailsFormValues) => {
    onUpdate(values);
    onNext();
  };

  return (
    <div>
        <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Complete Your Profile</h2>
            <p className="text-muted-foreground">Just a few more details to get you set up.</p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
          
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                     <PhoneInput
                        id="phone"
                        placeholder="Enter phone number"
                        international
                        defaultCountry="NG"
                        {...field}
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="123 Main St, Anytown, Nigeria"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between items-center pt-4">
                <AnimatedButton variant="outline" type="button" onClick={onBack}>Back</AnimatedButton>
                <AnimatedButton type="submit">Finish Setup</AnimatedButton>
            </div>
        </form>
        </Form>
    </div>
  );
}