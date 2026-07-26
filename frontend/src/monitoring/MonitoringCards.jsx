import { memo } from "react";
import { FaBolt, FaServer, FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import { useWebSocketContext } from "../context/WebSocketContext";

const MonitoringCards = memo(function MonitoringCards() {
  const { liveData } = useWebSocketContext();
  const cards = [
    { title: "Total Load", value: liveData?.current_load ? liveData.current_load + " MW" : "--", icon: FaBolt, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { title: "Peak Capacity", value: liveData?.peak_load ? liveData.peak_load + " MW" : "--", icon: FaServer, color: "text-teal-400", bg: "bg-teal-500/10" },
    { title: "Active Zones", value: liveData?.active_zones ?? "--", icon: FaChartLine, color: "text-green-400", bg: "bg-green-500/10" },
    { title: "Grid Health", value: liveData?.grid_health ? liveData.grid_health + "%" : "--", icon: FaExclamationTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">{card.title}</p>
                <h2 className="text-3xl font-bold text-white mt-2">{card.value}</h2>
              </div>
              <div className={`w-14 h-14 rounded-xl ${card.bg} flex items-center justify-center`}>
                <Icon className={`text-3xl ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
export default MonitoringCards;
