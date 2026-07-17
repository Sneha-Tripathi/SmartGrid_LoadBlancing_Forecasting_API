import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardCards from "../dashboard/DashboardCards";
import MeterTable from "../dashboard/MeterTable";
import AlertPanel from "../dashboard/AlertPanel";
import RecentActivity from "../dashboard/RecentActivity";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Page Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Smart Grid Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Real-time monitoring and forecasting of smart grid operations.
        </p>

      </div>

      {/* Dashboard Cards */}

      <DashboardCards />

      {/* Meter Table + Alert Panel */}

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2">

          <MeterTable />

        </div>

        <AlertPanel />

      </div>

      {/* Recent Activity */}

      <div className="mt-8">

        <RecentActivity />

      </div>

    </DashboardLayout>
  );
}