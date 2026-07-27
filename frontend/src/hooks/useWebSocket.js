import { useEffect, useState } from "react";

import websocketService from "../services/websocket";

export default function useWebSocket() {

  const [data, setData] = useState(null);

  const [connected, setConnected] = useState(false);

  useEffect(() => {

    websocketService.connect(

      (message) => {

        setData(message);

      },

      () => {

        setConnected(true);

      },

      () => {

        setConnected(false);

      },

      () => {

        setConnected(false);

      }

    );

    return () => {

      websocketService.disconnect();

    };

  }, []);

  return {

    data,

    connected,

  };

}