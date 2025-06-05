"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/molecules/Course/CourseCard";
import { useAuth } from "@/hooks/Auth";
import CourseService from "@/services/Backend-api/course-service";
import { ICourse } from "@/interface";

const CourseContainer = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<ICourse.CourseRegistedDetail[]>([]); // sửa type ở đây

  useEffect(() => {
    if (!user?.id) return;

    const fetchCourses = async () => {
      try {
        const res = await CourseService.litsRegistedCourse(user.id);
        setCourses(res.data);
      } catch (error) {
        console.error("Failed to fetch registered courses:", error);
      }
    };

    fetchCourses();
  }, [user?.id]);

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} userId={user?.id} />
      ))}
    </div>
  );
};

export default CourseContainer;
