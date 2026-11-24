import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Github, Globe, Linkedin, Mail } from 'lucide-react';
import type { Profile, WebsiteSettings } from '../types/portfolio';

export const FooterSection: React.FC<{ profile: Profile; settings?: WebsiteSettings }> = ({ profile, settings }) => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative border-t border-white/[0.08] bg-obsidian py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-midnight font-display text-sm font-bold tracking-widest text-gold-light">
                {settings?.logo_text || 'OB'}
              </div>
              <div>
                <p className="font-display text-base font-bold text-ivory">{profile.name}</p>
                <p className="text-xs text-slateMuted">
                  {settings?.footer_tagline || 'Crafting production-grade mobile experiences for Android & iOS.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slateMuted">
            <a href="#about" className="hover:text-gold-light">About</a>
            <a href="#skills" className="hover:text-gold-light">Expertise</a>
            <a href="#experience" className="hover:text-gold-light">Experience</a>
            <a href="#projects" className="hover:text-gold-light">Projects</a>
            <a href="#contact" className="hover:text-gold-light">Contact</a>
            <Link to="/admin" className="hover:text-gold-light">Admin</Link>
          </div>

          <div className="flex items-center gap-3">
            {profile.social_links?.linkedin && (
              <a
                href={profile.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-surface/60 text-slateMuted transition-colors hover:border-gold/50 hover:text-gold-light"
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-surface/60 text-slateMuted transition-colors hover:border-gold/50 hover:text-gold-light"
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-surface/60 text-slateMuted transition-colors hover:border-gold/50 hover:text-gold-light"
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-surface/60 text-slateMuted transition-colors hover:border-gold/50 hover:text-gold-light"
            >
              <Mail className="h-4 w-4" />
            </a>
            <button
              onClick={scrollTop}
              aria-label="Back to top"
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold-light transition-transform hover:-translate-y-0.5 hover:bg-gold/20"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-slateMuted sm:flex-row">
          <p>{settings?.copyright_text || '© 2026 Onkar Bhalane. All rights reserved.'}</p>
          <p>{profile.location}</p>
        </div>
      </div>
    </footer>
  );
};
