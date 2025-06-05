import { SidebarProvider } from "@/components/ui/sidebar";
import { InstructorSidebar } from "../components/instructor/Sidebar";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <div className="flex w-full">
          <InstructorSidebar />
          <div className="flex-1 p-4">{children}</div>
        </div>
      </SidebarProvider>
    </div>
  );
}
