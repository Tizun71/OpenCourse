"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import s3Service from "@/services/Backend-api/s3-service";
import LessonService from "@/services/Backend-api/lesson-service";
import { ILesson, ISection } from "@/interface";
import { toast } from "sonner";

interface LessonCreationFormProps {
  sections: ISection.SectionCombobox[];
  onLessonCreated: () => void;
}

export default function LessonCreationForm({
  sections,
  onLessonCreated,
}: LessonCreationFormProps) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<ILesson.LessonCreationPayload>({
    sectionId: 0,
    title: "",
    content: "",
    videoUrl: "",
  });

  const handleVideoUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await s3Service.uploadVideo(file);
      setFormData((prev) => ({
        ...prev,
        videoUrl: url,
      }));
      setUploaded(true);
      toast.success("Video đã được tải lên thành công!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Tải video không thành công, vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !uploaded) {
      handleVideoUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sectionId === 0) {
      toast.error("Vui lòng chọn một chương.");
      return;
    }
    try {
      await LessonService.createNewLesson(formData);
      toast.success("Bài học đã được tạo thành công!");
      setFormData({
        sectionId: 0,
        title: "",
        content: "",
        videoUrl: "",
      });
      setUploaded(false);
      setOpen(false);
      onLessonCreated(); // Gọi callback để thông báo cho component cha
    } catch (error) {
      console.error("Create lesson error:", error);
      toast.error("Không thể tạo bài học. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Thêm bài học</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm bài học mới</DialogTitle>
          <DialogDescription>
            Tải video lên trước, sau đó bạn có thể nhập thông tin bài học.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">Video bài học</label>

          {!uploaded && (
            <Input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          )}

          {uploading && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tải video lên...
            </div>
          )}

          {formData.videoUrl && (
            <video
              src={formData.videoUrl}
              controls
              className="mt-2 w-full max-h-52 rounded"
            />
          )}
        </div>

        {uploaded && !uploading && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Chọn chương</label>
              <select
                value={
                  formData.sectionId === 0 ? "" : formData.sectionId.toString()
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sectionId: e.target.value ? parseInt(e.target.value) : 0,
                  })
                }
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Chọn một chương</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id.toString()}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Tiêu đề</label>
              <Input
                placeholder="Nhập tiêu đề bài học"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Mô tả</label>
              <Textarea
                placeholder="Nhập mô tả bài học"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Lưu</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
