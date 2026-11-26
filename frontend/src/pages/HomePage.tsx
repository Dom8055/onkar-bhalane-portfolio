import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertTriangle, Award, Briefcase, Cpu, FolderKanban, Home, Mail, RefreshCw, User } from 'lucide-react';
import { CinematicLoader } from '../components/CinematicLoader';
import { Navbar } from '../components/Navbar';
import { SEOHead } from '../components/SEOHead';
import { LiquidGlassCursor, LiquidGlassDock } from '../components/liquid-glass';
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
  const [activeDock, setActiveDock] = useState('hero');

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

  useEffect(() => {
    const onScroll = () => {
      const ids = ['hero', 'about', 'skills', 'experience', 'projects', 'achievements', 'contact'];
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveDock(ids[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        <AlertTriangle className="h-12 w-12 text-gold" />
        <h1 className="mt-4 font-display text-2xl font-bold text-ivory">Unable to load portfolio data</h1>
        <p className="mt-2 max-w-md text-sm text-slateMuted">{error}</p>
        <button
          onClick={reload}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-[#080B12]"
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
        <div className="liquid-glass flex h-16 w-16 items-center justify-center rounded-2xl font-display text-2xl font-bold text-gold">
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
      : ['hero', 'about', 'skills', 'experience', 'projects', 'achievements', 'contact'];

  const dockItems = [
    { label: 'Home', href: '#hero', icon: <Home className="h-4 w-4" />, active: activeDock === 'hero' },
    { label: 'About', href: '#about', icon: <User className="h-4 w-4" />, active: activeDock === 'about' },
    { label: 'Skills', href: '#skills', icon: <Cpu className="h-4 w-4" />, active: activeDock === 'skills' },
    { label: 'Experience', href: '#experience', icon: <Briefcase className="h-4 w-4" />, active: activeDock === 'experience' },
    { label: 'Projects', href: '#projects', icon: <FolderKanban className="h-4 w-4" />, active: activeDock === 'projects' },
    { label: 'Highlights', href: '#achievements', icon: <Award className="h-4 w-4" />, active: activeDock === 'achievements' },
    { label: 'Contact', href: '#contact', icon: <Mail className="h-4 w-4" />, active: activeDock === 'contact' },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-ivory transition-colors duration-300">
      <div className="film-grain" />
      <SEOHead profile={data.profile} settings={data.settings} />
      {!loaderDone && <CinematicLoader onComplete={handleLoaderComplete} logoText={data.settings?.logo_text} />}
      <LiquidGlassCursor enabled={data.settings?.custom_cursor_enabled !== false} />
      <Navbar
        profile={data.profile}
        settings={data.settings}
        onResumeClick={() => portfolioApi.trackEvent('resume_download', '/')}
      />
      <main>{keysToRender.map((k) => renderSection(k))}</main>
      <FooterSection profile={data.profile} settings={data.settings} />
      <LiquidGlassDock items={dockItems} />
    </div>
  );
};
