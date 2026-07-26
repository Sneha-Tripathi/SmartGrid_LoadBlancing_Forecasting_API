import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock useAuth
vi.mock("../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

import useAuth from "../../hooks/useAuth";

// We need to dynamically import and set up the mock
const mockUseAuth = vi.mocked(useAuth);

describe("ProtectedRoute Component", () => {
  let ProtectedRoute;

  beforeAll(async () => {
    ProtectedRoute = (await import("../../components/auth/ProtectedRoute")).default;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderWithRouter(element) {
    return render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        {element}
      </MemoryRouter>
    );
  }

  it("should show PageLoader when loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      isAuthenticated: false,
    });

    renderWithRouter(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>);
    expect(screen.getByText("Loading Smart Grid Dashboard...")).toBeDefined();
  });

  it("should redirect to login when not authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
    });

    renderWithRouter(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>);
    expect(screen.queryByText("Protected Content")).toBeNull();
  });

  it("should render children when authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: { role: "admin" },
      loading: false,
      isAuthenticated: true,
    });

    renderWithRouter(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>);
    expect(screen.getByText("Protected Content")).toBeDefined();
  });

  it("should render children when user has sufficient role", () => {
    mockUseAuth.mockReturnValue({
      user: { role: "admin" },
      loading: false,
      isAuthenticated: true,
    });

    renderWithRouter(
      <ProtectedRoute requiredRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText("Admin Content")).toBeDefined();
  });
});
