export interface ProcessedDocument {
  filename: string;
  type: 'pdf' | 'pptx';
  pages: PageContent[];
}

export interface PageContent {
  pageNumber: number;
  text: string;
  hasImage: boolean;
}

export interface SearchResult {
  document: string;
  pageNumber: number;
  excerpt: string;
  relevance: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  results?: SearchResult[];
  timestamp: Date;
}
