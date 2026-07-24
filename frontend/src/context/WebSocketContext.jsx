import { createContext, useContext, useEffect, useState } from "react";
import websocket from "../services/websocket";

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const [liveData, setLiveData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    websocket.connect(
      (data) => {
        setLiveData(data);
      },
      () => setConnected(true),
      () => setConnected(false),
      () => setConnected(false)
    );

    //return () => websocket.disconnect();
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