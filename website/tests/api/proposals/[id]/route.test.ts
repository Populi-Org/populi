import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/proposals/[id]/route";
import { getPrismaClient } from "@/lib/prisma";
import type { NextRequest } from "next/server";

vi.mock("@/lib/prisma");

const mockFindUnique = vi.fn();

function createRequest(): NextRequest {
  return new Request("http://localhost") as unknown as NextRequest;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getPrismaClient).mockReturnValue({
    legislativeInitiative: { findUnique: mockFindUnique },
  } as unknown as ReturnType<typeof getPrismaClient>);
});

describe("GET /api/proposals/[id]", () => {
  it("returns 400 for invalid ID", async () => {
    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "not-a-number" }),
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("ID inválido");
  });

  it("returns 404 when proposal not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "999" }),
    });
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Proposta não encontrada");
  });

  it("returns mapped proposal data", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      iniId: 101,
      iniNr: "123/2024",
      iniTitulo: "Test Proposal",
      iniDescTipo: "Projeto de Lei",
      iniTipo: "J",
      iniLeg: "XVI",
      iniEpigrafe: "Epigrafe text",
      iniObs: "Some observations",
      iniLinkTexto: "http://example.com",
      dataInicioLeg: new Date("2024-01-01"),
      dataFimLeg: new Date("2024-12-31"),
      authors: [
        { authorType: "Deputado", authorName: "John Doe", authorSigla: "PS" },
        { authorType: "Grupo Parlamentar", authorName: "PSD", authorSigla: "PSD" },
      ],
      events: [
        {
          evtId: 1,
          codigoFase: "VOT",
          fase: "Votação",
          dataFase: new Date("2024-06-15"),
          comissao: "Comissão de Saúde",
          obsFase: "Observação",
          votes: [
            {
              voteId: 1,
              data: new Date("2024-06-15"),
              resultado: "Aprovado",
              detalhe: "Detalhes",
              descricao: "Aprovado por maioria",
              reuniao: "Reunião 1",
              tipoReuniao: "Ordinária",
              unanime: true,
            },
          ],
        },
      ],
    });

    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await response.json();

    expect(data).toMatchObject({
      id: 1,
      iniId: 101,
      iniNr: "123/2024",
      titulo: "Test Proposal",
      descTipo: "Projeto de Lei",
      tipo: "J",
      leg: "XVI",
      epigrafe: "Epigrafe text",
      obs: "Some observations",
      linkTexto: "http://example.com",
      authors: [
        { type: "Deputado", name: "John Doe", sigla: "PS" },
        { type: "Grupo Parlamentar", name: "PSD", sigla: "PSD" },
      ],
      events: [
        {
          evtId: 1,
          codigoFase: "VOT",
          fase: "Votação",
          comissao: "Comissão de Saúde",
          obsFase: "Observação",
          votes: [
            {
              voteId: 1,
              resultado: "Aprovado",
              descricao: "Aprovado por maioria",
              unanime: true,
            },
          ],
        },
      ],
    });
  });

  it("includes empty arrays when no authors or events", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      iniId: 101,
      iniNr: null,
      iniTitulo: "Empty Proposal",
      iniDescTipo: null,
      iniTipo: null,
      iniLeg: null,
      iniEpigrafe: null,
      iniObs: null,
      iniLinkTexto: null,
      dataInicioLeg: null,
      dataFimLeg: null,
      authors: [],
      events: [],
    });

    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await response.json();

    expect(data.authors).toEqual([]);
    expect(data.events).toEqual([]);
    expect(data.titulo).toBe("Empty Proposal");
  });
});
