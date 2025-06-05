// app/loading.tsx
import { Loader2 } from "lucide-react"; // nếu dùng lucide-react

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      <span className="ml-2 text-lg font-medium">Đang tải...</span>
    </div>
  );
}
