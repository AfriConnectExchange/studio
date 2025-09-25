import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginFormEmail } from '@/components/auth/login-form-email';
import { LoginFormPhone } from '@/components/auth/login-form-phone';
import { RegisterFormEmail } from '@/components/auth/register-form-email';
import { RegisterFormPhone } from '@/components/auth/register-form-phone';
import { Logo } from '@/components/logo';

export function AuthTabs() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-6 lg:hidden">
        <Logo />
      </div>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="border-0 shadow-none lg:border lg:shadow-sm">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Choose your preferred login method.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>
                <TabsContent value="email">
                  <LoginFormEmail />
                </TabsContent>
                <TabsContent value="phone">
                  <LoginFormPhone />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card className="border-0 shadow-none lg:border lg:shadow-sm">
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Create a new account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>
                <TabsContent value="email">
                  <RegisterFormEmail />
                </TabsContent>
                <TabsContent value="phone">
                  <RegisterFormPhone />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
