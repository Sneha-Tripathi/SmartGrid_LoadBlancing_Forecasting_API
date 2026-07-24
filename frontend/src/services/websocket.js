class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectTimer = null;
    this.url = "ws://127.0.0.1:8000/ws";
  }

  connect(onMessage, onOpen, onClose, onError) {

    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("✅ WebSocket Connected");
      onOpen?.();
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    };

    this.socket.onerror = (error) => {
      console.error("❌ WebSocket Error", error);
      onError?.(error);
    };

    this.socket.onclose = () => {

      console.log("🔌 WebSocket Closed");

      this.socket = null;

      onClose?.();

      // Auto Reconnect after 3 seconds
      clearTimeout(this.reconnectTimer);

      this.reconnectTimer = setTimeout(() => {

        console.log("🔄 Reconnecting...");

        this.connect(
          onMessage,
          onOpen,
          onClose,
          onError
        );

      }, 3000);

    };
  }

  disconnect() {

    clearTimeout(this.reconnectTimer);

    if (this.socket) {

      this.socket.close();

      this.socket = null;

    }

  }

}

export default new WebSocketService();