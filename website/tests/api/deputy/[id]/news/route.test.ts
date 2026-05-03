import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/deputy/[id]/news/route";
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
    article: { findMany: mockFindMany, count: mockCount },
  } as unknown as ReturnType<typeof getPrismaClient>);
});

describe("GET /api/deputy/[id]/news", () => {
  it("returns 400 for invalid deputy ID", async () => {
    const response = await GET(createRequest("http://localhost"), {
      params: Promise.resolve({ id: "not-a-number" }),
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Invalid deputy ID");
  });

  it("returns articles with default pagination", async () => {
    const articles = [
      { id: 1, title: "News 1", publishedAt: "2024-01-01T00:00:00.000Z" },
      { id: 2, title: "News 2", publishedAt: "2024-02-01T00:00:00.000Z" },
    ];
    mockFindMany.mockResolvedValue(articles);
    mockCount.mockResolvedValue(2);

    const response = await GET(
      createRequest("http://localhost/api/deputy/1/news"),
      { params: Promise.resolve({ id: "1" }) },
    );
    const data = await response.json();

    expect(data.articles).toEqual(articles);
    expect(data.pagination).toEqual({
      page: 1,
      limit: 1000,
      total: 2,
      totalPages: 1,
    });
  });

  it("filters articles by deputyId", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await GET(
      createRequest("http://localhost/api/deputy/5/news"),
      { params: Promise.resolve({ id: "5" }) },
    );

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where).toEqual({ deputyId: 5 });
    expect(call.orderBy).toEqual({ publishedAt: "desc" });
  });

  it("respects custom page and limit", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await GET(
      createRequest("http://localhost/api/deputy/1/news?page=2&limit=10"),
      { params: Promise.resolve({ id: "1" }) },
    );

    const call = mockFindMany.mock.calls[0][0];
    expect(call.skip).toBe(10);
    expect(call.take).toBe(10);
  });

  it("calculates totalPages correctly", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(25);

    const response = await GET(
      createRequest("http://localhost/api/deputy/1/news?limit=10"),
      { params: Promise.resolve({ id: "1" }) },
    );
    const data = await response.json();

    expect(data.pagination.totalPages).toBe(3);
  });
});
