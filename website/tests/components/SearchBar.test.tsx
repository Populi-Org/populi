import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "@/components/ui/SearchBar";

describe("SearchBar", () => {
  it("renders the default placeholder", () => {
    render(
      <SearchBar
        value=""
        onChange={() => {}}
        onSearch={() => {}}
        onFilterToggle={() => {}}
        filtersVisible={false}
      />,
    );
    expect(screen.getByPlaceholderText("Pesquisar...")).toBeInTheDocument();
  });

  it("renders a custom placeholder", () => {
    render(
      <SearchBar
        placeholder="Custom placeholder"
        value=""
        onChange={() => {}}
        onSearch={() => {}}
        onFilterToggle={() => {}}
        filtersVisible={false}
      />,
    );
    expect(
      screen.getByPlaceholderText("Custom placeholder"),
    ).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const handleChange = vi.fn();
    render(
      <SearchBar
        value=""
        onChange={handleChange}
        onSearch={() => {}}
        onFilterToggle={() => {}}
        filtersVisible={false}
      />,
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hello" },
    });
    expect(handleChange).toHaveBeenCalledWith("hello");
  });

  it("calls onSearch when Enter key is pressed", () => {
    const handleSearch = vi.fn();
    render(
      <SearchBar
        value=""
        onChange={() => {}}
        onSearch={handleSearch}
        onFilterToggle={() => {}}
        filtersVisible={false}
      />,
    );
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it("calls onSearch when search button is clicked", () => {
    const handleSearch = vi.fn();
    render(
      <SearchBar
        value=""
        onChange={() => {}}
        onSearch={handleSearch}
        onFilterToggle={() => {}}
        filtersVisible={false}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /pesquisar/i }));
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it("calls onFilterToggle when filter button is clicked", () => {
    const handleFilterToggle = vi.fn();
    render(
      <SearchBar
        value=""
        onChange={() => {}}
        onSearch={() => {}}
        onFilterToggle={handleFilterToggle}
        filtersVisible={false}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /filtrar/i }));
    expect(handleFilterToggle).toHaveBeenCalledTimes(1);
  });

  it("displays the current value", () => {
    render(
      <SearchBar
        value="current query"
        onChange={() => {}}
        onSearch={() => {}}
        onFilterToggle={() => {}}
        filtersVisible={false}
      />,
    );
    expect(screen.getByRole("textbox")).toHaveValue("current query");
  });
});
