import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination, { getVisiblePages } from "@/components/ui/Pagination";

describe("getVisiblePages", () => {
  it("returns all pages when totalPages <= 7", () => {
    expect(getVisiblePages(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns all pages when totalPages is exactly 7", () => {
    expect(getVisiblePages(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("shows ellipsis for large page counts near the start", () => {
    const pages = getVisiblePages(2, 20);
    expect(pages).toEqual([1, 2, 3, 4, 5, "...", 20]);
  });

  it("shows ellipsis for large page counts near the end", () => {
    const pages = getVisiblePages(19, 20);
    expect(pages).toEqual([1, "...", 16, 17, 18, 20]);
  });

  it("shows both ellipses for large page counts in the middle", () => {
    const pages = getVisiblePages(10, 20);
    expect(pages).toEqual([1, "...", 7, 8, 9, 10, 11, 12, 13, "...", 20]);
  });

  it("handles transition from no ellipsis to left ellipsis", () => {
    expect(getVisiblePages(5, 20)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, "...", 20]);
  });

  it("includes adjacent pages when near boundaries", () => {
    expect(getVisiblePages(3, 20)).toEqual([1, 2, 3, 4, 5, 6, "...", 20]);
  });
});

describe("Pagination", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when totalPages is 0", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("disables the previous button on page 1", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    const prevButton = screen.getAllByRole("button")[0];
    expect(prevButton).toBeDisabled();
  });

  it("disables the next button on the last page", () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[buttons.length - 1];
    expect(nextButton).toBeDisabled();
  });

  it("calls onPageChange when clicking a page number", () => {
    const handlePageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with previous page when clicking prev", () => {
    const handlePageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />);
    const prevButton = screen.getAllByRole("button")[0];
    fireEvent.click(prevButton);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with next page when clicking next", () => {
    const handlePageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />);
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[buttons.length - 1];
    fireEvent.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it("highlights the current page", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
    const currentPageButton = screen.getByRole("button", { name: "3" });
    expect(currentPageButton).toHaveClass("bg-primary-container");
  });

  it("renders ellipsis for large page counts", () => {
    render(<Pagination currentPage={10} totalPages={20} onPageChange={() => {}} />);
    expect(screen.getAllByText("...").length).toBeGreaterThanOrEqual(2);
  });
});
