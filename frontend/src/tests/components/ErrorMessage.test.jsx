import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const { default: ErrorMessage } = await import("../../components/common/ErrorMessage");

describe("ErrorMessage Component", () => {
  it("should render default title and message", () => {
    render(<ErrorMessage />);
    expect(screen.getByText("Something went wrong")).toBeDefined();
    expect(screen.getByText("Unable to load data.")).toBeDefined();
  });

  it("should render custom title", () => {
    render(<ErrorMessage title="Custom Error" />);
    expect(screen.getByText("Custom Error")).toBeDefined();
  });

  it("should render custom message", () => {
    render(<ErrorMessage message="Custom error message" />);
    expect(screen.getByText("Custom error message")).toBeDefined();
  });

  it("should call onRetry when retry button is clicked", () => {
    const onRetry = vi.fn();
    render(<ErrorMessage onRetry={onRetry} />);
    fireEvent.click(screen.getByText("Try Again"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("should not render retry button when onRetry is not provided", () => {
    render(<ErrorMessage />);
    expect(screen.queryByText("Try Again")).toBeNull();
  });
});
