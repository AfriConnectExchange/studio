import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { UpdateDetailsForm } from './update-details-form';
import { AccountManagementForm } from './account-management-form';

export function ProfilePage() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="profile">Profile Details</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <UpdateDetailsForm />
      </TabsContent>
      <TabsContent value="account">
        <div className="flex flex-col gap-6">
          <AccountManagementForm />
        </div>
      </TabsContent>
    </Tabs>
  );
}
