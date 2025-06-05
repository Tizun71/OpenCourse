"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import AuthService from "@/services/Backend-api/auth-service";
import { toast } from "sonner";
import { useState } from "react";
import RedirectDialog from "@/components/organism/Dialog/RedirectDialog";
import { useLoading } from "@/provider/Loading";

const formSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập tên"),
  lastName: z.string().min(1, "Vui lòng nhập họ"),
  username: z.string().min(1, "Vui lòng nhập tên người dùng"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

export default function SignUp() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setLoading } = useLoading();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await AuthService.register(values);
      if (res) {
        setLoading(false);
        setDialogOpen(true);
      }
    } catch {
      setLoading(false);

      form.setError("root", {
        message: "Đăng ký thất bại. Vui lòng thử lại.",
      });
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex max-w-4xl w-full mx-auto p-6">
        <div className="hidden md:block w-1/2 pr-8">
          <Image
            src="https://kltn-mooc-blockchain.s3.ap-southeast-1.amazonaws.com/images/login-illustration.png"
            alt="Sign up illustration"
            width={550}
            height={500}
            className="object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6">Đăng ký với Email</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên đệm</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên đệm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên đăng nhập" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Nhập email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.root.message}
                </p>
              )}

              <Button type="submit" className="w-full mt-4">
                Tiếp tục với Email
              </Button>
            </form>
          </Form>

          <RedirectDialog
            isOpen={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Đăng ký thành công"
            description="Bạn đã đăng ký tài khoản thành công. Nhấn tiếp tục để đến trang đăng nhập."
            link="/login"
          />

          <p className="text-sm text-center mt-4">
            Đã có tài khoản?{" "}
            <Link href="/login" className="underline text-purple-600">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
