
export enum UserRole {
  STUDENT = 'STUDENT',
  PROFESSIONAL = 'PROFESSIONAL',
  RESEARCHER = 'RESEARCHER'
}

export interface UserProfile {
  name: string;
  email: string;
  background: string;
  hardwareExperience: string;
  softwareExperience: string;
  specificInterests: string;
}

export interface Chapter {
  id: string;
  title: string;
  module: string;
  content: string;
  urduSummary?: string;
  personalizedTip?: string;
  visualData?: any[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
