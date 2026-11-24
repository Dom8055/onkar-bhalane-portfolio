import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Search, Smartphone, Star } from 'lucide-react';
import { ProjectVisual } from '../components/ProjectVisual';
import { portfolioApi } from '../services/api';
import type { Project } from '../types/portfolio';

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

  return (
    <section id="projects" className="relative border-t border-white/[0.06] bg-midnight/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">04 · Selected Work</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ivory sm:text-5xl">
              Production <span className="text-gradient-gold">Applications</span>
            </h2>
            <p className="mt-4 text-sm text-slateMuted sm:text-base">
              Real-world Flutter applications delivered across healthcare, fintech, e-commerce, logistics, B2B procurement, and education — live on Google Play and Apple App Store.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects or tech..."
              className="w-full rounded-full border border-white/10 bg-surface/80 py-2.5 pl-11 pr-4 text-sm text-ivory placeholder-slateMuted outline-none transition-colors focus:border-gold/60"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gold text-obsidian shadow-goldGlow'
                    : 'border border-white/10 bg-surface/60 text-slateMuted hover:border-gold/40 hover:text-ivory'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOnlyFeatured((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
              onlyFeatured
                ? 'border-gold bg-gold/20 text-gold-light'
                : 'border-white/10 bg-surface/60 text-slateMuted hover:text-ivory'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${onlyFeatured ? 'fill-gold-light text-gold-light' : ''}`} />
            Featured Only
          </button>
        </div>

        {/* Project Cards Grid */}
        <motion.div layout className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="group glass-panel flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-goldGlow"
              >
                <Link to={`/projects/${project.slug}`} className="block">
                  <ProjectVisual project={project} className="h-52" />
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-gold-light">
                      {project.industry_badge || project.category}
                    </span>
                    {project.is_featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold-light">
                        <Star className="h-2.5 w-2.5 fill-gold-light" /> Featured
                      </span>
                    )}
                  </div>

                  <Link to={`/projects/${project.slug}`}>
                    <h3 className="mt-2.5 font-display text-xl font-bold text-ivory transition-colors group-hover:text-gold-light">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slateMuted">
                    {project.short_description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/[0.08] bg-obsidian/70 px-2.5 py-1 font-mono text-[11px] text-ivory/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Store Links + Case Study CTA */}
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] pt-5">
                    <div className="flex flex-wrap items-center gap-2">
                      {project.google_play_url && (
                        <a
                          href={project.google_play_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => portfolioApi.trackEvent('store_click', `/projects/${project.slug}`, 'google_play')}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
                        >
                          <Smartphone className="h-3 w-3" />
                          Play Store
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                      {project.app_store_url && (
                        <a
                          href={project.app_store_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => portfolioApi.trackEvent('store_click', `/projects/${project.slug}`, 'app_store')}
                          className="inline-flex items-center gap-1 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-300 transition-colors hover:bg-sky-500/20"
                        >
                          <Smartphone className="h-3 w-3" />
                          App Store
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>

                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gold-light transition-transform group-hover:translate-x-0.5"
                    >
                      Case Study
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-surface/50 p-10 text-center">
            <p className="text-sm text-slateMuted">No projects matched your search or filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearch('');
                setOnlyFeatured(false);
              }}
              className="mt-4 rounded-full bg-gold px-5 py-2 text-xs font-semibold text-obsidian"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
