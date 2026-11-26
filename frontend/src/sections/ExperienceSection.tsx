import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import type { Experience } from '../types/portfolio';

export const ExperienceSection: React.FC<{ experiences: Experience[] }> = ({ experiences }) => {
  const { theme } = useTheme();
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    experiences.forEach((e, idx) => {
      init[e.id] = idx < 2;
    });
    return init;
  });

  const toggle = (id: string) => setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section id="experience" className="relative overflow-hidden border-b border-hairline bg-obsidian py-24 sm:py-32">
      {/* Subtle Architectural Monolith Texture in Dark Mode */}
      {theme === 'dark' && (
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.09]">
          <img src="/assets/backgrounds/arch_monolith.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-10">
        <div className="flex flex-col justify-between gap-6 border-b border-hairline pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold">03 / Career Ledger</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ivory sm:text-5xl">
              Professional <span className="text-gradient-gold">Experience</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slateMuted">
            Four years of end-to-end Flutter product engineering across agencies and enterprise teams in Nagpur, India.
          </p>
        </div>

        {/* Editorial Timeline Rows */}
        <div className="mt-8 divide-y divide-hairline border-b border-hairline">
          {experiences.map((exp, idx) => {
            const isOpen = expandedIds[exp.id] ?? true;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="py-7"
              >
                <button
                  type="button"
                  onClick={() => toggle(exp.id)}
                  aria-expanded={isOpen}
                  className="grid w-full items-start gap-4 text-left lg:grid-cols-12"
                >
                  <div className="flex items-center gap-3 lg:col-span-3">
                    <span className="font-mono text-xs text-gold">{String(idx + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.14em] text-ivory">{exp.duration}</p>
                      <p className="mt-0.5 text-xs text-slateMuted">{exp.location}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-xl font-bold text-ivory sm:text-2xl">{exp.company}</h3>
                      {exp.is_current && (
                        <span className="border border-gold/50 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-heading text-sm font-medium text-gold">{exp.role}</p>
                  </div>

                  <div className="flex justify-end lg:col-span-1">
                    <span className="flex h-8 w-8 items-center justify-center border border-hairline bg-surface text-slateMuted">
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
                      <div className="mt-6 grid lg:grid-cols-12">
                        <div className="lg:col-span-3" />
                        <div className="lg:col-span-9">
                          <ul className="space-y-2.5 text-sm leading-relaxed text-slateMuted">
                            {exp.responsibilities.map((item, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-3">
                                <span className="mt-2 h-1 w-3 shrink-0 bg-gold" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>

                          {exp.technologies?.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2">
                              {exp.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="border border-hairline bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ivory"
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
