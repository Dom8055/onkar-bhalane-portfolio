import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CinematicLoaderProps {
  onComplete: () => void;
  logoText?: string;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onComplete, logoText = 'OB' }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(false);
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            onComplete();
          }, 220);
          return 100;
        }
        return Math.min(prev + Math.floor(Math.random() * 18) + 12, 100);
      });
    }, 65);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-obsidian px-6"
          aria-label="Loading portfolio"
        >
          <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-40" />

          <motion.div
            initial={{ scale: 0.84, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center"
          >
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-gold/40 bg-midnight/90 shadow-goldGlow">
              <span className="font-display text-3xl font-bold tracking-widest text-gold-light">{logoText}</span>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-2 rounded-[20px] border border-gold/20 border-t-gold/70"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="mt-7 text-center"
            >
              <p className="font-display text-lg font-semibold tracking-[0.28em] text-ivory">ONKAR BHALANE</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slateMuted">Flutter Developer · Mobile Engineer</p>
            </motion.div>

            <div className="mt-8 w-56">
              <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-gold to-gold-light"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.12 }}
                />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[11px] text-slateMuted">
                <span>INITIALIZING</span>
                <span className="text-gold-light">{progress}%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
