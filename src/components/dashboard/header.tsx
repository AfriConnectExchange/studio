'use client';
import { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  MapPin,
  Bell,
  TrendingUp,
  HelpCircle,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { motion } from 'framer-motion';

interface HeaderProps {
    cartCount?: number;
}

export function Header({ cartCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useFirebase();
  const pathname = usePathname();
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setIsCartAnimating(true);
      const timer = setTimeout(() => setIsCartAnimating(false), 500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const notificationCount = 2;

  const navigationItems = [
    { id: '/marketplace', label: 'Marketplace', href: '/marketplace' },
    { id: '/money-transfer', label: 'Send Money', href: '/money-transfer' },
    { id: '/adverts', label: 'My Adverts', icon: TrendingUp, href: '/adverts' },
  ];

  const additionalItems = [
    { id: '/tracking', label: 'Track Orders', href: '/tracking' },
    { id: '/analytics', label: 'Analytics', href: '/analytics' },
    { id: '/reviews', label: 'Reviews', href: '/reviews' },
    { id: '/admin', label: 'Admin Panel', href: '/admin' },
    { id: '/help', label: 'Help Center', href: '/help', icon: HelpCircle },
    { id: '/support', label: 'Support', href: '/support', icon: HelpCircle },
  ];

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-2 border-b">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Lagos, Nigeria
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Free shipping on orders over £50
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-4">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <Link
                    href="/marketplace"
                    className="flex items-center gap-2"
                    onClick={handleMobileLinkClick}
                  >
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">AC</span>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      AfriConnect
                    </span>
                  </Link>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link key={item.id} href={item.href} passHref>
                        <Button
                          variant={pathname === item.href ? 'secondary' : 'ghost'}
                          className="w-full justify-start text-base py-6"
                          onClick={handleMobileLinkClick}
                        >
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </div>

                  <div className="border-t my-4"></div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2 px-3">
                      More Features
                    </p>
                    <div className="space-y-1">
                      {additionalItems.map((item) => (
                        <Link key={item.id} href={item.href} passHref>
                          <Button
                            variant={pathname === item.href ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={handleMobileLinkClick}
                          >
                           {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {user && (
                   <div className="border-t mt-4 pt-4">
                    <Link href="/notifications" passHref>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleMobileLinkClick}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                      </Button>
                    </Link>
                    <Link href="/profile" passHref>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleMobileLinkClick}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer flex-1 lg:flex-none justify-center lg:justify-start min-w-0">
            <Link href="/marketplace" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-base">AC</span>
              </div>
              <span className="text-lg lg:text-xl font-bold text-primary truncate">
                AfriConnect
              </span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products, courses, services..."
                className="pl-10 pr-4 h-10"
              />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Link key={item.id} href={item.href} passHref>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={pathname === item.href ? 'bg-accent' : ''}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>

            {user && (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/cart" passHref>
                  <motion.div
                    animate={isCartAnimating ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-9 w-9"
                      aria-label={`Shopping cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/notifications" passHref>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 relative"
                  >
                    <Bell className="w-5 h-5" />
                     {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {notificationCount}
                        </span>
                     )}
                  </Button>
                </Link>
                <Link href="/profile" passHref>
                   <Button variant="ghost" size="icon" className="h-9 w-9">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            )}
            
            <div className="flex md:hidden items-center gap-1">
                <Link href="/cart" passHref>
                  <motion.div
                      animate={isCartAnimating ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative h-9 w-9"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {cartCount > 9 ? '9+' : cartCount}
                        </span>
                      )}
                    </Button>
                  </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
