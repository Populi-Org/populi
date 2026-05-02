-- CreateTable
CREATE TABLE "fact_checks" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lead" TEXT,
    "truth_level" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fact_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fact_checks_deputy_id_idx" ON "fact_checks"("deputy_id");

-- CreateIndex
CREATE UNIQUE INDEX "fact_checks_deputy_id_url_key" ON "fact_checks"("deputy_id", "url");

-- AddForeignKey
ALTER TABLE "fact_checks" ADD CONSTRAINT "fact_checks_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
