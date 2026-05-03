import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactPage from "@/app/contact/page";
import FaqPage from "@/app/faq/page";
import PrivacyPage from "@/app/privacy/page";

vi.mock("@/components/layout/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/layout/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("@/components/contact/ContactForm", () => ({
  default: () => <form data-testid="contact-form">Contact Form</form>,
}));

describe("ContactPage", () => {
  it("renders all contact options", () => {
    render(<ContactPage />);
    expect(screen.getByRole("heading", { name: /contacto/i })).toBeInTheDocument();
    expect(screen.getByText("Correções e fontes")).toBeInTheDocument();
    expect(screen.getByText("Sugestões de melhoria")).toBeInTheDocument();
    expect(screen.getByText("Parcerias e imprensa")).toBeInTheDocument();
    expect(screen.getByText("Questões de privacidade")).toBeInTheDocument();
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
  });

  it("renders the contact description", () => {
    render(<ContactPage />);
    expect(
      screen.getByText(/A Populi cresce com contributos da comunidade/),
    ).toBeInTheDocument();
  });
});

describe("FaqPage", () => {
  it("renders all FAQ items", () => {
    render(<FaqPage />);
    expect(screen.getByRole("heading", { name: /faq/i })).toBeInTheDocument();
    expect(screen.getByText("O que é a Populi?")).toBeInTheDocument();
    expect(screen.getByText("De onde vêm os dados?")).toBeInTheDocument();
    expect(screen.getByText("Posso pedir correções?")).toBeInTheDocument();
  });

  it("renders the correct number of FAQ cards", () => {
    render(<FaqPage />);
    const faqQuestions = screen.getAllByRole("heading", { level: 2 });
    expect(faqQuestions.length).toBeGreaterThanOrEqual(10);
  });
});

describe("PrivacyPage", () => {
  it("renders the privacy title", () => {
    render(<PrivacyPage />);
    expect(
      screen.getByRole("heading", { name: /termos de privacidade/i }),
    ).toBeInTheDocument();
  });

  it("renders all privacy sections", () => {
    render(<PrivacyPage />);
    expect(screen.getByText("O que é este documento")).toBeInTheDocument();
    expect(screen.getByText("Informação pública e fontes")).toBeInTheDocument();
    expect(screen.getByText("Dados pessoais dos utilizadores")).toBeInTheDocument();
    expect(screen.getByText("Segurança")).toBeInTheDocument();
    expect(screen.getByText("Alterações")).toBeInTheDocument();
  });

  it("renders the last updated date", () => {
    render(<PrivacyPage />);
    expect(screen.getByText(/Última atualização:/)).toBeInTheDocument();
  });
});
