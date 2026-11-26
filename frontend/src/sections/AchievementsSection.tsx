import React from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassCard } from '../components/liquid-glass';
import { SectionBackdrop } from '../components/SectionBackdrop';
import type { Achievement } from '../types/portfolio';

export const AchievementsSection: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  return (
    <section id="achievements" className="relative overflow-hidden border-b border-hairline bg-obsidian py-24 sm:py-32">
      <SectionBackdrop variant="prismatic" />

      <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-10">
        <div className="flex flex-col justify-between gap-4 border-b border-hairline pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold">05 / Milestones</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ivory sm:text-5xl">
              Key <span className="text-gradient-gold">Achievements</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-slateMuted">
            Verified delivery milestones across production apps, payments, KYC, and real-time systems.
          </p>
        </div>

        {/* Asymmetric Liquid Glass Bento Grid */}
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {achievements.map((item, idx) => {
            const spanClass =
              idx === 0
                ? 'lg:col-span-4'
                : idx === 1
                ? 'lg:col-span-2'
                : 'lg:col-span-2';
            const tint = idx === 0 ? 'gold' : idx === 1 ? 'blue' : idx === 2 ? 'emerald' : 'neutral';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className={spanClass}
              >
                <LiquidGlassCard tint={tint} tilt className="h-full p-6 sm:p-7">
                  <div className="flex h-full flex-col justify-between gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <span className="liquid-glass inline-flex h-14 min-w-[3.5rem] items-center justify-center rounded-2xl border border-gold/40 px-3 font-display text-xl font-bold text-gold">
                        {item.badge}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-ivory sm:text-xl">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slateMuted">{item.description}</p>
                    </div>
                  </div>
                </LiquidGlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
