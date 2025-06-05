"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Course } from "@/models/course";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/course/${course.id}`);
  };
  const levelMap = {
    BEGINNER: "Cơ bản",
    INTERMEDIATE: "Trung cấp",
    ADVANCED: "Nâng cao",
  };

  const levelColor = {
    BEGINNER: "bg-green-100 text-green-800",
    INTERMEDIATE: "bg-blue-100 text-blue-800",
    ADVANCED: "bg-purple-100 text-purple-800",
  };

  return (
    <Card
      className="overflow-hidden max-w-sm transition-all hover:shadow-lg cursor-pointer p-0 min-w-[300px]"
      onClick={handleClick}
    >
      <div className="relative h-48 w-full">
        <Image
          src={course.imageUrl || "/placeholder.svg"}
          alt={course.categoryName}
          fill
          className="object-cover"
          priority
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2">
              {course.categoryName}
            </Badge>
            <h3 className="text-[13px] font-bold">{course.courseName}</h3>
          </div>
          <Badge
            className={
              levelColor[course.courseLevel as keyof typeof levelColor]
            }
          >
            {levelMap[course.courseLevel as keyof typeof levelMap]}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <span className="text-sm font-medium">
          Giảng viên: {course.instructorName}
        </span>
        <Badge className="text-sm font-medium">
          {course.numberOfRegister || 0} học viên
        </Badge>
      </CardFooter>
    </Card>
  );
}
