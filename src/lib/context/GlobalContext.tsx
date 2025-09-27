// src/lib/context/GlobalContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useFirebase } from '@/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

// Define a simpler user type for the context
type AppUser = {
    email: string;
    id: string;
    registered_at: Date;
};

interface GlobalContextType {
    loading: boolean;
    user: AppUser | null;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
    const { user: firebaseUser, isUserLoading } = useFirebase();
    const [appUser, setAppUser] = useState<AppUser | null>(null);

    useEffect(() => {
        if (!isUserLoading) {
            if (firebaseUser) {
                setAppUser({
                    email: firebaseUser.email!,
                    id: firebaseUser.uid,
                    registered_at: new Date(firebaseUser.metadata.creationTime || Date.now())
                });
            } else {
                setAppUser(null);
            }
        }
    }, [firebaseUser, isUserLoading]);

    const value = {
        loading: isUserLoading,
        user: appUser,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
};
