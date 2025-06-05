"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/Auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserService from "@/services/Backend-api/user-service";

export default function LoginPage() {
  const { handleLogin } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("user");
  const [password, setPassword] = useState("Abc@1234");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  async function handleLoginClick() {
    if (!username || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setIsLoading(true);
    try {
      const isSuccess = await handleLogin(username, password);
      if (isSuccess) {
        router.push("/homepage");
      } else {
        setErrorMessage(
          "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.log("failed to login", error);
      setErrorMessage("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!forgotEmail) {
      setForgotMessage("Vui lòng nhập địa chỉ email.");
      return;
    }

    setForgotLoading(true);
    try {
      await UserService.forgetPassword(forgotEmail);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setForgotMessage("Đã gửi mật khẩu mới đến email của bạn.");
      setTimeout(() => {
        setShowForgotDialog(false);
        setForgotEmail("");
        setForgotMessage("");
      }, 2000);
    } catch {
      setForgotMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
      <div className="flex max-w-5xl w-full mx-auto rounded-2xl overflow-hidden shadow-xl">
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-cyan-600 to-blue-700 relative overflow-hidden">
          <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full bg-white/10"></div>
          <div className="absolute bottom-[-100px] right-[-50px] w-[300px] h-[300px] rounded-full bg-white/5"></div>
          <div className="absolute top-[30%] right-[10%] w-[100px] h-[100px] rounded-full bg-white/10"></div>

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            ></path>
            <path
              d="M0,50 Q25,30 50,50 T100,50"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            ></path>
            <path
              d="M0,60 Q40,80 80,20 T100,70"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            ></path>
          </svg>

          <div className="absolute top-[20%] left-[20%] text-white/30">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <div className="absolute bottom-[30%] left-[30%] text-white/20">
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v4l3 3"></path>
            </svg>
          </div>
          <div className="absolute top-[40%] right-[25%] text-white/20">
            <svg
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>

          <div className="absolute bottom-8 left-8 right-8 text-white z-20">
            <h2 className="text-2xl font-bold mb-2">OpenCourse</h2>
            <p className="text-white/80">
              Khám phá thế giới tri thức với hàng ngàn khóa học về công nghệ,
              kinh doanh, thiết kế, và nhiều hơn nữa
            </p>
          </div>
        </div>

        <Card className="w-full md:w-1/2 border-0 rounded-none shadow-none">
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-bold text-center">
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin đăng nhập của bạn để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Nhập username của bạn"
                  className="h-11"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Mật khẩu
                  </label>
                  <Dialog
                    open={showForgotDialog}
                    onOpenChange={setShowForgotDialog}
                  >
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-xs text-cyan-600 hover:text-cyan-700 hover:underline"
                      >
                        Quên mật khẩu?
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Quên mật khẩu</DialogTitle>
                        <DialogDescription>
                          Nhập địa chỉ email của bạn để nhận mật khẩu mới.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="forgot-email"
                            className="text-sm font-medium"
                          >
                            Email
                          </label>
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="Nhập địa chỉ email của bạn"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="h-11"
                          />
                        </div>

                        {forgotMessage && (
                          <Alert
                            className={
                              forgotMessage.includes("Đã gửi")
                                ? "border-green-200 bg-green-50"
                                : "border-red-200 bg-red-50"
                            }
                          >
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm ml-2">
                              {forgotMessage}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex gap-3">
                          <Button
                            onClick={handleForgotPassword}
                            disabled={forgotLoading}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                          >
                            {forgotLoading ? "Đang gửi..." : "Xác nhận"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowForgotDialog(false);
                              setForgotEmail("");
                              setForgotMessage("");
                            }}
                            disabled={forgotLoading}
                          >
                            Hủy
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="Nhập mật khẩu của bạn"
                    type={showPassword ? "text" : "password"}
                    className="h-11 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>

              {errorMessage && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm ml-2">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleLoginClick}
                className="w-full h-11 bg-cyan-600 hover:bg-cyan-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase"></div>
              </div>

              <p className="text-sm text-center mt-6 text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
                >
                  Đăng kí
                </Link>{" "}
                tại đây
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
