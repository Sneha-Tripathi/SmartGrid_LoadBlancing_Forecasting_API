import { memo } from "react";
import { FaBolt, FaChartLine, FaExclamationTriangle, FaServer } from "react-icons/fa";

const MonitoringCards = memo(function MonitoringCards() {
  const cards = [
    { title: "Current Load", value: "2.54 MW", icon: FaBolt, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { title: "Peak Load", value: "3.91 MW", icon: FaServer, color: "text-teal-400", bg: "bg-teal-500/10" },
    { title: "Active Zones", value: "18", icon: FaChartLine, color: "text-green-400", bg: "bg-green-500/10" },
    { title: "Grid Health", value: "98%", icon: FaExclamationTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="relative overflow-hidden bg-[#101827] border border-slate-800 rounded-2xl p-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">{card.title}</p>
                <h2 className="text-3xl font-bold text-white mt-2">{card.value}</h2>
              </div>
              <div className={"w-14 h-14 rounded-xl " + card.bg + " flex items-center justify-center"}>
                <Icon className={"text-3xl " + card.color} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default MonitoringCards;
