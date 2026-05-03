import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import ProposalsPage from "@/app/proposals/page";
import ChatPage from "@/app/chat/page";

vi.mock("@/components/layout/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/layout/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("@/components/home/HeroSection", () => ({
  default: () => <div data-testid="hero">Hero</div>,
}));

vi.mock("@/components/home/TrendingSection", () => ({
  default: () => <div data-testid="trending">Trending</div>,
}));

vi.mock("@/components/home/ExploreSection", () => ({
  default: () => <div data-testid="explore">Explore</div>,
}));

vi.mock("@/components/proposals/ProposalsSection", () => ({
  default: () => <div data-testid="proposals-section">Proposals</div>,
}));

vi.mock("@/components/chat/ChatContainer", () => ({
  default: () => <div data-testid="chat-container">Chat</div>,
}));

describe("HomePage", () => {
  it("renders header, main sections, and footer", () => {
    render(<HomePage />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("trending")).toBeInTheDocument();
    expect(screen.getByTestId("explore")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});

describe("ProposalsPage", () => {
  it("renders header, title, proposals section, and footer", () => {
    render(<ProposalsPage />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /iniciativas/i })).toBeInTheDocument();
    expect(screen.getByTestId("proposals-section")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});

describe("ChatPage", () => {
  it("renders header, chat container, and footer", () => {
    render(<ChatPage />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("chat-container")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
