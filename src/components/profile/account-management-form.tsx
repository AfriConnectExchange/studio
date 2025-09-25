'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function AccountManagementForm() {
  const { toast } = useToast();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const handleDeleteAccount = () => {
    toast({
      variant: 'destructive',
      title: 'Account Deleted',
      description: 'Your account has been permanently deleted.',
    });
    // In a real app, this would trigger a redirect or logout
  };
  
  const handleDeactivate = () => {
     toast({
      title: 'Account Deactivated',
      description: 'Your account is now deactivated. You can reactivate it by logging in again.',
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile picture.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-20 w-20">
             {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" data-ai-hint={userAvatar.imageHint}/>}
            <AvatarFallback>AE</AvatarFallback>
          </Avatar>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Upload new picture</Label>
            <Input id="picture" type="file" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Update Picture</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Manage your account preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Role</Label>
            <p className="text-sm text-muted-foreground">User (Read-only)</p>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="notifications" defaultChecked />
            <Label htmlFor="notifications">Enable email notifications</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deactivate Account</CardTitle>
          <CardDescription>
            Deactivating your account will disable your profile. You can
            reactivate it anytime by logging back in.
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t px-6 py-4">
          <Button variant="outline" onClick={handleDeactivate}>Deactivate</Button>
        </CardFooter>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all of your content. This
            action is not reversible.
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t border-destructive/50 bg-destructive/10 px-6 py-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </>
  );
}
