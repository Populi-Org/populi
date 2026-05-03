import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/proposals/route";
import { getPrismaClient } from "@/lib/prisma";
import type { NextRequest } from "next/server";

vi.mock("@/lib/prisma");

const mockQueryRaw = vi.fn();
const mockQueryRawUnsafe = vi.fn();

function createRequest(url: string): NextRequest {
  return new Request(url) as unknown as NextRequest;
}

function mockProposal(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    ini_id: 101,
    ini_nr: "123/2024",
    ini_titulo: "Test Proposal",
    ini_desc_tipo: "Projeto de Lei",
    ini_tipo: "J",
    ini_link_texto: "http://example.com/text",
    author_sigla: "PS",
    author_type: "Deputado",
    vote_resultado: "Aprovado",
    vote_descricao: "Aprovado por maioria",
    last_event_date: new Date("2024-06-01"),
    last_event_fase: "Votação",
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getPrismaClient).mockReturnValue({
    $queryRaw: mockQueryRaw,
    $queryRawUnsafe: mockQueryRawUnsafe,
  } as unknown as ReturnType<typeof getPrismaClient>);
});

describe("GET /api/proposals", () => {
  it("returns proposals with default pagination", async () => {
    mockQueryRawUnsafe.mockImplementation((_query: string, ...args: unknown[]) => {
      if (args.length === 0) {
        return [{ total: 1 }];
      }
      return [mockProposal()];
    });

    const response = await GET(createRequest("http://localhost/api/proposals"));
    const data = await response.json();

    expect(data.proposals).toHaveLength(1);
    expect(data.proposals[0]).toMatchObject({
      id: 1,
      iniId: 101,
      iniNr: "123/2024",
      titulo: "Test Proposal",
      tipoLabel: "Projeto de Lei",
      authorSigla: "PS",
      status: "Aprovado",
    });
    expect(data.pagination).toEqual({
      page: 1,
      limit: 12,
      total: 1,
      totalPages: 1,
    });
  });

  it("filters by search term", async () => {
    mockQueryRawUnsafe.mockImplementation((_query: string, ...args: unknown[]) => {
      if (args.length === 1 && args[0] === "%education%") {
        return [{ total: 0 }];
      }
      return [];
    });

    await GET(createRequest("http://localhost/api/proposals?search=education"));

    const calls = mockQueryRawUnsafe.mock.calls;
    const countCall = calls.find((c) => c[0].includes("COUNT"));
    expect(countCall).toBeDefined();
    expect(countCall![1]).toBe("%education%");
  });

  it("filters by tipo", async () => {
    mockQueryRawUnsafe.mockImplementation((_query: string, ...args: unknown[]) => {
      if (args.length <= 1) {
        return [{ total: 0 }];
      }
      return [];
    });

    await GET(createRequest("http://localhost/api/proposals?tipo=J"));

    const calls = mockQueryRawUnsafe.mock.calls;
    const countCall = calls.find((c) => c[0].includes("COUNT"));
    expect(countCall).toBeDefined();
    expect(countCall![1]).toBe("J");
  });

  it("filters by party using EXISTS subquery", async () => {
    mockQueryRawUnsafe.mockImplementation((_query: string, ...args: unknown[]) => {
      if (args.length <= 1) {
        return [{ total: 0 }];
      }
      return [];
    });

    await GET(createRequest("http://localhost/api/proposals?party=PS"));

    const calls = mockQueryRawUnsafe.mock.calls;
    const countCall = calls.find((c) => c[0].includes("COUNT"));
    expect(countCall).toBeDefined();
    expect(countCall![0]).toContain("EXISTS");
    expect(countCall![0]).toContain("initiative_authors");
  });

  it("filters by resultado", async () => {
    mockQueryRaw.mockResolvedValue([{ id: 5 }, { id: 10 }]);
    mockQueryRawUnsafe.mockImplementation((_query: string, ...args: unknown[]) => {
      if (args.length <= 3) {
        return [{ total: 2 }];
      }
      return [mockProposal({ id: 5 }), mockProposal({ id: 10 })];
    });

    await GET(createRequest("http://localhost/api/proposals?resultado=Aprovado"));

    expect(mockQueryRaw).toHaveBeenCalled();
    const calls = mockQueryRawUnsafe.mock.calls;
    const countCall = calls.find((c) => c[0].includes("COUNT"));
    expect(countCall![0]).toContain("li.id IN");
  });

  it("returns empty result when no resultado matches", async () => {
    mockQueryRaw.mockResolvedValue([]);

    const response = await GET(
      createRequest("http://localhost/api/proposals?resultado=NonExistent"),
    );
    const data = await response.json();

    expect(data.proposals).toEqual([]);
    expect(data.pagination.total).toBe(0);
    expect(mockQueryRawUnsafe).not.toHaveBeenCalled();
  });

  it("respects custom page and limit", async () => {
    mockQueryRawUnsafe.mockImplementation((_query: string, ...args: unknown[]) => {
      if (args.length === 0) {
        return [{ total: 25 }];
      }
      const limit = args[args.length - 2] as number;
      const skip = args[args.length - 1] as number;
      return [mockProposal({ id: skip + 1 })];
    });

    const response = await GET(
      createRequest("http://localhost/api/proposals?page=2&limit=5"),
    );
    const data = await response.json();

    expect(data.pagination).toEqual({
      page: 2,
      limit: 5,
      total: 25,
      totalPages: 5,
    });
  });

  it("caps limit at 50", async () => {
    mockQueryRawUnsafe.mockImplementation((_query: string, ...args: unknown[]) => {
      if (args.length === 0) {
        return [{ total: 100 }];
      }
      const limit = args[args.length - 2] as number;
      expect(limit).toBe(50);
      return [];
    });

    await GET(createRequest("http://localhost/api/proposals?limit=100"));
  });

  it("maps tipo labels correctly", async () => {
    const tipos = [
      { tipo: "R", label: "Projeto de Resolução" },
      { tipo: "J", label: "Projeto de Lei" },
      { tipo: "P", label: "Proposta de Lei" },
      { tipo: "D", label: "Projeto de Deliberação" },
      { tipo: "S", label: "Proposta de Resolução" },
      { tipo: "A", label: "Apreciação Parlamentar" },
      { tipo: "I", label: "Inquérito Parlamentar" },
    ];

    for (const { tipo, label } of tipos) {
      mockQueryRawUnsafe.mockImplementation((_query: string, ...args: unknown[]) => {
        if (args.length === 0) {
          return [{ total: 1 }];
        }
        return [mockProposal({ ini_tipo: tipo })];
      });

      const response = await GET(
        createRequest(`http://localhost/api/proposals?tipo=${tipo}`),
      );
      const data = await response.json();
      expect(data.proposals[0].tipoLabel).toBe(label);
    }
  });

  it("falls back to raw tipo when label not found", async () => {
    mockQueryRawUnsafe.mockImplementation((_query: string, ...args: unknown[]) => {
      if (args.length === 0) {
        return [{ total: 1 }];
      }
      return [mockProposal({ ini_tipo: "X" })];
    });

    const response = await GET(createRequest("http://localhost/api/proposals"));
    const data = await response.json();
    expect(data.proposals[0].tipoLabel).toBe("X");
  });

  it("handles null vote fields gracefully", async () => {
    mockQueryRawUnsafe.mockImplementation((_query: string, ...args: unknown[]) => {
      if (args.length === 0) {
        return [{ total: 1 }];
      }
      return [
        mockProposal({
          vote_resultado: null,
          vote_descricao: null,
          last_event_date: null,
          last_event_fase: null,
        }),
      ];
    });

    const response = await GET(createRequest("http://localhost/api/proposals"));
    const data = await response.json();

    expect(data.proposals[0]).toMatchObject({
      status: null,
      statusDescription: null,
      dataUltimoEvento: null,
    });
  });
});
