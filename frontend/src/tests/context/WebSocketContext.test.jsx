import { describe, it, expect, vi, beforeAll } from "vitest";
import { render } from "@testing-library/react";

// Mock the websocket service
vi.mock("../../services/websocket", () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn(),
  },
}));

import websocket from "../../services/websocket";

describe("WebSocketContext", () => {
  let WebSocketProvider, useWebSocketContext;

  beforeAll(async () => {
    const module = await import("../../context/WebSocketContext");
    WebSocketProvider = module.WebSocketProvider;
    useWebSocketContext = module.useWebSocketContext;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function TestComponent() {
    const { liveData, connected } = useWebSocketContext();
    return (
      <div>
        <span data-testid="connected">{connected ? "true" : "false"}</span>
        <span data-testid="live-data">{liveData ? JSON.stringify(liveData) : "null"}</span>
      </div>
    );
  }

  it("should provide initial values", () => {
    const { getByTestId } = render(
      <WebSocketProvider>
        <TestComponent />
      </WebSocketProvider>
    );

    expect(getByTestId("connected").textContent).toBe("false");
    expect(getByTestId("live-data").textContent).toBe("null");
  });

  it("should connect on mount", () => {
    render(
      <WebSocketProvider>
        <TestComponent />
      </WebSocketProvider>
    );

    expect(websocket.connect).toHaveBeenCalledTimes(1);
    expect(websocket.connect).toHaveBeenCalledWith(
      expect.any(Function),  // onMessage
      expect.any(Function),  // onOpen
      expect.any(Function),  // onClose
      expect.any(Function),  // onError
    );
  });

  it("should disconnect on unmount", () => {
    const { unmount } = render(
      <WebSocketProvider>
        <TestComponent />
      </WebSocketProvider>
    );

    unmount();
    expect(websocket.disconnect).toHaveBeenCalledTimes(1);
  });
});
