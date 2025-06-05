"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";

import CourseService from "@/services/Backend-api/course-service";
import s3Service from "@/services/Backend-api/s3-service";
import { EHttpStatusCode } from "@/constants/http";
import { useRouter } from "next/navigation";
import CategorySelect from "@/components/molecules/Select/CategorySelect";
import { useLoading } from "@/provider/Loading";

const formSchema = z.object({
  courseName: z.string().min(1, "Tên không được để trống"),
  description: z.string(),
  courseLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  categoryId: z.number().min(1, "Hãy chọn danh mục"),
});

const CourseCreationForm = () => {
  const { setLoading } = useLoading();

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: "",
      description: "",
      courseLevel: "BEGINNER",
      categoryId: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken") as string;
      const decodedToken = jwtDecode(token) as JwtPayload & { userId: number };

      let imageUrl = "";
      if (image) {
        imageUrl = await s3Service.uploadImage(image);
      }

      const payload = {
        ...values,
        instructorId: decodedToken.userId,
        imageUrl,
      };

      const res = await CourseService.createNewCourse(payload);
      if (res.status === EHttpStatusCode.CREATED) {
        toast.success(`✅ Khóa học "${values.courseName}" đã được tạo!`);
        router.push(`/instructor/courses/${res.data}`);
        form.reset();
        setImage(null);
        setOpen(false);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error creating course:", err);
      toast.error("❌ Tạo khóa học thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Thêm khóa học</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Thêm khóa học</DialogTitle>
          <DialogDescription>Form tạo khóa học</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="courseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khóa học</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tên khóa học" />
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
                    <Textarea {...field} placeholder="Mô tả ngắn gọn..." />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trình độ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Cơ bản</SelectItem>
                      <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
                      <SelectItem value="ADVANCED">Nâng cao</SelectItem>
                    </SelectContent>
                  </Select>
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

            <div>
              <Label>Ảnh minh họa</Label>
              <Input
                type="file"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Lưu khóa học</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseCreationForm;
