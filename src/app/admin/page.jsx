import StatsCards from "@/components/admin/StatsCards";
import RecentAds from "@/components/admin/RecentAds";
import RecentUsers from "@/components/admin/RecentUsers";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <StatsCards />

      <div className="grid grid-cols-[1.6fr_1fr] gap-4">
        <RecentAds />
        <RecentUsers />
      </div>
    </div>
  );
}
