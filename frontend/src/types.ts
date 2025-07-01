export interface ContentBlock {
  type: 'text' | 'image' | 'video' | 'script';
  value: string;
  order: number;
}

export interface CourseData {
  id?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  isPublished: boolean;
  modules?: ModuleData[];
}

export interface ModuleData {
  id?: string;
  title: string;
  description: string;
  orderInCourse: number;
  courseId?: string; 
  lessons?: LessonData[];
}

export interface LessonData {
  id?: string;
  title: string;
  contentBlocks: ContentBlock[];
  orderInModule: number;
  moduleId: string;
  quiz?: QuizData;
}

export interface QuizData {
  id?: string;
  title?: string;
  description?: string;
  type?: string;
  maxAttempts?: number;
  passScore?: number;
  imageUrl?: string; // Gambar untuk keseluruhan Quiz
  questions?: QuizQuestionData[]; // Daftar pertanyaan
}

export interface QuizQuestion { // Ini bisa dihapus jika QuizQuestionData mencukupi
  questionText: string;
  options: string[];
  correctAnswerIndex?: number;
  questionType: 'multiple_choice' | 'essay' | 'short_answer';
  correctAnswerText?: string;
  scoreValue?: number;
  orderInQuiz?: number;
}

export interface CourseBasic{
  id: string;
  title: string;
}

export interface ModuleWithCourse {
  id: string;
  title: string;
  description: string;
  orderInCourse: number;
  courseId: string;
}


export interface FullUploadData {
  course: CourseData | null;
  modules: ModuleData[];
  lessons: LessonData[];
  quiz?: QuizData;
}

export interface ModuleWithLessons {
  id: string;
  title: string;
  description: string;
  orderInCourse: number;
  courseId: string;
  lessons: LessonWithQuizDto[];
}

export interface LessonWithQuizDto {
  id: string;
  title: string;
  contentBlocks: ContentBlock[];
  orderInModule: number;
  moduleId: string;
  quiz?: QuizData;
}

export interface AnswerResponse {
  id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface DiscussionResponse {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
  username?: string;
  avatarUrl?: string;
  answerCount: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  role?: string;
}

export interface LeaderboardEntry {
  rank: number;
  fullName: string;
  avatarUrl: string;
  courseCompleted: number;
  hourSpent: number;
  quizScore: number;
  bonusPoint: number;
  totalScore: number;
  reward: string;
  username: string;
}


export interface BookmarkedCourse {
  id: string;
  title: string;
  thumbnailUrl: string;
  isPublished: boolean;
  progressPercentage?: number;
}


export interface TopUser {
  id: number;
  name: string;
  score: number;
  img: string;
}

// Perbarui interface QuizQuestionData untuk menyertakan imageUrl
export interface QuizQuestionData {
  id?: string;
  questionText: string;
  imageUrl?: string; // <<-- Tambahkan properti ini
  questionType: 'multiple_choice' | 'essay' | 'short_answer';
  options: string[];
  correctAnswerIndex?: number;
  correctAnswerText?: string;
  scoreValue: number;
  orderInQuiz: number;
}

export interface QuizSummaryDTO {
  id: string;
  title: string;
  description: string;
  type: string;
  maxAttempts: number;
  passScore: number;
  imageUrl?: string;
}


export interface QuizSubmissionResponse {
  message: string;
  scoreObtained: number;
  isPassed: boolean;
  answerResults: {
    questionId: string;
    isCorrect: boolean;
    correctAnswerText?: string;
    correctAnswerIndex?: number;
  }[];
}


export interface UserDetails {
  id: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
  email?: string;
  role?: string;
  bonus_point?: number;
  created_at?: string;
  updated_at?: string;
}