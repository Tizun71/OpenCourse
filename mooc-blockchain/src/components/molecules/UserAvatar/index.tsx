import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IUser } from "@/interface";
import { useRouter } from "next/navigation";

interface UserProfileProps {
  user: IUser.BaseUser;
  handleLogout: () => void;
}

const UserProfile = ({ user, handleLogout }: UserProfileProps) => {
  const router = useRouter();

  const userJSON = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = userJSON.type;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-10 h-10 cursor-pointer">
          <AvatarImage src={""} alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback>
            {user.firstName[0]}
            {user.lastName[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>{`Xin chào, ${user.firstName}`}</DropdownMenuItem>

        {userType === "ADMIN" ? (
          <DropdownMenuItem
            onClick={() => router.push("/dashboard")}
            className="cursor-pointer"
          >
            Chuyển đến trang Admin
          </DropdownMenuItem>
        ) : (
          <div></div>
        )}

        {userType === "INSTRUCTOR" || userType === "ADMIN" ? (
          <DropdownMenuItem
            onClick={() => router.push("/instructor/courses")}
            className="cursor-pointer"
          >
            Chuyển đến trang giảng viên
          </DropdownMenuItem>
        ) : (
          <div></div>
        )}

        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer"
        >
          Sửa thông tin
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/change-password")}
          className="cursor-pointer"
        >
          Đổi mật khẩu
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/learning/all")}
          className="cursor-pointer"
        >
          Lộ trình học tập
        </DropdownMenuItem>

        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          className="cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
