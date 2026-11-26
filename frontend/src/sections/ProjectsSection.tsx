import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Search, Smartphone, Star } from 'lucide-react';
import { ProjectVisual } from '../components/ProjectVisual';
import { portfolioApi } from '../services/api';
import type { Project } from '../types/portfolio';

function getProjectTheme(project: Project) {
  if (project.slug === 'insta-wash-clean' || project.accent_color?.toLowerCase() === '#2563eb') {
    return { accent: '#2563EB', textClass: 'text-blue-500 dark:text-sky-400', label: 'Blue Identity' };
  }
  if (project.slug === 'purti-delivery-partner' || project.accent_color?.toLowerCase() === '#10b981') {
    return { accent: '#10B981', textClass: 'text-emerald-600 dark:text-emerald-400', label: 'Emerald Identity' };
  }
  return { accent: '#B68B50', textClass: 'text-gold', label: 'Gold Identity' };
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

  // Flagship spreads: projects that have visual artwork/screenshots (Purti Super Bazar, Purti Rider, Insta Wash Clean, or any uploaded via Admin)
  const flagshipProjects = filtered.filter((p) => Boolean(p.cover_image));
  const archiveProjects = filtered.filter((p) => !p.cover_image);

  return (
    <section id="projects" className="relative border-b border-hairline bg-midnight py-24 sm:py-32">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-10">
        {/* Editorial Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-hairline pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold">04 / Selected Work</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ivory sm:text-5xl">
              Production <span className="text-gradient-gold">Applications</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slateMuted sm:text-base">
              {projects.length} production mobile applications shipped across e-commerce, logistics, healthcare, fintech, B2B procurement, and education.
            </p>
          </div>

          {/* Minimal Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apps or stack..."
              className="w-full border border-hairline bg-surface py-2.5 pl-10 pr-4 text-sm text-ivory placeholder-slateMuted outline-none transition-colors focus:border-gold"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  selectedCategory === cat
                    ? 'border-gold bg-gold font-semibold text-[#080B12]'
                    : 'border-hairline bg-surface text-slateMuted hover:border-gold/60 hover:text-ivory'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOnlyFeatured((v) => !v)}
            className={`inline-flex items-center gap-1.5 border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
              onlyFeatured
                ? 'border-gold bg-gold/15 text-gold'
                : 'border-hairline bg-surface text-slateMuted hover:text-ivory'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${onlyFeatured ? 'fill-current' : ''}`} />
            Featured
          </button>
        </div>

        {/* FLAGSHIP EDITORIAL SPREADS */}
        {flagshipProjects.length > 0 && (
          <div className="mt-14 space-y-20">
            <AnimatePresence mode="popLayout">
              {flagshipProjects.map((project, idx) => {
                const theme = getProjectTheme(project);
                const reversed = idx % 2 === 1;
                return (
                  <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55 }}
                    className="group grid items-center gap-8 border-b border-hairline pb-16 lg:grid-cols-12 lg:gap-12"
                  >
                    {/* Visual Showcase (7 cols) */}
                    <Link
                      to={`/projects/${project.slug}`}
                      data-cursor-label="VIEW"
                      className={`block overflow-hidden border border-hairline bg-obsidian transition-colors group-hover:border-gold/60 lg:col-span-7 ${
                        reversed ? 'lg:order-2' : ''
                      }`}
                    >
                      <ProjectVisual project={project} className="aspect-[16/10] w-full" />
                    </Link>

                    {/* Editorial Narrative (5 cols) */}
                    <div className={`lg:col-span-5 ${reversed ? 'lg:order-1' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold" style={{ color: theme.accent }}>
                          {String(project.order).padStart(2, '0')}
                        </span>
                        <span className="h-px w-8 bg-hairline" />
                        <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${theme.textClass}`}>
                          {project.industry_badge || project.category}
                        </span>
                      </div>

                      <Link to={`/projects/${project.slug}`}>
                        <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-ivory transition-colors group-hover:text-gold sm:text-4xl">
                          {project.title}
                        </h3>
                      </Link>
                      {project.subtitle && (
                        <p className="mt-1 font-heading text-sm text-slateMuted">{project.subtitle}</p>
                      )}

                      <p className="mt-5 text-sm leading-relaxed text-slateMuted sm:text-base">
                        {project.short_description}
                      </p>

                      {project.contribution?.length > 0 && (
                        <ul className="mt-5 space-y-2 border-l-2 pl-4 text-xs leading-relaxed text-slateMuted" style={{ borderColor: `${theme.accent}66` }}>
                          {project.contribution.slice(0, 2).map((c, cIdx) => (
                            <li key={cIdx}>{c}</li>
                          ))}
                        </ul>
                      )}

                      {/* Tech Stack */}
                      <div className="mt-6 flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="border border-hairline bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ivory"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Actions & Store Links */}
                      <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-hairline pt-6">
                        <Link
                          to={`/projects/${project.slug}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
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
                            className="inline-flex items-center gap-1.5 border border-hairline bg-surface px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-ivory transition-colors hover:border-gold hover:text-gold"
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
                            className="inline-flex items-center gap-1.5 border border-hairline bg-surface px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-ivory transition-colors hover:border-gold hover:text-gold"
                          >
                            <Smartphone className="h-3.5 w-3.5 text-sky-500" />
                            App Store
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* ARCHITECTURAL ARCHIVE LEDGER FOR REMAINING PROJECTS */}
        {archiveProjects.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold">
                More Production Applications
              </h3>
              <span className="font-mono text-[11px] text-slateMuted">
                {String(archiveProjects.length).padStart(2, '0')} Projects
              </span>
            </div>

            <div className="divide-y divide-hairline border-b border-hairline">
              {archiveProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group grid items-center gap-4 py-6 transition-colors hover:bg-surface/55 sm:px-4 lg:grid-cols-12"
                >
                  <div className="flex items-baseline gap-4 lg:col-span-4">
                    <span className="font-mono text-xs text-gold">
                      {String(project.order).padStart(2, '0')}
                    </span>
                    <div>
                      <Link
                        to={`/projects/${project.slug}`}
                        data-cursor-label="OPEN"
                        className="font-display text-xl font-bold text-ivory transition-colors group-hover:text-gold"
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
                      <span key={t} className="border border-hairline bg-surface px-2 py-0.5 font-mono text-[10px] text-ivory">
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
                        title="Google Play Store"
                        className="border border-hairline bg-surface px-2.5 py-1.5 font-mono text-[10px] uppercase text-ivory hover:border-gold hover:text-gold"
                      >
                        Play
                      </a>
                    )}
                    {project.app_store_url && (
                      <a
                        href={project.app_store_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Apple App Store"
                        className="border border-hairline bg-surface px-2.5 py-1.5 font-mono text-[10px] uppercase text-ivory hover:border-gold hover:text-gold"
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
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="mt-12 border border-hairline bg-surface p-10 text-center">
            <p className="text-sm text-slateMuted">No projects matched your search or filter criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearch('');
                setOnlyFeatured(false);
              }}
              className="mt-4 bg-gold px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-[#080B12]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
