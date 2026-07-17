import { FaBolt, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { alertData } from "../data/dashboardData";

export default function AlertPanel() {

  const getStyle = (severity) => {

    switch (severity) {

      case "Critical":
        return {
          icon: <FaExclamationTriangle />,
          color: "text-red-400",
          bg: "bg-red-500/10",
        };

      case "Warning":
        return {
          icon: <FaBolt />,
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
        };

      case "Normal":
        return {
          icon: <FaCheckCircle />,
          color: "text-green-400",
          bg: "bg-green-500/10",
        };

      default:
        return {
          icon: <FaInfoCircle />,
          color: "text-cyan-400",
          bg: "bg-cyan-500/10",
        };
    }

  };

  return (

    <section className="rounded-2xl border border-slate-800 bg-[#0B1220] p-6">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-xl font-semibold text-white">
            Live Alerts
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Latest smart grid notifications
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {alertData.map((alert) => {

          const style = getStyle(alert.severity);

          return (

            <div
              key={alert.id}
              className="flex items-start gap-4 rounded-xl border border-slate-800 bg-[#111827] p-4 hover:border-teal-600 transition"
            >

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${style.bg}`}
              >
                <span className={style.color}>
                  {style.icon}
                </span>
              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-white">
                  {alert.title}
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  {alert.zone}
                </p>

              </div>

              <span className="text-xs text-slate-500 whitespace-nowrap">
                {alert.time}
              </span>

            </div>

          );

        })}

      </div>

    </section>

  );

}