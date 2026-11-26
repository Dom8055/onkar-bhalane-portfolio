import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Compass } from 'lucide-react';
import type { Profile } from '../types/portfolio';

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';
  const [display, setDisplay] = useState(target !== null ? 0 : value);

  useEffect(() => {
    if (!inView || target === null) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 24));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        setDisplay(current);
      }
    }, 35);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {target !== null ? `${display}${suffix}` : value}
    </span>
  );
}

export const AboutSection: React.FC<{ profile: Profile }> = ({ profile }) => {
  const portraits = [
    {
      src: profile.about_image || '/assets/portraits/portrait_cinematic_black_turtleneck.webp',
      label: 'Studio Editorial',
    },
    {
      src: profile.secondary_portrait || '/assets/portraits/portrait_editorial_seated_black_suit.webp',
      label: 'Executive Portrait',
    },
  ].filter((p) => Boolean(p.src));

  const [activePortrait, setActivePortrait] = useState(0);

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          {/* Editorial Heading & Portraits */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-light">
              <Compass className="h-4 w-4" />
              01 · Introduction
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-5xl">
              Engineering mobile apps built to{' '}
              <span className="text-gradient-gold">scale and endure.</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-slateMuted sm:text-base">
              {profile.subtitle}
            </p>

            {/* Editorial Portrait Showcase */}
            {portraits.length > 0 && (
              <div className="mt-8">
                <div className="glass-panel-gold group relative overflow-hidden rounded-3xl p-3 shadow-card">
                  <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-2xl bg-midnight">
                    <motion.img
                      key={portraits[activePortrait].src}
                      src={portraits[activePortrait].src}
                      alt={`${profile.name} — ${portraits[activePortrait].label}`}
                      loading="lazy"
                      decoding="async"
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45 }}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
                  </div>

                  {portraits.length > 1 && (
                    <div className="mt-3 flex items-center justify-between gap-2 px-1">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gold-light">
                        {portraits[activePortrait].label}
                      </span>
                      <div className="flex gap-2">
                        {portraits.map((p, idx) => (
                          <button
                            key={p.src}
                            type="button"
                            onClick={() => setActivePortrait(idx)}
                            aria-label={`View ${p.label}`}
                            className={`h-9 w-9 overflow-hidden rounded-lg border transition-all ${
                              activePortrait === idx
                                ? 'border-gold ring-2 ring-gold/40'
                                : 'border-white/15 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={p.src} alt={p.label} loading="lazy" className="h-full w-full object-cover object-top" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Animated KPI Strip */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {(profile.stats || []).map((s, idx) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="glass-panel rounded-2xl p-5"
                >
                  <p className="font-display text-3xl font-bold text-gold-light sm:text-4xl">
                    <AnimatedCounter value={s.value} />
                  </p>
                  <p className="mt-1.5 text-xs uppercase tracking-wider text-slateMuted">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Editorial Bio + Core Competencies */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="glass-panel rounded-3xl p-7 sm:p-10">
              <div className="space-y-5 text-base leading-relaxed text-ivory/90">
                {(profile.about_paragraphs || []).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="mt-9 border-t border-white/10 pt-8">
                <h3 className="font-mono text-xs uppercase tracking-[0.24em] text-gold-light">
                  Core Competencies
                </h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {(profile.core_competencies || []).map((comp) => (
                    <div
                      key={comp}
                      className="flex items-start gap-2.5 rounded-xl border border-white/[0.05] bg-obsidian/50 p-3 text-sm text-slateMuted transition-colors hover:border-gold/30 hover:text-ivory"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
