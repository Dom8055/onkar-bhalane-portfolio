import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { LiquidGlassBadge, LiquidGlassCard } from '../components/liquid-glass';
import { SectionBackdrop } from '../components/SectionBackdrop';
import type { Experience } from '../types/portfolio';

export const ExperienceSection: React.FC<{ experiences: Experience[] }> = ({ experiences }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 65%'],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0.05, 1]);

  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    experiences.forEach((e, idx) => {
      init[e.id] = idx < 2;
    });
    return init;
  });

  const toggle = (id: string) => setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section ref={sectionRef} id="experience" className="relative overflow-hidden border-b border-hairline bg-obsidian py-24 sm:py-32">
      <SectionBackdrop variant="monolith" />

      <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-10">
        <div className="flex flex-col justify-between gap-6 border-b border-hairline pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold">03 / Career Timeline</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ivory sm:text-5xl">
              Professional <span className="text-gradient-gold">Experience</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slateMuted">
            Four years of progressive end-to-end Flutter product ownership across agencies and enterprise teams.
          </p>
        </div>

        {/* Scroll-Linked Vertical Glass Timeline */}
        <div className="relative mt-12 pl-7 sm:pl-11">
          <div className="absolute bottom-4 left-2.5 top-4 w-[2px] bg-hairline sm:left-4" />
          <motion.div
            style={{ scaleY: lineScaleY, transformOrigin: 'top' }}
            className="absolute bottom-4 left-2.5 top-4 w-[2px] bg-gradient-to-b from-gold via-electric to-gold-light sm:left-4"
          />

          <div className="space-y-5">
            {experiences.map((exp, idx) => {
              const isOpen = expandedIds[exp.id] ?? true;
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className="relative"
                >
                  {/* Timeline Node */}
                  <span
                    className={`absolute -left-[25px] top-7 flex h-4 w-4 items-center justify-center rounded-full border-2 sm:-left-[35px] ${
                      exp.is_current
                        ? 'border-gold bg-gold shadow-goldGlow'
                        : 'border-gold/70 bg-obsidian'
                    }`}
                  >
                    {exp.is_current && <span className="h-1.5 w-1.5 rounded-full bg-[#080B12]" />}
                  </span>

                  <LiquidGlassCard tint={exp.is_current ? 'gold' : 'neutral'} className="p-5 sm:p-7">
                    <button
                      type="button"
                      onClick={() => toggle(exp.id)}
                      aria-expanded={isOpen}
                      className="grid w-full items-start gap-4 text-left lg:grid-cols-12"
                    >
                      <div className="lg:col-span-3">
                        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">{exp.duration}</p>
                        <p className="mt-1 text-xs text-slateMuted">{exp.location}</p>
                      </div>

                      <div className="lg:col-span-8">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-display text-xl font-bold text-ivory sm:text-2xl">{exp.company}</h3>
                          {exp.is_current && (
                            <LiquidGlassBadge tint="gold" className="px-2.5 py-0.5 font-mono text-[10px] uppercase text-gold">
                              Current
                            </LiquidGlassBadge>
                          )}
                        </div>
                        <p className="mt-1 font-heading text-sm font-medium text-gold">{exp.role}</p>
                      </div>

                      <div className="flex justify-end lg:col-span-1">
                        <span className="liquid-glass flex h-9 w-9 items-center justify-center rounded-full text-slateMuted">
                          {isOpen ? <Minus className="h-4 w-4 text-gold" /> : <Plus className="h-4 w-4" />}
                        </span>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 grid border-t border-hairline pt-5 lg:grid-cols-12">
                            <div className="hidden lg:col-span-3 lg:block" />
                            <div className="lg:col-span-9">
                              <ul className="space-y-2.5 text-sm leading-relaxed text-slateMuted">
                                {exp.responsibilities.map((item, rIdx) => (
                                  <li key={rIdx} className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>

                              {exp.technologies?.length > 0 && (
                                <div className="mt-5 flex flex-wrap gap-2">
                                  {exp.technologies.map((tech) => (
                                    <span
                                      key={tech}
                                      className="rounded-full border border-hairline bg-obsidian/45 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ivory"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </LiquidGlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
