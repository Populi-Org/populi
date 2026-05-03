import { describe, it, expect, vi, beforeEach } from "vitest";
import { deputyTools, getPartyColor } from "@/app/api/chat/tools";
import { getPrismaClient } from "@/lib/prisma";

vi.mock("@/lib/prisma");

const mockFindUnique = vi.fn();
const mockFindMany = vi.fn();
const mockCount = vi.fn();
const mockQueryRaw = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getPrismaClient).mockReturnValue({
    deputy: { findUnique: mockFindUnique, findMany: mockFindMany, count: mockCount },
    $queryRaw: mockQueryRaw,
  } as unknown as ReturnType<typeof getPrismaClient>);
});

describe("getPartyColor", () => {
  it("returns color for known parties", () => {
    expect(getPartyColor("PS")).toBe("#dc2626");
    expect(getPartyColor("PSD")).toBe("#f97316");
    expect(getPartyColor("CH")).toBe("#1d4ed8");
    expect(getPartyColor("IL")).toBe("#06b6d4");
    expect(getPartyColor("BE")).toBe("#be123c");
    expect(getPartyColor("PCP")).toBe("#991b1b");
    expect(getPartyColor("L")).toBe("#16a34a");
    expect(getPartyColor("PAN")).toBe("#14b8a6");
  });

  it("returns null for unknown party", () => {
    expect(getPartyColor("UNKNOWN")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(getPartyColor("")).toBeNull();
  });

  it("returns null for null input", () => {
    expect(getPartyColor(null)).toBeNull();
  });
});

describe("deputyTools.search_deputies", () => {
  it("searches by name only", async () => {
    mockFindMany.mockResolvedValue([]);
    await deputyTools.search_deputies.execute({ name: "Silva" });

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.AND).toEqual([
      { depNomeParlamentar: { contains: "Silva", mode: "insensitive" } },
      {},
      {},
    ]);
    expect(call.take).toBe(10);
  });

  it("searches by constituency only", async () => {
    mockFindMany.mockResolvedValue([]);
    await deputyTools.search_deputies.execute({ constituency: "Lisboa" });

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.AND).toEqual([
      {},
      { depCPDes: "Lisboa" },
      {},
    ]);
  });

  it("filters by party using queryRaw", async () => {
    mockQueryRaw.mockResolvedValue([{ deputy_id: 1 }, { deputy_id: 2 }]);
    mockFindMany.mockResolvedValue([]);

    await deputyTools.search_deputies.execute({ party: "PS" });

    expect(mockQueryRaw).toHaveBeenCalled();
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.AND[2]).toEqual({ id: { in: [1, 2] } });
  });

  it("maps results correctly", async () => {
    mockFindMany.mockResolvedValue([
      {
        id: 1,
        depNomeParlamentar: "Ana Silva",
        depNomeCompleto: "Ana Maria Silva",
        depCPDes: "Porto",
        legDes: "XVI",
        depImageUrl: "http://img.jpg",
        partyHistory: [{ party: { sigla: "PS" } }],
      },
    ]);

    const result = await deputyTools.search_deputies.execute({ name: "Ana" });

    expect(result).toEqual([
      {
        id: 1,
        name: "Ana Silva",
        fullName: "Ana Maria Silva",
        party: "PS",
        partyColor: "#dc2626",
        constituency: "Porto",
        legislature: "XVI",
        image: "http://img.jpg",
      },
    ]);
  });
});

describe("deputyTools.count_deputies", () => {
  it("returns the count from prisma", async () => {
    mockCount.mockResolvedValue(42);
    const result = await deputyTools.count_deputies.execute({ name: "Silva" });
    expect(result).toEqual({ count: 42 });
  });
});

describe("deputyTools.get_deputy_profile", () => {
  it("returns error when deputy not found", async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await deputyTools.get_deputy_profile.execute({ id: 999 });
    expect(result).toEqual({ error: "Deputado não encontrado" });
  });

  it("returns full profile when deputy is found", async () => {
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
        {
          sioDes: "Active",
          sioDtInicio: new Date("2024-01-01"),
          sioDtFim: null,
        },
      ],
      cms: [
        { cmsNo: "Education", cmsCargo: "Member", cmsSituacao: "Active" },
      ],
      ini: [
        {
          iniId: 1,
          iniTi: "Title",
          iniTpdesc: "Type",
          iniNr: "1",
          iniSelNr: "1",
          iniSelLg: "XVI",
        },
      ],
      intev: [
        {
          intId: 1,
          intSu: "Subject",
          intTe: "Text",
          pubDtreu: new Date("2024-01-01"),
          pubNr: "1",
          pubTp: "Type",
        },
      ],
      _count: { intev: 5, ini: 3, cms: 2 },
    });

    const result = await deputyTools.get_deputy_profile.execute({
      id: 1,
      initiativesLimit: 5,
      interventionsLimit: 5,
    });

    expect(result).toMatchObject({
      id: 1,
      depId: 123,
      name: "John Doe",
      fullName: "John Michael Doe",
      constituency: "Lisboa",
      legislature: "XVI",
      party: "PS",
      partyColor: "#dc2626",
      image: "http://example.com/img.jpg",
      committees: [
        { name: "Education", role: "Member", situation: "Active" },
      ],
      statusHistory: [
        { description: "Active", startDate: new Date("2024-01-01"), endDate: null },
      ],
      recentInitiatives: [
        {
          id: 1,
          title: "Title",
          type: "Type",
          number: "1",
          selectionNumber: "1",
          selectionLegislature: "XVI",
        },
      ],
      recentInterventions: [
        {
          id: 1,
          subject: "Subject",
          text: "Text",
          publicationDate: new Date("2024-01-01"),
          publicationNumber: "1",
          type: "Type",
        },
      ],
      stats: { interventions: 5, initiatives: 3, committees: 2 },
    });
  });

  it("uses default limits when not provided", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      depId: 123,
      depNomeParlamentar: "Jane",
      depNomeCompleto: "Jane Doe",
      depCPDes: null,
      legDes: null,
      depImageUrl: null,
      partyHistory: [],
      statusHistory: [],
      cms: [],
      ini: [],
      intev: [],
      _count: { intev: 0, ini: 0, cms: 0 },
    });

    const result = await deputyTools.get_deputy_profile.execute({ id: 1 });

    expect(result).toMatchObject({
      id: 1,
      name: "Jane",
      party: null,
      partyColor: null,
    });
  });
});
