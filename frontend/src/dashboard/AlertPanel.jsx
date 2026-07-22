import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

import useApi from "../hooks/useApi";
import dashboardService from "../services/dashboardService";
import EmptyState from "../components/common/EmptyState";

const dummyAlerts = [
  {
    id: 1,
    type: "Critical",
    message: "Transformer overload detected in North Zone.",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "Warning",
    message: "Voltage fluctuation detected in East Zone.",
    time: "10 min ago",
  },
  {
    id: 3,
    type: "Success",
    message: "Scheduled maintenance completed successfully.",
    time: "30 min ago",
  },
];

export default function AlertPanel() {

  const { data, loading, error } = useApi(() =>
    dashboardService.getAlerts()
  );

  const alerts =
    Array.isArray(data) && data.length > 0 ? data : dummyAlerts;

  if (loading) {
    return (
      <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 animate-pulse h-[420px]" />
    );
  }

  if (!alerts || alerts.length === 0) {

  return (

    <EmptyState

      title="No Alerts"

      message="Grid is operating normally."

    />

  );

}

  if (error) {
    console.warn("Alert API unavailable. Using dummy alerts.");
  }

  const getAlertStyle = (type) => {

    switch (type) {

      case "Critical":
        return {
          icon: <FaExclamationTriangle className="text-red-400" />,
          border: "border-red-500",
        };

      case "Warning":
      case "High":
        return {
          icon: <FaExclamationTriangle className="text-yellow-400" />,
          border: "border-yellow-500",
        };

      case "Success":
        return {
          icon: <FaCheckCircle className="text-green-400" />,
          border: "border-green-500",
        };

      default:
        return {
          icon: <FaInfoCircle className="text-blue-400" />,
          border: "border-blue-500",
        };

    }

  };

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 h-full">

      <h2 className="text-xl font-semibold text-white mb-6">
        Live Alerts
      </h2>

      <div className="space-y-4">

        {alerts.map((alert, index) => {

          const { icon, border } = getAlertStyle(alert.type);

          return (

            <div
              key={alert.id || index}
              className={`border-l-4 ${border} bg-slate-900 rounded-xl p-4`}
            >

              <div className="flex items-start gap-3">

                <div className="text-xl mt-1">

                  {icon}

                </div>

                <div className="flex-1">

                  <h3 className="text-white font-medium">

                    {alert.type}

                  </h3>

                  <p className="text-slate-400 text-sm mt-1">

                    {alert.message}

                  </p>

                  <p className="text-xs text-slate-500 mt-2">

                    {alert.time}

                  </p>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}