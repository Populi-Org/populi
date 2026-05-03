import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterChip from "@/components/ui/FilterChip";

describe("FilterChip", () => {
  it("renders the label", () => {
    render(<FilterChip label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("has inactive styling by default", () => {
    render(<FilterChip label="Inactive" />);
    const button = screen.getByRole("button", { name: "Inactive" });
    expect(button).toHaveClass("bg-surface-container-high");
  });

  it("has active styling when active is true", () => {
    render(<FilterChip label="Active" active />);
    const button = screen.getByRole("button", { name: "Active" });
    expect(button).toHaveClass("bg-primary-container");
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<FilterChip label="Clickable" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Clickable" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
