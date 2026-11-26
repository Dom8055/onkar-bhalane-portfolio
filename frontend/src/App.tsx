import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LiquidGlassSvgFilters } from './components/liquid-glass';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { ProfileManager } from './admin/ProfileManager';
import { ProjectsManager } from './admin/ProjectsManager';
import { SkillsManager } from './admin/SkillsManager';
import { ExperienceManager } from './admin/ExperienceManager';
import { EducationManager } from './admin/EducationManager';
import { AchievementsManager } from './admin/AchievementsManager';
import { InquiriesManager } from './admin/InquiriesManager';
import { MediaLibrary } from './admin/MediaLibrary';
import { CmsSettingsManager } from './admin/CmsSettingsManager';
import { ActivityLogsPage } from './admin/ActivityLogsPage';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  const routeKey = location.pathname.startsWith('/admin') ? '/admin' : location.pathname;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={routeKey}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
        <Route
          path="/projects/:slug"
          element={
            <PageWrapper>
              <ProjectDetailPage />
            </PageWrapper>
          }
        />

        <Route
          path="/admin/login"
          element={
            <PageWrapper>
              <AdminLoginPage />
            </PageWrapper>
          }
        />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<ProfileManager />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="skills" element={<SkillsManager />} />
          <Route path="experience" element={<ExperienceManager />} />
          <Route path="education" element={<EducationManager />} />
          <Route path="achievements" element={<AchievementsManager />} />
          <Route path="inquiries" element={<InquiriesManager />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="settings" element={<CmsSettingsManager />} />
          <Route path="activity" element={<ActivityLogsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LiquidGlassSvgFilters />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
