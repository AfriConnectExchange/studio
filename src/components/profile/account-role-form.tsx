'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const formSchema = z.object({
  role_id: z.string().min(1, 'Please select a role.'),
});

type RoleFormValues = z.infer<typeof formSchema>;

interface AccountRoleFormProps {
  user: User;
  onFeedback: (type: 'success' | 'error', message: string) => void;
}

export function AccountRoleForm({ user, onFeedback }: AccountRoleFormProps) {
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role_id: '1', // Default to 'buyer'
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const { data } = await supabase.from('profiles').select('role_id').eq('id', user.id).single();
      if (data && data.role_id) {
        form.reset({ role_id: String(data.role_id) });
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, [user.id, supabase, form]);

  const onSubmit = async (values: RoleFormValues) => {
    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ role_id: parseInt(values.role_id, 10) })
      .eq('id', user.id);

    if (error) {
      onFeedback('error', error.message || 'Failed to update role.');
    } else {
      onFeedback('success', 'Role updated successfully!');
    }
    setIsSaving(false);
  };
  
  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Role</CardTitle>
                <CardDescription>Change your account type to access different features.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-24">
                <Loader2 className="w-6 h-6 animate-spin" />
            </CardContent>
        </Card>
    )
  }
  
  const selectedRole = form.watch('role_id');
  const selectedRoleName = ['seller', 'sme', 'trainer'].includes(
      { '2': 'seller', '3': 'sme', '4': 'trainer' }[selectedRole] || ''
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Role</CardTitle>
        <CardDescription>Change your account type to access different features.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Buyer</SelectItem>
                      <SelectItem value="2">Seller</SelectItem>
                      <SelectItem value="3">SME Business</SelectItem>
                      <SelectItem value="4">Trainer/Educator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             {selectedRoleName && (
                <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                    This role may require KYC verification. 
                    <Button 
                        variant="link" 
                        className="p-0 h-auto ml-1"
                        onClick={() => router.push('/kyc')}
                    >
                        Complete KYC verification now.
                    </Button>
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Role
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
