"use client";

import type React from "react";

import type { Course } from "@/models/course";
import { Edit, Trash, Clock, BarChart3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CourseCardProps {
  course: Course;
}

const InstructorCourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getLevelConfig = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return {
          label: "Cơ bản",
          variant: "secondary" as const,
          icon: BarChart3,
        };
      case "INTERMEDIATE":
        return {
          label: "Trung bình",
          variant: "default" as const,
          icon: BarChart3,
        };
      case "ADVANCED":
        return {
          label: "Nâng cao",
          variant: "destructive" as const,
          icon: BarChart3,
        };
      default:
        return { label: level, variant: "outline" as const, icon: BarChart3 };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return {
          label: "Xuất bản",
          variant: "default" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-100",
        };
      case "UNPUBLISHED":
        return {
          label: "Chưa xuất bản",
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        };
      default:
        return { label: status, variant: "outline" as const, className: "" };
    }
  };

  const levelConfig = getLevelConfig(course.courseLevel);
  const statusConfig = getStatusConfig(course.status);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md py-0 mt-2">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image Section */}
          <div className="relative w-full sm:w-48 h-32 sm:h-auto">
            <div className="absolute inset-0 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none overflow-hidden">
              {course.imageUrl ? (
                <Image
                  src={course.imageUrl || "/placeholder.svg"}
                  alt={course.courseName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium">Chưa có hình ảnh</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between h-full">
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.courseName}
                  </h3>
                  {course.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={levelConfig.variant}
                    className="flex items-center gap-1 text-xs"
                  >
                    <levelConfig.icon className="w-3 h-3" />
                    {levelConfig.label}
                  </Badge>
                  <Badge
                    variant={statusConfig.variant}
                    className={`flex items-center gap-1 text-xs ${statusConfig.className}`}
                  >
                    <Clock className="w-3 h-3" />
                    {statusConfig.label}
                  </Badge>
                </div>

                {course.instructorName && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Giảng viên:</span>{" "}
                    {course.instructorName}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4">
                <Button
                  asChild
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  <Link href={`/instructor/courses/${course.id}`}>
                    <Edit className="w-4 h-4" />
                    <span className="sr-only">Chỉnh sửa khóa học</span>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="shadow-sm"
                  onClick={() => console.log("Xoá")}
                >
                  <Trash className="w-4 h-4" />
                  <span className="sr-only">Xóa khóa học</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorCourseCard;
