'use client';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`${sizeClasses[size]} border-2 border-muted border-t-primary rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {label && <p className="text-muted-foreground">{label}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-base">AC</span>
                </div>
                <span className="text-lg font-bold text-primary">Africonnect</span>
            </div>
             <LoadingSpinner size="md" label="Loading..." />
        </div>
    </div>
  );
}
