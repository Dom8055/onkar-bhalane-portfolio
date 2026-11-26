import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Github, Globe, Linkedin, Mail } from 'lucide-react';
import type { Profile, WebsiteSettings } from '../types/portfolio';

export const FooterSection: React.FC<{ profile: Profile; settings?: WebsiteSettings }> = ({ profile, settings }) => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative bg-midnight py-16">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-10">
        {/* Monumental Editorial Wordmark */}
        <div className="flex flex-col justify-between gap-8 border-b border-hairline pb-12 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold">
              {settings?.logo_text || 'OB'} · Portfolio 2026
            </p>
            <p className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-ivory sm:text-6xl">
              {profile.name}
            </p>
            <p className="mt-2 max-w-md text-sm text-slateMuted">
              {settings?.footer_tagline || 'Crafting production-grade mobile experiences for Android & iOS.'}
            </p>
          </div>

          <button
            type="button"
            onClick={scrollTop}
            aria-label="Back to top"
            className="inline-flex w-fit items-center gap-2.5 border border-hairline bg-surface px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ivory transition-colors hover:border-gold hover:text-gold"
          >
            Back to Top
            <ArrowUp className="h-3.5 w-3.5 text-gold" />
          </button>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-slateMuted">
            <a href="#about" className="hover:text-gold">About</a>
            <a href="#skills" className="hover:text-gold">Expertise</a>
            <a href="#experience" className="hover:text-gold">Experience</a>
            <a href="#projects" className="hover:text-gold">Work</a>
            <a href="#contact" className="hover:text-gold">Contact</a>
            <Link to="/admin" className="hover:text-gold">Admin</Link>
          </div>

          <div className="flex items-center gap-2.5">
            {profile.social_links?.linkedin && (
              <a
                href={profile.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center border border-hairline bg-surface text-slateMuted transition-colors hover:border-gold hover:text-gold"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {profile.social_links?.github && (
              <a
                href={profile.social_links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center border border-hairline bg-surface text-slateMuted transition-colors hover:border-gold hover:text-gold"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {profile.social_links?.portfolio && (
              <a
                href={profile.social_links.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Portfolio"
                className="flex h-9 w-9 items-center justify-center border border-hairline bg-surface text-slateMuted transition-colors hover:border-gold hover:text-gold"
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="flex h-9 w-9 items-center justify-center border border-hairline bg-surface text-slateMuted transition-colors hover:border-gold hover:text-gold"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-hairline pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted sm:flex-row">
          <p>{settings?.copyright_text || '© 2026 Onkar Bhalane. All rights reserved.'}</p>
          <p>{profile.location}</p>
        </div>
      </div>
    </footer>
  );
};
