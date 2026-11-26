import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { ProjectVisual } from './ProjectVisual';
import type { Project } from '../types/portfolio';

interface ProjectGalleryProps {
  project: Project;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ project }) => {
  const images = Array.from(new Set([project.cover_image, ...(project.gallery_images || [])].filter(Boolean)));
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [project.slug]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight' && images.length > 1) setActiveIndex((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft' && images.length > 1) setActiveIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, images.length]);

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-3xl border border-white/10">
        <ProjectVisual project={project} className="h-80 sm:h-96" />
      </div>
    );
  }

  const activeUrl = images[activeIndex] || images[0];
  const isConcept = activeUrl.includes('promotional_mockup');
  const accent = project.accent_color || '#B68B50';

  return (
    <div>
      {/* Main Showcase Stage */}
      <div
        className="group relative overflow-hidden rounded-3xl border bg-midnight shadow-card"
        style={{ borderColor: `${accent}44` }}
      >
        <div
          className={`relative w-full overflow-hidden bg-obsidian ${
            isConcept ? 'aspect-[16/9]' : 'flex min-h-[420px] max-h-[600px] items-center justify-center bg-gradient-to-br from-[#101624] via-[#0A0F1A] to-[#080B12] p-6 sm:p-8'
          }`}
        >
          {!isConcept && (
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-35"
              style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
            />
          )}
          <AnimatePresence mode="wait">
            <motion.img
              key={activeUrl}
              src={activeUrl}
              alt={`${project.title} — visual ${activeIndex + 1}`}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className={
                isConcept
                  ? 'h-full w-full object-cover'
                  : 'relative z-10 max-h-[540px] w-auto rounded-2xl border border-white/15 object-contain shadow-2xl'
              }
            />
          </AnimatePresence>

          {/* Subtle vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/55 via-transparent to-transparent" />

          {/* Badge: Concept Showcase vs App Screenshot */}
          <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
            <span
              className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur-md"
              style={{
                borderColor: `${accent}66`,
                backgroundColor: 'rgba(8, 11, 18, 0.78)',
                color: accent === '#2563EB' ? '#93C5FD' : '#D8B779',
              }}
            >
              {isConcept ? 'Promotional Concept' : `Screen ${activeIndex + 1} / ${images.length}`}
            </span>
          </div>

          {/* Lightbox Expand Button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Inspect full-size visual"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-obsidian/75 text-ivory backdrop-blur-md transition-all hover:scale-105 hover:border-gold hover:text-gold-light"
          >
            <Expand className="h-4 w-4" />
          </button>

          {/* Prev/Next Controls when multiple images */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-obsidian/75 text-ivory backdrop-blur-md transition-opacity hover:border-gold sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
                aria-label="Next image"
                className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-obsidian/75 text-ivory backdrop-blur-md transition-opacity hover:border-gold sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((imgUrl, idx) => (
            <button
              key={imgUrl}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border transition-all ${
                activeIndex === idx ? 'ring-2' : 'border-white/10 opacity-65 hover:opacity-100'
              }`}
              style={activeIndex === idx ? { borderColor: accent, boxShadow: `0 0 0 2px ${accent}55` } : undefined}
            >
              <img src={imgUrl} alt={`${project.title} thumbnail ${idx + 1}`} loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
              className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-obsidian/80 text-ivory hover:border-gold"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              src={activeUrl}
              alt={`${project.title} full view`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] max-w-[92vw] rounded-2xl border border-white/15 object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
