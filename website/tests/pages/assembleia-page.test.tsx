import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AssembleiaPage from "@/app/assembly/page";

vi.mock("@/components/layout/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/layout/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("@/app/assembly/CompositionSvg", () => ({
  default: () => <div data-testid="composition-svg">SVG</div>,
}));

describe("AssembleiaPage", () => {
  it("renders header, title, and footer", () => {
    render(<AssembleiaPage />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /assembleia/i })).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders the composition SVG", () => {
    render(<AssembleiaPage />);
    expect(screen.getByTestId("composition-svg")).toBeInTheDocument();
  });

  it("renders total seats count", () => {
    render(<AssembleiaPage />);
    expect(screen.getByText("230 deputados")).toBeInTheDocument();
  });

  it("renders all party cards", () => {
    render(<AssembleiaPage />);
    expect(screen.getByText("PSD")).toBeInTheDocument();
    expect(screen.getByText("CH")).toBeInTheDocument();
    expect(screen.getByText("PS")).toBeInTheDocument();
    expect(screen.getByText("IL")).toBeInTheDocument();
    expect(screen.getByText("L")).toBeInTheDocument();
    expect(screen.getByText("PCP")).toBeInTheDocument();
    expect(screen.getByText("CDS")).toBeInTheDocument();
    expect(screen.getByText("BE")).toBeInTheDocument();
    expect(screen.getByText("PAN")).toBeInTheDocument();
    expect(screen.getByText("JPP")).toBeInTheDocument();
  });

  it("renders correct seat counts", () => {
    render(<AssembleiaPage />);
    expect(screen.getByText("89 deputados")).toBeInTheDocument();
    expect(screen.getByText("60 deputados")).toBeInTheDocument();
    expect(screen.getByText("58 deputados")).toBeInTheDocument();
    expect(screen.getByText("9 deputados")).toBeInTheDocument();
    expect(screen.getByText("6 deputados")).toBeInTheDocument();
    expect(screen.getByText("3 deputados")).toBeInTheDocument();
    expect(screen.getByText("2 deputados")).toBeInTheDocument();
    expect(screen.getAllByText("1 deputado").length).toBe(3);
  });

  it("renders correct party names", () => {
    render(<AssembleiaPage />);
    expect(screen.getByText("Partido Social Democrata")).toBeInTheDocument();
    expect(screen.getByText("Partido Socialista")).toBeInTheDocument();
    expect(screen.getByText("Chega")).toBeInTheDocument();
    expect(screen.getByText("Iniciativa Liberal")).toBeInTheDocument();
    expect(screen.getByText("Livre")).toBeInTheDocument();
  });

  it("renders percentage labels", () => {
    render(<AssembleiaPage />);
    expect(screen.getByText("39%")).toBeInTheDocument();
    expect(screen.getByText("26%")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("renders singular 'deputado' for parties with 1 seat", () => {
    render(<AssembleiaPage />);
    const singularLabels = screen.getAllByText("1 deputado");
    expect(singularLabels.length).toBe(3);
  });

  it("renders plural 'deputados' for parties with more than 1 seat", () => {
    render(<AssembleiaPage />);
    expect(screen.getByText("89 deputados")).toBeInTheDocument();
    expect(screen.getByText("60 deputados")).toBeInTheDocument();
    expect(screen.getByText("58 deputados")).toBeInTheDocument();
  });
});
