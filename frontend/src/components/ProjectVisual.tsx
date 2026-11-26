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
