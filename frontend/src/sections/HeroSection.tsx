import React, { Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Download, Mail, MapPin, Sparkles } from 'lucide-react';
import { LiquidGlassBadge, LiquidGlassButton, LiquidGlassCard, LiquidGlassPanel } from '../components/liquid-glass';
import { useTheme } from '../hooks/useTheme';
import type { Profile } from '../types/portfolio';

const HeroCanvas3D = lazy(() => import('../components/HeroCanvas3D').then((m) => ({ default: m.HeroCanvas3D })));

interface HeroSectionProps {
  profile: Profile;
  animationsEnabled?: boolean;
  onResumeClick?: () => void;
}

const FLOATING_STACK = ['Flutter', 'Dart', 'GetX', 'Firebase', 'REST APIs', 'Razorpay', 'Agora SDK'];

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, animationsEnabled = true, onResumeClick }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mousePos, setMousePos] = useState({ x: 52, y: 38 });

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
      className="relative flex min-h-screen flex-col justify-between overflow-hidden border-b border-hairline bg-obsidian pb-12 pt-28 sm:pt-36"
    >
      {/* Multi-Layered Atmospheric Liquid Environment */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Drifting Ambient Gradient Orbs (Electric Blue + Gold) */}
        <div
          className="animate-liquid-drift absolute -left-24 top-12 h-[520px] w-[520px] rounded-full blur-[130px]"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(71,123,255,0.22) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(71,123,255,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="animate-liquid-drift absolute -right-20 bottom-10 h-[480px] w-[480px] rounded-full blur-[130px]"
          style={{
            animationDelay: '-8s',
            background: isDark
              ? 'radial-gradient(circle, rgba(182,139,80,0.22) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(167,123,67,0.16) 0%, transparent 70%)',
          }}
        />

        {/* Uploaded Abstract Geometric Blue Polygon & Particle Network Layers */}
        <img
          src="/assets/backgrounds/hero_geometric_blue.jpg"
          alt=""
          aria-hidden="true"
          className={`h-full w-full object-cover object-center transition-opacity duration-500 ${
            isDark ? 'opacity-[0.24]' : 'opacity-[0.05] invert'
          }`}
        />
        <img
          src="/assets/backgrounds/particle_network.jpg"
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover mix-blend-screen transition-opacity duration-500 ${
            isDark ? 'opacity-[0.16]' : 'opacity-0'
          }`}
        />

        {/* Cursor-Responsive Specular Lighting */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? `radial-gradient(640px circle at ${mousePos.x}% ${mousePos.y}%, rgba(71, 123, 255, 0.14), rgba(216, 183, 121, 0.07) 40%, transparent 72%)`
              : `radial-gradient(640px circle at ${mousePos.x}% ${mousePos.y}%, rgba(167, 123, 67, 0.12), rgba(71, 123, 255, 0.05) 40%, transparent 68%)`,
          }}
        />

        {/* Smooth Atmospheric Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'linear-gradient(180deg, rgba(8,11,18,0.58) 0%, rgba(8,11,18,0.34) 48%, rgba(8,11,18,0.96) 100%)'
              : 'linear-gradient(180deg, rgba(244,243,240,0.78) 0%, rgba(244,243,240,0.62) 48%, rgba(244,243,240,0.98) 100%)',
          }}
        />
      </div>

      {/* Selective Desktop 3D Wireframe Geometry */}
      {animationsEnabled && (
        <Suspense fallback={null}>
          <HeroCanvas3D isDark={isDark} />
        </Suspense>
      )}

      {/* Main Content */}
      <div className="relative z-10 mx-auto my-auto w-full max-w-[1380px] px-5 sm:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="flex flex-wrap items-center gap-3"
            >
              <LiquidGlassBadge tint="gold">
                <span className="relative flex h-2 w-2">
                  {profile.is_available && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${
                      profile.is_available ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                </span>
                <span className="text-[11px] tracking-wide">{profile.availability_status}</span>
              </LiquidGlassBadge>

              <LiquidGlassBadge>
                <MapPin className="h-3.5 w-3.5 text-gold" />
                <span className="text-[11px] text-slateMuted">{profile.location}</span>
              </LiquidGlassBadge>
            </motion.div>

            {/* Monumental Split-Line Name Reveal */}
            <div className="mt-7 overflow-hidden">
              <motion.h1
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[clamp(3.3rem,8vw,6.6rem)] font-bold uppercase leading-[0.94] tracking-[-0.04em] text-ivory"
              >
                {firstName}
                <span className="block text-gradient-gold">{lastName}</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-5 font-heading text-lg font-medium text-ivory sm:text-xl"
            >
              {profile.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-3 max-w-xl text-sm leading-relaxed text-slateMuted sm:text-base"
            >
              “{profile.tagline}”
            </motion.p>

            {/* Magnetic Liquid Glass CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.34 }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <LiquidGlassButton href="#projects" variant="primary" className="px-7 py-3.5 text-xs uppercase tracking-[0.14em]">
                Explore Projects
                <ArrowUpRight className="h-4 w-4" />
              </LiquidGlassButton>

              <LiquidGlassButton
                href={profile.resume_url || '/api/portfolio/resume'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onResumeClick}
                variant="glass"
                className="px-6 py-3.5 text-xs uppercase tracking-[0.14em]"
              >
                <Download className="h-4 w-4 text-gold" />
                Download Resume
              </LiquidGlassButton>

              <LiquidGlassButton href="#contact" variant="ghost" className="px-5 py-3.5 text-xs uppercase tracking-[0.14em]">
                <Mail className="h-4 w-4 text-electric" />
                Let&apos;s Connect
              </LiquidGlassButton>
            </motion.div>

            {/* Floating Technology Glass Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.44 }}
              className="mt-9 flex flex-wrap items-center gap-2"
            >
              <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted">
                <Sparkles className="h-3.5 w-3.5 text-electric" />
                Stack
              </span>
              {FLOATING_STACK.map((tech) => (
                <LiquidGlassBadge key={tech} className="px-3 py-1 font-mono text-[11px] text-slateMuted hover:text-ivory">
                  {tech}
                </LiquidGlassBadge>
              ))}
            </motion.div>
          </div>

          {/* Right Refractive Liquid Glass Portrait Composition */}
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <LiquidGlassCard
              tint="gold"
              tilt
              data-cursor-label="PORTRAIT"
              className="mx-auto max-w-md p-3.5 lg:ml-auto lg:mr-0"
            >
              <div className="group relative overflow-hidden rounded-[20px] bg-midnight">
                <div className="relative aspect-[4/4.6] w-full overflow-hidden">
                  <img
                    src={heroPortrait}
                    alt={`${profile.name} — ${profile.title}`}
                    width={1086}
                    height={1448}
                    fetchPriority="high"
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/80 via-transparent to-transparent" />

                  {/* Floating Translucent Glass Identity Pill Inside Portrait */}
                  <div className="liquid-glass-elevated absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-2xl px-4 py-2.5">
                    <div>
                      <p className="font-display text-sm font-semibold text-ivory">{profile.name}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                        Android · iOS · Flutter
                      </p>
                    </div>
                    <span className="rounded-full bg-electric/20 px-2.5 py-1 font-mono text-[10px] font-semibold text-electric">
                      2026
                    </span>
                  </div>
                </div>
              </div>
            </LiquidGlassCard>
          </motion.div>
        </div>

        {/* Refractive Liquid Glass KPI Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5 }}
          className="mt-12 lg:mt-16"
        >
          <LiquidGlassPanel className="grid grid-cols-2 divide-y divide-hairline p-2 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {(profile.stats || []).slice(0, 4).map((stat) => (
              <div key={stat.label} className="px-5 py-4 text-center sm:text-left">
                <p className="font-display text-2xl font-bold tracking-tight text-ivory sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slateMuted">
                  {stat.label}
                </p>
              </div>
            ))}
          </LiquidGlassPanel>
        </motion.div>
      </div>

      {/* Scroll Cue */}
      <div className="relative z-10 mx-auto mt-10 flex w-full max-w-[1380px] items-center justify-between px-5 sm:px-10">
        <a
          href="#about"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-slateMuted transition-colors hover:text-gold"
        >
          <ArrowDownRight className="h-3.5 w-3.5 text-gold" />
          Scroll to Explore
        </a>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-slateMuted sm:inline">
          Liquid Glass · Editorial Architecture
        </span>
      </div>
    </section>
  );
};
