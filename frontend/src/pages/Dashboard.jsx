import { useEffect } from "react";

import ApiStatus from "../components/common/ApiStatus";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardCards from "../dashboard/DashboardCards";
import ChartsSection from "../dashboard/ChartsSection";
import MeterTable from "../dashboard/MeterTable";
import AlertPanel from "../dashboard/AlertPanel";
import RecentActivity from "../dashboard/RecentActivity";
import api from "../services/api";
import RefreshButton from "../components/common/RefreshButton";

export default function Dashboard() {

  useEffect(() => {
    console.log("API Base URL:", api.defaults.baseURL);
  }, []);

  return (
    <DashboardLayout>

      {/* Header */}

      <section className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
          Smart Grid Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Real-time monitoring, AI forecasting and smart grid analytics.
        </p>
        
        <div className="mt-4">
          <ApiStatus />
        </div>
        </div>
        <RefreshButton />
          
      </section>



      {/* KPI Cards */}

      <DashboardCards />

      {/* Charts */}

      <ChartsSection />

      {/* Table + Alerts */}

      <section className="mt-8">

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2">

            <MeterTable />

          </div>

          <AlertPanel />

        </div>

      </section>

      {/* Activity */}

      <section className="mt-8">

        <RecentActivity />

      </section>

    </DashboardLayout>
  );
}