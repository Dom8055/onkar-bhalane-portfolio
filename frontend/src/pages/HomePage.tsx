import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { CinematicLoader } from '../components/CinematicLoader';
import { CustomCursor } from '../components/CustomCursor';
import { Navbar } from '../components/Navbar';
import { SEOHead } from '../components/SEOHead';
import { usePortfolio } from '../hooks/usePortfolio';
import { AboutSection } from '../sections/AboutSection';
import { AchievementsSection } from '../sections/AchievementsSection';
import { ContactSection } from '../sections/ContactSection';
import { EducationSection } from '../sections/EducationSection';
import { ExperienceSection } from '../sections/ExperienceSection';
import { FooterSection } from '../sections/FooterSection';
import { HeroSection } from '../sections/HeroSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { SkillsSection } from '../sections/SkillsSection';
import { portfolioApi } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

export const HomePage: React.FC = () => {
  const { data, loading, error, reload } = usePortfolio();
  const [loaderDone, setLoaderDone] = useState(() => sessionStorage.getItem('ob_intro_seen') === '1');

  // Lenis smooth scroll + GSAP ScrollTrigger sync
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || data?.settings?.animations_enabled === false) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [data?.settings?.animations_enabled]);

  // Privacy-conscious page view tracking
  useEffect(() => {
    if (data && data.settings?.analytics_enabled !== false) {
      portfolioApi.trackEvent('page_view', '/');
    }
  }, [data]);

  const handleLoaderComplete = () => {
    sessionStorage.setItem('ob_intro_seen', '1');
    setLoaderDone(true);
  };

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center">
        <AlertTriangle className="h-12 w-12 text-gold-light" />
        <h1 className="mt-4 font-display text-2xl font-bold text-ivory">Unable to load portfolio data</h1>
        <p className="mt-2 max-w-md text-sm text-slateMuted">{error}</p>
        <button
          onClick={reload}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-obsidian"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  if (loading || !data) {
    return <CinematicLoader onComplete={handleLoaderComplete} />;
  }

  if (data.settings?.maintenance_mode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/40 bg-midnight font-display text-2xl font-bold text-gold-light">
          {data.settings.logo_text || 'OB'}
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-ivory">Scheduled Maintenance</h1>
        <p className="mt-3 max-w-md text-sm text-slateMuted">{data.settings.maintenance_message}</p>
      </div>
    );
  }

  const sectionOrder = (data.settings?.sections || []).slice().sort((a, b) => a.order - b.order);
  const isVisible = (key: string) => {
    const found = sectionOrder.find((s) => s.key === key);
    return found ? found.is_visible : true;
  };

  const renderSection = (key: string) => {
    if (!isVisible(key)) return null;
    switch (key) {
      case 'hero':
        return (
          <HeroSection
            key="hero"
            profile={data.profile}
            animationsEnabled={data.settings?.animations_enabled !== false}
            onResumeClick={() => portfolioApi.trackEvent('resume_download', '/')}
          />
        );
      case 'about':
        return <AboutSection key="about" profile={data.profile} />;
      case 'skills':
        return <SkillsSection key="skills" skills={data.skills} />;
      case 'experience':
        return <ExperienceSection key="experience" experiences={data.experiences} />;
      case 'projects':
        return <ProjectsSection key="projects" projects={data.projects} />;
      case 'achievements':
        return <AchievementsSection key="achievements" achievements={data.achievements} />;
      case 'education':
        return <EducationSection key="education" education={data.education} />;
      case 'contact':
        return <ContactSection key="contact" profile={data.profile} />;
      default:
        return null;
    }
  };

  const keysToRender =
    sectionOrder.length > 0
      ? sectionOrder.map((s) => s.key)
      : ['hero', 'about', 'skills', 'experience', 'projects', 'achievements', 'education', 'contact'];

  return (
    <div className="min-h-screen bg-obsidian text-ivory transition-colors duration-300">
      <div className="film-grain" />
      <SEOHead profile={data.profile} settings={data.settings} />
      {!loaderDone && <CinematicLoader onComplete={handleLoaderComplete} logoText={data.settings?.logo_text} />}
      <CustomCursor enabled={data.settings?.custom_cursor_enabled !== false} />
      <Navbar
        profile={data.profile}
        settings={data.settings}
        onResumeClick={() => portfolioApi.trackEvent('resume_download', '/')}
      />
      <main>{keysToRender.map((k) => renderSection(k))}</main>
      <FooterSection profile={data.profile} settings={data.settings} />
    </div>
  );
};
