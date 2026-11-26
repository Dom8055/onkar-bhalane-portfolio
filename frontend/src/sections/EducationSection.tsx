import React from 'react';
import { motion } from 'framer-motion';
import type { Education } from '../types/portfolio';

export const EducationSection: React.FC<{ education: Education[] }> = ({ education }) => {
  return (
    <section id="education" className="relative border-b border-hairline bg-midnight py-20 sm:py-28">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-10">
        <div className="border-b border-hairline pb-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold">06 / Academic Foundation</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ivory sm:text-4xl">
            Education
          </h2>
        </div>

        <div className="grid divide-y divide-hairline border-b border-hairline md:grid-cols-3 md:divide-x md:divide-y-0">
          {education.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex flex-col justify-between py-8 md:px-7 md:first:pl-0 md:last:pr-0"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">{edu.duration}</p>
                <h3 className="mt-3 font-display text-xl font-bold text-ivory">{edu.degree}</h3>
                <p className="mt-2 text-sm text-slateMuted">{edu.institution}</p>
              </div>
              {edu.location && (
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted">
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
