"use client";

import EventCreationForm from "@/components/organism/Form/EventCreationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ICourse, IEvent } from "@/interface";
import EventService from "@/services/Backend-api/event-service";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
interface CourseCardProps {
  userId?: number;
  course: ICourse.CourseRegistedDetail;
}

const CourseCard = ({ userId, course }: CourseCardProps) => {
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [title, setTitle] = useState(course.courseName);
  const [eventStart, setEventStart] = useState<Date | null>(null);
  const [eventEnd, setEventEnd] = useState<Date | null>(null);
  const formatDateForInput = (date: Date) => {
    const offset = 7 * 60;
    const localDate = new Date(date.getTime() + offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const handleSubmitForm = async () => {
    console.log(eventStart, eventEnd, title);
    if (eventStart && eventEnd && title) {
      try {
        const payload: IEvent.EventCreationRequest = {
          title,
          startedAt: eventStart.toISOString(),
          endedAt: eventEnd.toISOString(),
          userId: userId!,
        };

        const response = await EventService.createEvent(payload);

        if (response.status === 201) {
          setShowAddEventDialog(false);
          toast("Tạo sự kiện mới thành công 🆗");
        }
      } catch (error) {
        console.error("Error creating event:", error);
        toast("Không thể tạo sự kiện mới");
      }
    } else {
      toast("Vui lòng điền đầy đủ thông tin!");
    }
  };
  const router = useRouter();
  return (
    <Card className="w-full max-w-[280px] shadow-md rounded-xl overflow-hidden flex flex-col p-0">
      <CardHeader className="p-0">
        <div className="relative w-full h-32">
          <Image
            src={course.imageUrl}
            alt="Course Thumbnail"
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
        </div>
        <div className="px-3 pb-1">
          <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
            {course.courseName}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {course.instructorName}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-3 pt-1 flex-grow flex flex-col justify-between space-y-2 p-2">
        <p className="text-xs text-gray-400 uppercase">{course.level}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>Hoàn thành:</span>
            <span className="font-medium text-primary">
              {course.progress} %
            </span>
          </div>
        </div>

        <EventCreationForm
          showDialog={showAddEventDialog}
          setShowDialog={setShowAddEventDialog}
          title={title}
          setTitle={setTitle}
          eventStart={eventStart ? formatDateForInput(eventStart) : ""}
          setEventStart={(value: string) => setEventStart(new Date(value))}
          eventEnd={eventEnd ? formatDateForInput(eventEnd) : ""}
          setEventEnd={(value: string) => setEventEnd(new Date(value))}
          handleSubmitForm={handleSubmitForm}
        />
        <Progress
          value={course.progress}
          className="h-1.5 rounded-full bg-gray-200"
        />
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => router.push(`/course/${course.id}`)}>
            Học ngay
          </Button>
          <Button onClick={() => setShowAddEventDialog(true)}>
            Thêm lịch mới
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
