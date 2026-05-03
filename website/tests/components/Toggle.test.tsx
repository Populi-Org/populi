import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Toggle from "@/components/ui/Toggle";

describe("Toggle", () => {
  it("renders the label", () => {
    render(<Toggle label="Test Toggle" checked={false} onChange={() => {}} />);
    expect(screen.getByText("Test Toggle")).toBeInTheDocument();
  });

  it("checkbox is unchecked when checked is false", () => {
    render(<Toggle label="Off" checked={false} onChange={() => {}} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("checkbox is checked when checked is true", () => {
    render(<Toggle label="On" checked onChange={() => {}} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onChange with true when toggled on", () => {
    const handleChange = vi.fn();
    render(<Toggle label="Toggle Me" checked={false} onChange={handleChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange with false when toggled off", () => {
    const handleChange = vi.fn();
    render(<Toggle label="Toggle Me" checked onChange={handleChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledWith(false);
  });
});
