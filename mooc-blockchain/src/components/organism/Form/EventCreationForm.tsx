import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
interface EventCreationFormProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  title: string;
  setTitle: (name: string) => void;
  eventStart: string;
  setEventStart: (start: string) => void;
  eventEnd: string;
  setEventEnd: (end: string) => void;
  handleSubmitForm: () => void;
}
const EventCreationForm: React.FC<EventCreationFormProps> = ({
  showDialog,
  setShowDialog,
  title,
  setTitle,
  eventStart,
  setEventStart,
  eventEnd,
  setEventEnd,
  handleSubmitForm,
}) => {
  useEffect(() => {
    if (showDialog && !eventStart && !eventEnd) {
      const uct0 = new Date();
      const now = new Date(uct0.getTime() + 7 * 60 * 60 * 1000);
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      const formatDate = (date: Date) => date.toISOString().slice(0, 16);

      setEventStart(formatDate(now));
      setEventEnd(formatDate(oneHourLater));
    }
  }, [showDialog]);
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm lịch mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tên khóa học"
          />
          <Input
            type="datetime-local"
            value={eventStart}
            onChange={(e) => setEventStart(e.target.value)}
          />
          <Input
            type="datetime-local"
            min={eventStart}
            value={eventEnd}
            onChange={(e) => setEventEnd(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmitForm}
            className="bg-green-600 hover:bg-green-700"
          >
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreationForm;
