"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import UserService from "@/services/Backend-api/user-service";
import { IUser } from "@/interface";
import RedirectDialog from "@/components/organism/Dialog/RedirectDialog";
import { useLoading } from "@/provider/Loading";
import { toast } from "sonner";
import s3Service from "@/services/Backend-api/s3-service";

const instructorSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  phone: z
    .string()
    .min(10, "Số điện thoại không hợp lệ")
    .max(11, "Số điện thoại không hợp lệ")
    .regex(/^\d+$/, "Số điện thoại không hợp lệ"),
  education: z.string().optional(),
  specialization: z.string().min(1, "Vui lòng nhập chuyên ngành"),
  courseCategories: z.string().min(1, "Vui lòng nhập danh mục khóa học"),
  teachingExperience: z.string().min(1, "Vui lòng nhập kinh nghiệm giảng dạy"),
  videoSample: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, {
      message: "File không hợp lệ",
    }),
});

type InstructorFormData = z.infer<typeof instructorSchema>;

export default function InstructorRegisterForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setLoading } = useLoading();

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      education: "",
      specialization: "",
      courseCategories: "",
      teachingExperience: "",
      videoSample: undefined,
    },
  });

  const onSubmit = async (values: InstructorFormData) => {
    setLoading(true);

    try {
      let videoUrl: string | undefined = undefined;

      if (values.videoSample instanceof File) {
        videoUrl = await s3Service.uploadVideo(values.videoSample);
      }

      const instructorData: IUser.InstructorRegister = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        education: values.education,
        specialization: values.specialization,
        courseCategories: values.courseCategories,
        teachingExperience: values.teachingExperience,
        videoSampleUrl: videoUrl,
      };

      await UserService.instructorRegister(instructorData);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Đăng ký thất bại. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <RedirectDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Đăng ký thành công"
        description="Bạn đã đăng ký tài khoản thành công. Nhấn tiếp tục để đến trang đăng nhập."
        link="/login"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-6 border rounded-md bg-white"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại *</FormLabel>
                  <FormControl>
                    <Input placeholder="0912345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trình độ học vấn</FormLabel>
                  <FormControl>
                    <Input placeholder="Cử nhân, Thạc sĩ..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chuyên ngành *</FormLabel>
                  <FormControl>
                    <Input placeholder="Công nghệ thông tin..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseCategories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục khóa học *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lập trình web, Marketing..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="teachingExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kinh nghiệm giảng dạy *</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Mô tả kinh nghiệm giảng dạy của bạn..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="videoSample"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video mẫu giảng dạy</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      field.onChange(
                        e.target.files ? e.target.files[0] : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Gửi đơn đăng ký
          </Button>
        </form>
      </Form>
    </div>
  );
}
