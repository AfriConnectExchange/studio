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
import { useFirebase, updateDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, DocumentData } from 'firebase/firestore';
import { Loader2, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  role: z.string().min(1, 'Please select a role.'),
});

type RoleFormValues = z.infer<typeof formSchema>;

interface AccountRoleFormProps {
  user: FirebaseUser;
  onFeedback: (type: 'success' | 'error', message: string) => void;
}

export function AccountRoleForm({ user, onFeedback }: AccountRoleFormProps) {
  const { firestore } = useFirebase();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => doc(firestore, 'users', user.uid), [firestore, user.uid]);
  const { data: userProfile, isLoading } = useDoc<DocumentData>(userDocRef);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'buyer',
    },
  });

  useEffect(() => {
    if (userProfile && userProfile.roleIds && userProfile.roleIds.length > 0) {
      form.reset({
        role: userProfile.roleIds[0],
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (values: RoleFormValues) => {
    setIsSaving(true);
    try {
      const userRef = doc(firestore, 'users', user.uid);
      updateDocumentNonBlocking(userRef, { roleIds: [values.role] });
      onFeedback('success', 'Role updated successfully!');
    } catch (e: any) {
      onFeedback('error', e.message || 'Failed to update role.');
    } finally {
      setIsSaving(false);
    }
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
  
  const selectedRole = form.watch('role');

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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                      <SelectItem value="sme">SME Business</SelectItem>
                      <SelectItem value="trainer">Trainer/Educator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {userProfile && !userProfile.onboardingCompleted && ['seller', 'sme', 'trainer'].includes(selectedRole) && (
              <p className="text-sm text-yellow-600">
                This role requires profile completion before activation.
              </p>
            )}
             {['seller', 'sme', 'trainer'].includes(selectedRole) && (
                <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                    Seller roles may require KYC verification. 
                    <Button 
                        variant="link" 
                        className="p-0 h-auto ml-1"
                        onClick={() => router.push('/kyc')} // Assuming a KYC page
                    >
                        Complete KYC verification
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
