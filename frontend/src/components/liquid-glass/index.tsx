import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { CustomCursor } from '../CustomCursor';

export type GlassTint = 'neutral' | 'gold' | 'blue' | 'emerald';

const TINT_RING: Record<GlassTint, string> = {
  neutral: 'border-white/15 dark:border-white/15',
  gold: 'border-gold/40',
  blue: 'border-electric/40',
  emerald: 'border-emerald-500/40',
};

const TINT_GLOW: Record<GlassTint, string> = {
  neutral: 'transparent',
  gold: 'rgba(182, 139, 80, 0.14)',
  blue: 'rgba(71, 123, 255, 0.16)',
  emerald: 'rgba(16, 185, 129, 0.15)',
};

/* ============================================================================
 * 1. LiquidGlassCard — Cursor-reactive specular sheen + subtle optional 3D tilt
 * ============================================================================ */
interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tint?: GlassTint;
  tilt?: boolean;
  children: React.ReactNode;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  tint = 'neutral',
  tilt = false,
  className = '',
  children,
  style,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty('--mx', `${x}px`);
    ref.current.style.setProperty('--my', `${y}px`);
    if (tilt && window.matchMedia('(pointer: fine)').matches) {
      const rx = ((y / rect.height) - 0.5) * -4.5;
      const ry = ((x / rect.width) - 0.5) * 4.5;
      setTransform(`perspective(950px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`);
    }
  };

  const handleLeave = () => {
    if (tilt) setTransform('');
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: transform || undefined,
        backgroundImage: tint !== 'neutral' ? `radial-gradient(circle at top right, ${TINT_GLOW[tint]}, transparent 60%)` : undefined,
        ...style,
      }}
      className={`liquid-glass liquid-glass-interactive overflow-hidden rounded-[26px] ${TINT_RING[tint]} ${className}`}
      {...rest}
    >
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

/* ============================================================================
 * 2. LiquidGlassPanel — Architectural translucent container
 * ============================================================================ */
export const LiquidGlassPanel: React.FC<{
  tint?: GlassTint;
  className?: string;
  children: React.ReactNode;
}> = ({ tint = 'neutral', className = '', children }) => (
  <div className={`liquid-glass-elevated rounded-[24px] ${TINT_RING[tint]} ${className}`}>{children}</div>
);

/* ============================================================================
 * 3. LiquidGlassButton — Magnetic refractive capsule CTA
 * ============================================================================ */
interface LiquidGlassButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'glass' | 'blue' | 'ghost';
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  children,
  variant = 'glass',
  className = '',
  href,
  target,
  rel,
  type = 'button',
  disabled = false,
  onClick,
  ariaLabel,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const variantClasses: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-gold to-gold-light text-[#080B12] font-semibold shadow-goldGlow hover:brightness-105',
    blue:
      'bg-gradient-to-r from-electric to-sky-400 text-white font-semibold shadow-[0_14px_36px_-12px_rgba(71,123,255,0.55)] hover:brightness-105',
    glass:
      'liquid-glass liquid-glass-interactive text-ivory hover:border-gold/60',
    ghost:
      'border border-transparent text-slateMuted hover:text-ivory hover:bg-surface',
  };

  const base = `inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-xs font-medium tracking-wide transition-all duration-300 disabled:opacity-55 ${variantClasses[variant]} ${className}`;

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    setOffset({
      x: (e.clientX - (rect.left + rect.width / 2)) * 0.16,
      y: (e.clientY - (rect.top + rect.height / 2)) * 0.16,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="inline-block"
    >
      {href ? (
        <a href={href} target={target} rel={rel} onClick={onClick} aria-label={ariaLabel} className={base}>
          {children}
        </a>
      ) : (
        <button type={type} disabled={disabled} onClick={onClick} aria-label={ariaLabel} className={base}>
          {children}
        </button>
      )}
    </motion.div>
  );
};

/* ============================================================================
 * 4. LiquidGlassBadge — Translucent refractive pill badge
 * ============================================================================ */
export const LiquidGlassBadge: React.FC<{
  tint?: GlassTint;
  className?: string;
  children: React.ReactNode;
}> = ({ tint = 'neutral', className = '', children }) => (
  <span
    className={`liquid-glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-ivory ${TINT_RING[tint]} ${className}`}
  >
    {children}
  </span>
);

/* ============================================================================
 * 5. LiquidGlassNavbar — Adaptive floating glass navigation shell
 * ============================================================================ */
export const LiquidGlassNavbar: React.FC<{
  scrolled: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ scrolled, className = '', children }) => (
  <div
    className={`mx-auto flex items-center justify-between rounded-full transition-all duration-500 ${
      scrolled
        ? 'liquid-glass-elevated max-w-6xl px-5 py-2.5 sm:px-6'
        : 'max-w-[1380px] border border-transparent bg-transparent px-4 py-3 sm:px-6'
    } ${className}`}
  >
    {children}
  </div>
);

/* ============================================================================
 * 6. LiquidGlassNavigation — Segmented refractive pill selector
 * ============================================================================ */
export const LiquidGlassNavigation: React.FC<{
  items: string[];
  active: string;
  onChange: (value: string) => void;
  layoutId?: string;
}> = ({ items, active, onChange, layoutId = 'lg-segment' }) => (
  <div className="liquid-glass no-scrollbar inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full p-1.5">
    {items.map((item) => {
      const isActive = active === item;
      return (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            isActive ? 'text-[#080B12]' : 'text-slateMuted hover:text-ivory'
          }`}
        >
          {isActive && (
            <motion.span
              layoutId={layoutId}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-gold to-gold-light shadow-goldGlow"
            />
          )}
          <span className="relative z-10">{item}</span>
        </button>
      );
    })}
  </div>
);

/* ============================================================================
 * 7. LiquidGlassTooltip — Frosted spring tooltip
 * ============================================================================ */
export const LiquidGlassTooltip: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.16 }}
            className="liquid-glass-elevated pointer-events-none absolute -top-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ivory"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================================
 * 8. LiquidGlassDock — Floating macOS/iOS-inspired quick-jump glass dock
 * ============================================================================ */
export interface DockItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

export const LiquidGlassDock: React.FC<{ items: DockItem[] }> = ({ items }) => (
  <motion.nav
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.5 }}
    aria-label="Quick Section Dock"
    className="liquid-glass-elevated fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1.5 rounded-full px-2.5 py-2 md:flex"
  >
    {items.map((item) => (
      <LiquidGlassTooltip key={item.href} label={item.label}>
        <a
          href={item.href}
          aria-label={item.label}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-1 ${
            item.active
              ? 'bg-gradient-to-br from-gold to-gold-light text-[#080B12] shadow-goldGlow'
              : 'text-slateMuted hover:bg-surface hover:text-ivory'
          }`}
        >
          {item.icon}
        </a>
      </LiquidGlassTooltip>
    ))}
  </motion.nav>
);

/* ============================================================================
 * 9. LiquidGlassModal — Refractive modal dialog
 * ============================================================================ */
export const LiquidGlassModal: React.FC<{
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="liquid-glass-elevated max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] p-6 sm:p-8"
        >
          {title && (
            <div className="mb-5 flex items-center justify-between border-b border-hairline pb-4">
              <h3 className="font-display text-xl font-bold text-ivory">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-slateMuted hover:border-gold hover:text-ivory"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ============================================================================
 * 10. LiquidGlassDropdown — Refractive glass dropdown menu
 * ============================================================================ */
export interface DropdownOption {
  value: string;
  label: string;
}

export const LiquidGlassDropdown: React.FC<{
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}> = ({ value, options, onChange, label, className = '' }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="liquid-glass inline-flex w-full items-center justify-between gap-2.5 rounded-full px-4 py-2 text-xs font-medium text-ivory transition-colors hover:border-gold/60"
      >
        <span className="truncate">
          {label ? <span className="mr-1.5 text-slateMuted">{label}:</span> : null}
          {current?.label}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-gold transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="liquid-glass-elevated absolute right-0 z-50 mt-2 min-w-[180px] overflow-hidden rounded-2xl p-1.5 shadow-card"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-left text-xs transition-colors ${
                  opt.value === value
                    ? 'bg-gold/20 font-semibold text-gold'
                    : 'text-ivory hover:bg-surface'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================================
 * 11. LiquidGlassSvgFilters — Subtle optical lens refraction SVG filter defs
 * ============================================================================ */
export const LiquidGlassSvgFilters: React.FC = () => (
  <svg className="pointer-events-none fixed h-0 w-0 overflow-hidden" aria-hidden="true">
    <defs>
      <filter id="liquid-refraction" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

/* ============================================================================
 * 12. LiquidGlassCursor — Refractive desktop lens cursor
 * ============================================================================ */
export const LiquidGlassCursor = CustomCursor;
