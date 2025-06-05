import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EventDeleteFormProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  handleDeleteEvent: () => void;
}

const EventDeleteForm: React.FC<EventDeleteFormProps> = ({
  showDialog,
  setShowDialog,
  handleDeleteEvent,
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa sự kiện</DialogTitle>
        </DialogHeader>
        <div>
          <p>Bạn có chắc chắn muốn xóa sự kiện này?</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleDeleteEvent}
            className="bg-red-600 hover:bg-red-700"
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDeleteForm;
