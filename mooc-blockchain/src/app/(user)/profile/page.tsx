"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Save, Upload, User } from "lucide-react";

import { useAuth } from "@/hooks/Auth";
import { toast } from "sonner";
import UserService from "@/services/Backend-api/user-service";

interface AccountData {
  id: number;
  firstName: string;
  lastName: string;
  gender: string | null;
  birthday: string | null;
  username: string;
  email: string | null;
  phone: string | null;
  imageUrl: string | null;
  status: string | null;
  type: string;
  createdAt: string | null;
  fullName: string;
}

export default function ProfilePage() {
  const userAuth = useAuth();
  const getInitialData = (): AccountData => {
    if (!userAuth.user) {
      return {
        id: 0,
        firstName: "",
        lastName: "",
        gender: "",
        birthday: "",
        username: "",
        email: "",
        phone: "",
        imageUrl: "",
        status: "",
        type: "",
        createdAt: "",
        fullName: "",
      };
    }
    return userAuth.user as AccountData;
  };

  const [formData, setFormData] = useState<AccountData>(getInitialData);
  const [isLoading, setIsLoading] = useState(false);

  if (!userAuth.user) {
    return (
      <p className="text-center mt-10 text-muted-foreground">
        Đang tải thông tin người dùng...
      </p>
    );
  }

  const handleInputChange = (field: keyof AccountData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await UserService.updateUser(formData);
      if (response) {
        setFormData(response.data);
        toast.success("Cập nhật thông tin thành công!");
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
        }
      } else {
        toast.error("Upload ảnh thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi khi tải ảnh lên");
      console.error("Error uploading image:", error);
    }
  };

  const handleCancel = () => {
    setFormData(getInitialData());
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Chỉnh sửa thông tin tài khoản</h1>
        <p className="text-muted-foreground">
          Cập nhật thông tin cá nhân của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>Thông tin cá nhân và liên hệ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.imageUrl ?? ""} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Tải ảnh lên
                    </span>
                  </Button>
                </Label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  JPG, PNG hoặc GIF (tối đa 5MB)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  value={formData.username}
                  disabled
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
              <div className="space-y-2">
                <Label>Loại tài khoản</Label>
                <div className="flex items-center h-10">
                  <Badge
                    variant={
                      formData.type === "ADMIN" ? "default" : "secondary"
                    }
                  >
                    {formData.type}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Họ</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Nhập họ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Tên</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Nhập tên"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email ?? ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Nhập email"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone ?? ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  value={formData.gender ?? ""}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Nam</SelectItem>
                    <SelectItem value="FEMALE">Nữ</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
