import UserHeader from "../components/user/UserHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <UserHeader></UserHeader>
      <div className="">{children}</div>
    </div>
  );
}
