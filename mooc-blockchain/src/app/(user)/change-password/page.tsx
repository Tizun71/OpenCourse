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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, XCircle } from "lucide-react";
import Link from "next/link";
import UserService from "@/services/Backend-api/user-service";
import { useAuth } from "@/hooks/Auth";
import { toast } from "sonner";

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

export default function ChangePassword() {
  const userAuth = useAuth();

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordChange = (
    field: "newPassword" | "confirmPassword",
    value: string
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const togglePasswordVisibility = (field: "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 25;
    else feedback.push("Ít nhất 8 ký tự");

    if (/[a-z]/.test(password)) score += 25;
    else feedback.push("Có chữ thường");

    if (/[A-Z]/.test(password)) score += 25;
    else feedback.push("Có chữ hoa");

    if (/[0-9]/.test(password)) score += 12.5;
    else feedback.push("Có số");

    if (/[^A-Za-z0-9]/.test(password)) score += 12.5;
    else feedback.push("Có ký tự đặc biệt");

    let color = "bg-red-500";
    if (score >= 75) color = "bg-green-500";
    else if (score >= 50) color = "bg-yellow-500";
    else if (score >= 25) color = "bg-orange-500";

    return { score, feedback, color };
  };

  const passwordStrength = checkPasswordStrength(passwordData.newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    if (passwordStrength.score < 50) {
      setError("Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await UserService.changePassword({
        id: userAuth.user?.id,
        password: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      if (response.status === 200) {
        toast.success("Đổi mật khẩu thành công");
        setPasswordData({
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error("Đổi mật khẩu thất bại");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi đổi mật khẩu"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Thay đổi mật khẩu</span>
            </CardTitle>
            <CardDescription>Nhập mật khẩu mới và xác nhận</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordChange("newPassword", e.target.value)
                    }
                    placeholder="Nhập mật khẩu mới"
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {passwordData.newPassword && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span>Độ mạnh mật khẩu:</span>
                      <span
                        className={`font-medium ${
                          passwordStrength.score >= 75
                            ? "text-green-600"
                            : passwordStrength.score >= 50
                            ? "text-yellow-600"
                            : passwordStrength.score >= 25
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {passwordStrength.score >= 75
                          ? "Mạnh"
                          : passwordStrength.score >= 50
                          ? "Trung bình"
                          : passwordStrength.score >= 25
                          ? "Yếu"
                          : "Rất yếu"}
                      </span>
                    </div>
                    <Progress value={passwordStrength.score} className="h-2" />
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <p>Cần cải thiện:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {passwordStrength.feedback.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange("confirmPassword", e.target.value)
                    }
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    className={`pr-10 ${
                      passwordData.confirmPassword &&
                      passwordData.newPassword !== passwordData.confirmPassword
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordData.confirmPassword &&
                  passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-sm text-red-500">Mật khẩu không khớp</p>
                  )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/account">Hủy</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword ||
                    passwordStrength.score < 50
                  }
                >
                  {isLoading ? "Đang đổi..." : "Đổi mật khẩu"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
