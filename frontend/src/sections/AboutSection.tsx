import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionBackdrop } from '../components/SectionBackdrop';
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

  return <span ref={ref}>{target !== null ? `${display}${suffix}` : value}</span>;
}

export const AboutSection: React.FC<{ profile: Profile }> = ({ profile }) => {
  const portraits = [
    {
      src: profile.about_image || '/assets/portraits/portrait_cinematic_black_turtleneck.webp',
      label: '01 · Studio Editorial',
    },
    {
      src: profile.secondary_portrait || '/assets/portraits/portrait_editorial_seated_black_suit.webp',
      label: '02 · Executive Study',
    },
  ].filter((p) => Boolean(p.src));

  const [activePortrait, setActivePortrait] = useState(0);

  return (
    <section id="about" className="relative overflow-hidden border-b border-hairline bg-obsidian py-24 sm:py-32">
      <SectionBackdrop variant="slate" />
      <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-10">
        {/* Section Eyebrow */}
        <div className="flex items-end justify-between border-b border-hairline pb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold">01 / Profile</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ivory sm:text-5xl">
              About <span className="text-gradient-gold">Onkar</span>
            </h2>
          </div>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-slateMuted sm:block">
            {profile.location}
          </span>
        </div>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Sticky Editorial Portrait Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65 }}
            className="lg:sticky lg:top-28 lg:col-span-5"
          >
            {portraits.length > 0 && (
              <div className="relative">
                  <div
                    data-cursor-label="SWITCH"
                    onClick={() => portraits.length > 1 && setActivePortrait((p) => (p + 1) % portraits.length)}
                    className="liquid-glass-elevated group relative cursor-pointer overflow-hidden rounded-[26px] p-3"
                  >
                    <div className="relative aspect-[4/4.7] w-full overflow-hidden rounded-[20px]">
                      <motion.img
                        key={portraits[activePortrait].src}
                        src={portraits[activePortrait].src}
                        alt={`${profile.name} — ${portraits[activePortrait].label}`}
                        loading="lazy"
                        decoding="async"
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between px-2 pb-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                        {portraits[activePortrait].label}
                      </span>
                      <div className="flex gap-1.5">
                        {portraits.map((p, idx) => (
                          <button
                            key={p.src}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePortrait(idx);
                            }}
                            className={`h-1.5 rounded-full transition-all ${
                              activePortrait === idx ? 'w-7 bg-gold' : 'w-2.5 bg-slateMuted/40 hover:bg-slateMuted'
                            }`}
                            aria-label={p.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
              </div>
            )}

            {/* Minimal Hairline Stats */}
            <div className="mt-8 grid grid-cols-2 border-t border-hairline">
              {(profile.stats || []).map((s, idx) => (
                <div
                  key={s.label}
                  className={`border-b border-hairline py-5 ${idx % 2 === 1 ? 'border-l border-hairline pl-5' : 'pr-5'}`}
                >
                  <p className="font-display text-3xl font-bold text-ivory sm:text-4xl">
                    <AnimatedCounter value={s.value} />
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slateMuted">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Editorial Narrative + Competencies */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <p className="font-display text-2xl font-medium leading-snug text-ivory sm:text-3xl">
              {profile.subtitle}
            </p>

            <div className="mt-8 space-y-6 text-base leading-[1.85] text-slateMuted">
              {(profile.about_paragraphs || []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Core Competencies Editorial Index */}
            <div className="mt-14 border-t border-hairline pt-8">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold">
                  Core Engineering Competencies
                </h3>
                <span className="font-mono text-[11px] text-slateMuted">
                  {String(profile.core_competencies?.length || 0).padStart(2, '0')} Disciplines
                </span>
              </div>

              <div className="mt-6 grid divide-y divide-hairline border-y border-hairline sm:grid-cols-2 sm:divide-y-0">
                {(profile.core_competencies || []).map((comp, idx) => (
                  <div
                    key={comp}
                    className="group flex items-center justify-between gap-3 border-b border-hairline py-4 sm:odd:pr-6 sm:even:border-l sm:even:pl-6"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-gold">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-medium text-ivory">{comp}</span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slateMuted opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-gold" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
