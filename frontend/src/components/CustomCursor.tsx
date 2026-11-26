import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
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
      const labeled = target?.closest('[data-cursor-label]') as HTMLElement | null;
      setLabel(labeled?.getAttribute('data-cursor-label') || null);
      setHovering(Boolean(labeled || target?.closest('a, button, input, textarea, select, [data-cursor="pointer"]')));
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
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/70 backdrop-blur-sm lg:flex"
        animate={{
          x: pos.x,
          y: pos.y,
          width: label ? 76 : hovering ? 46 : 32,
          height: label ? 76 : hovering ? 46 : 32,
          backgroundColor: label ? 'rgba(182, 139, 80, 0.92)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.4 }}
      >
        {label && (
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#080B12]">
            {label}
          </span>
        )}
      </motion.div>
      {!label && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[91] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold lg:block"
          animate={{ x: pos.x, y: pos.y, scale: hovering ? 0.5 : 1 }}
          transition={{ type: 'spring', stiffness: 700, damping: 35, mass: 0.15 }}
        />
      )}
    </>
  );
};
