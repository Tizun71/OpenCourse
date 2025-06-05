"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, Users, Calendar, Mail, Shield, Filter, X } from "lucide-react";
import UserService from "@/services/Backend-api/user-service";
import RoleChangeDialog from "./RoleChangeDialog";
import ConfirmDialog from "@/components/organism/Dialog/ConfirmDialog";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  fullName: string;
  email: string;
  type: string;
  status: string;
  createdAt: string;
}

interface UserTableProps {
  reload: boolean;
}

export default function UserTable({ reload }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const fetchUsers = async () => {
    try {
      const res = await UserService.getAll();
      const data = res.data.users;
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter((user) => {
      const name = user.fullName || "";
      const email = user.email || "";
      const matchesSearch =
        name.toLowerCase().includes(term) || email.toLowerCase().includes(term);

      const matchesRole = roleFilter === "all" || user.type === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const userDate = new Date(user.createdAt);
        const now = new Date();

        switch (dateFilter) {
          case "today":
            matchesDate = userDate.toDateString() === now.toDateString();
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = userDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = userDate >= monthAgo;
            break;
          case "year":
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            matchesDate = userDate >= yearAgo;
            break;
        }
      }

      return matchesSearch && matchesRole && matchesStatus && matchesDate;
    });

    setFilteredUsers(filtered);
  }, [searchTerm, users, roleFilter, statusFilter, dateFilter]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setDateFilter("all");
  };

  const getUniqueRoles = () => {
    const roles = users.map((user) => user.type);
    return [...new Set(roles)];
  };

  const hasActiveFilters =
    searchTerm ||
    roleFilter !== "all" ||
    statusFilter !== "all" ||
    dateFilter !== "all";

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="text-lg">Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">Lỗi: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Quản lý người dùng
            </h2>
            <p className="text-muted-foreground">
              Tổng cộng {filteredUsers.length} người dùng
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Lọc theo:</span>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  {/* Role Filter */}
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Quyền hạn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả quyền</SelectItem>
                      {getUniqueRoles().map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                      <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Date Filter */}
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả thời gian</SelectItem>
                      <SelectItem value="today">Hôm nay</SelectItem>
                      <SelectItem value="week">7 ngày qua</SelectItem>
                      <SelectItem value="month">30 ngày qua</SelectItem>
                      <SelectItem value="year">1 năm qua</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>

            {/* Filter Summary */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Đang hiển thị {filteredUsers.length} / {users.length} người
                  dùng
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user.fullName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {user.fullName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Role and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="font-medium">
                      {user.type}
                    </Badge>
                  </div>
                  <Badge
                    className={
                      user.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {user.status}
                  </Badge>
                </div>

                {/* Created Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Tạo ngày: {user.createdAt}</span>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <ConfirmDialog
                      title={
                        user.status === "ACTIVE"
                          ? "Khóa tài khoản"
                          : "Mở khóa tài khoản"
                      }
                      description={
                        user.status === "ACTIVE"
                          ? "Xác nhận khóa tài khoản này"
                          : "Xác nhận mở khóa tài khoản này"
                      }
                      handleConfirm={async () => {
                        try {
                          await UserService.lockToggle(user.id);
                          toast.success("Thành công");
                          fetchUsers();
                        } catch {
                          toast.error("Thất bại");
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <RoleChangeDialog
                      userId={user.id}
                      role={user.type}
                      onSuccess={fetchUsers}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Không tìm thấy người dùng
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Thử thay đổi từ khóa tìm kiếm"
                  : "Chưa có người dùng nào trong hệ thống"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
