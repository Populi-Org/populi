import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/parties/route";
import { getPrismaClient } from "@/lib/prisma";

vi.mock("@/lib/prisma");

const mockFindMany = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getPrismaClient).mockReturnValue({
    party: { findMany: mockFindMany },
  } as unknown as ReturnType<typeof getPrismaClient>);
});

describe("GET /api/parties", () => {
  it("returns parties ordered by sigla", async () => {
    const parties = [
      { id: 1, sigla: "BE", color: "#be123c" },
      { id: 2, sigla: "PS", color: "#dc2626" },
    ];
    mockFindMany.mockResolvedValue(parties);

    const response = await GET();
    const data = await response.json();

    expect(data.parties).toEqual(parties);
    expect(mockFindMany).toHaveBeenCalledWith({
      select: { id: true, sigla: true, color: true },
      orderBy: { sigla: "asc" },
    });
  });

  it("returns empty array when no parties exist", async () => {
    mockFindMany.mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(data.parties).toEqual([]);
  });
});
