import { describe, it, expect } from "vitest";

describe("Constants", () => {
  it("should export APP_NAME", async () => {
    const { APP_NAME } = await import("../../utils/constants");
    expect(APP_NAME).toBeDefined();
    expect(typeof APP_NAME).toBe("string");
    expect(APP_NAME.length).toBeGreaterThan(0);
  });

  it("should export APP_VERSION", async () => {
    const { APP_VERSION } = await import("../../utils/constants");
    expect(APP_VERSION).toBeDefined();
    expect(typeof APP_VERSION).toBe("string");
  });

  it("should export ROUTES object", async () => {
    const { ROUTES } = await import("../../utils/constants");
    expect(ROUTES).toBeDefined();
    expect(ROUTES.HOME).toBe("/");
    expect(ROUTES.DASHBOARD).toBe("/dashboard");
    expect(ROUTES.LOGIN).toBe("/login");
    expect(ROUTES.MONITORING).toBe("/monitoring");
    expect(ROUTES.ANALYTICS).toBe("/analytics");
    expect(ROUTES.SETTINGS).toBe("/settings");
  });
});
