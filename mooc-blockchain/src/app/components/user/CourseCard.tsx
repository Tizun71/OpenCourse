import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Course } from "@/models/course";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div>
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {course.courseName}
          </CardTitle>
          <div className="text-sm text-gray-500">
            Giảng viên: {course.instructorName}
          </div>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="mb-2">
            {course.categoryName}
          </Badge>

          <div
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${[
              course.courseLevel,
            ]}`}
          >
            {course.courseLevel}
          </div>

          <Separator className="my-3" />
          <p className="text-gray-700 text-sm">{course.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseCard;
