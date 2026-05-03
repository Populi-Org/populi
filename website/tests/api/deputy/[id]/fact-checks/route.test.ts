import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/deputy/[id]/fact-checks/route";
import { getPrismaClient } from "@/lib/prisma";
import type { NextRequest } from "next/server";

vi.mock("@/lib/prisma");

const mockFindMany = vi.fn();
const mockCount = vi.fn();

function createRequest(url: string): NextRequest {
  return new Request(url) as unknown as NextRequest;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getPrismaClient).mockReturnValue({
    factCheck: { findMany: mockFindMany, count: mockCount },
  } as unknown as ReturnType<typeof getPrismaClient>);
});

describe("GET /api/deputy/[id]/fact-checks", () => {
  it("returns 400 for invalid deputy ID", async () => {
    const response = await GET(createRequest("http://localhost"), {
      params: Promise.resolve({ id: "not-a-number" }),
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Invalid deputy ID");
  });

  it("returns fact checks with default pagination", async () => {
    const factChecks = [
      { id: 1, claim: "Claim 1", rating: "True", createdAt: "2024-01-01T00:00:00.000Z" },
      { id: 2, claim: "Claim 2", rating: "False", createdAt: "2024-02-01T00:00:00.000Z" },
    ];
    mockFindMany.mockResolvedValue(factChecks);
    mockCount.mockResolvedValue(2);

    const response = await GET(
      createRequest("http://localhost/api/deputy/1/fact-checks"),
      { params: Promise.resolve({ id: "1" }) },
    );
    const data = await response.json();

    expect(data.factChecks).toEqual(factChecks);
    expect(data.pagination).toEqual({
      page: 1,
      limit: 1000,
      total: 2,
      totalPages: 1,
    });
  });

  it("filters fact checks by deputyId", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await GET(
      createRequest("http://localhost/api/deputy/5/fact-checks"),
      { params: Promise.resolve({ id: "5" }) },
    );

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where).toEqual({ deputyId: 5 });
    expect(call.orderBy).toEqual({ createdAt: "desc" });
  });

  it("respects custom page and limit", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await GET(
      createRequest("http://localhost/api/deputy/1/fact-checks?page=3&limit=5"),
      { params: Promise.resolve({ id: "1" }) },
    );

    const call = mockFindMany.mock.calls[0][0];
    expect(call.skip).toBe(10);
    expect(call.take).toBe(5);
  });

  it("calculates totalPages correctly", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(15);

    const response = await GET(
      createRequest("http://localhost/api/deputy/1/fact-checks?limit=4"),
      { params: Promise.resolve({ id: "1" }) },
    );
    const data = await response.json();

    expect(data.pagination.totalPages).toBe(4);
  });
});
