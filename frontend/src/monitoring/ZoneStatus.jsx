import { memo } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const zones = [
  { name: "North Zone", status: "Normal", load: "2.45 MW", color: "text-green-400" },
  { name: "South Zone", status: "High", load: "3.82 MW", color: "text-yellow-400" },
  { name: "East Zone", status: "Normal", load: "1.98 MW", color: "text-green-400" },
  { name: "West Zone", status: "Critical", load: "4.76 MW", color: "text-red-400" },
  { name: "Central Zone", status: "Normal", load: "2.89 MW", color: "text-green-400" },
];

const ZoneStatus = memo(function ZoneStatus() {
  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Zone Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {zones.map((zone) => (
          <div key={zone.name} className="bg-[#0B1220] border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              {zone.status === "Critical" ? <FaExclamationTriangle className="text-red-400" /> : zone.status === "High" || zone.status === "Warning" ? <FaExclamationTriangle className="text-yellow-400" /> : <FaCheckCircle className="text-green-400" />}
              <h3 className="text-white font-medium text-sm">{zone.name}</h3>
            </div>
            <p className={`text-lg font-bold ${zone.color}`}>{zone.status}</p>
            <p className="text-slate-400 text-sm mt-1">Load: {zone.load}</p>
          </div>
        ))}
      </div>
    </div>
  );
});
export default ZoneStatus;
