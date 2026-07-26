import { memo } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { useWebSocketContext } from "../context/WebSocketContext";

const ZONES = ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"];

const getStatusIcon = (status) => {
  switch (status) {
    case "Normal": return <FaCheckCircle className="text-green-400" />;
    case "Warning":
    case "High": return <FaExclamationTriangle className="text-yellow-400" />;
    case "Critical": return <FaExclamationTriangle className="text-red-400" />;
    default: return <FaInfoCircle className="text-cyan-400" />;
  }
};

const getStatusBg = (status) => {
  switch (status) {
    case "Normal": return "bg-green-500/10 border-green-500/20";
    case "Warning":
    case "High": return "bg-yellow-500/10 border-yellow-500/20";
    case "Critical": return "bg-red-500/10 border-red-500/20";
    default: return "bg-slate-500/10 border-slate-500/20";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "Normal": return "text-green-400";
    case "Warning":
    case "High": return "text-yellow-400";
    case "Critical": return "text-red-400";
    default: return "text-slate-400";
  }
};

const ZoneStatus = memo(function ZoneStatus() {
  const { liveData } = useWebSocketContext();

  const zoneStatuses = {
    "North Zone": liveData?.status === "Critical" ? "Warning" : "Normal",
    "South Zone": liveData?.status === "Warning" ? "High" : "Normal",
    "East Zone": "Normal",
    "West Zone": liveData?.status === "Critical" ? "Critical" : liveData?.status === "Warning" ? "Warning" : "Normal",
    "Central Zone": liveData?.status === "Warning" ? "Warning" : "Normal",
  };

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Zone Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {ZONES.map((zone) => {
          const status = zoneStatuses[zone] || "Normal";
          return (
            <div key={zone} className={`${getStatusBg(status)} border rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-sm">{zone}</h3>
                {getStatusIcon(status)}
              </div>
              <p className={`text-xs font-medium ${getStatusText(status)}`}>{status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ZoneStatus;
