"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventCreationForm from "@/components/organism/Form/EventCreationForm";
import EventDeleteForm from "@/components/organism/Form/EventDeleteForm";
import FullCalendar from "@fullcalendar/react";
import { IEvent } from "@/interface";
import EventService from "@/services/Backend-api/event-service";
import { toast } from "sonner";
import { useAuth } from "@/hooks/Auth";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const Timetable: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [showDeleteEventDialog, setShowDeleteEventDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [eventStart, setEventStart] = useState<Date | null>(null);
  const [eventEnd, setEventEnd] = useState<Date | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStartDate, setCurrentStartDate] = useState<Date>(new Date());
  const [currentEndDate, setCurrentEndDate] = useState<Date>(new Date());

  const { user } = useAuth();

  const [userId, setUserId] = useState(14);

  const formatDateForInput = (date: Date) => {
    const offset = 7 * 60;
    const localDate = new Date(date.getTime() + offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // UTC +7
      const startOfWeek = new Date(currentStartDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(7, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(30, 59, 59, 999);

      const response = await EventService.getEventList(
        userId,
        startOfWeek,
        endOfWeek
      );

      if (response.status === 200 && response.data) {
        const formattedEvents: CalendarEvent[] = response.data.map(
          (event: IEvent.EventResponse) => ({
            id: event.id.toString(),
            title: event.title,
            start: new Date(event.startedAt),
            end: new Date(event.endedAt),
          })
        );
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchEvents();
    } else {
      console.log(user?.id);
      if (user?.id) setUserId(user.id);
    }
  }, [currentStartDate, currentEndDate, userId]);

  const handleSubmitForm = async () => {
    if (eventStart && eventEnd && title) {
      setLoading(true);
      try {
        const payload: IEvent.EventCreationRequest = {
          title,
          startedAt: eventStart.toISOString(),
          endedAt: eventEnd.toISOString(),
          userId,
        };

        const response = await EventService.createEvent(payload);

        if (response.status === 201) {
          await fetchEvents();
          setShowAddEventDialog(false);
          resetForm();
          toast("Tạo sự kiện mới thành công 🆗");
        }
      } catch (error) {
        console.error("Error creating event:", error);
        toast("Không thể tạo sự kiện mới");
      } finally {
        setLoading(false);
      }
    } else {
      toast("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const resetForm = () => {
    setTitle("");
    setEventStart(null);
    setEventEnd(null);
    setShowAddEventDialog(false);
  };

  const handleEventClick = (info: any) => {
    setSelectedEventId(info.event.id);
    setShowDeleteEventDialog(true);
  };

  const handleDeleteEvent = async () => {
    if (selectedEventId) {
      setLoading(true);
      try {
        const response = await EventService.deleteEvent(
          parseInt(selectedEventId)
        );
        if (response.status === 200) {
          await fetchEvents();
          setShowDeleteEventDialog(false);
          setSelectedEventId(null);
          toast("Xóa thành công");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        toast("Không thể xóa sự kiện");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDateChange = (info: any) => {
    setCurrentStartDate(new Date(info.start));
    setCurrentEndDate(new Date(info.end));
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-2xl max-w-5xl mx-auto">
      <div className="mb-4">
        <Button onClick={() => setShowAddEventDialog(true)} disabled={loading}>
          Thêm lịch mới
        </Button>
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

      <EventDeleteForm
        showDialog={showDeleteEventDialog}
        setShowDialog={setShowDeleteEventDialog}
        handleDeleteEvent={handleDeleteEvent}
      />

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        editable={false}
        events={events}
        eventContent={(eventInfo) => {
          const event = eventInfo.event;
          const title = event.title;
          const startTime = event.start?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const endTime = event.end?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <div>
              <strong>{title}</strong>
              <p className="px-0.5 text-xs">
                {startTime} - {endTime}
              </p>
            </div>
          );
        }}
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
          meridiem: false,
        }}
        headerToolbar={{
          start: "prev,next",
          end: "",
        }}
        select={(info) => {
          setEventStart(new Date(info.startStr));
          setEventEnd(new Date(info.endStr));
          setShowAddEventDialog(true);
        }}
        eventClick={handleEventClick}
        height="600px"
        datesSet={handleDateChange}
      />
    </div>
  );
};

export default Timetable;
