"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UserService from "@/services/Backend-api/user-service";
import { useLoading } from "@/provider/Loading";

interface UserCreationFormProps {
  onSubmit: () => void;
}

const UserCreationForm = ({ onSubmit }: UserCreationFormProps) => {
  const { setLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    type: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await UserService.createUser(formData);
      toast.success(`✅ Người dùng "${formData.username}" đã được thêm!`);
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        type: "",
      });
      setLoading(false);
      setOpen(false);
    } catch (err) {
      setLoading(false);
      console.error("Lỗi khi thêm user:", err);
      toast.error("❌ Thêm người dùng thất bại. Vui lòng thử lại.");
    }
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span className="mr-2">+</span>Thêm User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm người dùng</DialogTitle>
            <DialogDescription>
              Điền thông tin người dùng bên dưới
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {[
              { id: "lastName", label: "Họ", placeholder: "Nhập họ" },
              { id: "firstName", label: "Tên", placeholder: "Nhập tên" },
              {
                id: "username",
                label: "Username",
                placeholder: "Nhập username",
              },
              { id: "email", label: "Email", placeholder: "Nhập email" },
            ].map(({ id, label, placeholder }) => (
              <div key={id} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={id} className="text-left">
                  {label}
                </Label>
                <Input
                  id={id}
                  name={id}
                  value={formData[id as keyof typeof formData]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="col-span-3"
                  type={id === "email" ? "email" : "text"}
                />
              </div>
            ))}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-left">
                Vai trò
              </Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="col-span-3 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">-- Chọn vai trò --</option>
                <option value="ADMIN">Admin</option>
                <option value="INSTRUCTOR">Giảng viên</option>
                <option value="USER">Học viên</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Lưu người dùng</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreationForm;
