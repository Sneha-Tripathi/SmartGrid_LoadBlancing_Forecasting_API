import { FaBolt, FaChartLine, FaExclamationTriangle, FaServer } from "react-icons/fa";
import useApi from "../hooks/useApi";
import dashboardService from "../services/dashboardService";

const dummyCards = [
  {
    title: "Active Meters",
    value: "2,548",
    icon: FaBolt,
    color: "text-teal-400",
  },
  {
    title: "Grid Efficiency",
    value: "97.8%",
    icon: FaChartLine,
    color: "text-green-400",
  },
  {
    title: "Active Alerts",
    value: "08",
    icon: FaExclamationTriangle,
    color: "text-red-400",
  },
  {
    title: "Power Load",
    value: "4.82 MW",
    icon: FaServer,
    color: "text-cyan-400",
  },
];

export default function DashboardCards() {

  const {
    data,
    loading,
    error,
  } = useApi(() => dashboardService.getDashboardCards());

  // Backend ready
  const cards = data || dummyCards;

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
            className="bg-[#101827] border border-slate-800 rounded-2xl p-6"
          >

            <div className="flex justify-between items-center">

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