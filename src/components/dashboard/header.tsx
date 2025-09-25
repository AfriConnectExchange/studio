import { Logo } from '@/components/logo';
import { UserNav } from '@/components/dashboard/user-nav';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Package2 } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Logo withText={false} />
            <span className="hidden font-bold sm:inline-block">
              Africonnect
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Profile
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <Logo withText={false} />
                    <span className="sr-only">Africonnect</span>
                  </Link>
                  <Link href="/dashboard" className="hover:text-foreground">
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Profile
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
