export interface LessonCreationPayload {
  sectionId: number;
  title: string;
  content: string;
  videoUrl: string;
}

export interface LessonMarkCompletePayload {
  userId: number;
  lessonId: number;
}

export interface LessonDetail {
  id: number;
  title: string;
  content: string;
  videoUrl: string;
  position: number;
}
