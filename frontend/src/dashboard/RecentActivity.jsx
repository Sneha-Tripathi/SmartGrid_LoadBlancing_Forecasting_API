import { memo } from "react";
import useApi from "../hooks/useApi";
import dashboardService from "../services/dashboardService";
import EmptyState from "../components/common/EmptyState";
import TableLoader from "../components/common/TableLoader";

const RecentActivity = memo(function RecentActivity() {
  const { data, loading, error } = useApi(() => dashboardService.getActivities());
  const activities = data || [];

  if (loading) return <TableLoader />;
  if (error) console.warn("Recent Activity API unavailable.");

  if (!activities.length) {
    return (
      <EmptyState title="No Recent Activity" message="No recent activity found." />
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#0B1220] p-6">
      <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
      <p className="text-sm text-slate-400 mt-1 mb-8">Latest dashboard events</p>
      <div className="relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-700" />
        <div className="space-y-7">
          {activities.map((item, index) => (
            <div key={item.id ?? index} className="relative flex items-start gap-5">
              <div className="w-6 h-6 rounded-full bg-teal-600 border-4 border-[#0B1220] z-10" />
              <div>
                <p className="text-sm text-slate-500">{item.time}</p>
                <h3 className="text-white font-medium mt-1">{item.event}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default RecentActivity;
