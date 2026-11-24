import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import type { Achievement } from '../types/portfolio';

export const AchievementsSection: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  return (
    <section id="achievements" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-gold-light">
            <Award className="h-4 w-4" />
            05 · Highlights
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold text-ivory sm:text-5xl">
            Key <span className="text-gradient-gold">Achievements</span>
          </h2>
          <p className="mt-4 text-sm text-slateMuted sm:text-base">
            Milestones from owning production Flutter architectures across payments, KYC, real-time communication, and multi-stack collaboration.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.07 }}
              className={`glass-panel group relative overflow-hidden rounded-2xl p-6 transition-all hover:border-gold/40 ${
                idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-2xl transition-opacity group-hover:bg-gold/20" />
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/40 bg-obsidian font-display text-lg font-bold tracking-wider text-gold-light shadow-goldGlow">
                  {item.badge}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ivory">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slateMuted">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
