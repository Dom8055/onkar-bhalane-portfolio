import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Download, Shield } from 'lucide-react';
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
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ profile, settings, onResumeClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
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
        scrolled ? 'border-b border-white/[0.07] bg-obsidian/80 py-3 backdrop-blur-xl' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-midnight font-display text-sm font-bold tracking-wider text-gold-light transition-transform duration-300 group-hover:scale-105 group-hover:border-gold">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={logoText} className="h-7 w-7 rounded object-contain" />
            ) : (
              logoText
            )}
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-semibold tracking-wider text-ivory">
              {profile?.name || 'Onkar Bhalane'}
            </p>
            <p className="text-[11px] tracking-widest text-slateMuted">FLUTTER ENGINEER</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const id = item.href.replace('#', '');
            const isActive = isHome && activeSection === id;
            return (
              <a
                key={item.href}
                href={isHome ? item.href : `/${item.href}`}
                className={`relative rounded-full px-3.5 py-2 text-xs font-medium tracking-wide transition-colors ${
                  isActive ? 'text-gold-light' : 'text-slateMuted hover:text-ivory'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-light"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={profile?.resume_url || '/api/portfolio/resume'}
            onClick={onResumeClick}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-medium text-gold-light transition-all hover:border-gold hover:bg-gold/20"
          >
            <Download className="h-3.5 w-3.5" />
            Resume
          </a>
          <Link
            to="/admin"
            title="Admin Panel"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-surface/60 text-slateMuted transition-colors hover:border-gold/40 hover:text-gold-light"
            aria-label="Open Admin Panel"
          >
            <Shield className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-surface/70 text-ivory lg:hidden"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/10 bg-obsidian/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-5">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={isHome ? item.href : `/${item.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slateMuted hover:bg-surface hover:text-ivory"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-4">
                <a
                  href={profile?.resume_url || '/api/portfolio/resume'}
                  onClick={() => {
                    setMobileOpen(false);
                    onResumeClick?.();
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-obsidian"
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slateMuted"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
