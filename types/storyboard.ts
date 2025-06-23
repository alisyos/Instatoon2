// 입력 폼 데이터 타입
export interface FormInput {
  characters: string;
  keywords: string;
  plot: string;
  pageCount: number;
}

// 스토리보드 페이지 타입
export interface StoryboardPage {
  page: number;
  character: string[];
  background: string;
  dialogue: Record<string, string>;
  expressionPose: string;
}

// 전체 스토리보드 타입
export interface Storyboard {
  wholeTitle: string;
  storyTopic: string;
  hashtags: string[];
  pages: StoryboardPage[];
}

// API 응답 타입
export interface ApiResponse {
  success: boolean;
  data?: Storyboard;
  error?: string;
} 