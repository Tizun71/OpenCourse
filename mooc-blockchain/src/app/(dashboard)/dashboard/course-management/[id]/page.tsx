"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl: string;
  position: number;
}

export default function LessonDetail() {
  const params = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For this example, we'll use the provided data
    const currentLesson: Lesson = {
      id: 1,
      title: "Blockchain là gì",
      content: "Mô tả về blockchain",
      videoUrl:
        "https://kltn-mooc-blockchain.s3.ap-southeast-1.amazonaws.com/video/How+does+a+blockchain+work+-+Simply+Explained+(1).mp4",
      position: 0,
    };

    // Simulate API call
    setTimeout(() => {
      setLesson(currentLesson);

      // Mock next and previous lessons
      setPrevLesson(null); // This is the first lesson
      setNextLesson({
        id: 2,
        title: "Các ứng dụng của Blockchain",
        content: "Mô tả về các ứng dụng của blockchain",
        videoUrl: "",
        position: 1,
      });

      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleVideoEnded = () => {
    setCompleted(true);
  };

  const navigateToLesson = (lessonId: number) => {
    router.push(`/lessons/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-12 w-3/4 mb-8" />
        <Skeleton className="h-[400px] w-full mb-8" />
        <Skeleton className="h-32 w-full mb-4" />
        <div className="flex justify-between mt-8">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Không tìm thấy bài học</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{lesson.title}</span>
              {completed && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>
            <span className="text-sm text-muted-foreground">
              Bài {lesson.position + 1}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                className="w-full aspect-video"
                controls
                onEnded={handleVideoEnded}
                src={lesson.videoUrl}
              />
            </div>
          </div>

          <div className="prose max-w-none dark:prose-invert">
            <h2 className="text-xl font-semibold mb-4">Nội dung bài học</h2>
            <div className="p-4 bg-muted rounded-lg">
              <p>{lesson.content}</p>

              {/* Additional content would go here in a real application */}
              <p className="mt-4">
                Blockchain là một công nghệ lưu trữ và truyền tải dữ liệu theo
                chuỗi khối, được mã hóa và phân tán. Mỗi khối (block) chứa thông
                tin về các giao dịch, thời gian, và được liên kết với khối trước
                đó bằng mã hóa, tạo thành một chuỗi dữ liệu không thể thay đổi.
              </p>

              <p className="mt-4">
                Đặc điểm quan trọng của blockchain là tính phi tập trung, minh
                bạch và bảo mật cao. Dữ liệu được lưu trữ trên nhiều máy tính
                khác nhau trong mạng lưới, không có một điểm kiểm soát trung
                tâm, và mọi thay đổi đều phải được xác nhận bởi đa số thành viên
                trong mạng.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => prevLesson && navigateToLesson(prevLesson.id)}
              disabled={!prevLesson}
            >
              <ChevronLeft className="h-4 w-4" />
              Bài trước
            </Button>

            {completed ? (
              <Button
                className="flex items-center gap-2"
                onClick={() => nextLesson && navigateToLesson(nextLesson.id)}
                disabled={!nextLesson}
              >
                Bài tiếp theo
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setCompleted(true)}
              >
                <CheckCircle className="h-4 w-4" />
                Đánh dấu đã hoàn thành
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Tài liệu tham khảo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                Tài liệu: Giới thiệu về Blockchain
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                Whitepaper: Bitcoin - Hệ thống tiền điện tử P2P
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                Bài viết: Cách thức hoạt động của Blockchain
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
