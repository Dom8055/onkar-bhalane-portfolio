import React, { Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Download, Mail, MapPin } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';
import { useTheme } from '../hooks/useTheme';
import type { Profile } from '../types/portfolio';

const HeroCanvas3D = lazy(() => import('../components/HeroCanvas3D').then((m) => ({ default: m.HeroCanvas3D })));

interface HeroSectionProps {
  profile: Profile;
  animationsEnabled?: boolean;
  onResumeClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, animationsEnabled = true, onResumeClick }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mousePos, setMousePos] = useState({ x: 50, y: 40 });

  const heroPortrait = profile.profile_image || '/assets/portraits/portrait_corporate_black_suit_gold_tie.webp';
  const nameParts = profile.name.trim().split(' ');
  const firstName = nameParts[0] || 'Onkar';
  const lastName = nameParts.slice(1).join(' ') || 'Bhalane';

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen flex-col justify-between overflow-hidden border-b border-hairline bg-obsidian pb-12 pt-28 sm:pt-32"
    >
      {/* Layered Abstract Geometric Blue Faceted Backdrop + Particle Network */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src="/assets/backgrounds/hero_geometric_blue.jpg"
          alt=""
          aria-hidden="true"
          className={`h-full w-full object-cover object-center transition-opacity duration-500 ${
            isDark ? 'opacity-[0.26]' : 'opacity-[0.06] invert'
          }`}
        />
        <img
          src="/assets/backgrounds/particle_network.jpg"
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover mix-blend-screen transition-opacity duration-500 ${
            isDark ? 'opacity-[0.18]' : 'opacity-0'
          }`}
        />
        {/* Mouse-Responsive Architectural Spotlight */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: isDark
              ? `radial-gradient(620px circle at ${mousePos.x}% ${mousePos.y}%, rgba(56, 189, 248, 0.12), rgba(182, 139, 80, 0.06) 38%, transparent 72%)`
              : `radial-gradient(620px circle at ${mousePos.x}% ${mousePos.y}%, rgba(167, 123, 67, 0.11), transparent 65%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'linear-gradient(180deg, rgba(8,11,18,0.65) 0%, rgba(8,11,18,0.38) 45%, rgba(8,11,18,0.96) 100%)'
              : 'linear-gradient(180deg, rgba(245,243,238,0.82) 0%, rgba(245,243,238,0.68) 45%, rgba(245,243,238,0.98) 100%)',
          }}
        />
      </div>

      {/* Selective Desktop 3D Wireframe Geometry */}
      {animationsEnabled && (
        <Suspense fallback={null}>
          <HeroCanvas3D isDark={isDark} />
        </Suspense>
      )}

      {/* Main Asymmetrical Editorial Grid */}
      <div className="relative z-10 mx-auto my-auto w-full max-w-[1380px] px-5 sm:px-10">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7">
            {/* Top Meta Row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="flex flex-wrap items-center gap-4"
            >
              <span className="inline-flex items-center gap-2.5 border border-hairline bg-surface/80 px-3.5 py-1.5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  {profile.is_available && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${
                      profile.is_available ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ivory">
                  {profile.availability_status}
                </span>
              </span>

              <span className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-slateMuted sm:inline-flex">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                {profile.location}
              </span>
            </motion.div>

            {/* Monumental Split-Line Name Reveal */}
            <div className="mt-8 overflow-hidden">
              <motion.h1
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[clamp(3.3rem,8.2vw,6.8rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em] text-ivory"
              >
                {firstName}
                <span className="block text-gradient-gold">{lastName}</span>
              </motion.h1>
            </div>

            {/* Specialization & Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22 }}
              className="mt-8 grid gap-6 border-t border-hairline pt-7 sm:grid-cols-12"
            >
              <div className="sm:col-span-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">Specialization</p>
                <p className="mt-2 font-heading text-base font-medium text-ivory">{profile.title}</p>
              </div>
              <div className="sm:col-span-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slateMuted">Philosophy</p>
                <p className="mt-2 text-sm leading-relaxed text-slateMuted sm:text-base">
                  “{profile.tagline}”
                </p>
              </div>
            </motion.div>

            {/* Architectural CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.34 }}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <MagneticButton
                href="#projects"
                className="inline-flex items-center gap-3 bg-gold px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#080B12] transition-opacity hover:opacity-90"
              >
                Explore Projects
                <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>

              <MagneticButton
                href={profile.resume_url || '/api/portfolio/resume'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onResumeClick}
                className="inline-flex items-center gap-2.5 border border-hairline bg-surface px-6 py-4 font-mono text-xs uppercase tracking-[0.16em] text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                <Download className="h-4 w-4 text-gold" />
                Resume PDF
              </MagneticButton>

              <MagneticButton
                href="#contact"
                className="inline-flex items-center gap-2 border border-transparent px-4 py-4 font-mono text-xs uppercase tracking-[0.16em] text-slateMuted transition-colors hover:text-ivory"
              >
                <Mail className="h-4 w-4 text-gold" />
                Contact
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right Asymmetrical Editorial Portrait Composition */}
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(12% 0% 0% 0%)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 0.95, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-md lg:ml-auto lg:mr-0">
              {/* Architectural Offset Frame */}
              <div className="pointer-events-none absolute -bottom-3 -right-3 h-full w-full border border-gold/40" />

              <div
                data-cursor-label="PORTRAIT"
                className="group relative overflow-hidden border border-hairline bg-midnight shadow-card"
              >
                <div className="relative aspect-[4/4.8] w-full overflow-hidden">
                  <img
                    src={heroPortrait}
                    alt={`${profile.name} — ${profile.title}`}
                    width={1086}
                    height={1448}
                    fetchPriority="high"
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/75 via-transparent to-transparent" />
                </div>

                {/* Minimal Editorial Caption Bar */}
                <div className="flex items-center justify-between border-t border-hairline bg-surface px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slateMuted">
                    Edition · 2026
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                    Android · iOS · Flutter
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Architectural KPI Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.48 }}
          className="mt-14 grid grid-cols-2 border-t border-hairline pt-7 sm:grid-cols-4 lg:mt-16"
        >
          {(profile.stats || []).slice(0, 4).map((stat, idx) => (
            <div
              key={stat.label}
              className={`py-2 ${idx > 0 ? 'sm:border-l sm:border-hairline sm:pl-6' : ''}`}
            >
              <p className="font-display text-3xl font-bold tracking-tight text-ivory sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Subtle Bottom Scroll Cue */}
      <div className="relative z-10 mx-auto mt-10 flex w-full max-w-[1380px] items-center justify-between px-5 sm:px-10">
        <a
          href="#about"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-slateMuted transition-colors hover:text-gold"
        >
          <ArrowDownRight className="h-3.5 w-3.5 text-gold" />
          Scroll to Explore
        </a>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-slateMuted sm:inline">
          Flutter · Dart · GetX · Firebase · REST
        </span>
      </div>
    </section>
  );
};
