"use client";

import { useState } from "react";
import { ChevronUp, Play, CheckCircle } from "lucide-react";
import type { ICourse, IUser } from "@/interface";
import { useParams, useRouter } from "next/navigation";
import { useLoading } from "@/provider/Loading";

interface SectionProps {
  index: number;
  section: ICourse.Section;
  lessonCompleted?: IUser.LessonResponse[] | undefined;
}

export default function CourseSection({
  index,
  section,
  lessonCompleted,
}: SectionProps) {
  const params = useParams();
  const courseId = params.courseId;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setLoading } = useLoading();

  return (
    <div className="w-full m-2">
      <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl overflow-hidden hover:border-blue-200 transition-all duration-300 shadow-sm">
        {/* Section Header */}
        <div
          className="bg-gradient-to-r from-gray-50 to-blue-50 px-5 py-3.5 flex justify-between items-center cursor-pointer group"
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white border border-blue-200 text-blue-600 font-mono text-sm shadow-[0_0_10px_rgba(59,130,246,0.1)]">
              {(index + 1).toString().padStart(2, "0")}
            </div>
            <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
              {section.title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-500">
              {section.lessons.length.toString().padStart(2, "0")} BÀI HỌC
            </span>
            <div className="bg-white w-7 h-7 rounded-md flex items-center justify-center border border-blue-200 shadow-sm">
              <ChevronUp
                className={`h-4 w-4 text-blue-600 transition-transform duration-300 ${
                  !open ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section Lessons */}
        {open && (
          <div className="divide-y divide-gray-100">
            {section.lessons.map((lesson, index) => {
              const isLessonCompleted =
                lessonCompleted?.some((l) => l.lessonId === lesson.id) ?? false;

              return (
                <div
                  key={lesson.id}
                  className={`px-5 py-3 flex justify-between items-center transition-all duration-200 ${
                    isLessonCompleted ? "bg-blue-50/50" : "hover:bg-blue-50/30"
                  } cursor-pointer`}
                  onClick={() => {
                    setLoading(true);
                    router.push(`/course/${courseId}/lesson/${lesson.id}`);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-md ${
                        isLessonCompleted
                          ? "bg-white border border-green-200 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                          : "bg-white border border-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                      }`}
                    >
                      {isLessonCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Play className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">
                        {(index + 1).toString().padStart(2, "0")}.{" "}
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {isLessonCompleted && (
                          <div className="px-2 py-0.5 bg-green-50 rounded-md text-xs font-mono text-green-600">
                            ĐÃ HOÀN THÀNH
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
