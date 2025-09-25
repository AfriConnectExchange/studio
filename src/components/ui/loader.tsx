'use client';
import { motion } from 'framer-motion';

export function PageLoader() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center gap-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="relative w-24 h-24 flex items-center justify-center"
        >
          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'circOut',
            }}
          />
          {/* The Logo */}
          <div className="relative w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">AC</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg font-semibold text-muted-foreground tracking-widest"
        >
          LOADING...
        </motion.div>
      </div>
    </div>
  );
}
