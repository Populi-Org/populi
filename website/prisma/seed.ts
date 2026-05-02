import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const partyColors: Record<string, string> = {
  PSD: "#FF6600",
  CH: "#003366",
  PS: "#FF0066",
  IL: "#00AEEF",
  L: "#8CB811",
  PCP: "#ED1C24",
  "CDS-PP": "#0055A4",
  BE: "#E20613",
  PAN: "#009B91",
  JPP: "#2E8B57",
};

async function main() {
  const updates = Object.entries(partyColors).map(([sigla, color]) =>
    prisma.party.updateMany({
      where: { sigla },
      data: { color },
    }),
  );

  const results = await prisma.$transaction(updates);

  const totalUpdated = results.reduce((sum, r) => sum + r.count, 0);
  console.log(`Seeded ${totalUpdated} parties with colors.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
