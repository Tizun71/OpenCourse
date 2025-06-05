"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ICourse } from "@/interface";
import { useRouter } from "next/navigation";
import LessonService from "@/services/Backend-api/lesson-service";
import { toast } from "sonner";
import SectionService from "@/services/Backend-api/section-service";

interface SectionDropdownProps {
  section: ICourse.Section;
  index: number;
  refresh: () => void;
}

const SectionDropdown = ({ section, index, refresh }: SectionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteSection = async () => {
    try {
      await SectionService.deleteSection(section.id);
      refresh();
      toast.success("Xóa chương thành công");
    } catch {
      toast.error("Xóa chương thất bại");
    }
  };
  return (
    <div className="mb-3">
      <div
        className={cn(
          "flex items-center gap-2 p-3 rounded-md border bg-card hover:bg-accent/10 transition-colors",
          isOpen && "bg-accent/10 border-accent/20"
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              Chương {index}: {section.title}
            </span>
            <Badge variant="outline" className="ml-2">
              {section.lessons.length} bài học
            </Badge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Tùy chọn</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                handleDeleteSection();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa chương
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isOpen && section.lessons.length > 0 && (
        <div className="pl-10 mt-2 space-y-2">
          {section.lessons.map((lesson) => (
            <LessonItem key={lesson.id} lesson={lesson} refresh={refresh} />
          ))}
        </div>
      )}
    </div>
  );
};

const LessonItem = ({
  lesson,
  refresh,
}: {
  lesson: any;
  refresh: () => void;
}) => {
  const router = useRouter();
  const handleDeleteLesson = async () => {
    try {
      await LessonService.deleteLesson(lesson.id);
      refresh();
      toast.success("Xóa khóa học thành công");
    } catch {
      toast.error("Xóa bài học thất bại");
    }
  };
  return (
    <div className="flex items-center gap-2 p-2 rounded-md border bg-background hover:bg-accent/5 transition-colors">
      <div className="flex items-center gap-2 flex-1">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span>{lesson.title}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Edit className="h-3.5 w-3.5" />
            <span className="sr-only">Tùy chọn</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push("/instructor/lesson/" + lesson.id)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={handleDeleteLesson}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa bài học
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SectionDropdown;
