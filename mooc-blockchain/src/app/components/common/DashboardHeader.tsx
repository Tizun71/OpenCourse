"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/Auth";
import UserAvatar from "@/components/molecules/UserAvatar";
import SearchBox from "@/components/organism/Searchbox/Searchbox";
import NotificationList from "@/components/organism/Notification/NotificationList";

const DashboardHeader = () => {
  const { user, handleLogout } = useAuth();
  const router = useRouter();

  return (
    <div>
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            OpenCourse
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Danh mục</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Phần mềm & IT</DropdownMenuItem>
              <DropdownMenuItem>Marketing</DropdownMenuItem>
              <DropdownMenuItem>Design</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/certificate" className="">
            <Button variant="ghost">Tra cứu chứng chỉ</Button>
          </Link>

          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <SearchBox />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NotificationList userId={user.id} />
                <UserAvatar user={user} handleLogout={handleLogout} />
              </>
            ) : (
              <>
                <Button variant="ghost">
                  Đăng ký làm giảng viên tại OpenCourse
                </Button>
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Log in
                </Button>
                <Button onClick={() => router.push("/register")}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default DashboardHeader;
