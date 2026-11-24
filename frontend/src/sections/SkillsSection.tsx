import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Box,
  Braces,
  Code2,
  Cpu,
  CreditCard,
  Database,
  FileCode,
  Fingerprint,
  Gauge,
  GitBranch,
  Globe,
  Grid,
  HardDrive,
  Layers,
  Layout,
  Lock,
  MapPin,
  MessageSquare,
  Palette,
  Play,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  Terminal,
  Video,
  Wrench,
  Zap,
} from 'lucide-react';
import type { Skill } from '../types/portfolio';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code2,
  smartphone: Smartphone,
  layers: Layers,
  layout: Layout,
  cpu: Cpu,
  zap: Zap,
  box: Box,
  'git-branch': GitBranch,
  workflow: Layers,
  globe: Globe,
  braces: Braces,
  server: Server,
  terminal: Terminal,
  database: Database,
  shield: Shield,
  bell: Bell,
  'message-square': MessageSquare,
  'credit-card': CreditCard,
  video: Video,
  'map-pin': MapPin,
  'hard-drive': HardDrive,
  fingerprint: Fingerprint,
  'shield-check': ShieldCheck,
  lock: Lock,
  'file-code': FileCode,
  palette: Palette,
  grid: Grid,
  'refresh-cw': RefreshCw,
  wrench: Wrench,
  github: GitBranch,
  play: Play,
  apple: Smartphone,
  gauge: Gauge,
};

export const SkillsSection: React.FC<{ skills: Skill[] }> = ({ skills }) => {
  const categories = useMemo(() => {
    const ordered: string[] = [];
    for (const s of skills) {
      if (!ordered.includes(s.category)) ordered.push(s.category);
    }
    return ['All', ...ordered];
  }, [skills]);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const grouped = useMemo(() => {
    const filtered = selectedCategory === 'All' ? skills : skills.filter((s) => s.category === selectedCategory);
    const map = new Map<string, Skill[]>();
    for (const s of filtered) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    return Array.from(map.entries());
  }, [skills, selectedCategory]);

  return (
    <section id="skills" className="relative border-t border-white/[0.06] bg-midnight/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">02 · Technical Expertise</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ivory sm:text-5xl">
            Full-stack mobile toolkit from <span className="text-gradient-gold">UI to store launch.</span>
          </h2>
          <p className="mt-4 text-sm text-slateMuted sm:text-base">
            Filter by engineering domain across languages, Flutter state management, backend integrations, Firebase, SDKs, and optimization.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-9 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  active
                    ? 'bg-gold text-obsidian shadow-goldGlow'
                    : 'border border-white/10 bg-surface/60 text-slateMuted hover:border-gold/40 hover:text-ivory'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Skill Category Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {grouped.map(([category, items], groupIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (groupIdx % 4) * 0.06 }}
              className="glass-panel rounded-2xl p-6 transition-colors hover:border-gold/30"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-gold-light">
                  {category}
                </h3>
                <span className="font-mono text-xs text-slateMuted">{items.length}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {items.map((skill) => {
                  const Icon = ICON_MAP[skill.icon_name] || Code2;
                  return (
                    <motion.div
                      key={skill.id}
                      whileHover={{ y: -2, scale: 1.02 }}
                      className="group flex flex-col gap-1.5 rounded-xl border border-white/[0.08] bg-obsidian/70 px-3.5 py-2.5 transition-colors hover:border-gold/45 hover:bg-surface"
                    >
                      <div className="flex items-center gap-2">
                        {skill.icon_url ? (
                          <img src={skill.icon_url} alt={skill.name} className="h-4 w-4 rounded object-contain" />
                        ) : (
                          <Icon className="h-4 w-4 text-gold-light/85 transition-colors group-hover:text-gold-light" />
                        )}
                        <span className="text-xs font-medium text-ivory sm:text-sm">{skill.name}</span>
                        {skill.proficiency_label && (
                          <span className="ml-1 rounded bg-gold/15 px-1.5 py-0.5 text-[10px] text-gold-light">
                            {skill.proficiency_label}
                          </span>
                        )}
                      </div>
                      {/* Only render proficiency bar when explicitly configured in Admin */}
                      {typeof skill.proficiency_level === 'number' && skill.proficiency_level > 0 && (
                        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
                            style={{ width: `${skill.proficiency_level}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
