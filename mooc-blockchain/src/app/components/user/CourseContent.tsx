import CourseSection from "./CourseSection";
import { ICourse } from "@/interface";

interface CourseContentProps {
  sections: ICourse.Section[];
}

export default function CourseContent({ sections }: CourseContentProps) {
  return (
    <div className="mx-auto mt-6 p-4">
      <h2 className="text-xl font-semibold mb-4">Nội dung khóa học</h2>
      {sections.map((section, index) => (
        <CourseSection key={index} section={section} index={index} />
      ))}
      <div className="border rounded-md overflow-hidden"></div>
    </div>
  );
}
