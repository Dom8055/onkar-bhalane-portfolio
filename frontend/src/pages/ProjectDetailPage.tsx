import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Globe, Smartphone } from 'lucide-react';
import { CustomCursor } from '../components/CustomCursor';
import { Navbar } from '../components/Navbar';
import { ProjectGallery } from '../components/ProjectGallery';
import { SEOHead } from '../components/SEOHead';
import { FooterSection } from '../sections/FooterSection';
import { usePortfolio } from '../hooks/usePortfolio';
import { portfolioApi } from '../services/api';
import type { Project } from '../types/portfolio';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data } = usePortfolio();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    setLoading(true);
    portfolioApi
      .getProjectBySlug(slug)
      .then((p) => {
        setProject(p);
        portfolioApi.trackEvent('project_view', `/projects/${slug}`, p.title);
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian font-mono text-xs uppercase tracking-[0.2em] text-slateMuted">
        Loading Case Study...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center">
        <h1 className="font-display text-3xl font-bold text-ivory">Project Not Found</h1>
        <Link to="/" className="mt-6 bg-gold px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-[#080B12]">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const allProjects = data?.projects || [];
  const currentIdx = allProjects.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIdx > 0 ? allProjects[currentIdx - 1] : null;
  const nextProject = currentIdx >= 0 && currentIdx < allProjects.length - 1 ? allProjects[currentIdx + 1] : null;

  const accent =
    project.slug === 'insta-wash-clean'
      ? '#2563EB'
      : project.slug === 'purti-delivery-partner'
      ? '#10B981'
      : project.accent_color || '#B68B50';

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      <div className="film-grain" />
      <SEOHead
        profile={data?.profile}
        settings={data?.settings}
        pageTitle={`${project.title} — Case Study | Onkar Bhalane`}
        pageDescription={project.short_description}
      />
      <CustomCursor enabled={data?.settings?.custom_cursor_enabled !== false} />
      <Navbar profile={data?.profile} settings={data?.settings} />

      <main className="mx-auto max-w-[1240px] px-5 pb-24 pt-28 sm:px-10 sm:pt-36">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slateMuted transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Projects
        </Link>

        {/* Editorial Case Study Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 border-b border-hairline pb-10"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-semibold" style={{ color: accent }}>
              {String(project.order).padStart(2, '0')}
            </span>
            <span className="h-px w-8 bg-hairline" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: accent }}>
              {project.industry_badge || project.category}
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ivory sm:text-6xl">
            {project.title}
          </h1>
          {project.subtitle && <p className="mt-2 font-heading text-lg text-slateMuted">{project.subtitle}</p>}

          {/* Store & External Links */}
          <div className="mt-7 flex flex-wrap gap-3">
            {project.google_play_url && (
              <a
                href={project.google_play_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-300"
              >
                <Smartphone className="h-4 w-4" />
                Google Play Store
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {project.app_store_url && (
              <a
                href={project.app_store_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-sky-500/40 bg-sky-500/10 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-300"
              >
                <Smartphone className="h-4 w-4" />
                Apple App Store
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-hairline bg-surface px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-ivory hover:border-gold"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gold/50 bg-gold/10 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-gold hover:bg-gold/20"
              >
                <Globe className="h-4 w-4" />
                Live Demo
              </a>
            )}
            {(project.extra_links || []).map((lnk) => (
              <a
                key={lnk.url}
                href={lnk.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-hairline bg-surface px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-ivory hover:border-gold"
              >
                <Smartphone className="h-4 w-4 text-gold" />
                {lnk.label}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Interactive Project Gallery */}
        <div className="mt-10">
          <ProjectGallery project={project} />
        </div>

        {/* Two-Column Editorial Case Study Content */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: accent }}>
                Overview
              </p>
              <p className="mt-4 text-base leading-[1.85] text-slateMuted sm:text-lg">
                {project.full_description || project.short_description}
              </p>
            </div>

            <div className="border-t border-hairline pt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: accent }}>
                Responsibilities & Engineering Contributions
              </p>
              <ul className="mt-5 divide-y divide-hairline border-y border-hairline">
                {project.contribution.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 py-4 text-sm leading-relaxed text-ivory">
                    <span className="font-mono text-xs" style={{ color: accent }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sticky Metadata Rail */}
          <aside className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <div className="border border-hairline bg-surface p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slateMuted">Technology Stack</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="border border-hairline bg-obsidian px-3 py-1.5 font-mono text-[11px] text-ivory"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 border-t border-hairline pt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slateMuted">Category</p>
                <p className="mt-1 font-display text-base font-semibold text-ivory">{project.category}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Prev / Next Editorial Footer Navigation */}
        <div className="mt-16 grid gap-4 border-t border-hairline pt-8 sm:grid-cols-2">
          {prevProject ? (
            <Link
              to={`/projects/${prevProject.slug}`}
              className="group flex items-center gap-4 border border-hairline bg-surface p-6 transition-colors hover:border-gold"
            >
              <ArrowLeft className="h-5 w-5 text-gold transition-transform group-hover:-translate-x-1" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted">Previous Project</p>
                <p className="mt-1 font-display text-lg font-semibold text-ivory">{prevProject.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextProject && (
            <Link
              to={`/projects/${nextProject.slug}`}
              className="group flex items-center justify-end gap-4 border border-hairline bg-surface p-6 text-right transition-colors hover:border-gold"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted">Next Project</p>
                <p className="mt-1 font-display text-lg font-semibold text-ivory">{nextProject.title}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gold transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </main>

      {data?.profile && <FooterSection profile={data.profile} settings={data.settings} />}
    </div>
  );
};
