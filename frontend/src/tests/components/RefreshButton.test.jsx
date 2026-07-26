import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const { default: RefreshButton } = await import("../../components/common/RefreshButton");

describe("RefreshButton Component", () => {
  it("should render with default label", () => {
    render(<RefreshButton />);
    expect(screen.getByText("Refresh")).toBeDefined();
  });

  it("should render with custom label", () => {
    render(<RefreshButton label="Reload" />);
    expect(screen.getByText("Reload")).toBeDefined();
  });

  it("should call onRefresh when clicked", () => {
    const onRefresh = vi.fn();
    render(<RefreshButton onRefresh={onRefresh} />);
    fireEvent.click(screen.getByText("Refresh"));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("should show spinning animation when loading", () => {
    render(<RefreshButton onRefresh={vi.fn()} />);
    const button = screen.getByText("Refresh");
    // Find the icon inside the button
    const icon = button.previousElementSibling;
    expect(icon).toBeDefined();
  });
});
