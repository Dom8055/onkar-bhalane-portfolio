import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Download, Mail, MapPin, Sparkles } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';
import type { Profile } from '../types/portfolio';

const HeroCanvas3D = lazy(() => import('../components/HeroCanvas3D').then((m) => ({ default: m.HeroCanvas3D })));

interface HeroSectionProps {
  profile: Profile;
  animationsEnabled?: boolean;
  onResumeClick?: () => void;
}

const FLOATING_TECH = ['Flutter', 'Dart', 'GetX', 'Firebase', 'REST APIs', 'Razorpay', 'Agora'];

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, animationsEnabled = true, onResumeClick }) => {
  const initials = profile.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-obsidian pb-20 pt-28 sm:pt-32"
    >
      {/* Ambient Grid & Gold Radial Lighting */}
      <div className="pointer-events-none absolute inset-0 bg-ambient-grid opacity-50" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-[480px] w-[480px] rounded-full bg-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* Selective 3D Canvas */}
      {animationsEnabled && (
        <Suspense fallback={null}>
          <HeroCanvas3D />
        </Suspense>
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Content */}
          <div className="lg:col-span-7">
            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-midnight/80 px-4 py-1.5 backdrop-blur-md"
            >
              <span className="relative flex h-2.5 w-2.5">
                {profile.is_available && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    profile.is_available ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
              </span>
              <span className="text-xs font-medium tracking-wide text-ivory/90">
                {profile.availability_status}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display text-5xl font-bold leading-[1.03] tracking-tight text-ivory sm:text-6xl lg:text-7xl"
            >
              {profile.name.split(' ')[0]}{' '}
              <span className="text-gradient-gold">{profile.name.split(' ').slice(1).join(' ')}</span>
            </motion.h1>

            {/* Role */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-4 font-heading text-lg font-medium tracking-wide text-gold-light sm:text-xl"
            >
              {profile.title}
            </motion.p>

            {/* Editorial Quote / Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-5 max-w-2xl border-l-2 border-gold/60 pl-4 text-base leading-relaxed text-slateMuted sm:text-lg"
            >
              “{profile.tagline}”
            </motion.p>

            {/* Primary CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <MagneticButton
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-7 py-3.5 text-sm font-semibold text-obsidian shadow-goldGlow transition-transform hover:scale-[1.02]"
              >
                Explore My Work
                <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>

              <MagneticButton
                href={profile.resume_url || '/api/portfolio/resume'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onResumeClick}
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-surface/80 px-6 py-3.5 text-sm font-medium text-ivory backdrop-blur-md transition-colors hover:border-gold hover:bg-surface"
              >
                <Download className="h-4 w-4 text-gold-light" />
                Download Resume
              </MagneticButton>

              <MagneticButton
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-slateMuted transition-colors hover:border-white/25 hover:text-ivory"
              >
                <Mail className="h-4 w-4" />
                Let&apos;s Connect
              </MagneticButton>
            </motion.div>

            {/* Floating Tech Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.42 }}
              className="mt-10 flex flex-wrap items-center gap-2"
            >
              <span className="mr-1 inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-slateMuted">
                <Sparkles className="h-3.5 w-3.5 text-gold-light" />
                Core Stack:
              </span>
              {FLOATING_TECH.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/[0.08] bg-midnight/80 px-3 py-1 font-mono text-xs text-slateMuted transition-colors hover:border-gold/40 hover:text-gold-light"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Portrait & Executive Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="glass-panel-gold relative mx-auto max-w-md overflow-hidden rounded-3xl p-6 shadow-card">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />

              {/* Portrait Frame */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-midnight via-surface to-obsidian">
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.name}
                    className="h-72 w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-72 flex-col items-center justify-center p-8 text-center">
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold/50 bg-obsidian/90 shadow-goldGlow">
                      <span className="font-display text-4xl font-bold tracking-widest text-gold-light">
                        {initials}
                      </span>
                    </div>
                    <p className="mt-4 font-display text-lg font-semibold text-ivory">{profile.name}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slateMuted">
                      <MapPin className="h-3.5 w-3.5 text-gold-light" />
                      {profile.location}
                    </p>
                  </div>
                )}
              </div>

              {/* Experience Stats Grid */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {(profile.stats || []).slice(0, 4).map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/[0.06] bg-obsidian/70 p-3.5 transition-colors hover:border-gold/30"
                  >
                    <p className="font-display text-2xl font-bold text-gold-light">{stat.value}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-slateMuted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-14 inline-flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slateMuted transition-colors hover:text-gold-light"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15">
            <ArrowDown className="h-4 w-4 animate-bounce text-gold-light" />
          </span>
          Scroll to Explore
        </motion.a>
      </div>
    </section>
  );
};
