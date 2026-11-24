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
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Editorial Heading */}
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

            {/* Animated KPI Strip */}
            <div className="mt-8 grid grid-cols-2 gap-4">
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
