import { type NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrismaClient();
  const { id } = await params;
  const iniId = Number.parseInt(id, 10);

  if (Number.isNaN(iniId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const initiative = await prisma.legislativeInitiative.findUnique({
    where: { id: iniId },
    include: {
      authors: {
        orderBy: { id: "asc" },
      },
      events: {
        include: {
          votes: {
            orderBy: { id: "desc" },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!initiative) {
    return NextResponse.json(
      { error: "Proposta não encontrada" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    id: initiative.id,
    iniId: initiative.iniId,
    iniNr: initiative.iniNr,
    titulo: initiative.iniTitulo,
    descTipo: initiative.iniDescTipo,
    tipo: initiative.iniTipo,
    leg: initiative.iniLeg,
    epigrafe: initiative.iniEpigrafe,
    obs: initiative.iniObs,
    linkTexto: initiative.iniLinkTexto,
    dataInicioLeg: initiative.dataInicioLeg,
    dataFimLeg: initiative.dataFimLeg,
    authors: initiative.authors.map((a) => ({
      type: a.authorType,
      name: a.authorName,
      sigla: a.authorSigla,
    })),
    events: initiative.events.map((e) => ({
      evtId: e.evtId,
      codigoFase: e.codigoFase,
      fase: e.fase,
      dataFase: e.dataFase,
      comissao: e.comissao,
      obsFase: e.obsFase,
      votes: e.votes.map((v) => ({
        voteId: v.voteId,
        data: v.data,
        resultado: v.resultado,
        detalhe: v.detalhe,
        descricao: v.descricao,
        reuniao: v.reuniao,
        tipoReuniao: v.tipoReuniao,
        unanime: v.unanime,
      })),
    })),
  });
}
