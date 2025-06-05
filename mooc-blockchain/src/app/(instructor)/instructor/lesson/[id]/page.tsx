"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Edit,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl: string;
  position: number;
  references?: Reference[];
}

interface Reference {
  id: number;
  title: string;
  url: string;
}

export default function InstructorLessonDetail() {
  const params = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [editedLesson, setEditedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [newReference, setNewReference] = useState({ title: "", url: "" });
  const [showReferenceDialog, setShowReferenceDialog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For this example, we'll use the provided data
    const currentLesson: Lesson = {
      id: 1,
      title: "Blockchain là gì",
      content:
        "Mô tả về blockchain\n\nBlockchain là một công nghệ lưu trữ và truyền tải dữ liệu theo chuỗi khối, được mã hóa và phân tán. Mỗi khối (block) chứa thông tin về các giao dịch, thời gian, và được liên kết với khối trước đó bằng mã hóa, tạo thành một chuỗi dữ liệu không thể thay đổi.\n\nĐặc điểm quan trọng của blockchain là tính phi tập trung, minh bạch và bảo mật cao. Dữ liệu được lưu trữ trên nhiều máy tính khác nhau trong mạng lưới, không có một điểm kiểm soát trung tâm, và mọi thay đổi đều phải được xác nhận bởi đa số thành viên trong mạng.",
      videoUrl:
        "https://kltn-mooc-blockchain.s3.ap-southeast-1.amazonaws.com/video/How+does+a+blockchain+work+-+Simply+Explained+(1).mp4",
      position: 0,
      references: [
        {
          id: 1,
          title: "Tài liệu: Giới thiệu về Blockchain",
          url: "https://example.com/blockchain-intro",
        },
        {
          id: 2,
          title: "Whitepaper: Bitcoin - Hệ thống tiền điện tử P2P",
          url: "https://bitcoin.org/bitcoin.pdf",
        },
        {
          id: 3,
          title: "Bài viết: Cách thức hoạt động của Blockchain",
          url: "https://example.com/blockchain-how-it-works",
        },
      ],
    };

    // Simulate API call
    setTimeout(() => {
      setLesson(currentLesson);
      setEditedLesson(currentLesson);

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

  const handleSaveChanges = async () => {
    if (!editedLesson) return;

    setSaving(true);

    // In a real application, you would send this data to your API
    // For this example, we'll simulate an API call
    setTimeout(() => {
      setLesson(editedLesson);
      setIsEditing(false);
      setSaving(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleInputChange = (field: keyof Lesson, value: string) => {
    if (!editedLesson) return;
    setEditedLesson({ ...editedLesson, [field]: value });
  };

  const handleAddReference = () => {
    if (!editedLesson || !newReference.title || !newReference.url) return;

    const newId = editedLesson.references
      ? Math.max(...editedLesson.references.map((ref) => ref.id)) + 1
      : 1;

    const updatedReferences = [
      ...(editedLesson.references || []),
      { id: newId, title: newReference.title, url: newReference.url },
    ];

    setEditedLesson({ ...editedLesson, references: updatedReferences });
    setNewReference({ title: "", url: "" });
    setShowReferenceDialog(false);
  };

  const handleRemoveReference = (id: number) => {
    if (!editedLesson || !editedLesson.references) return;

    const updatedReferences = editedLesson.references.filter(
      (ref) => ref.id !== id
    );
    setEditedLesson({ ...editedLesson, references: updatedReferences });
  };

  const navigateToLesson = (lessonId: number) => {
    router.push(`/instructor/lessons/${lessonId}`);
  };

  const handlePreviewLesson = () => {
    if (lesson) {
      // Open the student view in a new tab
      window.open(`/lessons/${lesson.id}`, "_blank");
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý bài học</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePreviewLesson}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Xem trước
          </Button>
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setEditedLesson(lesson);
                  setIsEditing(false);
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <AlertDescription className="text-green-600">
            Đã lưu thay đổi thành công!
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {isEditing ? (
              <Input
                value={editedLesson?.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="text-xl font-bold"
                placeholder="Nhập tiêu đề bài học"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{lesson.title}</span>
              </div>
            )}
            <span className="text-sm text-muted-foreground">
              Bài {lesson.position + 1}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Nội dung</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="references">Tài liệu tham khảo</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <div className="prose max-w-none dark:prose-invert">
                <h2 className="text-xl font-semibold mb-4">Nội dung bài học</h2>
                {isEditing ? (
                  <div className="mb-4">
                    <Textarea
                      value={editedLesson?.content || ""}
                      onChange={(e) =>
                        handleInputChange("content", e.target.value)
                      }
                      className="min-h-[300px]"
                      placeholder="Nhập nội dung bài học"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-muted rounded-lg whitespace-pre-line">
                    {lesson.content}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="video">
              <div className="mb-6">
                {isEditing && (
                  <div className="mb-4">
                    <Label htmlFor="videoUrl">URL Video</Label>
                    <Input
                      id="videoUrl"
                      value={editedLesson?.videoUrl || ""}
                      onChange={(e) =>
                        handleInputChange("videoUrl", e.target.value)
                      }
                      placeholder="Nhập URL video bài học"
                      className="mb-4"
                    />
                  </div>
                )}

                <div className="relative rounded-lg overflow-hidden bg-black">
                  {editedLesson?.videoUrl ? (
                    <video
                      ref={videoRef}
                      className="w-full aspect-video"
                      controls
                      src={editedLesson.videoUrl}
                    />
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center bg-muted">
                      <p className="text-muted-foreground">Chưa có video</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="references">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Tài liệu tham khảo</h2>
                {isEditing && (
                  <Dialog
                    open={showReferenceDialog}
                    onOpenChange={setShowReferenceDialog}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Thêm tài liệu
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Thêm tài liệu tham khảo</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="refTitle">Tiêu đề</Label>
                          <Input
                            id="refTitle"
                            value={newReference.title}
                            onChange={(e) =>
                              setNewReference({
                                ...newReference,
                                title: e.target.value,
                              })
                            }
                            placeholder="Nhập tiêu đề tài liệu"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="refUrl">URL</Label>
                          <Input
                            id="refUrl"
                            value={newReference.url}
                            onChange={(e) =>
                              setNewReference({
                                ...newReference,
                                url: e.target.value,
                              })
                            }
                            placeholder="Nhập URL tài liệu"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowReferenceDialog(false)}
                        >
                          Hủy
                        </Button>
                        <Button onClick={handleAddReference}>Thêm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <ul className="space-y-2">
                {editedLesson?.references &&
                editedLesson.references.length > 0 ? (
                  editedLesson.references.map((ref) => (
                    <li
                      key={ref.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center gap-1"
                        >
                          {ref.title}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveReference(ref.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-center text-muted-foreground">
                    Chưa có tài liệu tham khảo
                  </li>
                )}
              </ul>
            </TabsContent>
          </Tabs>

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

            <Button
              variant={isEditing ? "outline" : "default"}
              className="flex items-center gap-2"
              onClick={() => nextLesson && navigateToLesson(nextLesson.id)}
              disabled={!nextLesson}
            >
              Bài tiếp theo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
