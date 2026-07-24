import useWebSocket from "../../hooks/useWebSocket";

export default function ConnectionBadge() {

  const { connected } = useWebSocket();

  return (

    <div
      className={`px-4 py-2 rounded-full text-sm font-medium
      ${
        connected
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400"
      }`}
    >

      {connected ? "🟢 Live" : "🔴 Offline"}

    </div>

  );

}