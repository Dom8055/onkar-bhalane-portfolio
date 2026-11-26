import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />

            <Route path="/admin/login" element={<AdminLoginPage />} />
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
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
