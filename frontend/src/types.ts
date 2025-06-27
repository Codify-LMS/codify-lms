export interface CourseData {
  id?: string; // Penting: bisa null/undefined jika course baru
  title: string;
  description: string;
  thumbnailUrl: string;
  isPublished: boolean;
  modules?: ModuleData[]; // Opsional, karena mungkin belum ada modul saat membuat course
}

export interface ModuleData {
  id?: string; // Penting: bisa null/undefined jika module baru
  title: string;
  description: string;
  orderInCourse: number;
  course?: { // Ini untuk relasi ke Course
    id: string;
    title?: string; // Bisa ditambahkan jika ingin menampilkan nama course di dropdown module
  };
  lessons?: LessonData[]; // Opsional, mungkin belum ada lesson
}

export interface LessonData {
  id?: string;
  title: string;
  content: string;
  contentType: 'video' | 'text';
  videoUrl?: string;
  orderInModule: number;
  moduleId: string; // Ini akan menjadi ID modul (bisa ID sementara atau ID dari DB)
  quiz?: QuizData;
}

export interface QuizData {
  id?: string;
  description: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizQuestion {
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
  content: string;
  contentType: 'video' | 'text';
  videoUrl?: string;
  orderInModule: number;
  moduleId: string;
  quiz?: QuizData;
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


export interface QuizQuestionData {
  id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'essay' | 'short_answer';
  options: string[]; 
  correctAnswerIndex?: number; 
  correctAnswerText?: string; 
  scoreValue: number;
  orderInQuiz: number;
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

