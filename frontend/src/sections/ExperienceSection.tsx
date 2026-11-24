import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronDown, MapPin } from 'lucide-react';
import type { Experience } from '../types/portfolio';

export const ExperienceSection: React.FC<{ experiences: Experience[] }> = ({ experiences }) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    experiences.forEach((e, idx) => {
      init[e.id] = idx < 2; // Expand latest 2 by default
    });
    return init;
  });

  const toggle = (id: string) => setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">03 · Career Timeline</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ivory sm:text-5xl">
            Professional <span className="text-gradient-gold">Experience</span>
          </h2>
          <p className="mt-4 text-sm text-slateMuted sm:text-base">
            Four years of progressive mobile engineering ownership — shipping production Flutter apps across diverse teams and domains.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative mt-14 space-y-6 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-gradient-to-b before:from-gold before:via-gold/30 before:to-transparent sm:before:left-6">
          {experiences.map((exp, idx) => {
            const isOpen = expandedIds[exp.id] ?? true;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative pl-12 sm:pl-16"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-2 top-6 flex h-5 w-5 items-center justify-center rounded-full border-2 sm:left-4 ${
                    exp.is_current
                      ? 'border-gold-light bg-gold shadow-goldGlow'
                      : 'border-gold/60 bg-obsidian'
                  }`}
                >
                  {exp.is_current && <span className="h-2 w-2 rounded-full bg-obsidian" />}
                </div>

                <div className="glass-panel overflow-hidden rounded-2xl transition-colors hover:border-gold/30">
                  <button
                    onClick={() => toggle(exp.id)}
                    className="flex w-full items-start justify-between gap-4 p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-display text-xl font-bold text-ivory">{exp.role}</h3>
                        {exp.is_current && (
                          <span className="rounded-full bg-gold/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-gold-light">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gold-light">
                        <Briefcase className="h-4 w-4" />
                        {exp.company}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slateMuted">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gold/80" />
                          {exp.duration}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-gold/80" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    <ChevronDown
                      className={`mt-1 h-5 w-5 shrink-0 text-slateMuted transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-gold-light' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-white/[0.06]"
                      >
                        <div className="p-6 pt-5">
                          <ul className="space-y-2.5 text-sm leading-relaxed text-slateMuted">
                            {exp.responsibilities.map((item, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-3">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-light" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>

                          {exp.technologies?.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2">
                              {exp.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-lg border border-white/10 bg-obsidian/70 px-2.5 py-1 font-mono text-[11px] text-ivory/80"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
