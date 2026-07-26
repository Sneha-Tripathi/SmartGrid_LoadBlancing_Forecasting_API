import { memo } from "react";
import useWebSocket from "../../hooks/useWebSocket";

const ConnectionBadge = memo(function ConnectionBadge() {
  const { connected } = useWebSocket();

  return (
    <div
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-out ${
        connected
          ? "bg-green-500/20 text-green-400 animate-fadeInScale"
          : "bg-red-500/20 text-red-400"
      }`}
      role="status"
      aria-live="polite"
      aria-label={connected ? "Connected to server" : "Disconnected from server"}
    >
      <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
      {connected ? "Live" : "Offline"}
    </div>
  );
});

export default ConnectionBadge;
