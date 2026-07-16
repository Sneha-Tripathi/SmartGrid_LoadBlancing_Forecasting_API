import {
  FaBolt,
  FaChartLine,
  FaBroadcastTower,
  FaCheckCircle,
} from "react-icons/fa";

const cards = [
  {
    title: "Current Load",
    value: "2.54 MW",
    change: "+4.2%",
    icon: FaBolt,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    title: "Peak Load",
    value: "3.91 MW",
    change: "+1.8%",
    icon: FaChartLine,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    title: "Active Zones",
    value: "18",
    change: "100%",
    icon: FaBroadcastTower,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    title: "Grid Health",
    value: "98%",
    change: "Healthy",
    icon: FaCheckCircle,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

export default function DashboardCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-800
              bg-[#0B1220]
              p-6
              transition-all
              duration-300
              hover:-translate-y-2
              hover:border-teal-600
              hover:shadow-xl
              hover:shadow-teal-900/20
            "
          >
            {/* Glow */}

            <div
              className="
                absolute
                -right-10
                -top-10
                h-28
                w-28
                rounded-full
                bg-teal-500/5
                blur-3xl
                transition-all
                duration-500
                group-hover:bg-teal-500/15
              "
            />

            {/* Header */}

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                <h2 className="mt-4 text-3xl font-bold text-white">
                  {card.value}
                </h2>

              </div>

              <div
                className={`
                  ${card.bg}
                  h-14
                  w-14
                  rounded-xl
                  flex
                  items-center
                  justify-center
                `}
              >
                <Icon className={`text-2xl ${card.color}`} />
              </div>

            </div>

            {/* Footer */}

            <div className="mt-8 flex items-center justify-between">

              <span className="text-sm text-slate-500">
                Live Status
              </span>

              <span className={`text-sm font-semibold ${card.color}`}>
                {card.change}
              </span>

            </div>

          </div>
        );
      })}
    </div>
  );
}