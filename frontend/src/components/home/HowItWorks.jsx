import {
  FaDatabase,
  FaChartLine,
  FaRobot,
  FaBolt,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaDatabase />,
    title: "Collect Data",
    description:
      "Gather real-time electricity consumption data from smart meters and IoT devices.",
  },
  {
    icon: <FaChartLine />,
    title: "Analyze",
    description:
      "AI analyzes historical patterns and current grid conditions.",
  },
  {
    icon: <FaRobot />,
    title: "Forecast",
    description:
      "Machine Learning predicts future energy demand and peak load.",
  },
  {
    icon: <FaBolt />,
    title: "Optimize",
    description:
      "Automatically balance grid load for efficient power distribution.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-28">

      <div className="section">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-block px-4 py-2 rounded-full bg-teal-900/20 border border-teal-700 text-teal-400 text-sm">
            WORKFLOW
          </span>

          <h2 className="mt-6 text-4xl lg:text-5xl font-bold">
            How Smart Grid AI
            <span className="text-teal-400"> Works</span>
          </h2>

          <p className="mt-6 text-slate-400 text-lg leading-8">
            Our AI-powered system continuously monitors the electrical grid,
            predicts future demand, and optimizes energy distribution in real
            time.
          </p>

        </div>

        {/* Timeline */}

        <div className="relative mt-24">

          {/* Desktop Line */}

          <div className="hidden lg:block absolute top-10 left-[13%] right-[13%] h-[2px] bg-slate-700"></div>

          <div className="grid lg:grid-cols-4 gap-12">

            {steps.map((step, index) => (

              <div
                key={step.title}
                className="relative text-center group"
              >

                {/* Circle */}

                <div
                  className="
                  mx-auto
                  w-20
                  h-20
                  rounded-full
                  bg-[#0B1220]
                  border
                  border-slate-700
                  flex
                  items-center
                  justify-center
                  text-3xl
                  text-teal-400
                  transition-all
                  duration-300
                  group-hover:bg-teal-700
                  group-hover:text-white
                  group-hover:border-teal-500
                  relative
                  z-10
                  "
                >
                  {step.icon}
                </div>

                {/* Number */}

                <div
                  className="
                  absolute
                  top-16
                  left-1/2
                  -translate-x-1/2
                  w-8
                  h-8
                  rounded-full
                  bg-teal-700
                  text-white
                  text-sm
                  flex
                  items-center
                  justify-center
                  border-4
                  border-[#050816]
                  z-20
                  "
                >
                  {index + 1}
                </div>

                <h3 className="mt-10 text-2xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-4 text-slate-400 leading-7">
                  {step.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}