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
    <section id="skills" className="relative border-b border-hairline bg-midnight py-24 sm:py-32">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-10">
        <div className="flex flex-col justify-between gap-6 border-b border-hairline pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold">02 / Technical Stack</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ivory sm:text-5xl">
              Engineering <span className="text-gradient-gold">Expertise</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slateMuted">
            Full-lifecycle mobile engineering capabilities spanning Flutter UI architecture, state management, backend integrations, Firebase, and release tuning.
          </p>
        </div>

        {/* Architectural Filter Bar */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? 'border-gold bg-gold font-semibold text-[#080B12]'
                    : 'border-hairline bg-surface text-slateMuted hover:border-gold/60 hover:text-ivory'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Editorial Matrix */}
        <div className="mt-10 divide-y divide-hairline border-y border-hairline">
          {grouped.map(([category, items], groupIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (groupIdx % 4) * 0.05 }}
              className="grid gap-5 py-7 lg:grid-cols-12 lg:items-start"
            >
              <div className="flex items-baseline gap-3 lg:col-span-4">
                <span className="font-mono text-[11px] text-gold">
                  {String(groupIdx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-lg font-semibold text-ivory">{category}</h3>
              </div>

              <div className="flex flex-wrap gap-2.5 lg:col-span-8">
                {items.map((skill) => {
                  const Icon = ICON_MAP[skill.icon_name] || Code2;
                  return (
                    <div
                      key={skill.id}
                      className="group flex flex-col gap-1.5 border border-hairline bg-surface px-3.5 py-2 transition-colors hover:border-gold"
                    >
                      <div className="flex items-center gap-2">
                        {skill.icon_url ? (
                          <img src={skill.icon_url} alt={skill.name} className="h-3.5 w-3.5 object-contain" />
                        ) : (
                          <Icon className="h-3.5 w-3.5 text-gold" />
                        )}
                        <span className="text-xs font-medium text-ivory sm:text-sm">{skill.name}</span>
                        {skill.proficiency_label && (
                          <span className="font-mono text-[10px] text-gold">{skill.proficiency_label}</span>
                        )}
                      </div>
                      {typeof skill.proficiency_level === 'number' && skill.proficiency_level > 0 && (
                        <div className="h-[2px] w-full bg-hairline">
                          <div className="h-full bg-gold" style={{ width: `${skill.proficiency_level}%` }} />
                        </div>
                      )}
                    </div>
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
