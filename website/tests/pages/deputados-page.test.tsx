import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AssemblyPage from "@/app/deputy/page";

vi.mock("@/components/layout/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/layout/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("@/components/assembly/AssemblySection", () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="assembly-section">
      <span data-testid="initial-search">{String(props.initialSearch)}</span>
      <span data-testid="initial-constituency">{String(props.initialConstituency)}</span>
      <span data-testid="initial-party">{String(props.initialParty)}</span>
      <span data-testid="initial-theme">{String(props.initialTheme)}</span>
      <span data-testid="initial-filters-visible">{String(props.initialFiltersVisible)}</span>
    </div>
  ),
}));

describe("AssemblyPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default empty props", async () => {
    const page = await AssemblyPage({});
    render(page);

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("assembly-section")).toBeInTheDocument();
    expect(screen.getByTestId("initial-search").textContent).toBe("");
    expect(screen.getByTestId("initial-filters-visible").textContent).toBe("false");
  });

  it("passes search param to AssemblySection", async () => {
    const page = await AssemblyPage({
      searchParams: Promise.resolve({ search: "Silva" }),
    });
    render(page);

    expect(screen.getByTestId("initial-search").textContent).toBe("Silva");
    expect(screen.getByTestId("initial-filters-visible").textContent).toBe("true");
  });

  it("passes party param to AssemblySection", async () => {
    const page = await AssemblyPage({
      searchParams: Promise.resolve({ party: "PS" }),
    });
    render(page);

    expect(screen.getByTestId("initial-party").textContent).toBe("PS");
    expect(screen.getByTestId("initial-filters-visible").textContent).toBe("true");
  });

  it("passes constituency param to AssemblySection", async () => {
    const page = await AssemblyPage({
      searchParams: Promise.resolve({ constituency: "Lisboa" }),
    });
    render(page);

    expect(screen.getByTestId("initial-constituency").textContent).toBe("Lisboa");
  });

  it("passes theme param to AssemblySection", async () => {
    const page = await AssemblyPage({
      searchParams: Promise.resolve({ theme: "education" }),
    });
    render(page);

    expect(screen.getByTestId("initial-theme").textContent).toBe("education");
  });

  it("shows filters when filters param is present", async () => {
    const page = await AssemblyPage({
      searchParams: Promise.resolve({ filters: "true" }),
    });
    render(page);

    expect(screen.getByTestId("initial-filters-visible").textContent).toBe("true");
  });

  it("shows filters when since param is present", async () => {
    const page = await AssemblyPage({
      searchParams: Promise.resolve({ since: "2020" }),
    });
    render(page);

    expect(screen.getByTestId("initial-filters-visible").textContent).toBe("true");
  });

  it("hides filters when no params are present", async () => {
    const page = await AssemblyPage({
      searchParams: Promise.resolve({}),
    });
    render(page);

    expect(screen.getByTestId("initial-filters-visible").textContent).toBe("false");
  });

  it("handles non-promise searchParams", async () => {
    const page = await AssemblyPage({
      searchParams: { search: "test", party: "PSD" },
    });
    render(page);

    expect(screen.getByTestId("initial-search").textContent).toBe("test");
    expect(screen.getByTestId("initial-party").textContent).toBe("PSD");
  });
});
