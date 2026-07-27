import {
  FaBolt,
  FaBroadcastTower,
  FaMicrochip,
  FaChartLine,
  FaServer,
} from "react-icons/fa";

const stats = [
  {
    title: "Current Load",
    value: "1.84 MW",
    icon: <FaBolt />,
  },
  {
    title: "Grid Stability",
    value: "99.2%",
    icon: <FaBroadcastTower />,
  },
  {
    title: "Active Meters",
    value: "12,486",
    icon: <FaMicrochip />,
  },
  {
    title: "AI Accuracy",
    value: "98.7%",
    icon: <FaChartLine />,
  },
  {
    title: "Online Zones",
    value: "154",
    icon: <FaServer />,
  },
];

export default function StatsBar() {
  return (
    <section className="relative -mt-6 pb-24">

      <div className="section">

        <div
          className="
          grid
          grid-cols-2
          md:grid-cols-3
          xl:grid-cols-5
          gap-6
        "
        >

          {stats.map((item) => (

            <div
              key={item.title}
              className="
              group
              bg-[#0B1220]
              border
              border-slate-800
              rounded-3xl
              p-7
              transition-all
              duration-300
              hover:border-teal-600
              hover:-translate-y-2
              hover:shadow-xl
              hover:shadow-teal-900/20
              "
            >

              <div
                className="
                w-14
                h-14
                rounded-2xl
                bg-teal-700/10
                flex
                items-center
                justify-center
                text-2xl
                text-teal-400
                group-hover:bg-teal-700
                group-hover:text-white
                transition
                "
              >
                {item.icon}
              </div>

              <h2 className="text-3xl font-bold mt-7">

                {item.value}

              </h2>

              <p className="text-slate-500 mt-2">

                {item.title}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}