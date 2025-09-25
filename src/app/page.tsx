import { AuthTabs } from '@/components/auth/auth-tabs';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function Home() {
  const authBgImage = PlaceHolderImages.find((img) => img.id === 'auth-background');

  return (
    <div className="w-full bg-background">
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          {authBgImage && (
            <Image
              src={authBgImage.imageUrl}
              alt={authBgImage.description}
              fill
              className="object-cover"
              data-ai-hint={authBgImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Logo withText={false} />
            <span className="ml-2">Africonnectexchange</span>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Connecting the continent, one transaction at a time.
                Secure, fast, and reliable exchanges for a new era of African
                commerce.&rdquo;
              </p>
              <footer className="text-sm">The Future of Exchange</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 flex items-center justify-center">
          <AuthTabs />
        </div>
      </div>
    </div>
  );
}
