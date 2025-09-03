export interface ILecture {
  _id?: string;
  title: string;
  description?: string;
  content?: string;
  pdfNotes?: string[];
  videoUrl?: string;
  duration: number; // in minutes
  lectureNumber?: number;
  order?: number;
  moduleId: string;
  courseId: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateLectureData {
  title: string;
  description?: string;
  content?: string;
  pdfNotes?: string[];
  videoUrl?: string;
  duration: number;
  lectureNumber?: number;
  order?: number;
  moduleId: string;
  courseId: string;
  isPublished?: boolean;
}

export interface UpdateLectureData {
  title?: string;
  description?: string;
  content?: string;
  pdfNotes?: string[];
  videoUrl?: string;
  duration?: number;
  lectureNumber?: number;
  order?: number;
  isPublished?: boolean;
}

export interface LectureFormData {
  title: string;
  description: string;
  content: string;
  pdfNotes: string[];
  videoUrl: string;
  duration: number;
  lectureNumber: number;
  order: number;
}
