import React from 'react';
import { Smartphone, Layers } from 'lucide-react';
import type { Project } from '../types/portfolio';

interface ProjectVisualProps {
  project: Project;
  className?: string;
}

/**
 * Renders the project's cover artwork/screenshot when available, with project-specific
 * accent styling (e.g., blue visual identity for Insta Wash Clean, gold for Purti Super Bazar).
 * When no asset is assigned yet, renders an architectural placeholder clearly labeled as such.
 */
export const ProjectVisual: React.FC<ProjectVisualProps> = ({ project, className = 'aspect-[16/9]' }) => {
  const accent = project.accent_color || '#B68B50';
  const isBlueTheme = project.slug === 'insta-wash-clean' || accent.toLowerCase() === '#2563eb';

  if (project.cover_image) {
    const isConcept = project.cover_image.includes('promotional_mockup');
    const realScreens = (project.gallery_images || []).filter((u) => !u.includes('promotional_mockup'));

    // Studio 3-phone fan composition for real vertical mobile app screenshots
    if (!isConcept && realScreens.length >= 3) {
      return (
        <div
          className={`relative flex items-end justify-center overflow-hidden bg-gradient-to-br from-[#121A2B] via-[#0B101B] to-[#080B12] px-4 pt-5 ${className}`}
        >
          <div className="pointer-events-none absolute inset-0 bg-ambient-grid opacity-45" />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, ${accent}38 0%, transparent 70%)` }}
          />

          <span className="absolute right-3 top-3 z-20 rounded-full border border-emerald-400/35 bg-obsidian/80 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-300 backdrop-blur-md">
            {realScreens.length} App Screens
          </span>

          <div className="relative z-10 flex h-full w-full items-end justify-center gap-2">
            {/* Left Phone */}
            <div className="h-[82%] w-[28%] -rotate-6 translate-y-2 overflow-hidden rounded-t-2xl border border-white/15 bg-black shadow-2xl transition-transform duration-500 group-hover:-translate-x-1 group-hover:-rotate-8">
              <img
                src={realScreens[1]}
                alt={`${project.title} screen 2`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </div>

            {/* Center Hero Phone */}
            <div className="z-10 h-[94%] w-[33%] overflow-hidden rounded-t-2xl border border-gold/45 bg-black shadow-goldGlow transition-transform duration-500 group-hover:-translate-y-1">
              <img
                src={realScreens[0]}
                alt={`${project.title} primary screen`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </div>

            {/* Right Phone */}
            <div className="h-[82%] w-[28%] rotate-6 translate-y-2 overflow-hidden rounded-t-2xl border border-white/15 bg-black shadow-2xl transition-transform duration-500 group-hover:translate-x-1 group-hover:rotate-8">
              <img
                src={realScreens[2]}
                alt={`${project.title} screen 3`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-obsidian/90 to-transparent" />
        </div>
      );
    }

    return (
      <div className={`relative overflow-hidden bg-midnight ${className}`}>
        <img
          src={project.cover_image}
          alt={`${project.title} — ${project.subtitle || project.category} showcase`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: isBlueTheme
              ? 'linear-gradient(to top, rgba(8, 11, 18, 0.85) 0%, rgba(37, 99, 235, 0.12) 45%, transparent 100%)'
              : 'linear-gradient(to top, rgba(8, 11, 18, 0.82) 0%, rgba(8, 11, 18, 0.1) 45%, transparent 100%)',
          }}
        />
        {isConcept && (
          <span
            className="absolute right-3 top-3 rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider backdrop-blur-md"
            style={{
              borderColor: isBlueTheme ? 'rgba(56, 189, 248, 0.45)' : 'rgba(216, 183, 121, 0.4)',
              backgroundColor: 'rgba(8, 11, 18, 0.72)',
              color: isBlueTheme ? '#93C5FD' : '#D8B779',
            }}
          >
            Concept Visual
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#121928] via-[#0D1320] to-[#080B12] p-5 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-ambient-grid opacity-55" />
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-90"
        style={{ background: `radial-gradient(circle, ${accent}33 0%, transparent 70%)` }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-obsidian/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-gold-light">
          <Smartphone className="h-3 w-3" />
          {project.category}
        </span>
        <span className="rounded-full border border-white/10 bg-obsidian/60 px-2.5 py-0.5 text-[10px] text-slateMuted">
          Visual Placeholder
        </span>
      </div>

      <div className="relative z-10 my-auto flex items-center justify-center py-2">
        <div className="relative flex h-28 w-20 flex-col items-center justify-center rounded-[18px] border border-gold/30 bg-obsidian/75 shadow-goldGlow transition-transform duration-500 group-hover:-translate-y-1">
          <div className="absolute top-2 h-1 w-7 rounded-full bg-white/15" />
          <Layers className="h-6 w-6 text-gold-light/80" />
          <span className="mt-1.5 px-1 text-center font-mono text-[9px] tracking-wider text-slateMuted">
            FLUTTER
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-[11px] text-slateMuted/80">
        <span className="truncate font-medium text-ivory/90">{project.title}</span>
        <span className="shrink-0 font-mono text-[10px] text-gold/80">
          {String(project.order).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
