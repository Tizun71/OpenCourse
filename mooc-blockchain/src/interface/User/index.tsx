import { IBase } from "..";

interface BaseUser extends IBase.BaseData {
  firstName: string;
  lastName: string;
}

interface UserRequest {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  gender: string;
  birthday: string;
  email: string;
  phone: string;
}

interface UserCreationPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  type: string;
}

interface RoleChangePayload {
  userId: number;
  type: string;
}

interface InstructorRegister {
  fullName: string;
  email: string;
  phone: string;
  education?: string;
  specialization: string;
  courseCategories: string;
  teachingExperience: string;
  videoSampleUrl?: string;
}

interface LessonResponse {
  lessonId: number;
  lessonName: string;
}

interface UserProgressInCourse {
  progress: number;
  totalLessons: number;
  completedLessons: number;
  completedLesson: LessonResponse[];
  status: string;
}

export type {
  UserProfile,
  UserRequest,
  BaseUser,
  UserCreationPayload,
  RoleChangePayload,
  InstructorRegister,
  UserProgressInCourse,
  LessonResponse,
};
