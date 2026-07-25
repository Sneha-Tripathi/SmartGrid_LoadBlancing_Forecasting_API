import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaBolt,
  FaBroadcastTower,
} from "react-icons/fa";

import { useWebSocketContext } from "../context/WebSocketContext";

export default function GridHealthPanel() {
  const { liveData, connected } = useWebSocketContext();

  const status = liveData?.status || "Normal";
  const alert = liveData?.alert || "Grid Operating Normally";

  const statusColor =
    status === "Critical"
      ? "text-red-400"
      : status === "Warning"
      ? "text-yellow-400"
      : "text-green-400";

  const icon =
    status === "Critical" ? (
      <FaExclamationTriangle className="text-red-400 text-3xl" />
    ) : (
      <FaCheckCircle className="text-green-400 text-3xl" />
    );

  return (
    <section className="mt-8">
      <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-semibold text-white">
            Smart Grid Health
          </h2>

          {icon}

        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">

          <div>
            <p className="text-slate-400 text-sm">
              Grid Status
            </p>

            <h3 className={`text-2xl font-bold mt-2 ${statusColor}`}>
              {status}
            </h3>
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              Connection
            </p>

            <div className="flex items-center gap-2 mt-2">

              <FaBroadcastTower
                className={
                  connected
                    ? "text-green-400"
                    : "text-red-400"
                }
              />

              <span className="text-white">

                {connected ? "Connected" : "Disconnected"}

              </span>

            </div>
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              Current Alert
            </p>

            <div className="flex items-center gap-2 mt-2">

              <FaBolt className="text-cyan-400" />

              <span className="text-white">
                {alert}
              </span>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}