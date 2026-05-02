import { tool } from "ai";
import { z } from "zod";
import { getPrismaClient } from "@/lib/prisma";

const partyColors: Record<string, string> = {
  PS: "#dc2626",
  PSD: "#f97316",
  CH: "#1d4ed8",
  IL: "#06b6d4",
  BE: "#be123c",
  PCP: "#991b1b",
  L: "#16a34a",
  PAN: "#14b8a6",
};

function getPartyColor(sigla: string | null): string | null {
  if (!sigla) return null;
  return partyColors[sigla] || null;
}

export const deputyTools = {
  search_deputies: tool({
    description:
      "Search for deputies by name, party (sigla), or constituency. Returns a list of matching deputies with basic info.",
    inputSchema: z.object({
      name: z
        .string()
        .optional()
        .describe("Name or partial name of the deputy to search for"),
      party: z
        .string()
        .optional()
        .describe("Party sigla (e.g. PS, PSD, CH, IL, BE, PCP, L, PAN)"),
      constituency: z
        .string()
        .optional()
        .describe("Constituency name (e.g. Lisboa, Porto, Braga)"),
    }),
    execute: async ({ name, party, constituency }) => {
      console.log("[Tool: search_deputies] Called with:", { name, party, constituency });
      const prisma = getPrismaClient();

      const deputies = await prisma.deputy.findMany({
        where: {
          AND: [
            name
              ? {
                  depNomeParlamentar: {
                    contains: name,
                    mode: "insensitive",
                  },
                }
              : {},
            constituency ? { depCPDes: constituency } : {},
          ],
        },
        include: {
          partyHistory: {
            where: { gpDtFim: null },
            include: {
              party: {
                select: { sigla: true },
              },
            },
            take: 1,
          },
        },
        take: 10,
        orderBy: { depNomeParlamentar: "asc" },
      });

      const results = deputies
        .filter((d) => {
          if (!party) return true;
          const activeParty = d.partyHistory[0]?.party?.sigla;
          return activeParty === party;
        })
        .map((d) => ({
          id: d.id,
          name: d.depNomeParlamentar,
          fullName: d.depNomeCompleto,
          party: d.partyHistory[0]?.party?.sigla || null,
          partyColor: getPartyColor(d.partyHistory[0]?.party?.sigla || null),
          constituency: d.depCPDes,
          legislature: d.legDes,
          image: d.depImageUrl,
        }));
      console.log("[Tool: search_deputies] Found", results.length, "results");
      return results;
    },
  }),

  get_deputy_profile: tool({
    description:
      "Get detailed profile information for a specific deputy by ID. Includes party, constituency, committees, and activity counts.",
    inputSchema: z.object({
      id: z.number().describe("The deputy's internal ID (not depId)"),
    }),
    execute: async ({ id }) => {
      console.log("[Tool: get_deputy_profile] Called with id:", id);
      const prisma = getPrismaClient();

      const deputy = await prisma.deputy.findUnique({
        where: { id },
        include: {
          partyHistory: {
            where: { gpDtFim: null },
            include: {
              party: {
                select: { sigla: true },
              },
            },
            take: 1,
          },
          statusHistory: {
            orderBy: { sioDtInicio: "desc" },
            take: 5,
          },
          cms: {
            where: { cmsSituacao: { not: "Suspenso" } },
            orderBy: { cmsCargo: "asc" },
          },
          _count: {
            select: {
              intev: true,
              ini: true,
              cms: true,
            },
          },
        },
      });

      if (!deputy) {
        console.log("[Tool: get_deputy_profile] Deputy not found:", id);
        return { error: "Deputado não encontrado" };
      }

      const partySigla = deputy.partyHistory[0]?.party?.sigla || null;
      console.log("[Tool: get_deputy_profile] Found:", deputy.depNomeParlamentar);

      return {
        id: deputy.id,
        depId: deputy.depId,
        name: deputy.depNomeParlamentar,
        fullName: deputy.depNomeCompleto,
        constituency: deputy.depCPDes,
        legislature: deputy.legDes,
        party: partySigla,
        partyColor: getPartyColor(partySigla),
        image: deputy.depImageUrl,
        committees: deputy.cms.map((c) => ({
          name: c.cmsNo,
          role: c.cmsCargo,
          situation: c.cmsSituacao,
        })),
        statusHistory: deputy.statusHistory.map((s) => ({
          description: s.sioDes,
          startDate: s.sioDtInicio,
          endDate: s.sioDtFim,
        })),
        stats: {
          interventions: deputy._count.intev,
          initiatives: deputy._count.ini,
          committees: deputy._count.cms,
        },
      };
    },
  }),

  get_deputy_initiatives: tool({
    description:
      "Get legislative initiatives (bills, proposals) authored by a specific deputy.",
    inputSchema: z.object({
      id: z.number().describe("The deputy's internal ID"),
      limit: z
        .number()
        .optional()
        .default(5)
        .describe("Maximum number of initiatives to return"),
    }),
    execute: async ({ id, limit }) => {
      console.log("[Tool: get_deputy_initiatives] Called with id:", id, "limit:", limit);
      const prisma = getPrismaClient();

      const deputy = await prisma.deputy.findUnique({
        where: { id },
        include: {
          ini: {
            orderBy: { id: "desc" },
            take: limit,
          },
        },
      });

      if (!deputy) {
        console.log("[Tool: get_deputy_initiatives] Deputy not found:", id);
        return { error: "Deputado não encontrado" };
      }

      console.log("[Tool: get_deputy_initiatives] Found", deputy.ini.length, "initiatives");
      return {
        deputyName: deputy.depNomeParlamentar,
        initiatives: deputy.ini.map((i) => ({
          id: i.iniId,
          title: i.iniTi,
          type: i.iniTpdesc,
          number: i.iniNr,
          selectionNumber: i.iniSelNr,
          selectionLegislature: i.iniSelLg,
        })),
      };
    },
  }),

  get_deputy_interventions: tool({
    description:
      "Get parliamentary interventions (speeches, quotes) by a specific deputy.",
    inputSchema: z.object({
      id: z.number().describe("The deputy's internal ID"),
      limit: z
        .number()
        .optional()
        .default(5)
        .describe("Maximum number of interventions to return"),
    }),
    execute: async ({ id, limit }) => {
      console.log("[Tool: get_deputy_interventions] Called with id:", id, "limit:", limit);
      const prisma = getPrismaClient();

      const deputy = await prisma.deputy.findUnique({
        where: { id },
        include: {
          intev: {
            orderBy: { id: "desc" },
            take: limit,
          },
        },
      });

      if (!deputy) {
        console.log("[Tool: get_deputy_interventions] Deputy not found:", id);
        return { error: "Deputado não encontrado" };
      }

      console.log("[Tool: get_deputy_interventions] Found", deputy.intev.length, "interventions");
      return {
        deputyName: deputy.depNomeParlamentar,
        interventions: deputy.intev.map((i) => ({
          id: i.intId,
          subject: i.intSu,
          text: i.intTe,
          publicationDate: i.pubDtreu,
          publicationNumber: i.pubNr,
          type: i.pubTp,
        })),
      };
    },
  }),

  get_deputy_committees: tool({
    description:
      "Get committee memberships for a specific deputy.",
    inputSchema: z.object({
      id: z.number().describe("The deputy's internal ID"),
    }),
    execute: async ({ id }) => {
      console.log("[Tool: get_deputy_committees] Called with id:", id);
      const prisma = getPrismaClient();

      const deputy = await prisma.deputy.findUnique({
        where: { id },
        include: {
          cms: {
            where: { cmsSituacao: { not: "Suspenso" } },
            orderBy: { cmsCargo: "asc" },
          },
        },
      });

      if (!deputy) {
        console.log("[Tool: get_deputy_committees] Deputy not found:", id);
        return { error: "Deputado não encontrado" };
      }

      console.log("[Tool: get_deputy_committees] Found", deputy.cms.length, "committees");
      return {
        deputyName: deputy.depNomeParlamentar,
        committees: deputy.cms.map((c) => ({
          name: c.cmsNo,
          code: c.cmsCd,
          role: c.cmsCargo,
          situation: c.cmsSituacao,
          subRole: c.cmsSubCargo,
        })),
      };
    },
  }),
};
