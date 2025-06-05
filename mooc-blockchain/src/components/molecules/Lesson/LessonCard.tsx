import { Button } from "@/components/ui/button";
import { ICourse } from "@/interface";
import { useDraggable } from "@dnd-kit/core";
import { Trash } from "lucide-react";
import Link from "next/link";

interface LessonProps {
  courseId: number;
  lesson: ICourse.Lesson;
}

export function LessonCard({ courseId, lesson }: LessonProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: lesson.id.toString(), // ID duy nhất
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <div className="grid grid-cols-3">
        <Link
          href={`/instructor/courses/${courseId}/lesson/${lesson.id}`}
          className="text-left p-3 underline col-span-2"
        >
          {lesson.title}
        </Link>
        <div className="col-span-1">
          <Button className="m-0.5 mb-1">Đổi chương</Button>

          <Button className="m-0.5 bg-red-500">
            <Trash />
          </Button>
        </div>
      </div>

      <div></div>
    </div>
  );
}
