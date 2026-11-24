import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Github,
  Globe,
  Smartphone,
  Star,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ProjectVisual } from '../components/ProjectVisual';
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
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    setLoading(true);
    portfolioApi
      .getProjectBySlug(slug)
      .then((p) => {
        setProject(p);
        setActiveImage(p.cover_image || p.gallery_images?.[0] || null);
        portfolioApi.trackEvent('project_view', `/projects/${slug}`, p.title);
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian text-slateMuted">
        Loading case study...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center">
        <h1 className="font-display text-3xl font-bold text-ivory">Project Not Found</h1>
        <Link to="/" className="mt-6 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-obsidian">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const allProjects = data?.projects || [];
  const currentIdx = allProjects.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIdx > 0 ? allProjects[currentIdx - 1] : null;
  const nextProject = currentIdx >= 0 && currentIdx < allProjects.length - 1 ? allProjects[currentIdx + 1] : null;

  const gallery = [project.cover_image, ...(project.gallery_images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      <SEOHead
        profile={data?.profile}
        settings={data?.settings}
        pageTitle={`${project.title} — Case Study | Onkar Bhalane`}
        pageDescription={project.short_description}
      />
      <Navbar profile={data?.profile} settings={data?.settings} />

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slateMuted transition-colors hover:text-gold-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Projects
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-gold-light">
              {project.industry_badge || project.category}
            </span>
            {project.is_featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-surface px-3 py-1 text-xs text-gold-light">
                <Star className="h-3 w-3 fill-gold-light" />
                Featured Case Study
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold text-ivory sm:text-5xl">{project.title}</h1>
          {project.subtitle && <p className="mt-2 text-lg text-gold-light">{project.subtitle}</p>}
          <p className="mt-5 text-base leading-relaxed text-slateMuted sm:text-lg">
            {project.full_description || project.short_description}
          </p>

          {/* Store & External Links */}
          <div className="mt-7 flex flex-wrap gap-3">
            {project.google_play_url && (
              <a
                href={project.google_play_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-5 py-2.5 text-sm font-medium text-emerald-300 ring-1 ring-emerald-500/35 transition-colors hover:bg-emerald-500/25"
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
                className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-5 py-2.5 text-sm font-medium text-sky-300 ring-1 ring-sky-500/35 transition-colors hover:bg-sky-500/25"
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
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-surface px-5 py-2.5 text-sm font-medium text-ivory hover:border-gold/50"
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
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-medium text-gold-light hover:bg-gold/20"
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
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-surface px-5 py-2.5 text-sm font-medium text-ivory hover:border-gold/50"
              >
                <Smartphone className="h-4 w-4 text-gold-light" />
                {lnk.label}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Hero Visual / Gallery */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10">
          {activeImage ? (
            <img src={activeImage} alt={project.title} className="max-h-[480px] w-full bg-midnight object-contain" />
          ) : (
            <ProjectVisual project={project} className="h-80" />
          )}
        </div>

        {gallery.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {gallery.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(imgUrl)}
                className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl border transition-all ${
                  activeImage === imgUrl ? 'border-gold ring-2 ring-gold/40' : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`${project.title} screen ${idx + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Contributions & Technology Stack */}
        <div className="mt-12 grid gap-8 md:grid-cols-12">
          <div className="glass-panel rounded-2xl p-7 md:col-span-7">
            <h2 className="font-display text-xl font-bold text-ivory">Key Contributions & Architecture</h2>
            <ul className="mt-5 space-y-3.5">
              {project.contribution.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-slateMuted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel rounded-2xl p-7 md:col-span-5">
            <h2 className="font-display text-xl font-bold text-ivory">Technology Stack</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-gold/25 bg-obsidian/80 px-3 py-1.5 font-mono text-xs text-gold-light"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Prev / Next Navigation */}
        <div className="mt-14 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
          {prevProject ? (
            <Link
              to={`/projects/${prevProject.slug}`}
              className="glass-panel group flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-gold/40"
            >
              <ArrowLeft className="h-5 w-5 text-gold-light transition-transform group-hover:-translate-x-1" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slateMuted">Previous Project</p>
                <p className="mt-1 font-display text-base font-semibold text-ivory">{prevProject.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextProject && (
            <Link
              to={`/projects/${nextProject.slug}`}
              className="glass-panel group flex items-center justify-end gap-4 rounded-2xl p-5 text-right transition-colors hover:border-gold/40"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slateMuted">Next Project</p>
                <p className="mt-1 font-display text-base font-semibold text-ivory">{nextProject.title}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gold-light transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </main>

      {data?.profile && <FooterSection profile={data.profile} settings={data.settings} />}
    </div>
  );
};
