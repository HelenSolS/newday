// ============================================
// MARATHON LAB - SHARED DATA CONTRACTS
// ============================================

// Content Block Types
export type BlockType = 'video' | 'quiz' | 'article' | 'practice';

// Block Rules (Gating Logic)
export interface BlockRules {
  is_skippable: boolean;
  requires_correct_answer?: boolean; // For quizzes
  delay_seconds?: number; // Time-based unlock
}

// Quiz Option
export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
}

// Video Content
export interface VideoContent {
  url: string;
  description: string;
}

// Quiz Content
export interface QuizContent {
  question: string;
  options: QuizOption[];
}

// Article Content
export interface ArticleContent {
  markdown: string;
}

// Practice Content (AI Reflexion)
export interface PracticeContent {
  prompt: string;
  ai_instruction?: string;
}

// Universal Content Block
export interface ContentBlock {
  id: string;
  type: BlockType;
  order_index: number;
  content: VideoContent | QuizContent | ArticleContent | PracticeContent;
  rules: BlockRules;
}

// Course Day
export interface CourseDay {
  id: string;
  day_number: number;
  title: string;
  blocks: ContentBlock[];
}

// Course (Schema created by Admin)
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  cover_url?: string;
  bot_username: string;
  status: 'draft' | 'published' | 'archived';
  days: CourseDay[];
  created_at: string;
  updated_at: string;
}

// User Answer Log
export interface UserAnswer {
  block_id: string;
  answer_text?: string;
  selected_option_id?: string;
  is_correct?: boolean;
  timestamp: string;
}

// Student Enrollment (Progress State)
export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  current_day: number;
  current_block_index: number;
  answers: UserAnswer[];
  status: 'active' | 'completed' | 'paused';
  started_at: string;
  completed_at?: string;
}

// Chat Message (For Runner UI)
export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content_type: 'text' | 'video' | 'quiz' | 'article' | 'practice' | 'system';
  text?: string;
  block?: ContentBlock;
  timestamp: string;
}
