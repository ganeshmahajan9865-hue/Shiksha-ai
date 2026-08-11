export interface StudentProfile {
  id?: string;
  name: string;
  class_level: string; // "6" | "7" | "8" | "9" | "10"
  subjects: string[];
  preferred_language: "English" | "Hindi" | "Marathi";
  created_at?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  topic?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: number; // index 0-3
  explanation: string;
}

export interface QuizResult {
  topic: string;
  score: number;
  total: number;
  questions: QuizQuestion[];
  answers: number[];
  language: string;
  completed_at: string;
}

export interface ProgressEntry {
  id?: string;
  student_id: string;
  topic: string;
  subject: string;
  score: number;
  total: number;
  language: string;
  completed_at: string;
}

export interface TutorResponse {
  explanation: string;
  example: string;
  analogy: string;
  practice_question: string;
  topic: string;
  language: string;
}
