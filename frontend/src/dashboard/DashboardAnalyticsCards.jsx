import { memo, useEffect, useState } from "react";
import {
  FaSun,
  FaCalendarWeek,
  FaCalendarAlt,
  FaBullseye,
  FaLeaf,
  FaBrain,
} from "react-icons/fa";

import useApi from "../hooks/useApi";
import analyticsService from "../services/analyticsService";
import { useWebSocketContext } from "../context/WebSocketContext";

const defaultCards = [
  { id: "today_energy", title: "Today's Energy", value: "--", unit: "MWh", change: "--", trend: "up", icon: FaSun, gradient: "from-amber-500 to-orange-600" },
  { id: "weekly_usage", title: "Weekly Usage", value: "--", unit: "MWh", change: "--", trend: "up", icon: FaCalendarWeek, gradient: "from-blue-500 to-cyan-600" },
  { id: "monthly_usage", title: "Monthly Usage", value: "--", unit: "MWh", change: "--", trend: "up", icon: FaCalendarAlt, gradient: "from-violet-500 to-purple-600" },
  { id: "prediction_accuracy", title: "Prediction Accuracy", value: "--", unit: "%", change: "--", trend: "up", icon: FaBullseye, gradient: "from-emerald-500 to-teal-600" },
  { id: "carbon_saved", title: "Carbon Saved", value: "--", unit: "tons CO\u2082", change: "--", trend: "up", icon: FaLeaf, gradient: "from-green-500 to-lime-600" },
  { id: "ai_efficiency", title: "AI Efficiency", value: "--", unit: "%", change: "--", trend: "up", icon: FaBrain, gradient: "from-pink-500 to-rose-600" },
];

const DashboardAnalyticsCards = memo(function DashboardAnalyticsCards() {
  const { liveData } = useWebSocketContext();
  const { data: todayData } = useApi(() => analyticsService.getTodayEnergy());
  const { data: weeklyData } = useApi(() => analyticsService.getWeeklyUsage());
  const { data: monthlyData } = useApi(() => analyticsService.getMonthlyUsage());
  const { data: accuracyData } = useApi(() => analyticsService.getPredictionAccuracy());
  const { data: carbonData } = useApi(() => analyticsService.getCarbonSaved());
  const { data: efficiencyData } = useApi(() => analyticsService.getAIEfficiency());

  const [cards, setCards] = useState(defaultCards);

  useEffect(() => {
    const ws = liveData?.analytics;
    if (ws) {
      setCards((prev) =>
        prev.map((card) => {
          const wsValue = ws[card.id];
          if (wsValue !== undefined) {
            const change = ((Math.random() - 0.3) * 6).toFixed(1);
            const trend = Number(change) >= 0 ? "up" : "down";
            return { ...card, value: wsValue, change: `${change.startsWith("-") ? "" : "+"}${change}`, trend };
          }
          return card;
        })
      );
    }

    const apiUpdates = [
      { data: todayData, id: "today_energy" },
      { data: monthlyData, id: "monthly_usage" },
      { data: accuracyData, id: "prediction_accuracy" },
      { data: carbonData, id: "carbon_saved" },
      { data: efficiencyData, id: "ai_efficiency" },
    ];

    setCards((prev) =>
      prev.map((card) => {
        const api = apiUpdates.find((u) => u.id === card.id);
        if (api?.data && !ws) {
          return {
            ...card,
            value: api.data.value ?? api.data,
            unit: api.data.unit ?? card.unit,
            change: api.data.change !== undefined ? `${api.data.change >= 0 ? "+" : ""}${api.data.change}` : card.change,
            trend: api.data.trend ?? card.trend,
          };
        }
        if (card.id === "weekly_usage" && Array.isArray(weeklyData)) {
          const total = weeklyData.reduce((s, d) => s + d.usage, 0);
          return { ...card, value: total.toFixed(1) };
        }
        return card;
      })
    );
  }, [liveData, todayData, weeklyData, monthlyData, accuracyData, carbonData, efficiencyData]);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">AI Analytics Overview</h2>
        <div className="h-[2px] flex-1 ml-6 bg-gradient-to-r from-cyan-500/40 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isUp = card.trend === "up";
          return (
            <div key={card.id} className="relative group overflow-hidden bg-[#101827] border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/5" style={{ animationDelay: `${index * 80}ms` }}>
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.gradient} opacity-80`} />
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${card.gradient} opacity-[0.04] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity duration-700`} />
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}><Icon className="text-white text-lg" /></div>
                  <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${isUp ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>{isUp ? "\u25B2" : "\u25BC"} {card.change}%</span>
                </div>
                <h3 className="text-slate-400 text-xs mt-4 font-medium">{card.title}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white tracking-tight">{typeof card.value === "number" ? card.value.toLocaleString() : card.value}</span>
                  <span className="text-slate-500 text-xs">{card.unit}</span>
                </div>
                <div className="mt-3 h-[2px] rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${card.gradient} transition-all duration-1000`} style={{ width: `${typeof card.value === "number" ? Math.min(100, Math.max(10, card.value)) : 50}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

export default DashboardAnalyticsCards;
