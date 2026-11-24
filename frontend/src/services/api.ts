import axios from 'axios';
import type {
  Achievement,
  ActivityLog,
  AdminUser,
  ContactInquiry,
  DashboardResponse,
  Education,
  Experience,
  FullPortfolioData,
  MediaAsset,
  Profile,
  Project,
  Skill,
  WebsiteSettings,
} from '../types/portfolio';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT access token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ob_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatic refresh on 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && !original.url?.includes('/auth/login')) {
      const refresh = localStorage.getItem('ob_refresh_token');
      if (refresh) {
        original._retry = true;
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token: refresh });
          localStorage.setItem('ob_access_token', data.access_token);
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return apiClient(original);
        } catch {
          localStorage.removeItem('ob_access_token');
          localStorage.removeItem('ob_refresh_token');
          localStorage.removeItem('ob_admin_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

// Public Portfolio API
export const portfolioApi = {
  getFull: () => apiClient.get<FullPortfolioData>('/portfolio/full').then((r) => r.data),
  getProjectBySlug: (slug: string) => apiClient.get<Project>(`/portfolio/projects/${slug}`).then((r) => r.data),
  submitContact: (payload: { name: string; email: string; subject: string; message: string; honeypot?: string }) =>
    apiClient.post<{ id: string; message: string }>('/portfolio/contact', payload).then((r) => r.data),
  trackEvent: (event_type: 'page_view' | 'project_view' | 'resume_download' | 'store_click', path = '/', target = '') =>
    apiClient.post('/portfolio/analytics', { event_type, path, target }).catch(() => null),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient
      .post<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        admin: AdminUser;
      }>('/auth/login', { email, password })
      .then((r) => r.data),
  logout: (refresh_token?: string) => apiClient.post('/auth/logout', refresh_token ? { refresh_token } : {}).catch(() => null),
  me: () => apiClient.get<AdminUser>('/auth/me').then((r) => r.data),
  forgotPassword: (email: string) =>
    apiClient.post<{ message: string; dev_reset_token?: string }>('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (token: string, new_password: string) =>
    apiClient.post<{ message: string }>('/auth/reset-password', { token, new_password }).then((r) => r.data),
  changePassword: (current_password: string, new_password: string) =>
    apiClient.post<{ message: string }>('/auth/change-password', { current_password, new_password }).then((r) => r.data),
};

// Admin API
export const adminApi = {
  getDashboard: () => apiClient.get<DashboardResponse>('/admin/dashboard').then((r) => r.data),

  // Profile
  getProfile: () => apiClient.get<Profile>('/admin/profile').then((r) => r.data),
  updateProfile: (data: Partial<Profile>) => apiClient.put<Profile>('/admin/profile', data).then((r) => r.data),

  // Projects
  listProjects: () => apiClient.get<Project[]>('/admin/projects').then((r) => r.data),
  createProject: (data: Partial<Project>) => apiClient.post<Project>('/admin/projects', data).then((r) => r.data),
  updateProject: (id: string, data: Partial<Project>) => apiClient.put<Project>(`/admin/projects/${id}`, data).then((r) => r.data),
  deleteProject: (id: string) => apiClient.delete(`/admin/projects/${id}`).then((r) => r.data),
  reorderProjects: (items: { id: string; order: number }[]) => apiClient.put('/admin/projects/reorder', { items }).then((r) => r.data),

  // Skills
  listSkills: () => apiClient.get<Skill[]>('/admin/skills').then((r) => r.data),
  createSkill: (data: Partial<Skill>) => apiClient.post<Skill>('/admin/skills', data).then((r) => r.data),
  updateSkill: (id: string, data: Partial<Skill>) => apiClient.put<Skill>(`/admin/skills/${id}`, data).then((r) => r.data),
  deleteSkill: (id: string) => apiClient.delete(`/admin/skills/${id}`).then((r) => r.data),

  // Experience
  listExperience: () => apiClient.get<Experience[]>('/admin/experience').then((r) => r.data),
  createExperience: (data: Partial<Experience>) => apiClient.post<Experience>('/admin/experience', data).then((r) => r.data),
  updateExperience: (id: string, data: Partial<Experience>) => apiClient.put<Experience>(`/admin/experience/${id}`, data).then((r) => r.data),
  deleteExperience: (id: string) => apiClient.delete(`/admin/experience/${id}`).then((r) => r.data),

  // Education
  listEducation: () => apiClient.get<Education[]>('/admin/education').then((r) => r.data),
  createEducation: (data: Partial<Education>) => apiClient.post<Education>('/admin/education', data).then((r) => r.data),
  updateEducation: (id: string, data: Partial<Education>) => apiClient.put<Education>(`/admin/education/${id}`, data).then((r) => r.data),
  deleteEducation: (id: string) => apiClient.delete(`/admin/education/${id}`).then((r) => r.data),

  // Achievements
  listAchievements: () => apiClient.get<Achievement[]>('/admin/achievements').then((r) => r.data),
  createAchievement: (data: Partial<Achievement>) => apiClient.post<Achievement>('/admin/achievements', data).then((r) => r.data),
  updateAchievement: (id: string, data: Partial<Achievement>) => apiClient.put<Achievement>(`/admin/achievements/${id}`, data).then((r) => r.data),
  deleteAchievement: (id: string) => apiClient.delete(`/admin/achievements/${id}`).then((r) => r.data),

  // Messages
  listMessages: (params?: { status?: string; search?: string }) =>
    apiClient.get<ContactInquiry[]>('/admin/messages', { params }).then((r) => r.data),
  updateMessage: (id: string, data: Partial<Pick<ContactInquiry, 'is_read' | 'status' | 'internal_notes'>>) =>
    apiClient.put<ContactInquiry>(`/admin/messages/${id}`, data).then((r) => r.data),
  deleteMessage: (id: string) => apiClient.delete(`/admin/messages/${id}`).then((r) => r.data),
  exportMessagesCsv: async () => {
    const res = await apiClient.get('/admin/messages/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'portfolio_inquiries.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Settings
  getSettings: () => apiClient.get<WebsiteSettings>('/admin/settings').then((r) => r.data),
  updateSettings: (data: Partial<WebsiteSettings>) => apiClient.put<WebsiteSettings>('/admin/settings', data).then((r) => r.data),

  // Media
  listMedia: (category?: string) => apiClient.get<MediaAsset[]>('/admin/media', { params: category ? { category } : {} }).then((r) => r.data),
  uploadMedia: (file: File, category = 'general', onProgress?: (pct: number) => void) => {
    const form = new FormData();
    form.append('file', file);
    form.append('category', category);
    return apiClient
      .post<MediaAsset>('/admin/media/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total && onProgress) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      })
      .then((r) => r.data);
  },
  deleteMedia: (id: string) => apiClient.delete(`/admin/media/${id}`).then((r) => r.data),

  // Activity Logs
  listActivityLogs: (limit = 100) => apiClient.get<ActivityLog[]>('/admin/activity-logs', { params: { limit } }).then((r) => r.data),
};
