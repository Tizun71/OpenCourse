import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserService from "@/services/Backend-api/user-service";
import { IUser } from "@/interface";
import { toast } from "sonner";

interface RoleChangeDialogProps {
  userId: number;
  role: string;
  onSuccess?: () => void;
}

export default function RoleChangeDialog({
  userId,
  role,
  onSuccess,
}: RoleChangeDialogProps) {
  const [selectedRole, setSelectedRole] = useState(role);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError("Vui lòng chọn quyền.");
      return;
    }

    const payload: IUser.RoleChangePayload = {
      userId,
      type: selectedRole,
    };

    try {
      await UserService.changeRole(payload);
      toast.success("Thành công");
      onSuccess?.();
      setIsOpen(false);
    } catch {
      toast.error("Thất bại");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-blue-600 border-blue-600">
          Thay đổi quyền
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Thay đổi quyền người dùng</DialogHeader>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="space-y-4">
          <div>
            <Label htmlFor="role">Chọn quyền</Label>
            <Select
              defaultValue={role}
              onValueChange={(value) => setSelectedRole(value)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Chọn quyền..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="INSTRUCTOR">Giảng viên</SelectItem>
                <SelectItem value="USER">Học viên</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
