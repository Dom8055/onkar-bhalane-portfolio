import React from 'react';
import { useTheme } from '../hooks/useTheme';

export type BackdropVariant = 'slate' | 'constellation' | 'monolith' | 'prismatic';

interface SectionBackdropProps {
  variant: BackdropVariant;
}

/**
 * Distinct, subtle architectural + atmospheric background layer for each section.
 * Adapts automatically to Dark (Obsidian) and Light (Pearl) themes with zero clutter.
 */
export const SectionBackdrop: React.FC<SectionBackdropProps> = ({ variant }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'slate') {
    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {isDark && (
          <img
            src="/assets/backgrounds/obsidian_slate.jpg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover opacity-[0.08] mix-blend-lighten"
          />
        )}
        <div
          className="absolute -right-24 top-1/4 h-[440px] w-[440px] rounded-full blur-[130px]"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(182,139,80,0.14) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(167,123,67,0.11) 0%, transparent 70%)',
          }}
        />
      </div>
    );
  }

  if (variant === 'constellation') {
    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {isDark && (
          <img
            src="/assets/backgrounds/particle_network.jpg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover opacity-[0.12] mix-blend-screen"
          />
        )}
        <div
          className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full blur-[140px]"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(71,123,255,0.16) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(71,123,255,0.08) 0%, transparent 70%)',
          }}
        />
      </div>
    );
  }

  if (variant === 'monolith') {
    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {isDark && (
          <img
            src="/assets/backgrounds/arch_monolith.jpg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover opacity-[0.11]"
          />
        )}
        <div
          className="absolute bottom-0 right-1/4 h-[380px] w-[380px] rounded-full blur-[130px]"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(182,139,80,0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(167,123,67,0.08) 0%, transparent 70%)',
          }}
        />
      </div>
    );
  }

  // prismatic
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="animate-liquid-drift absolute -left-20 top-16 h-[460px] w-[460px] rounded-full blur-[145px]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(71,123,255,0.16) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(71,123,255,0.09) 0%, transparent 70%)',
        }}
      />
      <div
        className="animate-liquid-drift absolute -right-24 bottom-12 h-[440px] w-[440px] rounded-full blur-[145px]"
        style={{
          animationDelay: '-9s',
          background: isDark
            ? 'radial-gradient(circle, rgba(216,183,121,0.14) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(167,123,67,0.12) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
