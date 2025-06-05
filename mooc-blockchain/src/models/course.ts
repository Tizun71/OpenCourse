export interface Course {
  id: number;
  courseName: string;
  description: string;
  instructorName: string;
  categoryName: string;
  courseLevel: string;
  imageUrl: string;
  status: string;
  numberOfRegister?: number;
}