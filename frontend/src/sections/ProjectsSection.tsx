import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Search, Smartphone, Star } from 'lucide-react';
import { ProjectVisual } from '../components/ProjectVisual';
import {
  LiquidGlassBadge,
  LiquidGlassCard,
  LiquidGlassNavigation,
  LiquidGlassPanel,
  type GlassTint,
} from '../components/liquid-glass';
import { portfolioApi } from '../services/api';
import type { Project } from '../types/portfolio';

function getProjectTheme(project: Project): { accent: string; tint: GlassTint; textClass: string } {
  if (project.slug === 'insta-wash-clean' || project.accent_color?.toLowerCase() === '#2563eb') {
    return { accent: '#477BFF', tint: 'blue', textClass: 'text-electric' };
  }
  if (project.slug === 'purti-delivery-partner' || project.accent_color?.toLowerCase() === '#10b981') {
    return { accent: '#10B981', tint: 'emerald', textClass: 'text-emerald-500 dark:text-emerald-400' };
  }
  return { accent: '#B68B50', tint: 'gold', textClass: 'text-gold' };
}

export const ProjectsSection: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    return ['All', ...cats];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (onlyFeatured && !p.is_featured) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          p.title.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [projects, selectedCategory, onlyFeatured, search]);

  const flagshipProjects = filtered.filter((p) => Boolean(p.cover_image));
  const archiveProjects = filtered.filter((p) => !p.cover_image);

  return (
    <section id="projects" className="relative overflow-hidden border-b border-hairline bg-midnight py-24 sm:py-32">
      {/* Subtle Ambient Electric Blue + Gold Atmospheric Glow */}
      <div className="pointer-events-none absolute -right-32 top-24 h-96 w-96 rounded-full bg-electric/10 blur-[140px]" />
      <div className="pointer-events-none absolute -left-32 bottom-24 h-96 w-96 rounded-full bg-gold/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-hairline pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold">04 / Product Showcase</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ivory sm:text-5xl">
              Production <span className="text-gradient-gold">Applications</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slateMuted sm:text-base">
              {projects.length} production mobile apps shipped across e-commerce, logistics, healthcare, fintech, B2B procurement, and education.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apps or stack..."
              className="liquid-glass w-full rounded-full py-2.5 pl-11 pr-4 text-sm text-ivory placeholder-slateMuted outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Liquid Glass Segmented Filter Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <LiquidGlassNavigation
            items={categories}
            active={selectedCategory}
            onChange={setSelectedCategory}
            layoutId="projects-filter-pill"
          />

          <button
            type="button"
            onClick={() => setOnlyFeatured((v) => !v)}
            className={`liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
              onlyFeatured ? 'border-gold text-gold' : 'text-slateMuted hover:text-ivory'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${onlyFeatured ? 'fill-current' : ''}`} />
            Featured Only
          </button>
        </div>

        {/* FLAGSHIP LIQUID GLASS PRODUCT SPREADS */}
        {flagshipProjects.length > 0 && (
          <div className="mt-14 space-y-12">
            <AnimatePresence mode="popLayout">
              {flagshipProjects.map((project, idx) => {
                const theme = getProjectTheme(project);
                const reversed = idx % 2 === 1;
                return (
                  <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55 }}
                  >
                    <LiquidGlassCard tint={theme.tint} className="group p-4 sm:p-6 lg:p-7">
                      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
                        <Link
                          to={`/projects/${project.slug}`}
                          data-cursor-label="VIEW"
                          className={`block overflow-hidden rounded-[20px] border border-hairline bg-obsidian lg:col-span-7 ${
                            reversed ? 'lg:order-2' : ''
                          }`}
                        >
                          <ProjectVisual project={project} className="aspect-[16/10] w-full" />
                        </Link>

                        <div className={`px-1 lg:col-span-5 ${reversed ? 'lg:order-1' : ''}`}>
                          <div className="flex items-center gap-2.5">
                            <LiquidGlassBadge tint={theme.tint} className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]">
                              <span style={{ color: theme.accent }}>{String(project.order).padStart(2, '0')}</span>
                              <span className={theme.textClass}>{project.industry_badge || project.category}</span>
                            </LiquidGlassBadge>
                          </div>

                          <Link to={`/projects/${project.slug}`}>
                            <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-ivory transition-colors group-hover:text-gold sm:text-4xl">
                              {project.title}
                            </h3>
                          </Link>
                          {project.subtitle && <p className="mt-1 text-sm text-slateMuted">{project.subtitle}</p>}

                          <p className="mt-4 text-sm leading-relaxed text-slateMuted sm:text-base">
                            {project.short_description}
                          </p>

                          {project.contribution?.length > 0 && (
                            <ul
                              className="mt-4 space-y-2 border-l-2 pl-4 text-xs leading-relaxed text-slateMuted"
                              style={{ borderColor: `${theme.accent}70` }}
                            >
                              {project.contribution.slice(0, 2).map((c, cIdx) => (
                                <li key={cIdx}>{c}</li>
                              ))}
                            </ul>
                          )}

                          <div className="mt-5 flex flex-wrap gap-1.5">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full border border-hairline bg-obsidian/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ivory"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="mt-7 flex flex-wrap items-center gap-2.5 border-t border-hairline pt-5">
                            <Link
                              to={`/projects/${project.slug}`}
                              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-white transition-transform hover:scale-[1.03]"
                              style={{ backgroundColor: theme.accent }}
                            >
                              Case Study
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>

                            {project.google_play_url && (
                              <a
                                href={project.google_play_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => portfolioApi.trackEvent('store_click', `/projects/${project.slug}`, 'google_play')}
                                className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-medium text-ivory hover:border-gold"
                              >
                                <Smartphone className="h-3.5 w-3.5 text-emerald-500" />
                                Play Store
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}

                            {project.app_store_url && (
                              <a
                                href={project.app_store_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => portfolioApi.trackEvent('store_click', `/projects/${project.slug}`, 'app_store')}
                                className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-medium text-ivory hover:border-gold"
                              >
                                <Smartphone className="h-3.5 w-3.5 text-sky-500" />
                                App Store
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </LiquidGlassCard>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* LIQUID GLASS ARCHIVE PANEL FOR REMAINING PRODUCTION APPS */}
        {archiveProjects.length > 0 && (
          <div className="mt-16">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold">
                More Production Applications
              </h3>
              <span className="font-mono text-[11px] text-slateMuted">
                {String(archiveProjects.length).padStart(2, '0')} Apps
              </span>
            </div>

            <LiquidGlassPanel className="overflow-hidden divide-y divide-hairline">
              {archiveProjects.map((project) => (
                <div
                  key={project.id}
                  className="group grid items-center gap-4 p-5 transition-colors hover:bg-surface sm:px-7 lg:grid-cols-12"
                >
                  <div className="flex items-baseline gap-4 lg:col-span-4">
                    <span className="font-mono text-xs text-gold">
                      {String(project.order).padStart(2, '0')}
                    </span>
                    <div>
                      <Link
                        to={`/projects/${project.slug}`}
                        data-cursor-label="OPEN"
                        className="font-display text-lg font-bold text-ivory transition-colors group-hover:text-gold"
                      >
                        {project.title}
                      </Link>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slateMuted">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-slateMuted lg:col-span-4">
                    {project.short_description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 lg:col-span-2">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-full border border-hairline px-2.5 py-0.5 font-mono text-[10px] text-ivory">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-start gap-2 lg:col-span-2 lg:justify-end">
                    {project.google_play_url && (
                      <a
                        href={project.google_play_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase text-ivory hover:border-gold hover:text-gold"
                      >
                        Play
                      </a>
                    )}
                    {project.app_store_url && (
                      <a
                        href={project.app_store_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase text-ivory hover:border-gold hover:text-gold"
                      >
                        iOS
                      </a>
                    )}
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-gold"
                    >
                      Details
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </LiquidGlassPanel>
          </div>
        )}

        {filtered.length === 0 && (
          <LiquidGlassPanel className="mt-12 p-10 text-center">
            <p className="text-sm text-slateMuted">No projects matched your search or filter criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearch('');
                setOnlyFeatured(false);
              }}
              className="mt-4 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-[#080B12]"
            >
              Reset Filters
            </button>
          </LiquidGlassPanel>
        )}
      </div>
    </section>
  );
};
