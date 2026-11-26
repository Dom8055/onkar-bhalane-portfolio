import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Menu, Moon, Shield, Sun, X } from 'lucide-react';
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
  { label: 'Work', href: '#projects' },
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
      setScrolled(window.scrollY > 28);
      if (!isHome) return;
      const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'achievements', 'education', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 160) {
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
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-hairline bg-obsidian/85 py-3.5 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-[1380px] items-center justify-between px-5 sm:px-10">
        {/* Monogram & Wordmark */}
        <Link to="/" className="group flex items-center gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center border border-gold/60 bg-obsidian font-display text-xs font-bold tracking-[0.2em] text-gold transition-colors group-hover:bg-gold group-hover:text-obsidian">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={logoText} className="h-6 w-6 object-contain" />
            ) : (
              logoText
            )}
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-semibold tracking-tight text-ivory">
              {profile?.name || 'Onkar Bhalane'}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slateMuted">
              Mobile Architect · Flutter
            </p>
          </div>
        </Link>

        {/* Desktop Editorial Nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const id = item.href.replace('#', '');
            const isActive = isHome && activeSection === id;
            return (
              <a
                key={item.href}
                href={isHome ? item.href : `/${item.href}`}
                className={`relative py-1 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  isActive ? 'text-gold' : 'text-slateMuted hover:text-ivory'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Controls: Theme Toggle, Resume, Admin */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="flex h-9 w-9 items-center justify-center border border-hairline bg-surface text-slateMuted transition-colors hover:border-gold hover:text-gold"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href={profile?.resume_url || '/api/portfolio/resume'}
            onClick={onResumeClick}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gold/60 bg-gold/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold transition-all hover:bg-gold hover:text-[#080B12]"
          >
            <Download className="h-3.5 w-3.5" />
            Resume
          </a>

          <Link
            to="/admin"
            title="Admin CMS"
            aria-label="Open Admin CMS"
            className="flex h-9 w-9 items-center justify-center border border-hairline bg-surface text-slateMuted transition-colors hover:border-gold hover:text-gold"
          >
            <Shield className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center border border-hairline bg-surface text-ivory"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center border border-hairline bg-surface text-ivory"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-hairline bg-obsidian/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col px-6 py-5">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={isHome ? item.href : `/${item.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-hairline py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-slateMuted hover:text-gold"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-5 flex items-center gap-3">
                <a
                  href={profile?.resume_url || '/api/portfolio/resume'}
                  onClick={() => {
                    setMobileOpen(false);
                    onResumeClick?.();
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 bg-gold px-4 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-[#080B12]"
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 border border-hairline px-4 py-3 font-mono text-xs uppercase tracking-widest text-slateMuted"
                >
                  <Shield className="h-4 w-4" />
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
