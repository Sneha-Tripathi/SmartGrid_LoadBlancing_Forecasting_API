import {
  FaBolt,
  FaChartLine,
  FaBroadcastTower,
  FaShieldAlt,
  FaMicrochip,
  FaLeaf,
} from "react-icons/fa";

const features = [
  {
    icon: <FaBroadcastTower />,
    title: "Real-Time Monitoring",
    description:
      "Monitor smart grid performance continuously with live sensor and meter data.",
  },
  {
    icon: <FaBolt />,
    title: "Smart Load Balancing",
    description:
      "Distribute electricity efficiently using AI-powered load balancing algorithms.",
  },
  {
    icon: <FaChartLine />,
    title: "AI Forecasting",
    description:
      "Predict future power demand using Machine Learning and historical data.",
  },
  {
    icon: <FaMicrochip />,
    title: "IoT Integration",
    description:
      "Connect smart meters and IoT devices for real-time communication.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Infrastructure",
    description:
      "Enterprise-grade security with reliable communication across the grid.",
  },
  {
    icon: <FaLeaf />,
    title: "Sustainable Energy",
    description:
      "Reduce energy wastage and improve efficiency for a greener future.",
  },
];

export default function Features() {
  return (
    <section className="py-28">

      <div className="section">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-block px-4 py-2 rounded-full bg-teal-900/30 border border-teal-700 text-teal-400 text-sm">
            PLATFORM FEATURES
          </span>

          <h2 className="mt-6 text-4xl lg:text-5xl font-bold leading-tight">
            Everything You Need for a
            <span className="text-teal-400"> Smarter Grid</span>
          </h2>

          <p className="mt-6 text-slate-400 text-lg leading-8">
            Powerful AI, predictive analytics and real-time monitoring
            combined into one intelligent platform for modern power
            distribution.
          </p>

        </div>

        {/* Cards */}

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-20">

          {features.map((item) => (

            <div
              key={item.title}
              className="
              group
              rounded-3xl
              bg-[#0B1220]
              border
              border-slate-800
              p-8
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
                w-16
                h-16
                rounded-2xl
                bg-teal-900/20
                flex
                items-center
                justify-center
                text-3xl
                text-teal-400
                transition-all
                duration-300
                group-hover:bg-teal-700
                group-hover:text-white
                "
              >
                {item.icon}
              </div>

              <h3 className="mt-8 text-2xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-5 text-slate-400 leading-8">
                {item.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}