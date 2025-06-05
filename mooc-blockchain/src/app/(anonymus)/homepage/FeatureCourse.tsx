import CourseCard from "@/components/molecules/Card/CourseCard";
import { Course } from "@/models/course";
import { useLoading } from "@/provider/Loading";
import { listPublisedCourses } from "@/services/course-service";
import { useCallback, useEffect, useState } from "react";

const FeatureCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { setLoading } = useLoading();

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listPublisedCourses({
        keyword: "",
        sort: "desc",
        page: 1,
        size: 5,
      });
      const data = res?.data;
      setCourses(data?.courses || []);
      console.log(data?.courses);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div>
      <div className="flex justify-center gap-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default FeatureCourse;
