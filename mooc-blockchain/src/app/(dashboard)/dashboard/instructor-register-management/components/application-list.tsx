"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Clock,
  Video,
} from "lucide-react";
import UserService from "@/services/Backend-api/user-service";
import { IUser } from "@/interface";

export default function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await UserService.listApplication();
        setApplications(res.data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    fetchApplication();
  }, []);

  const handleApprove = (application: any) => {
    console.log(application);

    const payload: IUser.UserCreationPayload = {
      firstName: application.fullName || "",
      lastName: application.lastName || "",
      username: application.email || "",
      email: application.email || "",
      type: "INSTRUCTOR",
    };

    UserService.handleApplication(application.id, true, payload);

    setApplications((prev: any) =>
      prev.map((app: any) =>
        app.id === application.id ? { ...app, accepted: true } : app
      )
    );
  };

  const filteredApplications = applications.filter((app: any) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && app.accepted) ||
      (statusFilter === "pending" && !app.accepted);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    approved: applications.filter((app: any) => app.accepted).length,
    pending: applications.filter((app: any) => !app.accepted).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý đơn ứng tuyển
            </h1>
            <p className="text-gray-600 mt-1">
              Xem và quản lý các đơn ứng tuyển giảng viên
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng đơn ứng tuyển
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.approved}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bộ lọc và tìm kiếm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, chuyên môn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Danh sách ứng viên ({filteredApplications.length})
            </CardTitle>
            <CardDescription>
              Quản lý và xem chi tiết các đơn ứng tuyển giảng viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Thông tin cá nhân</TableHead>
                    <TableHead>Học vấn & Chuyên môn</TableHead>
                    <TableHead>Khóa học</TableHead>
                    <TableHead>Ngày nộp</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Video mẫu</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app: any) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">#{app.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{app.fullName}</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-1" />
                            {app.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {app.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {app.education}
                          </div>
                          <div className="text-sm text-gray-600">
                            {app.specialization}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {app.courseCategories}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(app.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={app.accepted ? "default" : "secondary"}
                          className={
                            app.accepted
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        >
                          {app.accepted ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Đã duyệt
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Chờ duyệt
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {app.videoSampleUrl ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(app.videoSampleUrl, "_blank")
                            }
                          >
                            <Video className="h-3 w-3 mr-1" />
                            Xem video
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-400">Chưa có</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!app.accepted ? (
                            <Button
                              size="sm"
                              onClick={() => handleApprove(app)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Duyệt
                            </Button>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
