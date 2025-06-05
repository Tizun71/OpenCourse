"use client";

import CourseUpdateForm from "@/components/organism/Form/CourseUpdateForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CourseService from "@/services/Backend-api/course-service";
import { ICourse } from "@/interface";
import SectionCreationList from "@/components/templates/SectionEditor";

const InstructorCourseDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [course, setCourse] = useState<ICourse.CourseDetail | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await CourseService.getCourseDetail(Number(id));
      console.log(res);
      if (res?.data) {
        setCourse(res.data);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  if (!course) return <div className="p-6">Đang tải khóa học...</div>;
  return (
    <div className="grid grid-cols-3 gap-3">
      <CourseUpdateForm course={course} />
      <SectionCreationList courseId={course.id} />
    </div>
  );
};

export default InstructorCourseDetailPage;
