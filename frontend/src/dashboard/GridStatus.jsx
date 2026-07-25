import {
  FaServer,
  FaWifi,
  FaRobot,
  FaDatabase,
} from "react-icons/fa";

import useApi from "../hooks/useApi";
import systemService from "../services/systemService";
import { useWebSocketContext } from "../context/WebSocketContext";

export default function GridStatus() {

  const { connected } = useWebSocketContext();

  const { data } = useApi(() =>
    systemService.getSystemStatus()
  );

  const status = [
    {
      title: "Backend",
      value: data?.backend ?? "Online",
      icon: FaServer,
      color:
        data?.backend === "Online"
          ? "text-green-400"
          : "text-red-400",
    },
    {
      title: "WebSocket",
      value: connected ? "Connected" : "Disconnected",
      icon: FaWifi,
      color: connected
        ? "text-cyan-400"
        : "text-red-400",
    },
    {
      title: "AI Engine",
      value: data?.ai ?? "Running",
      icon: FaRobot,
      color: "text-purple-400",
    },
    {
      title: "Database",
      value: data?.database ?? "Connected",
      icon: FaDatabase,
      color: "text-yellow-400",
    },
  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {status.map((item, index) => {

        const Icon = item.icon;

        return (

          <div
            key={index}
            className="
            bg-[#101827]
            border
            border-slate-800
            rounded-2xl
            p-6
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-400 text-sm">

                  {item.title}

                </p>

                <h2
                  className={`text-xl font-bold mt-2 ${item.color}`}
                >
                  {item.value}
                </h2>

              </div>

              <Icon
                className={`text-3xl ${item.color}`}
              />

            </div>

          </div>

        );

      })}

    </div>

  );

}