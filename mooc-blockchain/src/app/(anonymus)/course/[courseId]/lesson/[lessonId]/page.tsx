"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import CourseService from "@/services/Backend-api/course-service";
import { ICourse, ILesson, IUser } from "@/interface";
import CourseSection from "@/app/components/user/CourseSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Home, Lock } from "lucide-react";
import Link from "next/link";
import { useLoading } from "@/provider/Loading";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import LessonService from "@/services/Backend-api/lesson-service";
import { toast } from "sonner";
import UserService from "@/services/Backend-api/user-service";
import { CertificateDialog } from "@/components/organism/Dialog/CertificateDialog";
const LessonPage = () => {
  const router = useRouter();
  const { setLoading } = useLoading();
  const params = useParams();
  const courseId = params.courseId;
  const lessonId = params.lessonId;
  const [course, setCourse] = useState<ICourse.CourseDetail | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [userProgress, setUserProgress] =
    useState<IUser.UserProgressInCourse>();
  const userData = localStorage.getItem("user");
  let user: any;
  if (userData) {
    user = JSON.parse(userData);
  } else {
  }
  useEffect(() => {
    const fetchCourse = async () => {
      const res = await CourseService.getCourseDetail(Number(courseId));
      if (res?.data) {
        setCourse(res.data);
      }
      setLoading(false);
    };

    const fetchProgress = async () => {
      const res = await UserService.getProgress(
        Number(user.id),
        Number(courseId)
      );
      setUserProgress(res.data);
    };

    const markLesson = async () => {
      const payload: ILesson.LessonMarkCompletePayload = {
        userId: Number(user.id),
        lessonId: Number(lessonId),
      };

      await Promise.all([LessonService.markLessonComplete(payload)]);

      toast.success("🎉 Đã xem đủ 80%, mở khóa bài học tiếp theo!");
    };

    if (courseId) {
      fetchCourse();
      fetchProgress();
    }
    if (unlocked) {
      markLesson();
    }
  }, [courseId, unlocked]);

  const handleTimeUpdate = async (
    e: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const video = e.currentTarget;
    const percentWatched = (video.currentTime / video.duration) * 100;
    setVideoProgress(percentWatched);

    if (percentWatched >= 80 && !unlocked) {
      setUnlocked(true);
    }
  };

  if (!course) return <div className="p-6">Đang tải khóa học...</div>;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const getCurrentLesson = () => {
    if (!course) return null;

    for (const section of course.sections) {
      const lesson = section.lessons.find((l) => l.id.toString() === lessonId);
      if (lesson) return { lesson, section };
    }
    return null;
  };

  const currentLessonInfo = getCurrentLesson();

  return (
    <div className="p-2 max-w-7xl mx-auto">
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
        <Link href={`/course/${courseId}`} className="hover:text-primary">
          {course.courseName}
        </Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {currentLessonInfo?.lesson.title || "Bài học"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {currentLessonInfo?.lesson.videoUrl ? (
            <Card className="overflow-hidden border-none shadow-lg py-0">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full rounded-t-xl"
                  controls
                  onTimeUpdate={handleTimeUpdate}
                >
                  <source
                    src={currentLessonInfo.lesson.videoUrl}
                    type="video/mp4"
                  />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>

                <div className="px-4 py-3 bg-card border-t">
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-1.5">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {videoRef.current
                        ? formatTime(videoRef.current.currentTime)
                        : "0:00"}{" "}
                      /
                      {videoRef.current
                        ? formatTime(videoRef.current.duration || 0)
                        : "0:00"}
                    </div>
                    <div>{Math.round(videoProgress)}% hoàn thành</div>
                  </div>
                  <Progress value={videoProgress} className="h-1.5" />
                </div>
              </div>
            </Card>
          ) : (
            <div>Không thể tải Video</div>
          )}

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => router.back()}
            >
              <ChevronLeft size={16} />
              Quay lại
            </Button>

            <AnimatePresence>
              {unlocked ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center text-sm text-muted-foreground gap-2 bg-muted px-3 py-2 rounded-md"
                >
                  <Lock size={16} className="text-amber-500" />
                  Vui lòng xem ít nhất 80% video để mở khóa bài học tiếp theo
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Lesson Content */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {currentLessonInfo?.section.title || "Phần học"}
                </Badge>
                <Badge variant="outline" className="bg-muted">
                  <Clock size={14} className="mr-1" />
                  {videoRef.current
                    ? Math.round(videoRef.current.duration / 60)
                    : 0}{" "}
                  phút
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold">
                {currentLessonInfo?.lesson.title || "Nội dung bài học"}
              </CardTitle>
            </CardHeader>
            <Separator className="my-4" />
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-3">Nội dung chính</h3>
              <p className="text-muted-foreground mb-4">
                {currentLessonInfo?.lesson.content}
              </p>
            </div>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex justify-center">
              Nội dung khóa học
            </CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium inline-flex w-full justify-end">
                  {userProgress?.completedLessons}/{userProgress?.totalLessons}{" "}
                  bài học đã hoàn thành
                </span>
              </div>
              <Progress
                value={userProgress?.progress}
                className="h-3 [&>*]:bg-blue-400 bg-blue-200"
              />
              <p className="text-sm text-muted-foreground text-right">
                {userProgress?.progress}% hoàn thành
              </p>
            </div>

            {userProgress?.progress === 100 &&
            userProgress.status !== "COMPLETED" ? (
              <div>
                <CertificateDialog userId={user.id} courseId={course.id} />
              </div>
            ) : (
              <div></div>
            )}
          </CardHeader>

          <CardContent className="p-4 space-y-2">
            {course.sections.map((section, index) => (
              <CourseSection
                key={index}
                index={index}
                section={section}
                lessonCompleted={userProgress?.completedLesson}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonPage;
