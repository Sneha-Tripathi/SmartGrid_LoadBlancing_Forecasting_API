import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import GridHealthPanel from "../dashboard/GridHealthPanel";
import ApiStatus from "../components/common/ApiStatus";
import RefreshButton from "../components/common/RefreshButton";
import LiveStatistics from "../dashboard/LiveStatistics";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardCards from "../dashboard/DashboardCards";
import ChartsSection from "../dashboard/ChartsSection";
import MeterTable from "../dashboard/MeterTable";
import AlertPanel from "../dashboard/AlertPanel";
import RecentActivity from "../dashboard/RecentActivity";
import GridStatus from "../dashboard/GridStatus";
import api from "../services/api";
import NotificationCenter from "../dashboard/NotificationCenter";

export default function Dashboard() {

  const { user } = useAuth();

  useEffect(() => {
    console.log("API Base URL:", api.defaults.baseURL);
  }, []);

  return (
  <div className="bg-[var(--bg)] min-h-screen">
    <DashboardLayout>

      {/* Welcome Section */}

      <section className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>

          <h1 className="text-3xl font-bold text-white">
            Welcome, {user?.name || "User"} 👋
          </h1>

          <p className="text-slate-400 mt-2">
            Smart Grid Monitoring Dashboard
          </p>

          <p className="text-sm text-teal-400 mt-1">
            {user?.role || "Frontend Developer"}
          </p>

          <div className="mt-5">
            <ApiStatus />
          </div>

        </div>

        <div>
          <RefreshButton />
        </div>

      </section>

      {/* Dashboard Cards */}

      <DashboardCards />
      

      <section>
        <GridStatus />
      </section>

      <section className="mt-8">

        <LiveStatistics />

      </section>

      <section className="mt-8">

        <GridHealthPanel />

      </section>

      {/* Charts */}

      <section className="mt-8">

        <ChartsSection />

      </section>

      {/* Meter Table + Live Alerts */}

      <section className="mt-8">

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2">

            <MeterTable />

          </div>

          <div>

            <AlertPanel />

          </div>

        </div>

      </section>

      {/* Recent Activity */}

      <section className="mt-8">

        <RecentActivity />

      </section>

      <section className="mt-8">
        <NotificationCenter />
      </section>

    </DashboardLayout>
  
  </div>
    

  );

}