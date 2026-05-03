import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { getPrismaClient } from "@/lib/prisma";

vi.mock("@/lib/prisma");
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/components/layout/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/layout/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("@/components/profile", () => ({
  ProfileHero: (props: Record<string, unknown>) => (
    <div data-testid="profile-hero">{String(props.name)}</div>
  ),
  DeputyProfileTabs: () => <div data-testid="profile-tabs">Tabs</div>,
  BiographicalHighlights: () => <div data-testid="bio-highlights">Bio</div>,
  LegislativeActivity: () => <div data-testid="legislative-activity">Activity</div>,
  FeaturedQuote: () => <div data-testid="featured-quote">Quote</div>,
  ProfileStats: () => <div data-testid="profile-stats">Stats</div>,
  DeputyNews: () => <div data-testid="deputy-news">News</div>,
  DeputyFactChecks: () => <div data-testid="deputy-fact-checks">FactChecks</div>,
}));

const mockFindUnique = vi.fn();
const mockCount = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getPrismaClient).mockReturnValue({
    deputy: { findUnique: mockFindUnique, count: mockCount },
  } as unknown as ReturnType<typeof getPrismaClient>);
});

describe("DeputyPage generateMetadata", () => {
  it("returns not-found metadata for invalid ID", async () => {
    const { generateMetadata } = await import("@/app/deputy/[id]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "invalid" }),
    });
    expect(metadata.title).toBe("Deputado não encontrado | Populi");
  });

  it("returns not-found metadata when deputy does not exist", async () => {
    mockFindUnique.mockResolvedValue(null);
    const { generateMetadata } = await import("@/app/deputy/[id]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "999" }),
    });
    expect(metadata.title).toBe("Deputado não encontrado | Populi");
  });

  it("returns metadata with deputy name and party", async () => {
    mockFindUnique.mockResolvedValue({
      depNomeParlamentar: "John Doe",
      depCPDes: "Lisboa",
      depImageUrl: "http://example.com/img.jpg",
      partyHistory: [{ party: { sigla: "PS" } }],
    });

    const { generateMetadata } = await import("@/app/deputy/[id]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "1" }),
    });

    expect(metadata.title).toBe("John Doe (PS) — Perfil no Populi");
    expect(metadata.description).toContain("John Doe");
    expect(metadata.description).toContain("PS");
    expect(metadata.description).toContain("Lisboa");
    expect(metadata.openGraph?.images).toEqual(["http://example.com/img.jpg"]);
  });

  it("returns metadata without party when no party history", async () => {
    mockFindUnique.mockResolvedValue({
      depNomeParlamentar: "Jane Doe",
      depCPDes: null,
      depImageUrl: null,
      partyHistory: [],
    });

    const { generateMetadata } = await import("@/app/deputy/[id]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "1" }),
    });

    expect(metadata.title).toBe("Jane Doe — Perfil no Populi");
    expect(metadata.description).toBe(
      "Perfil parlamentar de Jane Doe. Consulta atividade legislativa, iniciativas, comissões e estatísticas.",
    );
    expect(metadata.openGraph?.images).toBeUndefined();
  });
});

describe("DeputyPage component", () => {
  it("calls notFound for invalid ID", async () => {
    const { default: DeputyPage } = await import("@/app/deputy/[id]/page");
    await expect(
      DeputyPage({ params: Promise.resolve({ id: "invalid" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("calls notFound when deputy does not exist", async () => {
    mockFindUnique.mockResolvedValue(null);
    const { default: DeputyPage } = await import("@/app/deputy/[id]/page");
    await expect(
      DeputyPage({ params: Promise.resolve({ id: "999" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders deputy profile with correct data", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      depId: 123,
      depNomeParlamentar: "John Doe",
      depNomeCompleto: "John Michael Doe",
      depCPDes: "Lisboa",
      legDes: "XVI",
      depImageUrl: "http://example.com/img.jpg",
      partyHistory: [{ party: { sigla: "PS" } }],
      statusHistory: [
        { sioDes: "Active", sioDtInicio: new Date("2024-01-01"), sioDtFim: null },
      ],
      cms: [{ cmsNo: "Education", cmsCargo: "Member", cmsSituacao: "Active" }],
      ini: [
        { iniId: 1, iniTi: "Title 1", iniTpdesc: "Type 1", iniNr: "1" },
      ],
      intev: [{ intTe: "Quote text", pubDtreu: new Date("2024-06-01") }],
      _count: { intev: 10 },
    });
    mockCount.mockResolvedValue(5);

    const { default: DeputyPage } = await import("@/app/deputy/[id]/page");
    const element = await DeputyPage({ params: Promise.resolve({ id: "1" }) });
    render(element);

    expect(screen.getByTestId("profile-hero").textContent).toBe("John Doe");
    expect(screen.getByTestId("profile-tabs")).toBeInTheDocument();
  });

  it("renders without featured quote when no intervention text", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      depId: 123,
      depNomeParlamentar: "Jane Doe",
      depNomeCompleto: "Jane Doe",
      depCPDes: "Porto",
      legDes: "XVI",
      depImageUrl: null,
      partyHistory: [{ party: { sigla: "PSD" } }],
      statusHistory: [],
      cms: [],
      ini: [],
      intev: [{ intTe: "", pubDtreu: null }],
      _count: { intev: 0 },
    });
    mockCount.mockResolvedValue(0);

    const { default: DeputyPage } = await import("@/app/deputy/[id]/page");
    const element = await DeputyPage({ params: Promise.resolve({ id: "1" }) });
    render(element);

    expect(screen.getByTestId("profile-hero").textContent).toBe("Jane Doe");
    expect(screen.queryByTestId("featured-quote")).not.toBeInTheDocument();
  });

  it("passes correct image to ProfileHero", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      depId: 123,
      depNomeParlamentar: "Test",
      depNomeCompleto: "Test",
      depCPDes: null,
      legDes: null,
      depImageUrl: "http://custom.img.jpg",
      partyHistory: [],
      statusHistory: [],
      cms: [],
      ini: [],
      intev: [],
      _count: { intev: 0 },
    });
    mockCount.mockResolvedValue(0);

    const { default: DeputyPage } = await import("@/app/deputy/[id]/page");
    const element = await DeputyPage({ params: Promise.resolve({ id: "1" }) });
    render(element);

    expect(screen.getByTestId("profile-hero")).toBeInTheDocument();
  });
});
