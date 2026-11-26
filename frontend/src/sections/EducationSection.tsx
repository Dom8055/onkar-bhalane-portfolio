import React from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassCard } from '../components/liquid-glass';
import type { Education } from '../types/portfolio';

export const EducationSection: React.FC<{ education: Education[] }> = ({ education }) => {
  return (
    <section id="education" className="relative border-b border-hairline bg-midnight py-20 sm:py-28">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-10">
        <div className="border-b border-hairline pb-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold">Academic Foundation</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ivory sm:text-4xl">
            Education
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {education.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <LiquidGlassCard className="h-full p-6">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">{edu.duration}</p>
                    <h3 className="mt-3 font-display text-xl font-bold text-ivory">{edu.degree}</h3>
                    <p className="mt-2 text-sm text-slateMuted">{edu.institution}</p>
                  </div>
                  {edu.location && (
                    <p className="mt-6 border-t border-hairline pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted">
                      {edu.location}
                    </p>
                  )}
                </div>
              </LiquidGlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
