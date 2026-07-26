import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

const { default: EmptyState } = await import("../../components/common/EmptyState");

describe("EmptyState Component", () => {
  it("should render default title and description", () => {
    render(<EmptyState />);
    expect(screen.getByText("No Data Available")).toBeDefined();
    expect(screen.getByText("No records found.")).toBeDefined();
  });

  it("should render custom title", () => {
    render(<EmptyState title="Custom Title" />);
    expect(screen.getByText("Custom Title")).toBeDefined();
  });

  it("should render custom description", () => {
    render(<EmptyState description="Custom description text" />);
    expect(screen.getByText("Custom description text")).toBeDefined();
  });

  it("should render action element", () => {
    render(<EmptyState action={<button>Action</button>} />);
    expect(screen.getByText("Action")).toBeDefined();
  });
});
