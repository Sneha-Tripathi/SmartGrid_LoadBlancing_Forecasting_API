import { memo } from "react";
import {
  FaBolt,
  FaClock,
  FaHeartbeat,
  FaWifi,
} from "react-icons/fa";

import { useWebSocketContext } from "../context/WebSocketContext";

const LiveStatistics = memo(function LiveStatistics() {
  const { liveData, connected } = useWebSocketContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
      {/* Status */}
      <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-slate-400">Grid Status</h3>
          <FaBolt className="text-yellow-400 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-white mt-4">
          {liveData?.status ?? "--"}
        </h2>
      </div>

      {/* Alert */}
      <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-slate-400">Current Alert</h3>
          <FaHeartbeat className="text-red-400 text-xl" />
        </div>
        <p className="text-white mt-4 font-semibold">
          {liveData?.alert ?? "No Alerts"}
        </p>
      </div>

      {/* Last Update */}
      <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-slate-400">Last Update</h3>
          <FaClock className="text-cyan-400 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-white mt-4">
          {liveData?.timestamp ?? "--"}
        </h2>
      </div>

      {/* Connection */}
      <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-slate-400">Connection</h3>
          <FaWifi className={`text-xl ${connected ? "text-green-400" : "text-red-400"}`} />
        </div>
        <h2 className={`text-2xl font-bold mt-4 ${connected ? "text-green-400" : "text-red-400"}`}>
          {connected ? "Online" : "Offline"}
        </h2>
      </div>
    </div>
  );
});

export default LiveStatistics;
