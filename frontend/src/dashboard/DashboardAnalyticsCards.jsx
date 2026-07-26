import { memo, useMemo } from "react";
import { FaChartLine, FaCalendarDay, FaCalendarAlt, FaLeaf, FaBrain, FaBullseye } from "react-icons/fa";
import useApi from "../hooks/useApi";
import analyticsService from "../services/analyticsService";
import { useWebSocketContext } from "../context/WebSocketContext";
import CardLoader from "../components/common/CardLoader";

const ANALYTICS_CARDS_CONFIG = [
  { key: "today_energy", title: "Today's Energy", icon: FaCalendarDay, gradient: "from-cyan-500 to-teal-600", unit: "MWh" },
  { key: "weekly_usage", title: "Weekly Usage", icon: FaCalendarAlt, gradient: "from-violet-500 to-purple-600", unit: "MWh" },
  { key: "prediction_accuracy", title: "AI Accuracy", icon: FaBullseye, gradient: "from-emerald-500 to-teal-600", unit: "%" },
  { key: "carbon_saved", title: "Carbon Saved", icon: FaLeaf, gradient: "from-green-500 to-emerald-600", unit: "tons CO2" },
  { key: "ai_efficiency", title: "AI Efficiency", icon: FaBrain, gradient: "from-pink-500 to-rose-600", unit: "%" },
  { key: "monthly_usage", title: "Monthly Usage", icon: FaChartLine, gradient: "from-amber-500 to-orange-600", unit: "MWh" },
];

const DashboardAnalyticsCards = memo(function DashboardAnalyticsCards() {
  const { data, loading } = useApi(() => analyticsService.getTodayEnergy(), { onError: () => console.warn("Analytics API unavailable") });
  const { liveData } = useWebSocketContext();
  const source = useMemo(() => liveData?.analytics || data, [liveData, data]);
  if (loading && !source) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mt-8">
        {ANALYTICS_CARDS_CONFIG.map((_, idx) => <CardLoader key={idx} delay={idx * 100} />)}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mt-8">
      {ANALYTICS_CARDS_CONFIG.map((card) => {
        const Icon = card.icon;
        const value = source?.[card.key];
        return (
          <div key={card.key} className="relative group overflow-hidden bg-[#101827] border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/5">
            <div className={"absolute top-0 left-0 w-full h-1 bg-gradient-to-r " + card.gradient + " opacity-80"} />
            <div className={"absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br " + card.gradient + " opacity-[0.04] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity duration-700"} />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className={"w-10 h-10 rounded-xl bg-gradient-to-br " + card.gradient + " flex items-center justify-center shadow-lg"}><Icon className="text-white text-lg" /></div>
              </div>
              <h3 className="text-slate-400 text-xs mt-4 font-medium">{card.title}</h3>
              <p className="text-2xl font-bold text-white tracking-tight mt-1">{value !== undefined && value !== null ? value : "--"}</p>
              <p className="text-slate-500 text-[11px] mt-1">{card.unit}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default DashboardAnalyticsCards;
