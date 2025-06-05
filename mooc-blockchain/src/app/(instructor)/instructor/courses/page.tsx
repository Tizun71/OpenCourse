"use client";

import InstructorCourseList from "./InstructorCourseList";

import CourseCreationForm from "@/components/organism/Form/CourseCreationForm";

export default function InstructorCoursesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between mb-6"></div>

      <CourseCreationForm />
      {/* Instructor Course List */}
      <InstructorCourseList />
    </div>
  );
}
