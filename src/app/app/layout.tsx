// src/app/app/layout.tsx
import AppLayout from '@/components/AppLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
    // The FirebaseProvider in the root layout already provides the context.
    // No need for a redundant GlobalProvider here.
    return <AppLayout>{children}</AppLayout>;
}
