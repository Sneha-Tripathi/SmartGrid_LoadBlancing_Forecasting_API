import { memo, useMemo } from "react";
import useApi from "../hooks/useApi";
import dashboardService from "../services/dashboardService";
import TableLoader from "../components/common/TableLoader";
import EmptyState from "../components/common/EmptyState";

const dummyMeters = [
  { id: "MTR-1001", zone: "North", load: "245 kW", voltage: "228 V", status: "Active" },
  { id: "MTR-1002", zone: "South", load: "198 kW", voltage: "230 V", status: "Active" },
  { id: "MTR-1003", zone: "East", load: "310 kW", voltage: "226 V", status: "Warning" },
  { id: "MTR-1004", zone: "West", load: "275 kW", voltage: "229 V", status: "Critical" },
  { id: "MTR-1005", zone: "Central", load: "342 kW", voltage: "231 V", status: "Active" },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Active": case "Normal": return "bg-green-500/20 text-green-400";
    case "Warning": case "High": return "bg-yellow-500/20 text-yellow-400";
    case "Critical": return "bg-red-500/20 text-red-400";
    default: return "bg-slate-500/20 text-slate-300";
  }
};

const LiveMeterTable = memo(function LiveMeterTable() {
  const { data, loading } = useApi(() => dashboardService.getMeters());
  const meters = useMemo(() => Array.isArray(data) && data.length > 0 ? data : dummyMeters, [data]);
  if (loading) return <TableLoader />;
  if (!meters || meters.length === 0) return <EmptyState title="No Meter Data" message="No smart meter records found." />;
  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-5">Live Meter Monitoring</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 text-slate-400">Meter ID</th>
              <th className="text-left py-3 text-slate-400">Zone</th>
              <th className="text-left py-3 text-slate-400">Load</th>
              <th className="text-left py-3 text-slate-400">Voltage</th>
              <th className="text-left py-3 text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {meters.map((meter, index) => (
              <tr key={meter.id || index} className="border-b border-slate-800 hover:bg-slate-800/40 transition">
                <td className="py-4 text-white">{meter.id}</td>
                <td className="py-4 text-slate-300">{meter.zone}</td>
                <td className="py-4 text-slate-300">{meter.load}</td>
                <td className="py-4 text-slate-300">{meter.voltage ?? "--"}</td>
                <td className="py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(meter.status)}`}>{meter.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
export default LiveMeterTable;
