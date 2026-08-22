export interface ProfileInfo {
  id?: number;
  fullName: string;
  eyebrow: string;
  title: string;
  summary: string;
  aboutText: string;
  avatarUrl: string;
  resumeUrl: string;
  yearsExperience: number;
  projectsCompleted: number;
  technologiesMastered: number;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  location: string;
  primaryColor?: string;
  accentColor?: string;
  themePreset?: string;
}

export interface Skill {
  id?: number;
  name: string;
  category: string;
  proficiencyPercent: number;
  iconName: string;
  displayOrder: number;
}

export interface Experience {
  id?: number;
  company: string;
  role: string;
  period: string;
  description: string;
  current: boolean;
  badgeText: string;
  techStack: string;
  displayOrder: number;
}

export interface Project {
  id?: number;
  title: string;
  shortDesc: string;
  fullDesc: string;
  demoUrl: string;
  githubUrl: string;
  imageUrl: string;
  tags: string;
  featured: boolean;
  displayOrder: number;
}

export interface Education {
  id?: number;
  degree: string;
  institution: string;
  period: string;
  score: string;
  highlights: string;
  displayOrder: number;
}

export interface Note {
  id?: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
  receivedAt?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface AdminStats {
  totalSkills: number;
  totalExperiences: number;
  totalProjects: number;
  totalNotes: number;
  unreadMessages: number;
  totalMessages: number;
}
