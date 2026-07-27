import { useEffect, useState, memo } from "react";
import api from "../../services/api";

const ApiStatus = memo(function ApiStatus() {
  const [status, setStatus] = useState("Checking...");
  const [color, setColor] = useState("text-yellow-400");

  useEffect(() => {
    let mounted = true;

    const checkApi = async () => {
      try {
        const response = await api.get("/");

        if (mounted) {
          if (response.status === 200) {
            setStatus("Backend Connected");
            setColor("text-green-400");
          }
        }
      } catch (error) {
        if (mounted) {
          setStatus("Backend Offline");
          setColor("text-red-400");
        }
      }
    };

    checkApi();
    return () => { mounted = false; };
  }, []);

  return (
    <div
      className="flex items-center gap-2 animate-fadeIn"
      role="status"
      aria-live="polite"
    >
      <span
        className={`relative flex w-3 h-3 ${status === "Checking..." ? "animate-pulseSoft" : ""}`}
      >
        <span
          className={`absolute inset-0 rounded-full ${
            color === "text-green-400"
              ? "bg-green-400 animate-ping opacity-30"
              : color === "text-red-400"
              ? "bg-red-400"
              : "bg-yellow-400"
          }`}
        />
        <span className={`absolute inset-0 rounded-full ${color.replace("text", "bg")}`} />
      </span>
      <span className={`text-sm font-medium transition-colors duration-500 ${color}`}>
        {status}
      </span>
    </div>
  );
});

export default ApiStatus;
