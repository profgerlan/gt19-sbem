export interface Paper {
  id: number;
  title: string;
  authors: string;
  year: number;
  type: string; // e.g., "Artigo", "Dissertação"
  eventOrJournal?: string;
  keywords: string[];
  abstract: string;
  fileName: string; // The path to the file, e.g., "trabalho1.pdf"
  downloadUrl: string; // Full URL or relative path
  
  // Metrics
  viewCount: number;
  downloadCount: number;
  recentLocations: string[]; // Mock list of locations e.g., "São Paulo - SP"
}

export enum ViewState {
  LIST = 'LIST',
  DETAIL = 'DETAIL',
  DASHBOARD = 'DASHBOARD'
}