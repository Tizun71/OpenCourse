"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { ICourse } from "@/interface";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Home } from "lucide-react";
import CourseContent from "@/app/components/user/CourseContent";
import CourseService from "@/services/Backend-api/course-service";
import ConfirmDialog from "@/components/organism/Dialog/ConfirmDialog";
import { useAuth } from "@/hooks/Auth";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/provider/Loading";

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.courseId as string;

  const [course, setCourse] = useState<ICourse.CourseDetail>();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useAuth();

  const { setLoading } = useLoading();

  const handleRegister = async (): Promise<void> => {
    setLoading(true);
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      if (course) {
        const payload: ICourse.CourseEnrollmentPayload = {
          userId: user.id,
          courseId: course.id,
        };
        await CourseService.enrollNewCourse(payload);
        router.push(`/course/${id}/lesson/${course.sections[0].lessons[0].id}`);
      }
    } catch {
      toast.error("Không thể đăng ký khóa học");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, enrolledRes] = await Promise.all([
          CourseService.getCourseDetail(Number(id)),
          user
            ? CourseService.isEnrolled({
                userId: user.id,
                courseId: Number(id),
              })
            : Promise.resolve({ data: false }),
        ]);

        if (courseRes?.data) setCourse(courseRes.data);
        setIsEnrolled(enrolledRes.data as boolean);
        setLoading(false);
      } catch {
        setLoading(false);
        toast.error("Đã xảy ra lỗi khi tải dữ liệu");
      }
    };

    if (id) fetchData();
  }, [id, user]);

  if (!course) return <div className="p-6">Đang tải khóa học...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 max-w-7xl mx-auto">
      {/* Left content */}
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary flex items-center">
            <Home size={14} className="mr-1" />
            Trang chủ
          </Link>
          <ChevronRight size={14} />
          <Link href="/course" className="hover:text-primary">
            Khóa học
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {course.courseName}
          </span>
        </div>

        <h1 className="text-3xl font-bold">{course.courseName}</h1>
        <p className="text-muted-foreground">{course.description}</p>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-300">
            {course.categoryName}
          </Badge>

          <Badge variant={"secondary"}>
            {course.registeredNumber} học viên
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          Được tạo bởi{" "}
          <span className="text-blue-600">{course.instructorName}</span>
        </p>

        <Card>
          <CardContent
            className={!isEnrolled ? "pointer-events-none opacity-60" : ""}
          >
            <CourseContent sections={course.sections} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="w-full aspect-video bg-gray-200 rounded-xl relative overflow-hidden">
              <Image
                src={course.imageUrl}
                alt="Course"
                fill
                className="object-cover"
              />
            </div>
            {!isEnrolled ? (
              <ConfirmDialog
                title="Đăng ký khóa học"
                description="Xác nhận đăng ký khóa học này"
                handleConfirm={handleRegister}
              />
            ) : (
              <Button
                className="w-full"
                onClick={() => {
                  setLoading(true);
                  router.push(
                    `/course/${id}/lesson/${course.sections[0].lessons[0].id}`
                  );
                }}
              >
                Học ngay
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
