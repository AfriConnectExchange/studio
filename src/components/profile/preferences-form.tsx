'use client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useFirebase, updateDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, DocumentData } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';

const formSchema = z.object({
  language: z.string(),
  timezone: z.string(),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
});

type PreferencesFormValues = z.infer<typeof formSchema>;

interface PreferencesFormProps {
  user: FirebaseUser;
  onFeedback: (type: 'success' | 'error', message: string) => void;
}

export function PreferencesForm({ user, onFeedback }: PreferencesFormProps) {
  const { firestore } = useFirebase();
  const [isSaving, setIsSaving] = useState(false);

  const userDocRef = useMemoFirebase(() => doc(firestore, 'users', user.uid), [firestore, user.uid]);
  const { data: userProfile, isLoading } = useDoc<DocumentData>(userDocRef);

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: 'en',
      timezone: 'GMT+0',
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        language: userProfile.language || 'en',
        timezone: userProfile.timezone || 'GMT+0',
        notifications: {
          email: userProfile.notifications?.email ?? true,
          sms: userProfile.notifications?.sms ?? true,
          push: userProfile.notifications?.push ?? true,
        },
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (values: PreferencesFormValues) => {
    setIsSaving(true);
    try {
      const userRef = doc(firestore, 'users', user.uid);
      updateDocumentNonBlocking(userRef, values);
      onFeedback('success', 'Preferences updated successfully!');
    } catch (e: any) {
      onFeedback('error', e.message || 'Failed to update preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience on AfriConnect Exchange.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 animate-spin" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize your experience on AfriConnect Exchange.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                        <SelectItem value="ha">Hausa</SelectItem>
                        <SelectItem value="am">Amharic</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GMT-1">GMT-1</SelectItem>
                        <SelectItem value="GMT+0">GMT+0</SelectItem>
                        <SelectItem value="GMT+1">GMT+1</SelectItem>
                        <SelectItem value="GMT+2">GMT+2</SelectItem>
                        <SelectItem value="GMT+3">GMT+3</SelectItem>
                        <SelectItem value="GMT+4">GMT+4</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Notification Preferences</h4>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="notifications.email"
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel htmlFor="email-notifications">Email Notifications</FormLabel>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <FormControl>
                        <Switch id="email-notifications" checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="notifications.sms"
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel htmlFor="sms-notifications">SMS Notifications</FormLabel>
                        <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                      </div>
                      <FormControl>
                        <Switch id="sms-notifications" checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="notifications.push"
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel htmlFor="push-notifications">Push Notifications</FormLabel>
                        <p className="text-sm text-muted-foreground">Receive push notifications in-app</p>
                      </div>
                      <FormControl>
                        <Switch id="push-notifications" checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
             <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Preferences
              </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
