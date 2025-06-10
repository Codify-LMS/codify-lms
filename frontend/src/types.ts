export interface CourseData {
  title: string;
  description: string;
  thumbnailUrl: string;
  isPublished: boolean;
}

export interface ModuleData {
  title: string;
  description: string;
  orderInCourse: number;
}

export interface LessonData {
  title: string;
  content: string;          
  contentType: 'video' | 'text';  
  videoUrl?: string;     
  orderInModule: number;   
}


export interface FullUploadData {
  course: CourseData | null;
  modules: ModuleData[];
  lessons: LessonData[];
}