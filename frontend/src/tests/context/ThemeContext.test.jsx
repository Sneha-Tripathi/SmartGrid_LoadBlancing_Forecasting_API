import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("ThemeContext", () => {
  let ThemeProvider, useTheme;

  beforeAll(async () => {
    const module = await import("../../context/ThemeContext");
    ThemeProvider = module.ThemeProvider;
    useTheme = module.useTheme;
  });

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  function TestComponent() {
    const { theme, toggleTheme } = useTheme();
    return (
      <div>
        <span data-testid="theme-value">{theme}</span>
        <button data-testid="toggle-btn" onClick={toggleTheme}>Toggle</button>
      </div>
    );
  }

  it("should default to dark theme", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme-value").textContent).toBe("dark");
  });

  it("should toggle theme from dark to light", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    await userEvent.click(screen.getByTestId("toggle-btn"));
    expect(screen.getByTestId("theme-value").textContent).toBe("light");
  });

  it("should toggle theme back to dark", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await userEvent.click(screen.getByTestId("toggle-btn"));
    await userEvent.click(screen.getByTestId("toggle-btn"));
    expect(screen.getByTestId("theme-value").textContent).toBe("dark");
  });

  it("should persist theme to localStorage", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await userEvent.click(screen.getByTestId("toggle-btn"));
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("should update data-theme attribute on document", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    await userEvent.click(screen.getByTestId("toggle-btn"));
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });
});
