
export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export interface ProjectMedia {
  id: string;
  type: MediaType;
  url: string;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  category: string;
  thumbnail: string;
  media: ProjectMedia[];
  createdAt: number;
  backgroundVideoUrl?: string; // 项目详情页背景视频
}

export interface AppConfig {
  title: string;
  logoText: string;
  logoUrl?: string;
  theme: 'light' | 'dark';
  password?: string; // Access password for editing
}

export interface AppState {
  projects: Project[];
  isEditing: boolean;
  selectedProjectId: string | null;
  config: AppConfig;
}
