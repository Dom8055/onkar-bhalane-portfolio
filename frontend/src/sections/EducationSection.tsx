import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, GraduationCap, MapPin } from 'lucide-react';
import type { Education } from '../types/portfolio';

export const EducationSection: React.FC<{ education: Education[] }> = ({ education }) => {
  return (
    <section id="education" className="relative border-t border-white/[0.06] bg-midnight/30 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-gold-light">
            <GraduationCap className="h-4 w-4" />
            06 · Background
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold text-ivory sm:text-5xl">
            Academic <span className="text-gradient-gold">Education</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {education.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="glass-panel flex flex-col justify-between rounded-2xl p-6 transition-colors hover:border-gold/35"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-obsidian/70 px-3 py-1 font-mono text-[11px] text-gold-light">
                  <Calendar className="h-3 w-3" />
                  {edu.duration}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ivory">{edu.degree}</h3>
                <p className="mt-2 text-sm text-slateMuted">{edu.institution}</p>
              </div>
              {edu.location && (
                <p className="mt-5 flex items-center gap-1.5 border-t border-white/[0.06] pt-4 text-xs text-slateMuted">
                  <MapPin className="h-3.5 w-3.5 text-gold/80" />
                  {edu.location}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
