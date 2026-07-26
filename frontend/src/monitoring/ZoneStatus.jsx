import { memo } from "react";

const getStatusStyle = (status) => {
  switch (status) {
    case "Normal": return "bg-green-500/20 text-green-400";
    case "High": return "bg-yellow-500/20 text-yellow-400";
    case "Critical": return "bg-red-500/20 text-red-400";
    default: return "bg-slate-500/20 text-slate-300";
  }
};

const zones = [
  { name: "North", load: "2.45 MW", status: "Normal" },
  { name: "South", load: "3.82 MW", status: "High" },
  { name: "East", load: "1.98 MW", status: "Normal" },
  { name: "West", load: "4.76 MW", status: "Critical" },
  { name: "Central", load: "2.89 MW", status: "Normal" },
];

const ZoneStatus = memo(function ZoneStatus() {
  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-5">Zone Status Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {zones.map((zone, i) => (
          <div key={i} className="bg-[#0B1220] border border-slate-700 rounded-xl p-4">
            <h3 className="text-white font-medium">{zone.name}</h3>
            <p className="text-slate-400 text-sm mt-1">{zone.load}</p>
            <span className={"inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 " + getStatusStyle(zone.status)}>
              {zone.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ZoneStatus;
