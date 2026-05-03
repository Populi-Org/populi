import { type NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deputyId = Number.parseInt(id, 10);

  if (Number.isNaN(deputyId)) {
    return NextResponse.json({ error: "Invalid deputy ID" }, { status: 400 });
  }

  const prisma = getPrismaClient();
  const { searchParams } = new URL(request.url);

  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10),
  );
  const limit = Math.max(
    1,
    Number.parseInt(searchParams.get("limit") || "1000", 10),
  );
  const skip = (page - 1) * limit;

  const [matches, total] = await Promise.all([
    prisma.articleMpMatch.findMany({
      where: { mpId: deputyId },
      orderBy: [{ mentionCount: "desc" }, { matchQuality: "asc" }],
      skip,
      take: limit,
      include: {
        article: true,
      },
    }),
    prisma.articleMpMatch.count({ where: { mpId: deputyId } }),
  ]);

  const articles = matches.map((m) => ({
    ...m.article,
    matchQuality: m.matchQuality,
    mentionCount: m.mentionCount,
  }));

  return NextResponse.json({
    articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
