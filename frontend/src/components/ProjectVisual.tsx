import React from 'react';
import { Smartphone, Layers } from 'lucide-react';
import type { Project } from '../types/portfolio';

interface ProjectVisualProps {
  project: Project;
  className?: string;
}

/**
 * Renders the project's uploaded screenshot/cover image when available.
 * When no screenshot has been uploaded yet, renders a refined architectural
 * placeholder card explicitly labeled as an editable placeholder (never implying
 * a generic mockup is an actual app screenshot).
 */
export const ProjectVisual: React.FC<ProjectVisualProps> = ({ project, className = 'h-56' }) => {
  if (project.cover_image) {
    return (
      <div className={`relative overflow-hidden bg-midnight ${className}`}>
        <img
          src={project.cover_image}
          alt={`${project.title} showcase`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/10 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#121928] via-[#0D1320] to-[#080B12] p-5 ${className}`}
    >
      {/* Subtle architectural grid & ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-ambient-grid opacity-55" />
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-90"
        style={{ background: `radial-gradient(circle, ${project.accent_color || '#B68B50'}33 0%, transparent 70%)` }}
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

      {/* Stylized wireframe phone silhouette — clearly abstract, not a fake screenshot */}
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
