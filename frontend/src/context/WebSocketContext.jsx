import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import websocket from "../services/websocket";

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const [liveData, setLiveData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    websocket.connect(
      // Message Received
      (data) => {
        setLiveData(data);
      },

      // Connected
      () => {
        console.log("✅ WebSocket Connected");
        setConnected(true);

        toast.success("Connected to Live Server", {
          id: "ws-connected",
        });
      },

      // Closed
      () => {
        console.log("❌ WebSocket Disconnected");
        setConnected(false);

        toast.error("Disconnected from Live Server", {
          id: "ws-disconnected",
        });
      },

      // Error
      () => {
        console.log("⚠️ WebSocket Error");
        setConnected(false);

        toast.error("WebSocket Connection Error", {
          id: "ws-error",
        });
      }
    );

    return () => {
      websocket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        liveData,
        connected,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  return useContext(WebSocketContext);
}