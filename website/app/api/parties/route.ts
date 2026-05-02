import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const prisma = getPrismaClient();
  const parties = await prisma.party.findMany({
    select: {
      id: true,
      sigla: true,
      color: true,
    },
    orderBy: { sigla: "asc" },
  });

  return NextResponse.json({ parties });
}
