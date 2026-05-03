import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/deputy/route";
import { getPrismaClient } from "@/lib/prisma";
import type { NextRequest } from "next/server";

vi.mock("@/lib/prisma");

const mockFindMany = vi.fn();
const mockCount = vi.fn();
const mockQueryRaw = vi.fn();

function createRequest(url: string): NextRequest {
  return new Request(url) as unknown as NextRequest;
}

function mockDeputy(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    depNomeParlamentar: "John Doe",
    depNomeCompleto: "John Michael Doe",
    depCPDes: "Lisboa",
    legDes: "XVI",
    depImageUrl: "http://example.com/img.jpg",
    partyHistory: [{ party: { sigla: "PS", color: "#dc2626" } }],
    cms: [{ cmsNo: "Education", cmsCargo: "Member", cmsSituacao: "Active" }],
    statusHistory: [],
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getPrismaClient).mockReturnValue({
    deputy: { findMany: mockFindMany, count: mockCount },
    $queryRaw: mockQueryRaw,
  } as unknown as ReturnType<typeof getPrismaClient>);
});

describe("GET /api/deputy", () => {
  it("returns deputies with default pagination", async () => {
    const deputies = [mockDeputy()];
    mockFindMany.mockResolvedValue(deputies);

    const response = await GET(createRequest("http://localhost/api/deputy"));
    const data = await response.json();

    expect(data.deputies).toHaveLength(1);
    expect(data.pagination).toEqual({
      page: 1,
      limit: 12,
      total: 1,
      totalPages: 1,
    });
  });

  it("filters by search term", async () => {
    mockFindMany.mockResolvedValue([]);

    await GET(createRequest("http://localhost/api/deputy?search=John"));

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.depNomeParlamentar).toEqual({
      contains: "John",
      mode: "insensitive",
    });
  });

  it("filters by constituency", async () => {
    mockFindMany.mockResolvedValue([]);

    await GET(createRequest("http://localhost/api/deputy?constituency=Lisboa"));

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.depCPDes).toBe("Lisboa");
  });

  it("filters by party using queryRaw", async () => {
    mockQueryRaw.mockResolvedValue([{ deputy_id: 1 }, { deputy_id: 2 }]);
    mockFindMany.mockResolvedValue([]);

    await GET(createRequest("http://localhost/api/deputy?party=PS"));

    expect(mockQueryRaw).toHaveBeenCalled();
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.id).toEqual({ in: [1, 2] });
  });

  it("returns empty result when party has no deputies", async () => {
    mockQueryRaw.mockResolvedValue([]);

    const response = await GET(
      createRequest("http://localhost/api/deputy?party=UNKNOWN"),
    );
    const data = await response.json();

    expect(data.deputies).toEqual([]);
    expect(data.pagination.total).toBe(0);
  });

  it("hides suplentes by default", async () => {
    mockFindMany.mockResolvedValue([]);

    await GET(createRequest("http://localhost/api/deputy"));

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.statusHistory).toEqual({
      none: {
        sioDes: { contains: "suplent", mode: "insensitive" },
        sioDtFim: null,
      },
    });
  });

  it("shows suplentes when showSuplentes is true", async () => {
    mockFindMany.mockResolvedValue([]);

    await GET(
      createRequest("http://localhost/api/deputy?showSuplentes=true"),
    );

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.statusHistory).toBeUndefined();
  });

  it("respects custom page and limit with sortByPhoto=false", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await GET(
      createRequest(
        "http://localhost/api/deputy?page=2&limit=5&sortByPhoto=false",
      ),
    );

    const call = mockFindMany.mock.calls[0][0];
    expect(call.skip).toBe(5);
    expect(call.take).toBe(5);
  });

  it("caps limit at 50", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await GET(
      createRequest(
        "http://localhost/api/deputy?limit=100&sortByPhoto=false",
      ),
    );

    const call = mockFindMany.mock.calls[0][0];
    expect(call.take).toBe(50);
  });

  it("sorts by photo when sortByPhoto is true", async () => {
    const deputies = [
      mockDeputy({
        id: 1,
        depNomeParlamentar: "B",
        depImageUrl: null,
      }),
      mockDeputy({
        id: 2,
        depNomeParlamentar: "A",
        depImageUrl: "http://img.jpg",
      }),
    ];
    mockFindMany.mockResolvedValue(deputies);

    const response = await GET(
      createRequest("http://localhost/api/deputy?sortByPhoto=true"),
    );
    const data = await response.json();

    expect(data.deputies[0].name).toBe("A");
    expect(data.deputies[1].name).toBe("B");
  });

  it("paginates correctly with sortByPhoto=true", async () => {
    const deputies = Array.from({ length: 15 }, (_, i) =>
      mockDeputy({
        id: i + 1,
        depNomeParlamentar: `Deputy ${i + 1}`,
        depImageUrl: i % 2 === 0 ? "http://img.jpg" : null,
      }),
    );
    mockFindMany.mockResolvedValue(deputies);

    const response = await GET(
      createRequest("http://localhost/api/deputy?page=2&limit=5"),
    );
    const data = await response.json();

    expect(data.deputies).toHaveLength(5);
    expect(data.pagination).toEqual({
      page: 2,
      limit: 5,
      total: 15,
      totalPages: 3,
    });
  });

  it("maps deputy data correctly with committee", async () => {
    const deputies = [
      mockDeputy({
        id: 1,
        depNomeParlamentar: "Jane Doe",
        depNomeCompleto: "Jane Mary Doe",
        depCPDes: "Porto",
        legDes: "XV",
        depImageUrl: "",
        partyHistory: [{ party: { sigla: "PSD", color: "#f97316" } }],
        cms: [
          { cmsNo: "Health", cmsCargo: "President", cmsSituacao: "Active" },
        ],
        statusHistory: [{ sioDes: "suplente", sioDtFim: null }],
      }),
    ];
    mockFindMany.mockResolvedValue(deputies);

    const response = await GET(
      createRequest("http://localhost/api/deputy?showSuplentes=true"),
    );
    const data = await response.json();

    expect(data.deputies[0]).toMatchObject({
      id: 1,
      name: "Jane Doe",
      fullName: "Jane Mary Doe",
      constituency: "Porto",
      party: "PSD",
      partyColor: "#f97316",
      image: "/defaultNoImage.png",
      isSuplente: true,
    });
    expect(data.deputies[0].description).toContain("Comissão de Health");
  });

  it("falls back to legislature description when no committee", async () => {
    const deputies = [
      mockDeputy({
        cms: [],
        legDes: "XVI",
      }),
    ];
    mockFindMany.mockResolvedValue(deputies);

    const response = await GET(createRequest("http://localhost/api/deputy"));
    const data = await response.json();

    expect(data.deputies[0].description).toContain("na XVI");
  });

  it("handles empty committee and no legislature", async () => {
    const deputies = [
      mockDeputy({
        cms: [],
        legDes: null,
        depCPDes: null,
      }),
    ];
    mockFindMany.mockResolvedValue(deputies);

    const response = await GET(createRequest("http://localhost/api/deputy"));
    const data = await response.json();

    expect(data.deputies[0].description).toBe("Deputado (PS).");
  });

  it("filters by theme", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await GET(createRequest("http://localhost/api/deputy?theme=education"));

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.AND).toEqual([
      {
        intev: {
          some: {
            OR: [
              { intTe: { contains: "education", mode: "insensitive" } },
              { intSu: { contains: "education", mode: "insensitive" } },
              { tinDs: { contains: "education", mode: "insensitive" } },
            ],
          },
        },
      },
    ]);
  });

  it("filters by since year", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await GET(createRequest("http://localhost/api/deputy?since=2020"));

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.AND[0]).toMatchObject({
      partyHistory: {
        some: {
          gpDtInicio: { gte: new Date(2020, 0, 1) },
        },
      },
    });
  });

  it("ignores invalid since parameter", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await GET(createRequest("http://localhost/api/deputy?since=invalid"));

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.AND).toBeUndefined();
  });
});
