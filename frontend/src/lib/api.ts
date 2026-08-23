import axios from 'axios';
import {
  ProfileInfo,
  Skill,
  Experience,
  Project,
  Education,
  Note,
  ContactMessage,
  AuthResponse,
  AdminStats
} from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085/api/v1';

const publicClient = axios.create({
  baseURL: `${API_BASE}/public`,
  headers: { 'Content-Type': 'application/json' },
});

const adminClient = axios.create({
  baseURL: `${API_BASE}/admin`,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to attach Bearer token from localStorage
adminClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const loginAdmin = async (username: string, password: string): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(`${API_BASE}/auth/login`, { username, password });
  if (res.data.token) {
    localStorage.setItem('admin_jwt_token', res.data.token);
    localStorage.setItem('admin_username', res.data.username);
  }
  return res.data;
};

export const registerAdmin = async (username: string, password: string, email: string): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(`${API_BASE}/auth/register`, { username, password, email });
  if (res.data.token) {
    localStorage.setItem('admin_jwt_token', res.data.token);
    localStorage.setItem('admin_username', res.data.username);
  }
  return res.data;
};

export const loginGoogleAdmin = async (email: string, name: string, picture: string): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(`${API_BASE}/auth/google`, { email, name, picture });
  if (res.data.token) {
    localStorage.setItem('admin_jwt_token', res.data.token);
    localStorage.setItem('admin_username', res.data.username);
  }
  return res.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('admin_jwt_token');
  localStorage.removeItem('admin_username');
};

// Multi-Tenant User Slug API
export const fetchUserBySlug = async (username: string): Promise<any> => {
  const res = await publicClient.get(`/u/${username}`);
  return res.data;
};

// Super Admin User Management API
export const fetchSuperAdminUsers = async (): Promise<any[]> => {
  const res = await adminClient.get('/super/users');
  return res.data;
};

export const deleteSuperAdminUser = async (id: number): Promise<void> => {
  await adminClient.delete(`/super/users/${id}`);
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_jwt_token');
};

// Public Portfolio APIs
export const fetchPublicProfile = async (): Promise<ProfileInfo> => {
  const res = await publicClient.get<ProfileInfo>('/profile');
  return res.data;
};

export const fetchPublicSkills = async (): Promise<Skill[]> => {
  const res = await publicClient.get<Skill[]>('/skills');
  return res.data;
};

export const fetchPublicExperiences = async (): Promise<Experience[]> => {
  const res = await publicClient.get<Experience[]>('/experiences');
  return res.data;
};

export const fetchPublicProjects = async (): Promise<Project[]> => {
  const res = await publicClient.get<Project[]>('/projects');
  return res.data;
};

export const fetchPublicEducation = async (): Promise<Education[]> => {
  const res = await publicClient.get<Education[]>('/education');
  return res.data;
};

export const fetchPublicNotes = async (): Promise<Note[]> => {
  const res = await publicClient.get<Note[]>('/notes');
  return res.data;
};

export const fetchPublicNoteBySlug = async (slug: string): Promise<Note> => {
  const res = await publicClient.get<Note>(`/notes/${slug}`);
  return res.data;
};

export const sendContactMessage = async (data: { name: string; email: string; subject: string; message: string }) => {
  const res = await publicClient.post('/contact', data);
  return res.data;
};

// Admin Management APIs
export const fetchAdminStats = async (): Promise<AdminStats> => {
  const res = await adminClient.get<AdminStats>('/stats');
  return res.data;
};

export const updateAdminProfile = async (data: ProfileInfo): Promise<ProfileInfo> => {
  const res = await adminClient.put<ProfileInfo>('/profile', data);
  return res.data;
};

// Skills CRUD
export const fetchAdminSkills = async (): Promise<Skill[]> => {
  const res = await adminClient.get<Skill[]>('/skills');
  return res.data;
};

export const createAdminSkill = async (skill: Partial<Skill>): Promise<Skill> => {
  const res = await adminClient.post<Skill>('/skills', skill);
  return res.data;
};

export const updateAdminSkill = async (id: number, skill: Partial<Skill>): Promise<Skill> => {
  const res = await adminClient.put<Skill>(`/skills/${id}`, skill);
  return res.data;
};

export const deleteAdminSkill = async (id: number): Promise<void> => {
  await adminClient.delete(`/skills/${id}`);
};

// Projects CRUD
export const fetchAdminProjects = async (): Promise<Project[]> => {
  const res = await adminClient.get<Project[]>('/projects');
  return res.data;
};

export const createAdminProject = async (project: Partial<Project>): Promise<Project> => {
  const res = await adminClient.post<Project>('/projects', project);
  return res.data;
};

export const updateAdminProject = async (id: number, project: Partial<Project>): Promise<Project> => {
  const res = await adminClient.put<Project>(`/projects/${id}`, project);
  return res.data;
};

export const deleteAdminProject = async (id: number): Promise<void> => {
  await adminClient.delete(`/projects/${id}`);
};

// Experiences CRUD
export const fetchAdminExperiences = async (): Promise<Experience[]> => {
  const res = await adminClient.get<Experience[]>('/experiences');
  return res.data;
};

export const createAdminExperience = async (experience: Partial<Experience>): Promise<Experience> => {
  const res = await adminClient.post<Experience>('/experiences', experience);
  return res.data;
};

export const updateAdminExperience = async (id: number, experience: Partial<Experience>): Promise<Experience> => {
  const res = await adminClient.put<Experience>(`/experiences/${id}`, experience);
  return res.data;
};

export const deleteAdminExperience = async (id: number): Promise<void> => {
  await adminClient.delete(`/experiences/${id}`);
};

// Notes CRUD
export const fetchAdminNotes = async (): Promise<Note[]> => {
  const res = await adminClient.get<Note[]>('/notes');
  return res.data;
};

export const createAdminNote = async (note: Partial<Note>): Promise<Note> => {
  const res = await adminClient.post<Note>('/notes', note);
  return res.data;
};

export const updateAdminNote = async (id: number, note: Partial<Note>): Promise<Note> => {
  const res = await adminClient.put<Note>(`/notes/${id}`, note);
  return res.data;
};

export const deleteAdminNote = async (id: number): Promise<void> => {
  await adminClient.delete(`/notes/${id}`);
};

// Messages Inbox
export const fetchAdminMessages = async (): Promise<ContactMessage[]> => {
  const res = await adminClient.get<ContactMessage[]>('/messages');
  return res.data;
};

export const markMessageAsRead = async (id: number): Promise<ContactMessage> => {
  const res = await adminClient.put<ContactMessage>(`/messages/${id}/read`);
  return res.data;
};

export const deleteAdminMessage = async (id: number): Promise<void> => {
  await adminClient.delete(`/messages/${id}`);
};
