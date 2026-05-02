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

  count_deputies: tool({
    description:
      "Count how many deputies match the given search criteria (name, party, or constituency). Use this when the user asks 'how many' or wants a total.",
    inputSchema: z.object({
      name: z
        .string()
        .optional()
        .describe("Name or partial name of the deputy"),
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
      console.log("[Tool: count_deputies] Called with:", { name, party, constituency });
      const prisma = getPrismaClient();

      const count = await prisma.deputy.count({
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
      });

      console.log("[Tool: count_deputies] Result:", count);
      return { count };
    },
  }),

  get_deputy_profile: tool({
    description:
      "Get detailed profile information for a specific deputy by ID. Includes party, constituency, committees, status history, recent initiatives, recent interventions, and activity counts.",
    inputSchema: z.object({
      id: z.number().describe("The deputy's internal ID (not depId)"),
      initiativesLimit: z
        .number()
        .optional()
        .default(5)
        .describe("Maximum number of recent initiatives to include"),
      interventionsLimit: z
        .number()
        .optional()
        .default(5)
        .describe("Maximum number of recent interventions to include"),
    }),
    execute: async ({ id, initiativesLimit, interventionsLimit }) => {
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
          ini: {
            orderBy: { id: "desc" },
            take: initiativesLimit,
          },
          intev: {
            orderBy: { id: "desc" },
            take: interventionsLimit,
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
        recentInitiatives: deputy.ini.map((i) => ({
          id: i.iniId,
          title: i.iniTi,
          type: i.iniTpdesc,
          number: i.iniNr,
          selectionNumber: i.iniSelNr,
          selectionLegislature: i.iniSelLg,
        })),
        recentInterventions: deputy.intev.map((i) => ({
          id: i.intId,
          subject: i.intSu,
          text: i.intTe,
          publicationDate: i.pubDtreu,
          publicationNumber: i.pubNr,
          type: i.pubTp,
        })),
        stats: {
          interventions: deputy._count.intev,
          initiatives: deputy._count.ini,
          committees: deputy._count.cms,
        },
      };
    },
  }),
};
