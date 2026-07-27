import DashboardLayout from "../components/layout/DashboardLayout";
import ApiStatus from "../components/common/ApiStatus";
import RefreshButton from "../components/common/RefreshButton";

import MonitoringCards from "../monitoring/MonitoringCards";
import LiveStatistics from "../monitoring/LiveStatistics";
import ZoneStatus from "../monitoring/ZoneStatus";
import LiveMeterTable from "../monitoring/LiveMeterTable";
import GridHealthPanel from "../monitoring/GridHealthPanel";

export default function Monitoring() {
  return (
    <DashboardLayout>
      {/* ================= Header ================= */}

      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-8 gap-5">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Live Grid Monitoring
          </h1>

          <p className="text-slate-400 mt-2">
            Monitor the complete Smart Grid infrastructure in real time.
            Track live load, health, connected meters, zones and system
            performance.
          </p>

        </div>

        

      </section>

      {/* ================= Monitoring Cards ================= */}

      <section className="mb-8">

        <MonitoringCards />

      </section>

      {/* ================= Live Statistics + Health ================= */}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        <div className="xl:col-span-2">

          <LiveStatistics />

        </div>

        <GridHealthPanel />

      </section>

      {/* ================= Zone Status ================= */}

      <section className="mb-8">

        <ZoneStatus />

      </section>

      {/* ================= Live Meter Table ================= */}

      <section>

        <LiveMeterTable />

      </section>

    </DashboardLayout>
  );
}