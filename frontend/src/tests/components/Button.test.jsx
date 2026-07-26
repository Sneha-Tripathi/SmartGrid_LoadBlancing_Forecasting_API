import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

const { default: Button } = await import("../../components/common/Button");

describe("Button Component", () => {
  it("should render children", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeDefined();
  });

  it("should use primary variant by default", () => {
    const { container } = render(<Button>Primary</Button>);
    const button = container.querySelector("button");
    expect(button.className).toContain("teal");
  });

  it("should apply outline variant classes", () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const button = container.querySelector("button");
    expect(button.className).toContain("border");
  });

  it("should apply custom className", () => {
    const { container } = render(<Button className="custom-class">Custom</Button>);
    const button = container.querySelector("button");
    expect(button.className).toContain("custom-class");
  });

  it("should have type button by default", () => {
    render(<Button>Default Type</Button>);
    expect(screen.getByText("Default Type").getAttribute("type")).toBe("button");
  });

  it("should accept type prop", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByText("Submit").getAttribute("type")).toBe("submit");
  });
});
