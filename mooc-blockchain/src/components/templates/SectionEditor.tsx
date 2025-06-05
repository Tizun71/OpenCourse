"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, BookOpen, Layers } from "lucide-react";
import SectionDropdown from "@/components/organism/Section/SectionDropdown";
import type { Section } from "@/interface/Course";
import type { ISection } from "@/interface";
import LessonCreationForm from "../organism/Form/LessonCreationForm";
import SectionService from "@/services/Backend-api/section-service";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface courseIdProps {
  courseId: number;
}

const SectionEditor = ({ courseId }: courseIdProps) => {
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [sections, setSections] = useState<ISection.SectionCombobox[]>([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const res = await SectionService.listSectionByCourseID(courseId);
      const data = Array.isArray(res.data) ? res.data : [];
      setSectionList(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSectionsCombobox = async () => {
    try {
      const res = await SectionService.listSectionForCombobox(courseId);
      if (res.status === 200 && Array.isArray(res.data)) {
        setSections(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch section combobox data:", error);
    }
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim()) return;

    setIsLoading(true);
    const payload: ISection.SectionCreationPayload = {
      courseId,
      title: newSectionName.trim(),
    };

    try {
      await SectionService.createNewSection(payload);
      setNewSectionName("");
      fetchSections();
      fetchSectionsCombobox();
    } catch (error) {
      console.error("Failed to add section:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    let fromSectionId: number | null = null;
    let toSectionId: number | null = null;

    for (const section of sectionList) {
      if (section.lessons.some((lesson) => lesson.id.toString() === activeId)) {
        fromSectionId = section.id;
      }
      if (
        section.id.toString() === overId ||
        section.lessons.some((lesson) => lesson.id.toString() === overId)
      ) {
        toSectionId = section.id;
      }
    }

    if (fromSectionId === null || toSectionId === null) return;
    if (fromSectionId === toSectionId && activeId === overId) return;

    setSectionList((prev) => {
      const newSections = [...prev];
      const fromSection = newSections.find((s) => s.id === fromSectionId)!;
      const toSection = newSections.find((s) => s.id === toSectionId)!;

      const lessonIndex = fromSection.lessons.findIndex(
        (l) => l.id.toString() === activeId
      );
      const [movedLesson] = fromSection.lessons.splice(lessonIndex, 1);

      toSection.lessons.push(movedLesson);

      return newSections;
    });
  };

  useEffect(() => {
    if (courseId) {
      fetchSectionsCombobox();
      fetchSections();
    }
  }, [courseId]);

  console.log(sectionList);

  return (
    <div className="col-span-2">
      <Card className="shadow-md border-muted">
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Layers className="h-5 w-5" />
            Quản lý chương và bài học
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Input
                  placeholder="Tên chương mới"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="pr-24"
                />
                <Button
                  onClick={handleAddSection}
                  disabled={isLoading || !newSectionName.trim()}
                  size="sm"
                  className="absolute right-1 top-1 h-8"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Thêm
                </Button>
              </div>
              <LessonCreationForm
                sections={sections}
                onLessonCreated={fetchSections}
              />
            </div>

            <Separator />

            <div className="rounded-md border">
              <div className="bg-muted/50 px-4 py-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Danh sách chương</h3>
                <div className="ml-auto text-sm text-muted-foreground">
                  {sectionList.length} chương
                </div>
              </div>

              <ScrollArea className="h-[400px] p-4">
                {sectionList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Layers className="h-10 w-10 mb-2 opacity-20" />
                    <p>Chưa có chương nào. Hãy thêm chương mới.</p>
                  </div>
                ) : (
                  <DndContext onDragEnd={handleDragEnd}>
                    <div className="space-y-3">
                      {sectionList.map((section, index) => (
                        <SectionDropdown
                          key={section.id}
                          section={section}
                          index={index + 1}
                          refresh={() => {
                            fetchSectionsCombobox();
                            fetchSections();
                          }}
                        />
                      ))}
                    </div>
                  </DndContext>
                )}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectionEditor;
