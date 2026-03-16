import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export const metadata = {
  title: "Admin — TanjaMarket",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
