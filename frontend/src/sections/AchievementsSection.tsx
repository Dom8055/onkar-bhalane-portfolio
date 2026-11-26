import React from 'react';
import { motion } from 'framer-motion';
import type { Achievement } from '../types/portfolio';

export const AchievementsSection: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  return (
    <section id="achievements" className="relative border-b border-hairline bg-obsidian py-24 sm:py-32">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-10">
        <div className="border-b border-hairline pb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold">05 / Milestones</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ivory sm:text-5xl">
            Key <span className="text-gradient-gold">Achievements</span>
          </h2>
        </div>

        <div className="mt-6 divide-y divide-hairline border-b border-hairline">
          {achievements.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group grid items-baseline gap-4 py-7 transition-colors hover:bg-surface/40 sm:px-4 lg:grid-cols-12"
            >
              <div className="lg:col-span-2">
                <span className="font-display text-3xl font-bold tracking-tight text-gold sm:text-4xl">
                  {item.badge}
                </span>
              </div>
              <div className="lg:col-span-4">
                <h3 className="font-display text-lg font-semibold text-ivory">{item.title}</h3>
              </div>
              <div className="lg:col-span-6">
                <p className="text-sm leading-relaxed text-slateMuted">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
