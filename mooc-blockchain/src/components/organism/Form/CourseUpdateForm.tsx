"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ICourse } from "@/interface";
import CourseService from "@/services/Backend-api/course-service";
import s3Service from "@/services/Backend-api/s3-service";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "../Dialog/ConfirmDialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CategorySelect from "@/components/molecules/Select/CategorySelect";

interface CourseDetail {
  course: ICourse.CourseDetail;
}

const formSchema = z.object({
  courseName: z.string().min(1, "Tên không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  courseLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  categoryId: z.number().min(1, "Vui lòng chọn danh mục"),
  imageUrl: z.string(),
});

type CourseFormData = z.infer<typeof formSchema>;

const CourseUpdateForm = ({ course }: CourseDetail) => {
  const [image, setImage] = useState(course.imageUrl || "");
  const [isPublish, setIsPublish] = useState(course.status || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: course.courseName,
      description: course.description,
      courseLevel: course.courseLevel,
      categoryId: course.categoryId,
      imageUrl: course.imageUrl,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: CourseFormData) => {
    setIsSubmitting(true);
    try {
      let imageUrl = image;

      if (selectedImage) {
        imageUrl = await s3Service.uploadImage(selectedImage);
      }

      const coursePayload: ICourse.CourseUpdatePayload = {
        courseId: course.id,
        ...values,
        imageUrl,
        categoryId: 1,
      };

      await CourseService.updateCourse(coursePayload);

      toast.success(`✅ Khóa học "${values.courseName}" đã được cập nhật!`);
    } catch (err) {
      console.error("Error updating course:", err);
      toast.error("❌ Cập nhật khóa học thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishCourse = async (status: string) => {
    try {
      await CourseService.updateCourseStatus({ courseId: course.id, status });
      setIsPublish(status);
      toast.success("✅ Thành công!");
    } catch (error) {
      console.error("Failed to update course status", error);
      toast.error("❌ Thất bại!");
    }
  };

  return (
    <Card>
      <CardTitle className="mx-auto flex items-center justify-between gap-4">
        {isPublish === "UNPUBLISHED" ? (
          <ConfirmDialog
            title="Xuất bản"
            description="Bạn có muốn xuất bản khóa học này không?"
            handleConfirm={() => handlePublishCourse("PENDING")}
          />
        ) : isPublish === "PENDING" ? (
          <div>
            <Button>Đang đợi duyệt</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <ConfirmDialog
              title="Hủy xuất bản"
              description="Bạn có muốn hủy xuất bản khóa học này không?"
              handleConfirm={() => handlePublishCourse("UNPUBLISHED")}
            />
            <Link href={`/course/${course.id}`} passHref>
              <Button>Xem khóa học</Button>
            </Link>
          </div>
        )}
      </CardTitle>
      <CardHeader>
        <div className="flex gap-3">
          <Button
            type="submit"
            form="course-update-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </Button>
          <Button asChild variant="outline">
            <Link href="/instructor/courses">Quay lại</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="course-update-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm"
          >
            <Input name="courseId" value={course.id} disabled hidden></Input>
            <FormField
              control={form.control}
              name="courseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khóa học</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên khóa học" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả khóa học" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <FormControl>
                    <CategorySelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trình độ</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
                    >
                      <option value="BEGINNER">Cơ bản</option>
                      <option value="INTERMEDIATE">Trung cấp</option>
                      <option value="ADVANCED">Nâng cao</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label>Ảnh khóa học</Label>
              {image && (
                <Image
                  src={image}
                  alt="Ảnh khóa học"
                  width={800}
                  height={600}
                  className="rounded-lg"
                />
              )}
              <Input type="file" onChange={handleImageChange} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CourseUpdateForm;
