export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface TailoringResult {
  resume: ResumeData;
  atsScoreBefore: number;
  atsScoreAfter: number;
  improvements: string[];
}

export interface ResumeData {
  name: string;
  contact: ContactInfo;
  summary: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  credits: number;
  creditsLimit: number;
  atsCredits: number;
  atsCreditsLimit: number;
  plan: string;
  emailVerified?: boolean;
  referralCode?: string | null;
}

export interface SavedResume {
  id: string;
  name: string;
  content: ResumeData;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryItem {
  id: string;
  jobDescription: string;
  resumeName?: string | null;
  tailoredResume: ResumeData;
  createdAt: string;
  expiresAt: string;
}

export const PLAN_CREDITS: Record<string, number> = {
  free: 3,
  basic: 50,
  pro: 150,
  premium: 9999, // unlimited
};

export const PLAN_ATS_CREDITS: Record<string, number> = {
  free: 3,
  basic: 0,
  pro: 200,
  premium: 9999, // unlimited
};

export const PLAN_PRICES: Record<string, { price: string; label: string; credits: number; priceId?: string }> = {
  basic: { price: '$9.99', label: 'Basic', credits: 50, priceId: process.env.STRIPE_PRICE_BASIC },
  pro: { price: '$24.99', label: 'Pro', credits: 150, priceId: process.env.STRIPE_PRICE_PRO },
  premium: { price: '$35.99', label: 'Premium', credits: 800, priceId: process.env.STRIPE_PRICE_PREMIUM },
};

export function emptyResume(): ResumeData {
  return {
    name: '',
    contact: { email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  };
}
