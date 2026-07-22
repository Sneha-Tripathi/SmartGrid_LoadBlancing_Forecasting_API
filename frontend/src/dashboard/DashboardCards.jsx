import {
  FaBolt,
  FaChartLine,
  FaExclamationTriangle,
  FaServer,
} from "react-icons/fa";

import useApi from "../hooks/useApi";
import dashboardService from "../services/dashboardService";

const dummyCards = [
  {
    title: "Current Load",
    value: "2.54 MW",
    icon: FaBolt,
    color: "text-teal-400",
  },
  {
    title: "Peak Load",
    value: "3.91 MW",
    icon: FaServer,
    color: "text-cyan-400",
  },
  {
    title: "Active Zones",
    value: "18",
    icon: FaExclamationTriangle,
    color: "text-yellow-400",
  },
  {
    title: "Grid Health",
    value: "98%",
    icon: FaChartLine,
    color: "text-green-400",
  },
];

export default function DashboardCards() {

  const {
    data,
    loading,
    error,
  } = useApi(() => dashboardService.getDashboardCards());

  const cards = data
    ? [
        {
          title: "Current Load",
          value: data.current_load,
          icon: FaBolt,
          color: "text-teal-400",
        },
        {
          title: "Peak Load",
          value: data.peak_load,
          icon: FaServer,
          color: "text-cyan-400",
        },
        {
          title: "Active Zones",
          value: data.active_zones,
          icon: FaExclamationTriangle,
          color: "text-yellow-400",
        },
        {
          title: "Grid Health",
          value: data.grid_health,
          icon: FaChartLine,
          color: "text-green-400",
        },
      ]
    : dummyCards;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {dummyCards.map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-2xl bg-[#101827] border border-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    console.warn("Dashboard API unavailable. Using dummy data.");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {cards.map((card, index) => {

        const Icon = card.icon;

        return (

          <div
            key={index}
            className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-teal-500 transition-all duration-300"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-400 text-sm">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold text-white mt-2">
                  {card.value}
                </h2>

              </div>

              <div className={`text-3xl ${card.color}`}>

                <Icon />

              </div>

            </div>

          </div>

        );

      })}

    </div>
  );
}