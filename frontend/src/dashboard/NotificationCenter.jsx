import { memo, useEffect, useState } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import { useWebSocketContext } from "../context/WebSocketContext";

const MAX_NOTIFICATIONS = 10;

const NotificationCenter = memo(function NotificationCenter() {
  const { liveData } = useWebSocketContext();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!liveData) return;

    const notification = {
      id: Date.now(),
      status: liveData.status,
      message: liveData.alert,
      time: liveData.timestamp,
    };

    setNotifications((prev) => [notification, ...prev.slice(0, MAX_NOTIFICATIONS - 1)]);
  }, [liveData]);

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaBell className="text-cyan-400 text-xl" />
        <h2 className="text-xl font-semibold text-white">Live Notifications</h2>
      </div>

      {notifications.length === 0 ? (
        <p className="text-slate-400">Waiting for live alerts...</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="bg-[#0B1220] border border-slate-700 rounded-xl p-4 flex justify-between items-center"
            >
              <div className="flex gap-3">
                {item.status === "Critical" ? (
                  <FaExclamationTriangle className="text-red-500 mt-1" />
                ) : item.status === "Warning" ? (
                  <FaExclamationTriangle className="text-yellow-400 mt-1" />
                ) : (
                  <FaCheckCircle className="text-green-400 mt-1" />
                )}
                <div>
                  <p className="text-white font-medium">{item.message}</p>
                  <p className="text-sm text-slate-400">{item.status}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">{item.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default NotificationCenter;
