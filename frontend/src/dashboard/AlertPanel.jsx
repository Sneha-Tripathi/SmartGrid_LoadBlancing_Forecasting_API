import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";

export default function AlertPanel() {
  const { liveData } = useWebSocketContext();

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!liveData) return;

    const message =
      liveData.alert ||
      (liveData.status === "Critical"
        ? "Critical load detected."
        : liveData.status === "Warning"
        ? "Grid load approaching threshold."
        : "Grid operating normally.");

    const newAlert = {
      id: Date.now(),
      status: liveData.status,
      message,
      time: liveData.timestamp,
    };

    setAlerts((prev) => [newAlert, ...prev].slice(0, 6));
  }, [liveData]);

  const getIcon = (status) => {
    switch (status) {
      case "Critical":
        return (
          <FaExclamationTriangle className="text-red-400 text-xl" />
        );

      case "Warning":
        return (
          <FaExclamationTriangle className="text-yellow-400 text-xl" />
        );

      case "Normal":
        return (
          <FaCheckCircle className="text-green-400 text-xl" />
        );

      default:
        return (
          <FaInfoCircle className="text-blue-400 text-xl" />
        );
    }
  };

  const getBorder = (status) => {
    switch (status) {
      case "Critical":
        return "border-red-500";

      case "Warning":
        return "border-yellow-500";

      case "Normal":
        return "border-green-500";

      default:
        return "border-blue-500";
    }
  };

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 h-full">
      <h2 className="text-xl font-semibold text-white mb-6">
        Live Alerts
      </h2>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-slate-400 text-center py-8">
            Waiting for live alerts...
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 ${getBorder(
                alert.status
              )} bg-slate-900 rounded-xl p-4`}
            >
              <div className="flex items-start gap-3">
                {getIcon(alert.status)}

                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-white font-semibold">
                      {alert.status}
                    </h3>

                    <span className="text-xs text-slate-500">
                      {alert.time}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm mt-2">
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}