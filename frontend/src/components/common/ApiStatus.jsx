import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ApiStatus() {
  const [status, setStatus] = useState("Checking...");
  const [color, setColor] = useState("text-yellow-400");

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await api.get("/");

        if (response.status === 200) {
          setStatus("Backend Connected");
          setColor("text-green-400");
        }
      } catch (error) {
        setStatus("Backend Offline");
        setColor("text-red-400");
      }
    };

    checkApi();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color.replace("text", "bg")}`}></div>

      <span className={`text-sm font-medium ${color}`}>
        {status}
      </span>
    </div>
  );
}