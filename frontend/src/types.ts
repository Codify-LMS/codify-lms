export interface CourseData {
  id?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  isPublished: boolean;
  modules: ModuleData[];
}

export interface ModuleData {
  id?: string;
  title: string;
  description: string;
  orderInCourse: number;
}

export interface LessonData {
  id?: string;
  title: string;
  content: string;          
  contentType: 'video' | 'text';  
  videoUrl?: string;     
  orderInModule: number;   
  moduleId: string;
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
  id: string
  email: string
  full_name?: string
  first_name?: string
  last_name?: string
  username?: string
  avatar_url?: string
  role?: string
}