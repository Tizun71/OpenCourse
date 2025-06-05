import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <div className="flex w-full">
          <DashboardSidebar />

          <div className="flex-1 p-4">{children}</div>
        </div>
      </SidebarProvider>
    </div>
  );
}
