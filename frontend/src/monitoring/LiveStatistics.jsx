import { memo } from "react";
import { FaBolt, FaHeartbeat, FaClock, FaWifi } from "react-icons/fa";
import { useWebSocketContext } from "../context/WebSocketContext";

const LiveStatistics = memo(function LiveStatistics() {
  const { liveData, connected } = useWebSocketContext();

  const stats = [
    { label: "Grid Status", value: liveData?.status || "--", icon: FaBolt, color: "text-yellow-400" },
    { label: "Current Alert", value: liveData?.alert || "No Alerts", icon: FaHeartbeat, color: "text-red-400" },
    { label: "Last Update", value: liveData?.timestamp || "--", icon: FaClock, color: "text-cyan-400" },
    { label: "Connection", value: connected ? "Online" : "Offline", icon: FaWifi, color: connected ? "text-green-400" : "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-slate-400">{stat.label}</h3>
              <Icon className={`${stat.color} text-xl`} />
            </div>
            <h2 className={`text-2xl font-bold mt-4 ${stat.color}`}>{stat.value}</h2>
          </div>
        );
      })}
    </div>
  );
});

export default LiveStatistics;
