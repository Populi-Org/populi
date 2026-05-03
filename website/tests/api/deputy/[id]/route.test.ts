import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/deputy/[id]/route";
import { getPrismaClient } from "@/lib/prisma";
import type { NextRequest } from "next/server";

vi.mock("@/lib/prisma");

const mockFindUnique = vi.fn();
const mockCount = vi.fn();

function createRequest(): NextRequest {
  return new Request("http://localhost") as unknown as NextRequest;
}

function mockDeputyResult(overrides: Record<string, unknown> = {}) {
  return {
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
      { iniId: 2, iniTi: "Title 2", iniTpdesc: "Type 2", iniNr: "2" },
    ],
    intev: [
      { intTe: "Intervention text", pubDtreu: new Date("2024-06-01") },
    ],
    _count: { intev: 10, ini: 5, cms: 2 },
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getPrismaClient).mockReturnValue({
    deputy: { findUnique: mockFindUnique, count: mockCount },
  } as unknown as ReturnType<typeof getPrismaClient>);
});

describe("GET /api/deputy/[id]", () => {
  it("returns 400 for invalid ID", async () => {
    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "not-a-number" }),
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("ID inválido");
  });

  it("returns 404 when deputy not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "999" }),
    });
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Deputado não encontrado");
  });

  it("returns full deputy profile", async () => {
    mockFindUnique.mockResolvedValue(mockDeputyResult());
    mockCount.mockResolvedValue(3);

    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await response.json();

    expect(data).toMatchObject({
      id: 1,
      depId: 123,
      name: "John Doe",
      fullName: "John Michael Doe",
      constituency: "Lisboa",
      legislature: "XVI",
      party: "PS",
      image: "/api/image-proxy?url=http%3A%2F%2Fexample.com%2Fimg.jpg",
      committees: [{ name: "Education", role: "Member", situation: "Active" }],
      statusHistory: [
        { description: "Active", startDate: "2024-01-01T00:00:00.000Z", endDate: null },
      ],
      initiatives: [
        { id: 1, title: "Title 1", type: "Type 1", number: "1" },
        { id: 2, title: "Title 2", type: "Type 2", number: "2" },
      ],
      latestIntervention: {
        text: "Intervention text",
        date: "2024-06-01T00:00:00.000Z",
      },
      stats: {
        interventions: 10,
        initiatives: 5,
        committees: 2,
        allies: 3,
      },
    });
  });

  it("counts allies in same committees", async () => {
    mockFindUnique.mockResolvedValue(mockDeputyResult());
    mockCount.mockResolvedValue(7);

    await GET(createRequest(), {
      params: Promise.resolve({ id: "1" }),
    });

    const countCall = mockCount.mock.calls[0][0];
    expect(countCall.where.id.not).toBe(1);
    expect(countCall.where.cms.some.cmsNo.in).toEqual(["Education"]);
    expect(countCall.where.cms.some.cmsSituacao).toEqual({ not: "Suspenso" });
  });

  it("excludes null committee names from allies query", async () => {
    mockFindUnique.mockResolvedValue(
      mockDeputyResult({
        cms: [
          { cmsNo: "Education", cmsCargo: "Member", cmsSituacao: "Active" },
          { cmsNo: null, cmsCargo: "Member", cmsSituacao: "Active" },
        ],
      }),
    );
    mockCount.mockResolvedValue(5);

    await GET(createRequest(), {
      params: Promise.resolve({ id: "1" }),
    });

    const countCall = mockCount.mock.calls[0][0];
    expect(countCall.where.cms.some.cmsNo.in).toEqual(["Education"]);
  });

  it("returns null latestIntervention when no interventions exist", async () => {
    mockFindUnique.mockResolvedValue(
      mockDeputyResult({ intev: [] }),
    );
    mockCount.mockResolvedValue(0);

    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await response.json();

    expect(data.latestIntervention).toBeNull();
  });

  it("uses default image when depImageUrl is null", async () => {
    mockFindUnique.mockResolvedValue(
      mockDeputyResult({ depImageUrl: null }),
    );
    mockCount.mockResolvedValue(0);

    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await response.json();

    expect(data.image).toBe("/defaultNoImage.png");
  });

  it("returns null party when no party history exists", async () => {
    mockFindUnique.mockResolvedValue(
      mockDeputyResult({ partyHistory: [] }),
    );
    mockCount.mockResolvedValue(0);

    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await response.json();

    expect(data.party).toBeNull();
  });

  it("limits initiatives to 5 and interventions to 1", async () => {
    mockFindUnique.mockResolvedValue(
      mockDeputyResult({
        ini: Array.from({ length: 10 }, (_, i) => ({
          iniId: i + 1,
          iniTi: `Title ${i + 1}`,
          iniTpdesc: "Type",
          iniNr: `${i + 1}`,
        })),
        intev: Array.from({ length: 5 }, (_, i) => ({
          intTe: `Text ${i + 1}`,
          pubDtreu: new Date("2024-01-01"),
        })),
      }),
    );
    mockCount.mockResolvedValue(0);

    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await response.json();

    expect(data.initiatives).toHaveLength(10);
    expect(data.latestIntervention).not.toBeNull();
    expect(mockFindUnique.mock.calls[0][0].include.ini.take).toBe(5);
    expect(mockFindUnique.mock.calls[0][0].include.intev.take).toBe(1);
  });
});
