import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardCards from "../dashboard/DashboardCards";

export default function Dashboard() {
  return (
    <DashboardLayout>

      <DashboardCards />

      {/* Day 4 */}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div
          className="
          h-[380px]
          rounded-2xl
          border
          border-slate-800
          bg-[#0B1220]
          flex
          items-center
          justify-center
          text-slate-500
          "
        >
          Meter Monitoring Table
        </div>

        <div
          className="
          h-[380px]
          rounded-2xl
          border
          border-slate-800
          bg-[#0B1220]
          flex
          items-center
          justify-center
          text-slate-500
          "
        >
          Live Alert Panel
        </div>

      </div>

      <div
        className="
        mt-8
        h-[420px]
        rounded-2xl
        border
        border-slate-800
        bg-[#0B1220]
        flex
        items-center
        justify-center
        text-slate-500
        "
      >
        Charts Section (Day 5)
      </div>

    </DashboardLayout>
  );
}