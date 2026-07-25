import {
  FaBolt,
  FaChartLine,
  FaExclamationTriangle,
  FaServer,
} from "react-icons/fa";


import useApi from "../hooks/useApi";
import dashboardService from "../services/dashboardService";
import { useWebSocketContext } from "../context/WebSocketContext";

export default function DashboardCards() {
  // Initial API Data
  const { data } = useApi(() =>
    dashboardService.getDashboardCards()
  );

  // Live WebSocket Data
  const { liveData } = useWebSocketContext();

  const source =
  liveData ||
  (data && typeof data === "object" ? data : null);

if (!source) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="bg-[#101827] border border-slate-800 rounded-2xl p-6 h-40 animate-pulse"
        />
      ))}
    </div>
  );
}

const cards = [
  {
    title: "Current Load",
    value: `${source.current_load} MW`,
    icon: FaBolt,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Peak Load",
    value: `${source.peak_load} MW`,
    icon: FaServer,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    title: "Active Zones",
    value: source.active_zones,
    icon: FaChartLine,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    title: "Grid Health",
    value: `${source.grid_health}%`,
    icon: FaExclamationTriangle,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
];

  // Loading State
  if (!cards.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-[var(--card)] border border-slate-800 rounded-2xl p-6"
          />
        ))}
      </div>
    );
  }
  console.log("API DATA:", data);
console.log("LIVE DATA:", liveData);
console.log("USING:", liveData ?? data);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="relative overflow-hidden bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300"
          >
            {/* Top Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />

            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold text-white mt-2">
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-xl ${card.bg} flex items-center justify-center`}
              >
                <Icon className={`text-3xl ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}