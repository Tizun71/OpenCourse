"use client";

import Cookies from "js-cookie";
import { Course } from "@/models/course";
import { useCallback, useEffect, useState } from "react";
import InstructorCourseCard from "@/app/components/instructor/InstructorCourseCard";
import { jwtDecode, JwtPayload } from "jwt-decode";
import CourseService from "@/services/Backend-api/course-service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/provider/Loading";

const InstructorCourseList = () => {
  const { setLoading } = useLoading();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);

      const token = Cookies.get("accessToken") as string;
      const decodedToken = jwtDecode(token) as JwtPayload & {
        userId: number;
      };
      const res = await CourseService.listAllInstructorCourses(
        decodedToken.userId
      );
      const data = res?.data;
      setCourses(data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [setLoading]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Tìm kiếm khóa học..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive">Lưu ý</Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-black text-white px-3 py-2 rounded text-sm shadow-md"
          >
            <p>Điều kiện để 1 khóa học được xuất bản</p>
            <ul>
              <li>
                - Thông tin khóa học phải đầy đủ bao gồm: tên, hình ảnh, mô tả,
                ...
              </li>
              <li>- Cần tối thiểu 3 chương</li>
              <li>- Mỗi chương tối thiểu 3 bài học</li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {filteredCourses.map((course) => (
        <InstructorCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default InstructorCourseList;
