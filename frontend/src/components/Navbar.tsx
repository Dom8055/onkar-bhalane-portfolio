import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Menu, Moon, Shield, Sun, X } from 'lucide-react';
import { LiquidGlassNavbar, LiquidGlassTooltip } from './liquid-glass';
import { useTheme } from '../hooks/useTheme';
import type { Profile, WebsiteSettings } from '../types/portfolio';

interface NavbarProps {
  profile?: Profile;
  settings?: WebsiteSettings;
  onResumeClick?: () => void;
}

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ profile, settings, onResumeClick }) => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      if (!isHome) return;
      const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'achievements', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 165) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const logoText = settings?.logo_text || 'OB';

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <LiquidGlassNavbar scrolled={scrolled}>
        {/* Brand */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="liquid-glass flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 font-display text-xs font-bold tracking-[0.18em] text-gold transition-transform duration-300 group-hover:scale-105">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={logoText} className="h-6 w-6 rounded-full object-contain" />
            ) : (
              logoText
            )}
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-semibold tracking-tight text-ivory">
              {profile?.name || 'Onkar Bhalane'}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted">
              Flutter Engineer
            </p>
          </div>
        </Link>

        {/* Desktop Glass Pill Links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const id = item.href.replace('#', '');
            const isActive = isHome && activeSection === id;
            return (
              <a
                key={item.href}
                href={isHome ? item.href : `/${item.href}`}
                className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors ${
                  isActive ? 'text-ivory' : 'text-slateMuted hover:text-ivory'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="lg-nav-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="liquid-glass absolute inset-0 rounded-full border border-gold/45"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Liquid Glass Controls */}
        <div className="hidden items-center gap-2 lg:flex">
          <LiquidGlassTooltip label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="liquid-glass flex h-9 w-9 items-center justify-center rounded-full text-slateMuted transition-all hover:scale-105 hover:border-gold/50 hover:text-gold"
            >
              <motion.span
                key={theme}
                initial={{ rotate: -60, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.span>
            </button>
          </LiquidGlassTooltip>

          <a
            href={profile?.resume_url || '/api/portfolio/resume'}
            onClick={onResumeClick}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-4 py-2 text-xs font-semibold text-[#080B12] shadow-goldGlow transition-transform hover:scale-[1.03]"
          >
            <Download className="h-3.5 w-3.5" />
            Resume
          </a>

          <LiquidGlassTooltip label="Admin CMS">
            <Link
              to="/admin"
              aria-label="Open Admin CMS"
              className="liquid-glass flex h-9 w-9 items-center justify-center rounded-full text-slateMuted transition-all hover:scale-105 hover:border-gold/50 hover:text-gold"
            >
              <Shield className="h-4 w-4" />
            </Link>
          </LiquidGlassTooltip>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="liquid-glass flex h-9 w-9 items-center justify-center rounded-full text-ivory"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="liquid-glass flex h-9 w-9 items-center justify-center rounded-full text-ivory"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </LiquidGlassNavbar>

      {/* Mobile Floating Glass Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="liquid-glass-elevated mx-auto mt-2.5 max-w-md overflow-hidden rounded-[26px] p-5 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={isHome ? item.href : `/${item.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-ivory transition-colors hover:bg-surface"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-3 flex items-center gap-2.5 border-t border-hairline pt-4">
                <a
                  href={profile?.resume_url || '/api/portfolio/resume'}
                  onClick={() => {
                    setMobileOpen(false);
                    onResumeClick?.();
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-4 py-2.5 text-xs font-semibold text-[#080B12]"
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="liquid-glass flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs text-ivory"
                >
                  <Shield className="h-3.5 w-3.5 text-gold" />
                  CMS
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
