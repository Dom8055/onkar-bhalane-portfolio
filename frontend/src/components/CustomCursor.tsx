import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || reduced) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const target = e.target as HTMLElement | null;
      setHovering(Boolean(target?.closest('a, button, input, textarea, select, [data-cursor="pointer"]')));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled]);

  if (!enabled || !visible) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/60 lg:block"
        animate={{
          x: pos.x,
          y: pos.y,
          scale: hovering ? 1.55 : 1,
          borderColor: hovering ? 'rgba(216,183,121,0.9)' : 'rgba(182,139,80,0.45)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.45 }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[91] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-light lg:block"
        animate={{ x: pos.x, y: pos.y, scale: hovering ? 0.4 : 1 }}
        transition={{ type: 'spring', stiffness: 700, damping: 35, mass: 0.15 }}
      />
    </>
  );
};
