"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LessonCard } from "./LessonCard";
import { Plus, Trash } from "lucide-react";

export function SectionArea() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="w-full mb-6 rounded-lg border shadow-sm col-span-10">
        <div
          className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-between px-4 py-3 cursor-pointer font-semibold rounded-t-lg"
          onClick={handleToggle}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{isOpen ? "▼" : "▶"}</span>
            <span className="text-base sm:text-lg">Chương 1: Giới thiệu</span>
          </div>
        </div>
        {isOpen && (
          <div className="bg-white px-6 py-4 space-y-3">
            <LessonCard />
            <LessonCard />
            <LessonCard />
          </div>
        )}
      </div>
      <Button className="col-span-1" variant="secondary" size="sm">
        <Plus className="w-4 h-4 mr-1" />
      </Button>
      <Button className="col-span-1" variant="destructive" size="sm">
        <Trash className="w-4 h-4 mr-1" />
      </Button>
    </div>
  );
}
