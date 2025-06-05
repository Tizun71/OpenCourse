export interface CourseCreationPayload {
  courseName: string;
  description: string;
  imageUrl: string;
  courseLevel: string;
  instructorId: number;
  categoryId: number;
}

export interface CourseUpdatePayload {
  courseId: number;
  courseName: string;
  description: string;
  imageUrl: string;
  courseLevel: string;
  categoryId: number;
}

export interface CourseUpdateStatusPayload {
  courseId: number;
  status: string;
}

export interface CourseEnrollmentPayload {
  userId: number;
  courseId: number;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl: string | null;
  position: number;
  isCompleted: boolean;
}

export interface Section {
  id: number;
  title: string;
  position: number;
  lessons: Lesson[];
}

export interface CourseDetail {
  id: number;
  courseName: string;
  description: string;
  registeredNumber: number;
  instructorName: string;
  courseLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  status: string;
  sections: Section[];
}

export interface CourseRegistedDetail {
  id: number;
  courseName: string;
  instructorName: string;
  level: string;
  progress: number;
  imageUrl: string;
}
